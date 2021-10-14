<template>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 199 310" fill="none">
    <g style="mix-blend-mode:overlay">
        <rect y="0.00405884" width="199" height="309" rx="20" fill="white"/>
    </g>
    <rect x="13" y="12.0041" width="173" height="282" rx="15" :fill="color"/>
    <g style="mix-blend-mode:lighten">
        <path d="M161.568 189.209C143.015 221.345 119.139 246.151 95.6966 260.352C72.1308 274.628 49.7958 277.785 33.5259 268.391C17.2559 258.998 8.82186 238.077 9.40234 210.53C9.97978 183.128 19.5251 150.048 38.0787 117.912C56.6324 85.7761 80.5083 60.9694 103.951 46.7682C127.516 32.4923 149.851 29.336 166.121 38.7294C182.391 48.1229 190.825 69.0437 190.245 96.5902C189.667 123.992 180.122 157.073 161.568 189.209Z" :fill="color"/>
        <path d="M161.568 189.209C143.015 221.345 119.139 246.151 95.6966 260.352C72.1308 274.628 49.7958 277.785 33.5259 268.391C17.2559 258.998 8.82186 238.077 9.40234 210.53C9.97978 183.128 19.5251 150.048 38.0787 117.912C56.6324 85.7761 80.5083 60.9694 103.951 46.7682C127.516 32.4923 149.851 29.336 166.121 38.7294C182.391 48.1229 190.825 69.0437 190.245 96.5902C189.667 123.992 180.122 157.073 161.568 189.209Z" stroke="white" stroke-width="7"/>
    </g>
    <g clip-path="url(#clip0_10:43)">
        <text fill="white" xml:space="preserve" style="white-space: pre" font-family="Rubik" font-size="72" letter-spacing="0em"><tspan x="57.3906" y="183.16">{{ value }}</tspan></text>
    </g>
    <g clip-path="url(#clip1_10:43)">
        <text transform="translate(175 286) rotate(-180)" fill="white" xml:space="preserve" style="white-space: pre" font-family="Rubik" font-size="35" letter-spacing="0em"><tspan x="0.287109" y="32.4875">{{ value }}</tspan></text>
    </g>
    <g clip-path="url(#clip2_10:43)">
        <text fill="white" xml:space="preserve" style="white-space: pre" font-family="Rubik" font-size="35" letter-spacing="0em"><tspan x="28.7871" y="54.4875">{{ value }}</tspan></text>
    </g>
    <defs>
        <clipPath id="clip0_10:43">
            <rect width="82" height="76" fill="white" transform="translate(59 116)"/>
        </clipPath>
        <clipPath id="clip1_10:43">
            <rect width="51" height="48" fill="white" transform="translate(175 286) rotate(-180)"/>
        </clipPath>
        <clipPath id="clip2_10:43">
            <rect width="51" height="49" fill="white" transform="translate(24 22)"/>
        </clipPath>
    </defs>
</svg>
</template>

<script lang='ts' setup>
    let props = defineProps<{ color: string, value: string }>();

    console.log("special");
</script>