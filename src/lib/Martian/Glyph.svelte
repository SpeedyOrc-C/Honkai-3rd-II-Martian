<script lang="ts">
    import {Tone} from "$lib/Pinyin";
    import {afterUpdate, onMount} from "svelte";
    import Letter from "$lib/Martian/Letter.svelte";

    export let syllable = "";
    export let tone: Tone = Tone.Flat;
    export let height = "5rem";
    export let color = "black";
    export let weight = 0.1;

    $: charNum = syllable.length;
    $: transform = `rotate(${rotation}deg)`

    let columns: Array<{ upper: string, lower: string }> = [];
    let rotation = 0;

    afterUpdate(() => {
        let syllableUpper = syllable.toUpperCase();

        const newColumns = [];
        if (charNum > 0) {
            for (let i = 0; i <= Math.floor(charNum / 2) - 1; i++) {
                newColumns.push({upper: syllableUpper[2*i], lower: syllableUpper[2*i+1]});
            }
            if (charNum % 2 == 1) {
                newColumns.push({upper: syllableUpper[charNum-1], lower: "/"})
            }
        }
        columns = newColumns;

        switch (tone) {
            case Tone.Flat:       rotation = 0; break;
            case Tone.Rising:     rotation = 90; break;
            case Tone.FallRising: rotation = 180; break;
            case Tone.Falling:    rotation = 270; break;
            case Tone.Neutral:    rotation = 0; break;
        }

    });
</script>

<div class="glyph" style:height>
    {#key columns}
    {#each columns as column}
    <div class="column">
        <div><Letter letter={column.upper} {tone} {color} {weight} /></div>
        <div><Letter letter={column.lower} {tone} {color} {weight} /></div>
    </div>
    {/each}
    {/key}
</div>

<style lang="sass">
    .glyph
        position: relative
        width: fit-content
        display: flex

    .column
        height: 100%
        aspect-ratio: 5 / 9

        &:nth-last-child(n+2)
            aspect-ratio: 4 / 9

        & > div
            position: absolute
            height: calc(100% * 5 / 9)
            aspect-ratio: 1

            &:first-child
                top: 0
            &:last-child
                bottom: 0
</style>