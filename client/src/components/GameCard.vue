<template>
    <UnoBasicCardSVG
        v-if="newValue.length == 1" 
        :color="newColor" 
        :value="newValue"
        @click="handleCard"
    />
    <UnoColorCardSVG 
        v-if="newValue === 'color'"
        @click="handleCard" 
    />
    <UnoSpecialCardSVG 
        v-if="newValue == '+2' || newValue == '+4' || newValue == '🗘' || newValue == '🚫'" 
        :color="newColor" 
        :value="newValue"
        @click="handleCard" 
    />
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useMutation } from '@vue/apollo-composable';
    import { PLAY_CARD } from '../graphql/game.gql';
    import UnoBasicCardSVG from './svg/UnoBasicCardSVG.vue';
    import UnoSpecialCardSVG from './svg/UnoSpecialCardSVG.vue';
    import UnoColorCardSVG from './svg/UnoColorCardSVG.vue';

    const { mutate: playCard } = useMutation(PLAY_CARD);

    let props = defineProps<{ index?: number, color: string, value: string, game?: any, me?: any }>();
    let newColor = ref<string>('');
    let newValue = ref<string>('');

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
            newValue.value = props.value;
        break;
    }


    let handleCard = async () => {
        let { index, game, me } = props;
        if(!game) return;

        if(game.turn.user_id == me.sub && playable) {
            console.log('can play', index);
            await playCard({ index });
        } else if (!playable) {
            console.log(44444)
        }
    }
</script>

<style scoped>
svg {
    height: 12.5vw;
}

</style>