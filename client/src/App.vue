<template>
	<router-view />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Rubik&display=swap');

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
import Cookies from 'js-cookie'
import jwt_decode from "jwt-decode";
import { useRoute, useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable';

import { REMOVE_USER } from './graphql/user.gql';

const router = useRouter();
let route = useRoute();

let getToken = (): {lobby: string, state: string} | null => {
	let token = Cookies.get('token');
	if (token) return jwt_decode<{lobby: string, state: string}>(token);
	else return null;
}

let token = getToken();
if (token?.lobby && route.params.id != token?.lobby) {
	console.log(token);
	if(token?.state == "in_game") router.push({ name: "Game", params: { id: token?.lobby } })
	else router.push({ name: "Lobby", params: { id: token?.lobby } })
}

let handler = async (e: BeforeUnloadEvent) => {
	e.preventDefault();

	if (!getToken()?.lobby) {
		Cookies.remove('token');
		useMutation(REMOVE_USER);
	}
}

window.addEventListener("beforeunload", handler)

</script>