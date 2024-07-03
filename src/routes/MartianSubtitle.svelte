<script lang="ts">
    import type {Martian} from "$lib/Martian";
    import CanvasMartian from "$lib/CanvasMartian.svelte";

    export let martian: Martian;
</script>

<div class="martian-subtitle">
    <div class="text"><slot/></div>
    <div style="width: 1rem"/>
    <CanvasMartian sentence={martian} strokeWeight={0.08} color="#333" />
</div>

<style lang="sass">
    .martian-subtitle
        -moz-user-select: none
        -webkit-user-select: none
        user-select: none

        display: flex

        margin: 1rem auto
        width: fit-content
        height: 3rem
        line-height: 2rem
        padding: 0.5rem 1rem
        border-radius: 0.5rem

        font-size: 1.5rem
        color: #333
        font-family: sans-serif
        background: #fdd807
</style>