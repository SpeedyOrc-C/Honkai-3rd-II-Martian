<script lang="ts">
    import MartianRenderer from "$lib/MartianRenderer";
    import {onMount} from "svelte";

    let canvas: HTMLCanvasElement;
    let pinyinInput: HTMLInputElement;

    let pinyin = "";
    let foregroundColor = "#000000";
    let backgroundColor = "#ffffff";
    let transparentBackground = true;
    let weightPercentage = 9;
    let imageHeight = 500;
    let image: string | null = null;

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
    <table>
        <tr>
            <td><label for="pinyin">拼音</label></td>
            <td><input type="text" id="pinyin" bind:value={pinyin} bind:this={pinyinInput}
                       placeholder="di4 qiu2 ni3 hao3" required autocomplete="off"></td>
        </tr>
        <tr>
            <td><label for="foreground-color">前景色</label></td>
            <td><input type="color" id="foreground-color" bind:value={foregroundColor}></td>
        </tr>
        <tr>
            <td><label for="background-color">背景色</label></td>
            <td><input type="color" id="background-color" bind:value={backgroundColor}
                       disabled={transparentBackground}></td>
        </tr>
        <tr>
            <td><label for="transparent-background">透明背景</label></td>
            <td><input type="checkbox" id="transparent-background" bind:checked={transparentBackground}></td>
        </tr>
        <tr>
            <td><label for="stroke-weight-percentage">笔画粗细</label></td>
            <td><input type="number" id="stroke-weight-percentage" bind:value={weightPercentage}><br>
                <input type="range" id="stroke-weight-percentage-range" bind:value={weightPercentage}
                       min="1" max="20" step="1">
            </td>
        </tr>
        <tr>
            <td><label for="image-height">图像高度</label></td>
            <td><input type="number" id="image-height" bind:value={imageHeight} required><br>
                <input type="range" id="image-height-range" bind:value={imageHeight}
                       min="100" max="1000" step="100">
            </td>
        </tr>
    </table>

    <button on:click={render} type="submit" disabled={pinyin.length === 0}>生成</button>
    <button on:click={copyToClipboard} disabled={image == null}>复制到剪贴板</button>
</form>

<br>

{#if image}
    <div>
        <a href={image} download="崩三火星文-{pinyin.replace(/\s+/g, '-')}">
            <img src={image} alt="生成的图像">
        </a>
    </div>
{/if}

<canvas bind:this={canvas} />

<style>
    canvas {
        display: none;
    }

    img {
        height: 10rem;
    }
</style>