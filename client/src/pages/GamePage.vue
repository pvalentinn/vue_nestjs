<template>
    <div class='container'>
        <div class="circle">
            <div class="top" ref="topdiv">
                <div class='opponent' v-for="i in n">
                    <PersonSVG width='50'/>
                    <h2>Name {{ i }}</h2>
                    <div class="opponent_card"></div>
                </div>
            </div>
            <div class=""></div>
            <div class="bottom">
                <div class="hand">
                    <div class="card"></div>
                    <div class="card"></div>
                    <div class="card"></div>
                    <div class="card"></div>
                    <div class="card"></div>
                    <div class="card"></div>
                </div>
            </div>
            <div class='middle'></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PersonSVG from './PersonSVG.vue';

let topdiv = ref<HTMLDivElement>();
let n = 1;

onMounted(() => {
    let opponents = document.getElementsByClassName('opponent') as HTMLCollectionOf<HTMLDivElement>;

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


<style>
.container {
	height: 80vh;
	width: 100%;
	padding: 20px;
	background-color: blue;
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

.middle {
	background-color: brown;
	height: 5px;
	width: 100%;
	position: absolute;
	top: 50%;
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
	width: calc((15vw * 5.5) / 8.8);
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
