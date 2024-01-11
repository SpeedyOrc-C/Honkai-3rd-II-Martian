import type {Tone} from "$lib/Tone";

export type Martian = Array<MartianComponent>;
export type MartianComponent = MartianSyllable | MartianGlyph | MartianSpace;

export class MartianSyllable { constructor(public syllable: string, public tone: Tone) {} }
export class MartianGlyph { constructor(public glyph: string) {} }
export class MartianSpace {}
