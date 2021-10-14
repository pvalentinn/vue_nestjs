<template>
    <div class="modal">
        <div class="modal_container">
            <h1>Enter username to join the room :</h1>
            <form class="join_form" @submit="submit">
                <BeautifulInput v-model="username" label="Username" />
                <BeautifulSubmit button="join" />
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMutation } from "@vue/apollo-composable";

import { JOIN_LOBBY } from "../graphql/lobby.gql";
import { CREATE_USER } from "../graphql/user.gql";
import BeautifulInput from "./BeautifulInput.vue";
import BeautifulSubmit from "./BeautifulSubmit.vue";

let username = ref('');
let props = defineProps<{ hide: () => void, id: string }>();
let emit = defineEmits(['update:me']);

let { mutate: createUser } = useMutation(CREATE_USER);
let { mutate: joinLobby } = useMutation(JOIN_LOBBY);

let submit = async (e: Event) => {
    e.preventDefault();
    await createUser({ input: { login: username.value } });
    await joinLobby({ id: props.id })
    emit('update:me');
    props.hide()
}
</script>

<style>
.modal {
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal_container {
    height: 300px;
    width: 80%;
    max-width: 600px;
    background: white;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0px 6px 15px 0px rgba(0, 0, 0, 0.37);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
}

.modal_container > h1 {
    text-align: center;
    width: 100%;
}

.join_form {
    /* height: 80%; */
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.join_form > input {
    height: 50px;
    display: inline-flex;
}
</style>