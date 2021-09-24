<template>
    <ModalJoin
        v-if="show"
        :hide="hide"
        :id="id"
        @update:me="() => me = jwt_decode(Cookies.get('token')!)"
    />
    <div class="container" v-else-if="!loading && players && !show">
        <div class="container_header">
            <h1>Welcome to lobby {{ id }}</h1>
            <h2>The currents players are :</h2>
        </div>
        <LobbyBoard :players="players" :me="me" />
        <LobbyChat :chat="chat" :me="me" />
    </div>
</template>

<script setup lang='ts'>
import { ref } from "vue";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';
import { useMutation, useQuery, useSubscription } from "@vue/apollo-composable";
import { useRoute, useRouter } from "vue-router";

import { UPDATE_TOKEN } from "../graphql/user.gql";
import { GET_LOBBY, UPDATE_LOBBY } from "../graphql/lobby.gql";
import ModalJoin from "../components/ModalJoin.vue";
import LobbyBoard from "../components/LobbyBoard.vue";
import LobbyChat from "../components/LobbyChat.vue";

let { params: { id } }: any = useRoute();
let router = useRouter();

let players = ref<null | { _id: string, login: string }[]>(null);
let me = ref<null | { sub: string, lobby: string, roles: string[], state: string }>(null);
let chat = ref('');
let show = ref(false);

if (Cookies.get('token')) me.value = jwt_decode(Cookies.get('token')!);

const { loading, onResult: getLobby, onError: getLobbyError } = useQuery(GET_LOBBY, { id });
const { onResult: updateLobby } = useSubscription(UPDATE_LOBBY, { id });
const { mutate: updateToken } = useMutation(UPDATE_TOKEN);

let hide = () => show.value = false;

updateLobby(async result => {
    try {
        await updateToken({ token: Cookies.get('token') });
        me.value = jwt_decode(Cookies.get('token')!);
        if (!me.value?.lobby) router.push({ name: 'Home' });

        let updated_players = result.data.updateLobby.players;
        if (updated_players) {
            console.log(updated_players);
            players.value = updated_players;
        }
    } catch (e: any) {
        console.log("Error in updateLobby() :", e.message)
    }
})

getLobby(res => {
    if (!Cookies.get('token')) show.value = true;

    if (res.data == undefined) {
        console.log("Error in getLobby()", res)
        if (res.error?.graphQLErrors[0].extensions?.code == "UNAUTHENTICATED") show.value = true;
        else router.push({ name: 'NotFound' });
    } else {
        players.value = res.data.lobby.players;
        chat.value = res.data.lobby.chat._id;
    }
});

getLobbyError((e) => {
    console.log("Error in getLobby() : " + e.message)
    if (e.message == "Cannot return null for non-nullable field Query.lobby.") {
        router.push({ name: 'Home' });
        Cookies.remove('token');
    } else {
        show.value = true;
    }
})
</script>

<style>
.container {
    height: 100vh;
    padding: 25px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 40px;
}

.container_header {
    width: 100%;
}

h1 {
    word-break: break-word;
    text-align: center;
}
</style>