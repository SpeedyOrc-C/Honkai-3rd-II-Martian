<script lang="ts">
    import {afterUpdate, onMount} from "svelte";
    import Glyph from "$lib/Martian/Glyph.svelte";
    import {PinyinSyllable, type Martian, martianP, Space} from "$lib/Martian/Martian";

    export let input = "";
    export let height = "5rem";
    export let color = "black";
    export let weight = 0.1;

    export let valid = false;


    let script: Martian = [];

    afterUpdate(() => {
        const result = martianP(input);
        if (result && result[1].length == 0) {
            script = result[0];
            valid = true;
        } else {
            script = [];
            valid = false;
        }
    })
</script>

<div class="sentence" style:height>
    {#each script as component}
        {#if component instanceof Space}
            <div class="space"/>
        {:else if component instanceof PinyinSyllable}
            {@const {syllable, tone} = component}
            <Glyph {syllable} {tone} {height} {color} {weight} />
        {/if}
    {/each}
</div>

<style lang="sass">
    .sentence
        display: flex
        width: fit-content

    .space
        height: 100%
        aspect-ratio: 1 / 3
</style>
