<template>
    <div class="container">
        <div>
            <form class="login_form" @submit="submit">
                <span class="title">Vue project</span>
                <BeautifulInput v-model="username" label="Username" />
                <BeautifulSubmit button="Play" />
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useMutation } from '@vue/apollo-composable'
import { useRouter } from 'vue-router';

import { CREATE_USER } from '../graphql/user.gql';
import { CREATE_LOBBY } from '../graphql/lobby.gql';
import BeautifulSubmit from '../components/BeautifulSubmit.vue';
import BeautifulInput from '../components/BeautifulInput.vue';

let username = ref('');
let router = useRouter();

const { mutate: createUser } = useMutation(CREATE_USER);
const { mutate: createLobby } = useMutation(CREATE_LOBBY);

let submit = async (e: Event) => {
    e.preventDefault();

    try {
        await createUser({ input: { login: username.value } });
        let lobby_res = await createLobby();
        let { data: { createLobby: lobby } } = lobby_res!;

        router.push({ name: "Lobby", params: { id: lobby._id } })
    } catch (err: any) {
        console.log("Error in creating lobby :", err.message)
    }
}
</script>


<style scoped>
* {
    font-family: OpenSans-Regular, sans-serif;
    color: #212529;
}

.container {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding: 15px;
}

.container > div {
    padding-top: 50px;
    padding-bottom: 160px;
    width: 560px;
}

.login_form {
    width: 100%;
    background-color: transparent;
    display: flex;
    flex-wrap: wrap;
}

.title {
    padding-bottom: 43px;
    width: 100%;
    display: block;
    font-size: 30px;
    color: #fefefe;
    line-height: 1.2;
    text-transform: uppercase;
    text-align: center;
}
</style>