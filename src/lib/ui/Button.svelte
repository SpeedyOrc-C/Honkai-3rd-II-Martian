<script lang="ts">
    import {createEventDispatcher} from "svelte";
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();

    const dispatch = createEventDispatcher();

    function onclick() {
        dispatch("click");
    }
</script>

<div class="button" {onclick} role="button" tabindex="0">
    <div class="inner">
        <div class="label">
            {@render children?.()}
        </div>
    </div>
</div>

<style lang="scss">
    .button {
        height: 100%;
        width: 100%;
        box-sizing: border-box;

        border: 2px solid #8888;
        padding: 2px;

        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }

    .inner {
        height: 100%;
        width: 100%;
        box-sizing: border-box;

        background: white;
        line-height: 100%;
    }

    .label {
        height: 100%;
        width: 100%;
        box-sizing: border-box;

        display: flex;
        align-items: center;
        justify-content: center;

        color: #333;
        font-family: "Microsoft YaHei UI", sans-serif;
        font-weight: bold;
    }
</style>