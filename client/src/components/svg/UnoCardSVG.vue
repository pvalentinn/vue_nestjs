<template>
<svg xmlns="http://www.w3.org/2000/svg"  height="100%" viewBox="0 0 303 364" fill="none">
    <g id="uno card">
        <rect id="Rectangle 1" x="43.5" y="8.5" width="215" height="347" :fill="color" stroke="white" stroke-width="10"/>
        <path id="Ellipse 1" d="M234.076 220.268C215.93 259.181 190.128 289.904 163.202 308.168C136.226 326.465 108.544 332.021 86.2111 321.607C63.8785 311.193 50.3405 286.416 47.0173 253.99C43.7003 221.624 50.6504 182.109 68.7956 143.197C86.9409 104.284 112.743 73.5607 139.669 55.2972C166.645 36.9999 194.328 31.4441 216.66 41.858C238.993 52.2718 252.531 77.0491 255.854 109.475C259.171 141.841 252.221 181.355 234.076 220.268Z" :fill="color" stroke="white" stroke-width="10"/>
        <g id="middle_frame">
            <text x="10" y="335" fill="white">9</text>
           <text id="middle_value" fill="white" xml:space="preserve" style="white-space: pre" font-family="Roboto" font-size="96" letter-spacing="0em"><tspan x="124.547" y="218.812">{{ value }}</tspan></text>
        </g>
        <g id="top_frame">
            <text id="top_value" fill="white" xml:space="preserve" style="white-space: pre" font-family="Roboto" font-size="54" letter-spacing="0em"><tspan x="60.8389" y="71.957">{{ value }}</tspan></text>
        </g>
        <g id="bottom_frame" clip-path="url(#clip0)">
            <text id="bottom_value" transform="translate(248 345) rotate(-180)" fill="white" xml:space="preserve" style="white-space: pre" font-family="Roboto" font-size="54" letter-spacing="0em"><tspan x="6.83887" y="52.957">{{ value }}</tspan></text>
        </g>
    </g>
    <defs>
        <clipPath id="clip0">
            <rect width="44" height="69" fill="white" transform="translate(204 276)"/>
        </clipPath>
    </defs>
</svg>
</template>

<script lang='ts' setup>
    let props = defineProps<{ color: string, value: string }>();

</script>