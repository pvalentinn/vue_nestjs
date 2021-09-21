<template>
    <div v-if="loading">Loading...</div>
    <div class="container" v-else-if="!loading && players">
        <h1>Welcome to lobby {{ id }}</h1>
        <h2>The currents players are :</h2>
        <LobbyBoard :players="players" />
    </div>
    <ModalJoin v-if="show" :hide="hide" :id="id" />
</template>

<script setup lang='ts'>
import { ref } from "vue";
import { useQuery, useSubscription } from "@vue/apollo-composable";
import { useRoute, useRouter } from "vue-router";

import { GET_LOBBY, UPDATE_LOBBY } from "../graphql/lobby.gql";
import ModalJoin from "../components/ModalJoin.vue";
import LobbyBoard from "../components/LobbyBoard.vue";

let { params: { id } }: any = useRoute();
let router = useRouter();
let show = ref(false);

let players = ref<null | { _id: string, login: string }[]>(null);

const { loading, onResult, onError } = useQuery(GET_LOBBY, { id });
const { onResult: updateLobby } = useSubscription(UPDATE_LOBBY, { id });

let hide = () => show.value = false;

updateLobby(result => {
    let updated_players = result.data.updateLobby.players;
    if (updated_players) {
        console.log(updated_players);
        players.value = updated_players;
    }
})

onResult(res => {
    if (res.data == undefined) {
        if (res.error?.graphQLErrors[0].extensions?.code == "UNAUTHENTICATED") show.value = true;
        else router.push({ name: 'NotFound' });
    } else {
        players.value = res.data.lobby.players;
    }
});

onError((e) => !show.value && router.push({ name: 'Home' }))
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