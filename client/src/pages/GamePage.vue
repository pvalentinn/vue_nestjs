<template>
    <div class='container'>
		<h1 v-if="game?.turn.user_id == me?.sub">Your turn</h1>
        <div class="circle" v-if="game">
            <div class="top">
                <div class='opponent' v-for="hand of game?.hands.filter((e) => e.user_id != me?.sub)">
                    <h2>{{ hand.user_login }}</h2>
                    <div class="opponent_card">
						{{ hand.left }}
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
let load = ref<boolean>(false)

onResult((res: any) => {
	if(res.data) {
		game.value = res.data.game;
		mine.value = res.data.game.hands.find((e: any) => e.user_id == me.value!.sub)!.cards;
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
	load.value = true;
	game.value = res.data.updateGame;
	mine.value = res.data.updateGame.hands.find((e: any) => e.user_id == me.value!.sub)!.cards;
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
}

.circle {
	border: 5px solid grey;
	border-radius: 500%;
	height: 900px;
	width: 900px;
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
