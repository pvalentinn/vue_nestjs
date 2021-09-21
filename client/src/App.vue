<template>
	<router-view />
</template>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body {
	background: -webkit-linear-gradient(left, #6a11cb, #2575fc);
	background: linear-gradient(left, #6a11cb, #2575fc);
}
</style>


<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable';
import { REMOVE_USER } from './graphql/user.gql';
import Cookies from 'js-cookie'
import jwt_decode from "jwt-decode";

const router = useRouter();
let route = useRoute();

let token = Cookies.get('token');
let lobby: string | null | undefined;

if (token) ({ lobby } = jwt_decode(token));
console.log(lobby, token);

if (lobby && route.params.id != lobby) {
	router.push({ name: "Lobby", params: { id: lobby } })
}

let handler = async (e: Event) => {
	e.preventDefault();

	let token = Cookies.get('token');
	let lobby: string | null | undefined;
	if (token) ({ lobby } = jwt_decode(token));

	if (!lobby) {
		Cookies.remove('token');
		useMutation(REMOVE_USER);
	}
}

window.addEventListener("beforeunload", handler)

</script>