<template>
    <div class='container'>
        <div class="circle" v-if="game">
            <div class="top">
                <div class='opponent' v-for="hand of game?.hands.filter((e) => e.user_id != me?.sub)">
                    <!-- <PersonSVG width='50'/> -->
                    <h2>{{ hand.user_login }}</h2>
                    <div class="opponent_card">
						{{ hand.left }}
					</div>
                </div>
            </div>
            <div class="bottom">
				<div class="card deck"></div>
				<div class="card pile" :style="{backgroundColor: game.pile[game.pile.length - 1].color}">
					{{ game.pile[game.pile.length - 1].value }}
				</div>
                <div class="hand">
					<!-- <div class="card" v-for="[i, card] of game?.hands.find((e) => e.user_id == me?.sub)!.cards?.entries()">
						<UnoCardSVG :color="card.color" :value="card.value" />
					</div> -->
					<UnoCardSVG v-for="[i, card] of game?.hands.find((e) => e.user_id == me?.sub)!.cards?.entries()" :color="card.color" :value="card.value" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useLazyQuery, useMutation } from '@vue/apollo-composable';
import { ref, onMounted, onUpdated } from 'vue';
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';

import { UPDATE_TOKEN } from '../graphql/user.gql';
import { GET_GAME } from '../graphql/game.gql';
import UnoCardSVG from '../components/svg/UnoCardSVG.vue';

const { mutate: updateToken } = useMutation(UPDATE_TOKEN);
const { onResult, load: getGame } = useLazyQuery(GET_GAME);

let me = ref<{ sub: string, lobby: string, roles: string[], state: string } | null>(null);
let game = ref<{ 
	current_color: string,  
	pile: { color: string, value: string }[], 
	turn: { user_id: string, user_login: string }, 
	hands: { 
		user_id: string,
		user_login: string,
		left: number,
		cards: { color: string, value: string }[] | null
	}[]
} | null>(null);

onResult((res: any) => {
	console.log(res);
	if(res.data) {
		game.value = res.data.game;
	}
})

onMounted(async() => {
	await updateToken({ token: Cookies.get('token') });
	me.value = jwt_decode(Cookies.get('token')!);
	getGame(GET_GAME);
})

onUpdated(() => {
	let opponents = document.getElementsByClassName('opponent') as HTMLCollectionOf<HTMLDivElement>;
	let n = opponents.length;

	for(let i = 0; i < n; i++) {
		let angle = 180 - (180 / (n + 1)) * (i + 1);
		let x = 150 + 155 * Math.cos(-angle*Math.PI/180);
		let y = 150 + 155 * Math.sin(-angle*Math.PI/180);

		let left = `calc(100%*${x}/300)`;
		let top = `calc(100%*${y}/150)`;

		opponents[i].style.setProperty('left', left);
		opponents[i].style.setProperty('top', top);
	}
})

</script>


<style scoped>
.container {
	height: 80vh;
	width: 100%;
	padding: 20px;
}

.circle {
	border: 5px solid grey;
	border-radius: 500%;
	height: 70vw;
	width: 70%;
	margin: auto;
	position: relative;
}

.top {
	width: 100%;
	height: 50%;
	border: 5px solid black;
    position: relative;
}

.bottom {
	display: flex;
	justify-content: center;
	gap: 50px;
}

.deck, .pile {
	transform: translateY(-50%);
}

.hand {
	width: auto;
	background-color: cadetblue;
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	padding: 5px;
	gap: 5px;
}

.card {
	height: 15vw;
	width: calc(15vw / 1.6);
	border: 5px solid white;
	border-radius: 5px;
}

.opponent {
	display: flex;
	flex-direction: column;
	width: 35%;
	position: absolute;
	transform: translate(-50%, -50%);
	align-items: center;
}

.opponent_card {
	height: 60px;
	width: 37.5px;
	background-color: chartreuse;
}

</style>
