<template>
	<router-view />
</template>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
</style>


<script setup lang="ts">
import { useCookie } from 'vue-cookie-next';
import { useRoute, useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable';
import { REMOVE_USER } from './graphql/user.gql';
import jwt_decode from "jwt-decode";

const { getCookie, removeCookie } = useCookie();
const router = useRouter();
let route = useRoute();

let token = getCookie('token');
let lobby: string | null | undefined;

if (token) ({ lobby } = jwt_decode(token));

if (lobby && route.params.id != lobby) {
	router.push({ name: "Lobby", params: { id: lobby } })
}

let handler = async (e: Event) => {
	e.preventDefault();
	if (!lobby) {
		removeCookie('token');
		useMutation(REMOVE_USER);
	}
}

window.addEventListener("beforeunload", handler)

</script>