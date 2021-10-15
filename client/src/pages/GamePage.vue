<template>
    <div class='container'>
		<h1 v-if="game && game.turn.user_id == me?.sub">Your turn</h1>
        <div class="circle" v-if="game">
            <div class="top">
                <div class='opponent' v-if="!load" v-for="hand of opponents">
                    <h2>{{ hand.user_login }}</h2>
                    <div class="opponent_card">
						<UnoBackCardSVG 
							:left="hand.left"
						/>
					</div>
                </div>
            </div>
            <div class="bottom">
				<div class="deck" @click="handDeck">
					<UnoBackCardSVG />
				</div>
				<div class="pile">
					<GameCard 
						v-if="!load"
						:color="game.pile[game.pile.length - 1].color" 
						:value="game.pile[game.pile.length - 1].value" 
					/>
				</div>
                <div class="hand">
					<GameCard 
						v-if="!load"
						v-for="(card, index) in mine" 
						:color="card.color" 
						:value="card.value" 
						:game="game" 
						:me="me"
						:index="index"
					/>
                </div>
            </div>
        </div>
		<LobbyChat
			v-if="me"
			:me="me" 
		/>
    </div>
</template>

<script setup lang="ts">
import { useLazyQuery, useMutation, useSubscription } from '@vue/apollo-composable';
import { ref, onMounted, onUpdated } from 'vue';
import { useRoute } from 'vue-router';
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';

import { UPDATE_TOKEN } from '../graphql/user.gql';
import { DRAW_CARD, GET_GAME, UPDATE_GAME } from '../graphql/game.gql';
import GameCard from '../components/GameCard.vue';
import UnoBackCardSVG from '../components/svg/UnoBackCardSVG.vue';
import LobbyChat from '../components/LobbyChat.vue';

let { params: { id } }: any = useRoute();
const { mutate: updateToken } = useMutation(UPDATE_TOKEN);
const { mutate: drawCard } = useMutation(DRAW_CARD);
const { onResult, load: getGame } = useLazyQuery(GET_GAME);
const { onResult: updateGame } = useSubscription(UPDATE_GAME, { id, user_id: jwt_decode<any>(Cookies.get('token')!).sub });

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

let mine = ref<{ color: string, value: string }[] | null>(null);
let opponents = ref<{
		user_id: string,
		user_login: string,
		left: number,
		cards: { color: string, value: string }[]
}[]>([]);
let load = ref<boolean>(false)

onResult((res: any) => {
	if(res.data) {
		let result = res.data.game;

		game.value = result;
		mine.value = result.hands.find((e: any) => e.user_id == me.value!.sub)!.cards;

		let index = result.hands.indexOf(result.hands.find((e: any) => e.user_id == me.value!.sub));;
		opponents.value = [...result.hands.slice(index + 1), ...result.hands.slice(0, index)];
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
	load.value = false;
})

updateGame((res) => {
	let result = res.data.updateGame;

	load.value = true;
	game.value = result;
	mine.value = result.hands.find((e: any) => e.user_id == me.value!.sub)!.cards;

	let index = result.hands.indexOf(result.hands.find((e: any) => e.user_id == me.value!.sub));
	opponents.value = [...result.hands.slice(index + 1), ...result.hands.slice(0, index)];
});

let handDeck = async () => {
	if(game.value?.turn.user_id == me.value?.sub) {
		console.log("pioche");
		await drawCard();
	}
}

</script>


<style scoped>
.container {
	height: 100vh;
	width: 100%;
	padding: 20px;
	display: flex;
	align-items: center;
}

.circle {
	border: 5px solid grey;
	height: 80vh;
	width: 80vw;
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
	align-items: center;
	flex-wrap: wrap;
	gap: 50px;
}

.deck, .pile {
	transform: translateY(-50%);
	max-width: 7vw;
}

.deck > svg {
	width: 7vw;
}

.hand {
	width: 125%;
	background-color: cadetblue;
	/* position: absolute; */
	/* transform: translate(0%, 50%); */
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 5px;
	gap: 5px;
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
	height: 120px;
	width: 75px;
}

</style>
