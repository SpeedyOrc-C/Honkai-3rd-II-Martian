<!-- @migration-task Error while migrating Svelte code: Can't migrate code with afterUpdate. Please migrate by hand. -->
<script lang="ts">
    import MartianRenderer from "$lib/MartianRenderer";
    import {afterUpdate} from "svelte";
    import type {Martian} from "$lib/Martian";

    export let sentence: string | Martian = "di4 qiu2 ni3 hao3";
    export let color = "black";
    export let strokeWeight = 0.05;

    let canvas: HTMLCanvasElement;
    let renderer: MartianRenderer;

    afterUpdate(() => {
        renderer = new MartianRenderer(canvas, color, strokeWeight);
        renderer.drawSentence(sentence);
    });
</script>

<canvas bind:this={canvas} />

<style>
    canvas {
        height: 100%;
    }
</style>