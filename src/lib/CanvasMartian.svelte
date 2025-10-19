<script lang="ts">
    import MartianRenderer from "$lib/MartianRenderer";
    import type {Martian} from "$lib/Martian";

    const {
        sentence = "di4 qiu2 ni3 hao3",
        color = "black",
        strokeWeight = 0.05
    }: {
        sentence: string | Martian;
        color: string;
        strokeWeight: number;
    } = $props();

    let canvas: HTMLCanvasElement;
    let renderer: MartianRenderer;

    $effect(() => {
        renderer = new MartianRenderer(canvas, color, strokeWeight);
        renderer.drawSentence(sentence);
    });
</script>

<canvas bind:this={canvas}></canvas>

<style>
    canvas {
        height: 100%;
    }
</style>