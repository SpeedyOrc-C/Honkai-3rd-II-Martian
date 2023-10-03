<script lang="ts">
    import PinyinWithNumbers from "$lib/PinyinWithNumbers.svelte";

    export let martian: string
</script>

<div class="martian-subtitle">
    <div class="text"><slot/></div>
    <div style="width: 1rem"/>
    <PinyinWithNumbers input={martian} color="#333" height="2rem" weight={0.15} />
</div>

<style lang="sass">
    @import "../global"

    .martian-subtitle
        @extend %no-sel

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