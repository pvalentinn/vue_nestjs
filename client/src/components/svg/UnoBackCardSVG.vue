<template>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 199 309" fill="none">
    <g style="mix-blend-mode:overlay">
        <rect width="199" height="309" rx="20" fill="white"/>
    </g>
    <rect x="13" y="12" width="173" height="282" rx="15" fill="black"/>
    <g style="mix-blend-mode:lighten">
        <path d="M164.599 190.955C127.018 256.048 67.5506 292.073 31.7759 271.418C-3.99887 250.764 -2.53405 181.251 35.0476 116.158C72.6293 51.0645 132.096 15.0398 167.871 35.6943C203.646 56.3488 202.181 125.861 164.599 190.955Z" fill="#ED1C24"/>
    </g>
    <g style="mix-blend-mode:hard-light">
        <text v-if="left" transform="translate(35 83)" fill="#F9DC2F" xml:space="preserve" style="white-space: pre" font-family="Rubik" font-size="120" letter-spacing="0em">
            <tspan x="28.4336" y="112.1">{{ left }}</tspan>
        </text>
        <text v-else transform="translate(7.36929 141) rotate(-25)" fill="#F9DC2F" xml:space="preserve" style="white-space: pre" font-family="Rubik" font-size="82" letter-spacing="0em">
            <tspan x="1.49707" y="76.585">UNO</tspan>
        </text>
    </g>
</svg>
</template>

<script setup lang="ts">
    let props = defineProps<{left?: number}>();
</script>

<style scoped>
svg {
    user-select: none;
}

</style>