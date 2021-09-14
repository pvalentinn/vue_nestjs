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
import { ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag';
let username = ref('');

let { result } = useQuery(gql`
    query getUsers {
        users(filters: {}){
            _id,
            login
        }
    }
`)

watch(() => {
    console.log(result.value)
}, () => {
    console.log(result.value)
})

let submit = (e: SubmitEvent) => {
    e.preventDefault();

    console.log(username.value);
}
</script>