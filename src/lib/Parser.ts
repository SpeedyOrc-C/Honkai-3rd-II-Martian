import {Parser as p, type TParser} from "crazy-parser";
import {type MartianComponent, Syllable, Space, type Martian} from "$lib/Martian";
import {Tone} from "$lib/Tone";

export async function digitP(input: string): Promise<[string, string]> {
    if (input.length == 0) throw "";

    const c = input.charAt(0);
    if (!c.match(/[0-9]/)) throw "";

    return [c, input.slice(1)];
}

export async function alphaP(input: string): Promise<[string, string]> {
    if (input.length == 0) throw "";

    const c = input.charAt(0);
    if (!c.match(/[a-zA-Z]/)) throw "";

    return [c, input.slice(1)];
}

export async function toneP(input: string): Promise<[Tone, string]> {
    const [digit, tail] = await p.opt(digitP)(input);
    if (!digit) return [Tone.Neutral, input];

    switch (digit[0]) {
        case "1": return [Tone.Flat, tail];
        case "2": return [Tone.Rising, tail];
        case "3": return [Tone.FallRising, tail];
        case "4": return [Tone.Falling, tail];
        default: throw "";
    }
}

export async function pinyinSyllableP(input: string): Promise<[Syllable, string]> {
    const [syllableChars, tail] = await p.many(alphaP)(input);
    if (!syllableChars) throw "";

    const [tone, tail2] = await p.opt(toneP)(tail);
    if (tone == null) throw "";

    const syllable = syllableChars.join("");
    return [new Syllable(syllable, tone), tail2];
}

export const spaceP: TParser<Space> =
    p.map(p.str(" "), _ => new Space());

export const martianComponentP: TParser<MartianComponent> =
    p.alt(pinyinSyllableP, spaceP);

export const martianP: TParser<Martian> =
    p.many(martianComponentP);
