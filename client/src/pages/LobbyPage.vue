<template>
    <div v-if="loading">Loading...</div>
    <ModalJoin v-if="show" :hide="hide" :id="id" />
    <div class="container" v-else-if="!loading && players && !show">
        <h1>Welcome to lobby {{ id }}</h1>
        <h2>The currents players are :</h2>
        <LobbyBoard :players="players" />
    </div>
</template>

<script setup lang='ts'>
import { ref } from "vue";
import Cookies from "js-cookie";
import { useMutation, useQuery, useSubscription } from "@vue/apollo-composable";
import { useRoute, useRouter } from "vue-router";

import { UPDATE_TOKEN } from "../graphql/user.gql";
import { GET_LOBBY, UPDATE_LOBBY } from "../graphql/lobby.gql";
import ModalJoin from "../components/ModalJoin.vue";
import LobbyBoard from "../components/LobbyBoard.vue";

let { params: { id } }: any = useRoute();
let router = useRouter();
let show = ref(false);

let players = ref<null | { _id: string, login: string }[]>(null);

const { loading, onResult, onError } = useQuery(GET_LOBBY, { id });
const { onResult: updateLobby } = useSubscription(UPDATE_LOBBY, { id });
const { mutate: updateToken } = useMutation(UPDATE_TOKEN);

let hide = () => show.value = false;

updateLobby(result => {
    updateToken({ token: Cookies.get('token') });
    let updated_players = result.data.updateLobby.players;
    if (updated_players) {
        console.log(updated_players);
        players.value = updated_players;
    }
})

onResult(res => {
    if(!Cookies.get('token')) show.value = true;

    if (res.data == undefined) {
        if (res.error?.graphQLErrors[0].extensions?.code == "UNAUTHENTICATED") show.value = true;
        else router.push({ name: 'NotFound' });
    } else {
        players.value = res.data.lobby.players;
    }
});

onError((e) => {
    if(e.message == "Cannot return null for non-nullable field Query.lobby.") router.push({ name: 'Home' });
    else {
        show.value = true;
    }
})
</script>

<style>
.container {
    height: 100vh;
    padding: 25px;
}

h1 {
    word-break: break-word;
    text-align: center;
}
</style>