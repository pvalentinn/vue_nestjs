<template>
    <div v-if="loading">Loading...</div>
    <div v-else-if="!loading">
        <h1>Welcome to lobby {{ id }}</h1>
        <h2>The currents players are :</h2>
        <ul id="example-1">
            <li v-for="player in result.lobby.players" :key="player._id">{{ player.login }}</li>
        </ul>
    </div>
</template>

<script setup lang='ts'>
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { useRoute, useRouter } from "vue-router";

let route = useRoute();
let router = useRouter();
let { id } = route.params;

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

console.log(id);

const { result, loading, error, onResult, onError } = useQuery(GET_LOBBY, { id });

onResult(res => {
    console.log(result.value);
    result.value
});
onError((e) => {
    console.log(e);
    router.push({ name: 'NotFound' });
})

</script>