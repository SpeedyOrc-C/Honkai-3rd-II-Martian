<script lang="ts">
    import "../global.sass";
    import {Tones} from "$lib/Tones";
    import MartianSubtitle from "./MartianSubtitle.svelte";
    import type {Martian} from "$lib/Martian";
    import {martianP} from "$lib/Parser";
    import {onMount} from "svelte";
    import CanvasMartianLetter from "$lib/CanvasMartianLetter.svelte";
    import CanvasMartian from "$lib/CanvasMartian.svelte";
    import {Syllable} from "$lib/Martian";

    const letterGroups = [
        ["A", "O", "E", "I", "U", "Y", "W"],
        ["B", "P", "M", "F", "D", "T", "N", "L"],
        ["G", "K", "H", "J", "Q", "X"],
        ["Z", "C", "S", "R", "ZH", "CH", "SH"],
    ];
    const defaultPinyin = "di4 qiu2 ni3 hao3";

    let pinyinToBeConverted = defaultPinyin;
    let inputPinyin = "";
    let valid = true;
    let martian: Martian = [];

    let martianTitleConversion: Martian = [];
    let martianTitleWriting: Martian = [];
    let martianTitleAlphabet: Martian = [];
    let martianDefaultPinyin: Martian = [];

    onMount(async () => {
        const [[m1,], [m2,], [m3,], [m4,]] = await Promise.all([
            martianP("wen2 zi4 zhuan3 huan4"),
            martianP("shu1 xie3 fang1 fa3"),
            martianP("zi4 mu3 biao3"),
            martianP(defaultPinyin),
        ]);
        martianTitleConversion = m1;
        martianTitleWriting = m2;
        martianTitleAlphabet = m3;
        martianDefaultPinyin = m4;
        martian = martianDefaultPinyin;
    });

    async function updatePinyin() {
        pinyinToBeConverted = inputPinyin.length > 0 ? inputPinyin : defaultPinyin;
        try {
            const [m,] = await martianP(pinyinToBeConverted);
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

<div id="wrapper">
    <div style="height: 30vh"/>

    <MartianSubtitle martian={martianTitleConversion}>
        文字转换
    </MartianSubtitle>

    <input id="pinyin-input" type="text" spellcheck="false" placeholder="{defaultPinyin}（输入拼音）"
           bind:value={inputPinyin} on:keyup={updatePinyin} class:valid>

    <br>

    <div id="output" class="scroll-x">
        <div class="text" style:display={valid ? "none" : "block"}>
            语法错误：请输入用数字标记声调的拼音。<br>
            例如：wen2 ben3（文本）
        </div>
        <div class="output-martian" style:display={valid ? "block" : "none"}>
            <div style="height: 5rem; overflow-y: hidden; overflow-x: auto">
                <CanvasMartian sentence={martian} color="#eee" strokeWeight={0.05} />
            </div>
        </div>
    </div>

    <br><br><br>

    <MartianSubtitle martian={martianTitleWriting}>
        书写方法
    </MartianSubtitle>

    <div class="text">
        <div>
            每个两个字母一上一下排列后形成一列，下一列写在上一列的右方。
            如果该音节的声调并非一声或轻声，则需要旋转音节中的每一个字母。
            每个字母还需要额外和相邻的字母交叉 20% 的面积，需要特别注意。
        </div>

        <br>

        <div style="display: flex; align-items: center">
            <div>
                当一个音节中的部件数量为奇数个时，这个音节的右下角则会空出来，不是很美观。
                所以需要在该音节的右下角添加一个占位符，使部件的数量为偶数个。
                需要注意，占位符不需要根据声调来旋转。其形态如右图所示。
            </div>
            <div>
                <div style="height: 2rem; width: 2rem; margin-left: 1rem;">
                    <CanvasMartianLetter letter="/" color="#eee" strokeWeight={0.1} />
                </div>
            </div>
        </div>
    </div>

    <br><br><br>

    <MartianSubtitle martian={martianTitleAlphabet}>
        字母表
    </MartianSubtitle>

    <div id="alphabet" class="scroll-x">
        {#each letterGroups as group}
            <div class="column">
                {#each group as letter}
                    <div class="row">

                        <div class="latin" class:long={letter.length > 1}>
                            {letter}
                        </div>

                        <div class="tones">
                            {#each Tones as tone}
                            <div class="consonant">
                                {#if letter.length === 1}
                                    <CanvasMartianLetter {letter} color="#eee" {tone} strokeWeight={0.1} />
                                {:else}
                                    <CanvasMartian sentence={[new Syllable(letter, tone)]} color="#eee" strokeWeight={0.05} />
                                {/if}
                            </div>
                            {/each}
                        </div>

                    </div>
                {/each}
            </div>
        {/each}
    </div>

    <div style="height: 30vh"/>
</div>

<style lang="sass">
    @import "../global"

    #wrapper
        width: 100%

    .text
        width: 100%
        max-width: 45rem
        margin: 0 auto
        padding: 1rem 1.3rem

        background-color: #fff1
        color: #eee
        font-size: 1.2rem
        font-family: sans-serif

    #pinyin-input
        display: block
        width: 100%
        max-width: 50rem

        margin: 0 auto
        padding: 0.5rem 0.8rem

        font-size: 2rem

        background: #8f4014
        &.valid
            background: unset

    #output
        margin: 0 auto
        width: fit-content
        max-width: 100%

    #alphabet
        box-sizing: content-box
        *
            box-sizing: content-box

        display: flex
        align-items: flex-start

        max-width: 100%
        width: fit-content
        margin: 0 auto

        .column
            margin: 0 0.25rem

        .row
            display: flex
            align-items: center

            padding: 0.5rem 0.5rem 0.5rem 0
            border: 2px solid #fff2
            margin: 0.5rem 0

        .latin
            width: 3rem
            text-align: center

            color: #eee
            font-size: 2rem
            font-family: Georgia, serif

            &.long
                font-size: 1.5rem

        .tones
            display: flex
            width: 15rem
            justify-content: space-between

            .consonant
                height: 3rem
                width: 3rem
                position: relative
                overflow: visible
</style>
