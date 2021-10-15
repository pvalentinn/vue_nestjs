<template>
    <UnoColorCardSVG 
        v-if="newValue === 'color'"
        @click="handleCard"
        :color="newColor" 
        :class="[playable && 'playable', game && 'card']" 
    />
    <UnoUniversalCardSVG
        v-else
        :color="newColor" 
        :value="newValue"
        @click="handleCard"
        :class="[playable && 'playable', game && 'card']" 
    />
    <GameModalColor 
        v-if="show"
        @selectColor="handleBlackCard"
    />
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useMutation } from '@vue/apollo-composable';
    import { PLAY_CARD } from '../graphql/game.gql';
    import UnoColorCardSVG from './svg/UnoColorCardSVG.vue';
    import UnoUniversalCardSVG from './svg/UnoUniversalCardSVG.vue';
    import GameModalColor from './GameModalColor.vue';

    const { mutate: playCard } = useMutation(PLAY_CARD);

    let emit = defineEmits(['chooseColor'])
    let props = defineProps<{ index?: number, color: string, value: string, game?: any, me?: any }>();
    let newColor = ref<string>('');
    let newValue = ref<string>('');
    let show = ref<boolean>(false);

    let playable: boolean = (props.game?.current_color == props.color || props.color == "black" || props.game?.pile[props.game.pile.length - 1].value == props.value);

    switch(props.color) {
        case 'red': 
            newColor.value = '#c40c00';
        break
        case 'yellow': 
            newColor.value = '#e7d004';
        break
        case 'blue': 
            newColor.value = '#0849a3';
        break
        case 'green': 
            newColor.value = '#328a10';
        break
        case 'black': 
            newColor.value = '#000';
        break
    }

    switch(props.value) {
        case 'draw2': 
            newValue.value = '+2';
        break;
        case 'draw4': 
            newValue.value = '+4';
        break;
        case 'reverse': 
            newValue.value = '🗘';
        break;
        case 'skip': 
            newValue.value = '🚫';
        break;
        case 'color': 
            newValue.value = 'color';
        break;
        default: 
            newValue.value = ` ${props.value}`;
        break;
    }


    let handleCard = async () => {
        let { index, game, me } = props;
        if(!game) return;

        if(game.turn.user_id == me.sub && playable) {
            console.log('can play', index);

            if(props.color == "black") {
                show.value = true;
            } else {
                await playCard({ index });
            }
        } else if (!playable) {
            console.log("unplayable")
        } else {
            console.log('not your turn');
        }
    }

    let handleBlackCard = async (color: string) => {
        show.value = false;
        await playCard({ index: props.index, color });
    }

</script>

<style scoped>
svg {
    width: 6.5vw;
    user-select: none;
    filter: brightness(80%);
}

.card:hover {
    margin-bottom: 30px;
}

svg.playable {
    margin-bottom: 5px;
    filter: brightness(100%);
}

</style>