<template>
    <div v-if="loading">Loading...</div>
    <div v-else-if="!loading && players">
        <h1>Welcome to lobby {{ id }}</h1>
        <h2>The currents players are :</h2>
        <ul id="example-1">
            <li v-for="player in players" :key="player._id">{{ player.login }}</li>
        </ul>
    </div>
</template>

<script setup lang='ts'>
import { ref } from "vue";
import { useQuery, useSubscription } from "@vue/apollo-composable";
import { useRoute, useRouter } from "vue-router";
import gql from "graphql-tag";

let route = useRoute();
let router = useRouter();
let { id } = route.params;

let players = ref<null | { _id: string, login: string }[]>(null);

const GET_LOBBY = gql`
    query getLobby($id: String!){
        lobby(id: $id){
            capacity,
            players {
                _id,
                login
            }
        }
    }
`;

const SUBSCRIPTION = gql`
    subscription updatePlayers($id: String!) {
        updatePlayers(id: $id) {
            players {
                _id,
                login
            }
        }
    }
`;

console.log(id);

const { loading, onResult, onError } = useQuery(GET_LOBBY, { id });
const { onResult: updatePlayers } = useSubscription(SUBSCRIPTION, { id });

updatePlayers(result => {
    console.log(result)
    let updated_players = result.data.updatePlayers.players;
    if (updated_players) {
        console.log(updated_players);
        players.value = updated_players;
    }
})

onResult(res => {
    console.log(res.data)
    if (res.data == undefined) {
        router.push({ name: 'NotFound' });
    } else {
        players.value = res.data.lobby.players;
    }
});

onError((e) => {
    console.log(e);
    router.push({ name: 'NotFound' });
})

</script>