<template>
    <div>
        <h1>Vue project</h1>
        <form @submit="submit">
            <input type="text" placeholder="Username" v-model="username" />
            {{ username }}
            <button>Play</button>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
let username = ref('');

let submit = (e: SubmitEvent) => {
    e.preventDefault();
    console.log(username.value);
}
</script>