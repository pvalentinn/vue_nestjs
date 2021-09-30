<template>
    <div class='square'>
        <span>{{ modelValue }}</span>
    </div>
</template>

<script lang="ts" setup>
let props = defineProps<{ modelValue: number }>();
let emit = defineEmits(["update:modelValue"]);

let interval = setInterval(() => {
    if(props.modelValue - 1 == 0) clearInterval(interval);
    emit("update:modelValue", props.modelValue - 1);
}, 1000)

</script>

<style scoped>
.long {
    position: absolute;
    display: flex;
    width: 100%;
    height: 100px;
    /* transform: translate(-25deg, -25deg); */
    left: 0;
    top: 30%;
    background-color: rgba(0, 0, 0, 0.336);
    justify-content: center;
}

.square {
    position: absolute;
    width: 100px;
    height: 100px;
    position: absolute;
    background-color: rgba(255, 255, 255, 0.199);
    transform: translate(0, 0) rotate(45deg);
    left: calc(50% - 50px);
    top: -20%;
    z-index: 50;
    border: 5px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
}

.square > span {
    transform: rotate(-45deg);
    font-size: 40px;
}
</style>