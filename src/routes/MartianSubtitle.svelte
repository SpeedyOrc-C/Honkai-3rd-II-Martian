<script lang="ts">
    import type {Martian} from "$lib/Martian";
    import CanvasMartian from "$lib/CanvasMartian.svelte";

    interface Props {
        martian: Martian;
        children?: import('svelte').Snippet;
    }

    let { martian, children }: Props = $props();
</script>

<header class="rounded-lg p-2 flex items-center gap-4">
    <div class="text-xl">{@render children?.()}</div>
    <div class="h-8">
        <CanvasMartian sentence={martian} strokeWeight={0.08} color="#333" />
    </div>
</header>

<style>
    header {
        color: #333;
        background: #fdd807;
    }
</style>
