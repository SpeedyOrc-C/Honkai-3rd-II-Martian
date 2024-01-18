<script lang="ts">
    import CanvasMartianLetter from "$lib/CanvasMartianLetter.svelte";
    import CanvasMartian from "$lib/CanvasMartian.svelte";
    import {MartianSyllable} from "$lib/Martian";
    import {Tones} from "$lib/Tones";

    const letterGroups = [
        ["A", "O", "E", "I", "U", "Ü", "Y", "W"],
        ["B", "P", "M", "F", "D", "T", "N", "L"],
        ["G", "K", "H", "J", "Q", "X"],
        ["Z", "C", "S", "R", "ZH", "CH", "SH"],
    ];

    const numberGroups = [
        ["1", "2", "3", "4", "5"],
        ["6", "7", "8", "9", "0"],
    ];
</script>

<div id="alphabet">
    {#each letterGroups as group}
    <table>
        {#each group as letter}
        <tr>
            <td class="latin">{letter}</td>
            {#each Tones as tone}
            <td class="martian">

                <div>
                    {#if letter.length === 1}
                        <CanvasMartianLetter {letter} color="#eee" {tone} strokeWeight={0.1} />
                    {:else}
                        <CanvasMartian sentence={[new MartianSyllable(letter, tone)]}
                                       color="#eee" strokeWeight={0.05} />
                    {/if}
                </div>

            </td>
            {/each}
        </tr>
        {/each}
    </table>
    {/each}

    {#each numberGroups as group}
    <table>
        {#each group as number}
        <tr>
            <td class="number">{number}</td>
            <td class="martian">
                <div>
                    <CanvasMartian sentence={number} color="#eee" strokeWeight={0.05} />
                </div>
            </td>
        </tr>
        {/each}
    </table>
    {/each}
</div>

<style lang="scss">
    #alphabet {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;

        table {
            display: block;
            margin: 1rem;

            tr {
                .latin, .number {
                    padding-right: 0.3rem;
                    font-size: 1.5rem;
                    text-align: center;

                    color: #eee;
                    font-family:
                        -apple-system, "Helvetica Neue",
                        "Microsoft YaHei UI", Arial, sans-serif;
                }
                .martian > div {
                    height: 3rem;
                    box-sizing: border-box;

                    border: 1px solid #666;
                    padding: 0.1rem;
                }
            }
        }
    }
</style>

