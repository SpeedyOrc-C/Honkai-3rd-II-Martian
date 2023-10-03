import type {Tone} from "$lib/Pinyin";
import type {Parser} from "$lib/Parser";
import {alphaP, altParser, charP, manyP, mapParser, toneP} from "$lib/Parser";

export class PinyinSyllable {
    syllable: string;
    tone: Tone;
    constructor(syllable: string, tone: Tone) {
        this.syllable = syllable;
        this.tone = tone;
    }
}
export const pinyinSyllableP: Parser<PinyinSyllable> = (input: string) => {
    const syllableChars = manyP(alphaP)(input);
    if (!syllableChars) return null;
    const tone = toneP(syllableChars[1]);
    return tone ? [new PinyinSyllable(syllableChars[0].join(""), tone[0]), tone[1]] : null;
}

export class Space {}
export const spaceP = mapParser(() => new Space, charP(" "));

export type MartianComponent = PinyinSyllable | Space;
export const martianComponentP: Parser<MartianComponent> = altParser(pinyinSyllableP, spaceP);

export type Martian = Array<MartianComponent>;
export const martianP: Parser<Martian> = manyP(martianComponentP);