<template>
    <div class="button_div">
        <button>{{ props.button }}</button>
    </div>
</template>

<script setup lang='ts'>
import { defineProps } from 'vue';

let props = defineProps<{ button: string }>()
</script>

<style scoped>
.button_div {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.button_div > button {
    touch-action: manipulation;
    margin: 0;
    -webkit-appearance: button;
    outline: none !important;
    border: none;
    color: #fff;
    text-transform: uppercase;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    width: 100%;
    height: 70px;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    overflow: hidden;
    background: #111;
    transition: all 0.4s;
    position: relative;
    z-index: 1;
}
</style>