<script lang="ts">
    import MartianRenderer from "$lib/MartianRenderer";
    import {onMount} from "svelte";

    let canvas: HTMLCanvasElement
    let pinyinInput: HTMLInputElement

    let pinyin = $state("");
    let foregroundColor = $state("#000000");
    let backgroundColor = $state("#ffffff");
    let transparentBackground = $state(true);
    let weightPercentage = $state(9);
    let imageHeight = $state(500);
    let image: string | null = $state(null);

    async function render()
    {
        try {
            await new MartianRenderer(
                canvas,
                foregroundColor,
                weightPercentage / 100,
                imageHeight,
                transparentBackground ? null : backgroundColor
            ).drawSentence(pinyin);

            image = canvas.toDataURL();
        } catch (e) {
            alert("拼音输入格式错误。");
            console.error(e)
        }
    }

    async function copyToClipboard()
    {
        if (!image) return;

        const data = await fetch(image);
        const blob = await data.blob();
        await navigator.clipboard.write([new ClipboardItem({[blob.type]: blob})]);
    }

    onMount(() => {
        pinyinInput.focus();
    });
</script>

<svelte:head>
    <title>崩坏三（第二部）火星文生成器</title>
</svelte:head>

<form>
    <div>
        <label for="pinyin">拼音</label>
        <input type="text" id="pinyin" bind:value={pinyin} bind:this={pinyinInput}
                   placeholder="di4 qiu2 ni3 hao3" required autocomplete="off">
    </div>

    <div>
        <label for="foreground-color">前景色</label>
        <input type="color" id="foreground-color" bind:value={foregroundColor}>
    </div>

    <div>
        <label for="background-color">背景色</label>
        <input type="color" id="background-color" bind:value={backgroundColor}
                   disabled={transparentBackground}>
    </div>

    <div>
        <label for="transparent-background">透明背景</label>
        <input type="checkbox" id="transparent-background" bind:checked={transparentBackground}>
    </div>

    <div>
        <label for="stroke-weight-percentage">笔画粗细</label>
        <input type="number" id="stroke-weight-percentage" bind:value={weightPercentage}>
            <input type="range" id="stroke-weight-percentage-range" bind:value={weightPercentage}
                   min="1" max="20" step="1">
    </div>

    <div>
        <label for="image-height">图像高度</label>
        <input type="number" id="image-height" bind:value={imageHeight} required>
        <input type="range" id="image-height-range" bind:value={imageHeight}
               min="100" max="1000" step="100">
    </div>

    <button onclick={render} type="submit" disabled={pinyin.length === 0}>生成</button>
    <button onclick={copyToClipboard} disabled={image == null}>复制到剪贴板</button>
</form>

<br>

{#if image}
    <div>
        <a href={image} download="崩三火星文-{pinyin.replace(/\s+/g, '-')}">
            <img src={image} alt="生成的图像">
        </a>
    </div>
{/if}

<canvas bind:this={canvas}></canvas>

<style lang="sass">
    canvas
        display: none

    img
        height: 10rem

    form > div
        margin-bottom: 1rem

    label
        margin-bottom: 0.5rem
        display: block
        color: #eee

    input[type="range"]
        margin-top: 0.5rem

    input
        display: block
        font-size: 1.5rem

    img
        outline: 4px dashed #fff2
</style>