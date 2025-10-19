<script lang="ts">
	const { children } = $props()
</script>

{@render children()}

<style lang="sass">
    :global(*)
        box-sizing: border-box

    %mono
        font-family: Menlo, Consolas, "Source Code Pro", monospace

    :global(code)
        @extend %mono

    :global(body)
        background: #333
        margin: 0
        padding: 1rem

    :global(input[type="text"]),
    :global(input[type="number"]),
    :global(input[type="color"])
        color: #bbb
        background: #484848
        outline: 2px solid #fdd80788
        &:focus
            color: #ddd
            background: #404040
            outline: 4px solid #fdd807ff

    :global(button)
        font-size: 1.2rem
        padding: 0.5rem 0.8rem

    :global(.scroll-x)
        overflow-y: visible
        overflow-x: auto

    :global(.no-sel)
        @extend %no-sel

    :global(a)
        color: unset

    %no-sel
        -moz-user-select: none
        -webkit-user-select: none
        user-select: none
</style>