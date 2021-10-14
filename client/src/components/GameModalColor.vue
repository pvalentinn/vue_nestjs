<template>
      <div class="modal">
        <div class="modal_container">
            <div 
                v-for="color in colors" 
                class="color"
                :class="color"
                @click="() => emit('selectColor', color)"
            >
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    let colors = ['red', 'blue', 'yellow', 'green'];
    let emit = defineEmits(['selectColor']);

</script>

<style scoped>
.modal {
    position: absolute;
    z-index: 888;
    /* top: -200%;
    left: -102%; */
    left: -50%;
    transform: translate(-17%, -27%);
    width: 100vw;
    box-sizing: border-box;
}
.color {
    width: 50%;
    height: 125px;
    filter: brightness(80%);
    cursor: pointer;
}

.color:hover { 
    filter: brightness(100%);
}

.red { background-color: #c40c00; }
.blue { background-color: #0849a3; }
.yellow { background-color: #e7d004; }
.green { background-color: #328a10; }

</style>