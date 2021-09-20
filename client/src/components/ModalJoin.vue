<template>
    <div class="modal">
        <div class="modal_container">
            <h1>Enter username to join the room :</h1>
            <form class="login_form" @submit="submit">
                <BeautifulInput v-model="username" label="Username" />
                <button>Join</button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import { ref } from "vue";
import BeautifulInput from "./BeautifulInput.vue";
import { JOIN_LOBBY } from "../graphql/lobby.gql";
import { CREATE_USER } from "../graphql/user.gql";

let username = ref('');
let { mutate: createUser } = useMutation(CREATE_USER);
let { mutate: joinLobby } = useMutation(JOIN_LOBBY);

let submit = async (e: SubmitEvent) => {
    e.preventDefault();
    console.log(username.value);
    // await createUser({ input: { login: username.value } });
    // await joinLobby({ id: props.id })
    // props.hide()
}
</script>

<style scoped>
.modal {
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal_container {
    height: 200px;
    width: 80%;
    max-width: 400px;
    background: white;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0px 6px 15px 0px rgba(0,0,0,0.37);
}

.modal_container > h1 {
    text-align: center;
}

form {
    /* height: 80%; */
    display: flex;
    justify-content: center;
    align-items: center;
}

form > input {
    height: 50px;
    display: inline-flex;
}

</style>