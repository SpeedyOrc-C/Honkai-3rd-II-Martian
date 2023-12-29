import type {Tone} from "$lib/Tone";

export type Martian = Array<MartianComponent>;
export type MartianComponent = Syllable | Space;

export class Syllable { constructor(public syllable: string, public tone: Tone) {} }
export class Space {}
