<template>
    <div>
        <h1>Vue project</h1>
        <form @submit="click">
            <input type="text" placeholder="Username" :value="username" />
            <button>Play</button>
        </form>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'

const username = ref('');

let click = (e: SubmitEvent) => {
    e.preventDefault();

    console.log(username);
}

</script>