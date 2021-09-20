<template>
    <div v-if="loading">Loading...</div>
    <div v-else-if="!loading && players">
        <h1>Welcome to lobby {{ id }}</h1>
        <h2>The currents players are :</h2>
        <ul id="example-1">
            <li v-for="player in players" :key="player._id">{{ player.login }}</li>
        </ul>
    </div>
    <ModalJoin v-if="show" :hide="hide" :id="id as string" />
</template>

<script setup lang='ts'>
import { ref } from "vue";
import { useQuery, useSubscription } from "@vue/apollo-composable";
import { useRoute, useRouter } from "vue-router";

import { GET_LOBBY, SUBSCRIPTION } from "../graphql/lobby.gql";
import ModalJoin from "../components/ModalJoin.vue";

let { params: { id } } = useRoute();
let router = useRouter();
let show = ref(false);

let players = ref<null | { _id: string, login: string }[]>(null);

const { loading, onResult, onError } = useQuery(GET_LOBBY, { id });
const { onResult: updatePlayers } = useSubscription(SUBSCRIPTION, { id });

let hide = () => show.value = false;

updatePlayers(result => {
    let updated_players = result.data.updatePlayers.players;
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