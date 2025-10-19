<script lang="ts">
    import MartianRenderer from "$lib/MartianRenderer";
    import {Tone} from "$lib/Tone";
    import {rotationFromTone} from "$lib/MartianShapes";

    const {
        letter = "A",
        tone = Tone.Flat,
        color = "black",
        strokeWeight = 0.05
    }: {
        letter: string;
        tone: Tone;
        color: string;
        strokeWeight: number;
    } = $props();

    let canvas: HTMLCanvasElement;
    let renderer: MartianRenderer;

    $effect(() => {
        renderer = new MartianRenderer(canvas, color, strokeWeight);
        renderer.drawLetter(letter, rotationFromTone(tone));
    });
</script>

<canvas bind:this={canvas}></canvas>

<style>
    canvas {
        height: 100%;
    }
</style>
