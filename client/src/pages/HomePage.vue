<template>
    <div>
        <h1>Vue project</h1>
        <form @submit="submit">
            <input type="text" placeholder="Username" v-model="username" />
            <button>Play</button>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag';
import { useRouter } from 'vue-router';

let username = ref('');

const CREATE_USER = gql`
    mutation createUser($input: CreateUserInput!) {
        createUser(createUserInput: $input) {
            _id
            login
        }
    }
`

const CREATE_LOBBY = gql`
    mutation createLobby($input: CreateLobbyInput!) {
        createLobby(createLobbyInput: $input) {
            _id
        }
    }
`

const { mutate: createUser } = useMutation(CREATE_USER);
const { mutate: createLobby } = useMutation(CREATE_LOBBY);

let router = useRouter();
console.log(router);

let submit = async (e: SubmitEvent) => {
    e.preventDefault();

    try {
        let user_res = await createUser({ input: { login: username.value } });
        let { data: { createUser: user } } = user_res!;

        let lobby_res = await createLobby({ input: { capacity: 4, players: [user._id] } });
        let { data: { createLobby: lobby } } = lobby_res!;

        console.log(lobby);

        router.push({ name: "Lobby", params: { id: lobby._id } })
    } catch (err) {
        console.log(err);
    }
}
</script>