<template>
    <div class="modal">
        <div>
            <h1>Enter username to join the room :</h1>
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

<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import { ref, defineProps } from "vue-demi";
import { JOIN_LOBBY } from "../graphql/lobby.gql";
import { CREATE_USER } from "../graphql/user.gql";


let username = ref('');
const props = defineProps<{ id: string, hide: () => boolean }>()
let { mutate: createUser } = useMutation(CREATE_USER);
let { mutate: joinLobby } = useMutation(JOIN_LOBBY);

let submit = async (e: SubmitEvent) => {
    e.preventDefault();
    await createUser({ input: { login: username.value } });
    await joinLobby({ id: props.id })
    props.hide()
}
</script>

<style scoped>
</style>