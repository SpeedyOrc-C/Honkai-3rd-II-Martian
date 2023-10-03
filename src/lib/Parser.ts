import {Tone} from "$lib/Pinyin";

export type Parser<T> = (input: string) => [T, string] | null;

export const mapParser = <A, B>(f: (a: A) => B, p: Parser<A>): Parser<B> => (input: string) => {
    const result = p(input);
    return result ? [f(result[0]), result[1]] : null;
}

export const altParser = <T>(p1: Parser<T>, p2: Parser<T>): Parser<T> => (input: string) => {
    const result1 = p1(input);
    return result1 ? result1 : p2(input);
}

export const charP = (char: string): Parser<string> => (input: string) => {
    return input.startsWith(char) ? [char, input.slice(1)] : null;
}

export const digitP: Parser<string> = (input: string) => {
    const firstChar = input.charAt(0);
    return firstChar.match(/[0-9]/) ? [firstChar, input.slice(1)] : null;
}

export const alphaP: Parser<string> = (input: string) => {
    const firstChar = input.charAt(0);
    return firstChar.match(/[a-zA-Z]/) ? [firstChar, input.slice(1)] : null;
}

export const toneP: Parser<Tone> = (input: string) => {
    const digit = digitP(input);
    if (digit) {
        let tone: Tone;
        switch (digit[0]) {
            case "1": tone = Tone.Flat; break;
            case "2": tone = Tone.Rising; break;
            case "3": tone = Tone.FallRising; break;
            case "4": tone = Tone.Falling; break;
            default: return null;
        }
        return [tone, input.slice(1)];
    } else {
        return [Tone.Neutral, input];
    }
}

export const pinyinSyllableP: Parser<{syllable: string, tone: Tone}> = (input: string) => {
    const syllableChars = manyP(alphaP)(input);
    if (!syllableChars) return null;
    const tone = toneP(syllableChars[1]);
    return tone ? [{syllable: syllableChars[0].join(""), tone: tone[0]}, tone[1]] : null;
}

export const someP = <T>(parser: Parser<T>): Parser<T[]> => (input: string) => {
    const results: T[] = [];
    let nextInput = input;
    let result = parser(nextInput);
    while (result) {
        results.push(result[0]);
        nextInput = result[1];
        result = parser(nextInput);
    }
    return [results, nextInput];
}

export const manyP = <T>(parser: Parser<T>): Parser<T[]> => (input: string) => {
    const result = someP(parser)(input);
    return result !== null && result[0].length > 0 ? result : null;
}

