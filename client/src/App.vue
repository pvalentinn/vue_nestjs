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
import Cookies from 'js-cookie'
import jwt_decode from "jwt-decode";
import { useRoute, useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable';

import { REMOVE_USER } from './graphql/user.gql';

const router = useRouter();
let route = useRoute();

let getLobby = (): string | null => {
	let token = Cookies.get('token');
	if (token) return jwt_decode<{lobby: string}>(token).lobby;
	else return null;
}

let lobby = getLobby();
if (lobby && route.params.id != lobby) {
	router.push({ name: "Lobby", params: { id: lobby } })
}

let handler = async (e: BeforeUnloadEvent) => {
	e.preventDefault();

	if (!getLobby()) {
		Cookies.remove('token');
		useMutation(REMOVE_USER);
	}
}

window.addEventListener("beforeunload", handler)

</script>