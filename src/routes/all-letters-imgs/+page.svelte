<script lang="ts">
    import {onMount} from "svelte";
    import MartianRenderer from "$lib/MartianRenderer";

    const Letters = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G',
        'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'Ü', 'W', 'X', 'Y', 'Z',
    ]

    let URLs: string[] = []

    onMount(async () =>
    {
        const canvas = document.createElement('canvas')
        {
            const renderer = new MartianRenderer(canvas)

            for (const letter of Letters)
            {
                renderer.clear()
                await renderer.drawLetter(letter)
                URLs.push(canvas.toDataURL('image/png'))
            }

            URLs = URLs
        }
        canvas.remove()
    })
</script>

{#each URLs as url, i}
    <a href={url} download="火星文字母-{Letters[i]}">
        <img src={url} alt="火星文字母 {Letters[i]}">
    </a>
{/each}

<style lang="scss">
    img {
        height: 5rem;
        background: white;
    }
</style>
