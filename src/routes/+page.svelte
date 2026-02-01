<script lang="ts">
    import MartianSubtitle from "./MartianSubtitle.svelte";
    import type { Martian } from "$lib/Martian";
    import { martianP } from "$lib/Parser";
    import { onMount } from "svelte";
    import CanvasMartianLetter from "$lib/CanvasMartianLetter.svelte";
    import CanvasMartian from "$lib/CanvasMartian.svelte";
    import Alphabet from "./Alphabet.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Button from "$lib/components/ui/button/button.svelte";

    const defaultPinyin = "di4 qiu2 ni3 hao3";

    let pinyinToBeConverted = defaultPinyin;
    let inputPinyin = $state("");
    let valid = $state(true);
    let martian: Martian = $state([]);

    let martianTitleConversion: Martian = $state([]);
    let martianTitleWriting: Martian = $state([]);
    let martianTitleAlphabet: Martian = $state([]);
    let martianDefaultPinyin: Martian = [];

    onMount(async () => {
        const [[m1], [m2], [m3], [m4]] = await Promise.all([
            martianP("wen2 zi4 zhuan3 huan4"),
            martianP("shu1 xie3 fang1 fa3"),
            martianP("zi4 mu3 yu3 shu4 zi4"),
            martianP(defaultPinyin),
        ]);
        martianTitleConversion = m1;
        martianTitleWriting = m2;
        martianTitleAlphabet = m3;
        martianDefaultPinyin = m4;
        martian = martianDefaultPinyin;
    });

    async function updatePinyin() {
        pinyinToBeConverted =
            inputPinyin.length > 0 ? inputPinyin : defaultPinyin;
        try {
            const [m] = await martianP(pinyinToBeConverted);
            martian = m;
            valid = true;
        } catch (e) {
            martian = martianDefaultPinyin;
            valid = false;
        }
    }
</script>

<svelte:head>
    <title>崩坏三（第二部）的火星文</title>
</svelte:head>

<main class="m-auto mt-10 max-w-3xl p-2 flex flex-col gap-8">
    <header class="text-2xl text-center">
        崩坏三（第二部）的火星文
    </header>

    <section class="flex flex-col items-center gap-4">
        <MartianSubtitle martian={martianTitleConversion}>
            文字转换
        </MartianSubtitle>

        <div class="h-20">
            <CanvasMartian sentence={martian} color="#eee" />
        </div>

        <Input
            type="text"
            spellcheck="false"
            placeholder="{defaultPinyin}（输入拼音）"
            bind:value={inputPinyin}
            onkeyup={updatePinyin}
            aria-invalid={!valid}
        />

        {#if !valid}
            <div>
                语法错误：请输入用数字标记声调的拼音。<br />
                例如：wen2 ben3（文本）
            </div>
        {/if}

        <div>
            如果您需要进一步调整生成文字的颜色以及粗细，请移步至
            <Button href="/maker" variant="outline">生成器</Button> 。
        </div>
    </section>

    <section class="flex flex-col items-center gap-4">
        <MartianSubtitle martian={martianTitleWriting}>
            书写方法
        </MartianSubtitle>

        <p>
            每个两个字母一上一下排列后形成一列，下一列写在上一列的右方。
            如果该音节的声调并非一声或轻声，则需要旋转音节中的每一个字母。
            每个字母还需要额外和相邻的字母交叉 20% 的面积，需要特别注意。
        </p>

        <div class="flex items-center gap-2">
            <p>
                当一个音节中的部件数量为奇数个时，这个音节的右下角则会空出来，不是很美观。
                所以需要在该音节的右下角添加一个占位符，使部件的数量为偶数个。
                需要注意，占位符不需要根据声调来旋转，其形态如右图所示。
            </p>
            <div class="h-8">
                <CanvasMartianLetter
                    letter="/"
                    color="#eee"
                    strokeWeight={0.1}
                />
            </div>
        </div>
    </section>

    <section class="flex flex-col items-center gap-4">
        <MartianSubtitle martian={martianTitleAlphabet}>
            字母与数字
        </MartianSubtitle>

        <Alphabet />
    </section>

    <div class="h-40"></div>
</main>
