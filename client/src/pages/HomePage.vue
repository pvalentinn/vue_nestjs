<template>
    <div class="container">
        <div>
            <form class="login_form" @submit="submit">
                <span class="title">Vue project</span>
                <div class="username_div">
                    <input v-model="username" type="text" name="username" required minlength="3" />
                    <span :class="{ active: username }">Username</span>
                </div>
                <div class="button_div">
                    <button>Play</button>
                </div>
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

let username = ref('');

const { mutate: createUser } = useMutation(CREATE_USER);
const { mutate: createLobby } = useMutation(CREATE_LOBBY);

let router = useRouter();
console.log(router);

let submit = async (e: SubmitEvent) => {
    e.preventDefault();

    try {
        await createUser({ input: { login: username.value } });
        let lobby_res = await createLobby();
        let { data: { createLobby: lobby } } = lobby_res!;

        router.push({ name: "Lobby", params: { id: lobby._id } })
    } catch (err) {
        console.log(err);
    }
}
</script>


<style>
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
    background: -webkit-linear-gradient(left, #6a11cb, #2575fc);
    background: linear-gradient(left, #6a11cb, #2575fc);
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

.username_div {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    width: 100%;
    height: 75px;
    border: 1px solid #e0e0e0;
    border-bottom: none;
    background-color: #fff;
    position: relative;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    border-right: none;
}

.username_div > input {
    touch-action: manipulation;
    margin: 0;
    overflow: visible;
    outline: none;
    border: none;
    color: #555;
    display: block;
    width: 100%;
    background: 0 0;
    padding: 0 30px;
    height: 55px;
    transition: all 0.4s;
}

.username_div > span {
    font-size: 15px;
    color: #555;
    line-height: 1.2;
    display: block;
    position: absolute;
    pointer-events: none;
    width: 100%;
    padding-left: 30px;
    left: 0;
    top: 28px;
    transition: all 0.4s;
}

.username_div > input:focus + span,
span.active {
    top: 10px;
    font-size: 13px;
    color: #111;
}

.button_div {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.button_div > button {
    touch-action: manipulation;
    margin: 0;
    -webkit-appearance: button;
    outline: none !important;
    border: none;
    color: #fff;
    text-transform: uppercase;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    width: 100%;
    height: 70px;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    overflow: hidden;
    background: #111;
    transition: all 0.4s;
    position: relative;
    z-index: 1;
}
</style>