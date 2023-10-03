<script lang="ts">
    import {afterUpdate, onMount} from "svelte";
    import {LetterShapes} from "$lib/Martian/LetterShapes";
    import {Tone} from "$lib/Pinyin";

    export let letter: string = "/";
    export let tone: Tone = Tone.Flat;
    export let color = "black";
    export let weight = 0.1;

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let angle = 0;

    let resolution = 200;
    let width = resolution * weight;

    function dot(x: number, y: number) {
        // Convert to 0-based
        x -= 1; y -= 1;

        ctx.beginPath();
        {
            ctx.arc(
                resolution * (0.1 + 0.2 * x),
                resolution * (0.1 + 0.2 * y),
                width / 2,
                0, 2 * Math.PI
            );
            ctx.fill();
        }
    }

    function line(x1: number, y1: number, x2: number, y2: number) {
        // Convert to 0-based
        x1 -= 1; y1 -= 1; x2 -= 1; y2 -= 1;

        // A line between the two dots
        ctx.beginPath();
        {
            ctx.moveTo(
                resolution * (0.1 + 0.2 * x1),
                resolution * (0.1 + 0.2 * y1)
            );
            ctx.lineTo(
                resolution * (0.1 + 0.2 * x2),
                resolution * (0.1 + 0.2 * y2)
            );
            ctx.lineWidth = width;
            ctx.stroke();
        }
    }

    function consecutiveLines(ps: Array<[number, number]>) {
        const first = ps[0];
        dot(first[0], first[1]);

        for (let i = 1; i < ps.length; i++) {
            const prev = ps[i - 1];
            const curr = ps[i];
            line(prev[0], prev[1], curr[0], curr[1]);
            dot(curr[0], curr[1]);
        }
    }

    onMount(() => {
        let maybeCtx = canvas.getContext("2d");
        if (maybeCtx != null)
            ctx = maybeCtx;
        else
            throw new Error("Canvas context is null");

        canvas.height = resolution;
        canvas.width = resolution;
    })

    afterUpdate(() => {
        ctx.fillStyle = color;
        ctx.strokeStyle = color;

        const shape = LetterShapes.get(letter);
        if (shape != undefined) {
            for (const lines of shape) {
                consecutiveLines(lines);
            }

            if (letter != "/") {
                switch (tone) {
                    case Tone.Flat: angle = 0; break;
                    case Tone.Rising: angle = 90; break;
                    case Tone.FallRising: angle = 180; break;
                    case Tone.Falling: angle = 270; break;
                    case Tone.Neutral: angle = 0; break;
                }
            } else {
                angle = 0;
            }
        }

    });
</script>

<canvas bind:this={canvas} style="transform: rotate({angle}deg)"/>

<style lang="sass">
    canvas
        display: block
        width: 100%
        height: 100%
</style>
