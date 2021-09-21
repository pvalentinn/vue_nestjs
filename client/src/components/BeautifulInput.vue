<template>
    <div class="input_div">
        <input :value="props.modelValue" @input="handle" type="text" required minlength="3" />
        <span :class="{ active: props.modelValue }">{{ props.label }}</span>
    </div>
</template>

<script setup lang='ts'>
import { defineEmits, ref } from 'vue'
let props = defineProps<{ modelValue: string, label: string }>();
let emit = defineEmits(['update:modelValue']);

let handle = ({ target }: { target: HTMLInputElement }) => {
    console.log(props.modelValue)
    emit("update:modelValue", target!.value);
}
</script>

<style scoped>
.input_div {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    width: 100%;
    height: 75px;
    border: 1px solid #e0e0e0;
    border-bottom: none;
    background-color: #fff;
    position: relative;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
}
.input_div > input {
    touch-action: manipulation;
    margin: 0;
    overflow: visible;
    outline: none;
    border: none;
    color: #555;
    display: block;
    width: 100%;
    background: 0 0;
    padding: 0 30px;
    height: 55px;
    transition: all 0.4s;
}

.input_div > span {
    font-size: 15px;
    color: #555;
    line-height: 1.2;
    display: block;
    position: absolute;
    pointer-events: none;
    width: 100%;
    padding-left: 30px;
    left: 0;
    top: 28px;
    transition: all 0.4s;
}

.input_div > input:focus + span,
span.active {
    top: 10px;
    font-size: 13px;
    color: #111;
}
</style>