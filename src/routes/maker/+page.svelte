<script lang="ts">
    import MartianRenderer from "$lib/MartianRenderer";
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import Slider from "$lib/components/ui/slider/slider.svelte";
    import Button from "$lib/components/ui/button/button.svelte";

    let canvas: HTMLCanvasElement

    let pinyin = $state("");
    let foregroundColor = $state("#000000");
    let backgroundColor = $state("#ffffff");
    let transparentBackground = $state(false);
    let weightPercentage = $state(9);
    let imageHeight = $state(400);
    let image: string | null = $state(null);

    async function render() {
        try {
            await new MartianRenderer(
                canvas,
                foregroundColor,
                weightPercentage / 100,
                imageHeight,
                transparentBackground ? null : backgroundColor,
            ).drawSentence(pinyin);

            image = canvas.toDataURL();
        } catch (e) {
            alert("拼音输入格式错误。");
            console.error(e);
        }
    }

    async function copyToClipboard() {
        if (!image) return;

        const data = await fetch(image);
        const blob = await data.blob();
        await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob }),
        ]);
    }
</script>

<svelte:head>
    <title>崩坏三（第二部）火星文生成器</title>
</svelte:head>

<form class="m-auto max-w-2xl p-2 flex flex-col gap-4">
    <div>
        <Button href="/" variant="outline">返回</Button>
    </div>

    <header class="text-2xl">生成器</header>

    <div class="flex flex-col gap-2">
        <Label for="pinyin">拼音</Label>
        <Input
            type="text"
            id="pinyin"
            bind:value={pinyin}
            placeholder="di4 qiu2 ni3 hao3"
            required
            autocomplete="off"
        />
    </div>

    <div class="flex items-center gap-4">

        <div class="flex items-center">
            <Label for="foreground-color">前景色：</Label>
            <input
                type="color"
                id="foreground-color"
                bind:value={foregroundColor}
            />
        </div>

        <div class="flex items-center">
            <Label for="background-color">背景色：</Label>
            <input
                type="color"
                id="background-color"
                bind:value={backgroundColor}
                disabled={transparentBackground}
            />
        </div>

        <div class="flex items-center">
            <Label for="transparent-background">使用透明背景：</Label>
            <Checkbox
                id="transparent-background"
                bind:checked={transparentBackground}
            />
        </div>

    </div>


    <div class="flex flex-col gap-2">
        <Label for="stroke-weight-percentage">
            笔画粗细：{weightPercentage}
        </Label>
        <Slider
            type="single"
            id="stroke-weight-percentage-range"
            bind:value={weightPercentage}
            min={1}
            max={20}
            step={1}
        />
    </div>

    <div class="flex flex-col gap-2">
        <Label for="image-height">
            图像高度：{imageHeight}
        </Label>
        <Slider
            type="single"
            id="image-height"
            bind:value={imageHeight}
            min={50}
            max={500}
            step={50}
        />
    </div>

    <div>
        <Button onclick={render} type="submit" disabled={pinyin.length == 0}>
            生成
        </Button>
    </div>

    {#if image}
        <p>
            点击图像即可下载，或
            <Button onclick={copyToClipboard}>
                复制到剪贴板
            </Button>
        </p>

        <div
            class="outline-2 rounded p-2 w-fit bg-neutral-200 dark:bg-neutral-800"
        >
            <a href={image} download="崩三火星文-{pinyin.replace(/\s+/g, '-')}">
                <img class="h-40" src={image} alt="生成的图像" />
            </a>
        </div>
    {/if}

    <canvas bind:this={canvas} class="hidden"></canvas>
</form>
