<script lang="ts">
    import MartianRenderer from "$lib/MartianRenderer";
    import {afterUpdate} from "svelte";
    import {Tone} from "$lib/Tone";
    import {rotationFromTone} from "$lib/MartianShapes";

    export let letter: string = "A";
    export let tone: Tone = Tone.Flat;
    export let color = "black";
    export let strokeWeight = 0.05;

    let canvas: HTMLCanvasElement;
    let renderer: MartianRenderer;

    afterUpdate(() => {
        renderer = new MartianRenderer(canvas, color, strokeWeight);
        renderer.drawLetter(letter, rotationFromTone(tone));
    });
</script>

<canvas bind:this={canvas} />

<style>
    canvas {
        height: 100%;
    }
</style>
