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
import { useRouter } from 'vue-router'
import jwt_decode from "jwt-decode";

const { getCookie, removeCookie } = useCookie();
const router = useRouter();

let token = getCookie('token');
let lobby: string | null | undefined;

if (token) {
	({ lobby } = jwt_decode(token));

	if (lobby) router.push({ name: "Lobby", params: { id: lobby } })
}

let handler = (e: Event) => {
	e.preventDefault();
	if (!lobby) removeCookie('token');
}

window.addEventListener("beforeunload", handler)
</script>