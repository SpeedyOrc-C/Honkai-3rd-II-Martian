import {Tone} from "$lib/Tone";

type Coordinate = [number, number];

export function rotationFromTone(tone: Tone) {
    switch (tone) {
        case Tone.Flat:
            return 0;
        case Tone.Rising:
            return 90;
        case Tone.FallRising:
            return 180;
        case Tone.Falling:
            return 270;
        case Tone.Neutral:
            return 0;
    }
}

export function rotate90([x, y]: Coordinate): Coordinate {
    return [-y + 6, x];
}

export function rotate180([x, y]: Coordinate): Coordinate {
    return [-x + 6, -y + 6];
}

export function rotate270([x, y]: Coordinate): Coordinate {
    return [y, -x + 6];
}

export function rotate(shape: Coordinate[][], rotation: number): Coordinate[][] {
    if (rotation == 0)
        return shape;
    if (rotation == 90)
        return shape.map(line => line.map(rotate90));
    if (rotation == 180)
        return shape.map(line => line.map(rotate180));
    if (rotation == 270)
        return shape.map(line => line.map(rotate270));
    throw new Error(`Invalid rotation: ${rotation}`);
}

export type Strokes = Coordinate[][];

export const placeholder: Strokes = [
    [[5, 1]],
    [[1, 5], [4, 2]],
];

export const MartianLetterShapes: Map<string, Strokes> = new Map([
    ["A", [
        [[5, 1]],
        [[1, 5], [4, 2]],
        [[3, 5], [5, 5]],
    ]],
    ["B", [
        [[1, 1]],
        [[3, 1], [5, 1]],
        [[3, 3], [5, 3]],
        [[1, 5], [3, 5]],
    ]],
    ["C", [
        [[1, 5]],
        [[1, 1], [4, 1], [5, 2]],
        [[3, 5], [5, 5]],
    ]],
    ["D", [
        [[5, 5]],
        [[1, 1], [3.5, 1], [5, 2.5]],
        [[1, 3], [3, 5]],
    ]],
    ["E", [
        [[1, 1]],
        [[1, 5]],
        [[3, 1], [5, 1]],
        [[2, 3], [4, 3]],
        [[3, 5], [5, 5]],
    ]],
    ["F", [
        [[1, 1]],
        [[3, 1], [5, 1]],
        [[5, 5], [3, 3], [5, 3]],
    ]],
    ["G", [
        [[1, 5]],
        [[5, 1]],
        [[1, 1], [3, 1]],
        [[3, 3], [5, 3]],
        [[3, 5], [5, 5]],
    ]],
    ["H", [
        [[1, 5]],
        [[3, 1], [5, 3], [2, 3], [4, 5]],
    ]],
    ["I", [
        [[1, 5]],
        [[5, 1]],
        [[3, 1], [1, 1], [5, 5], [3, 5]],
    ]],
    ["J", [
        [[1, 5]],
        [[1, 1], [5, 5], [3, 5]],
    ]],
    ["K", [
        [[1, 5]],
        [[1, 2], [2, 1]],
        [[5, 1], [3, 3], [5, 5]],
    ]],
    ["L", [
        [[1, 5]],
        [[1, 1], [3, 3], [5, 3]],
        [[3, 5], [5, 5]],
    ]],
    ["M", [
        [[1, 5]],
        [[1, 1], [3, 3], [5, 1]],
        [[5, 3], [3, 5]],
    ]],
    ["N", [
        [[1, 5]],
        [[1, 1], [5, 5]],
        [[4, 1], [5, 2]],
    ]],
    ["O", [
        [[5, 3]],
        [[4, 2], [3, 1], [1, 3], [3, 5], [4, 4]],
    ]],
    ["P", [
        [[1, 1]],
        [[3, 1], [5, 1], [3, 3]],
        [[2, 2], [5, 5]],
    ]],
    ["Q", [
        [[5, 5]],
        [[5, 3], [3, 1], [1, 3], [3, 5]],
    ]],
    ["R", [
        [[5, 1]],
        [[1, 5]],
        [[1, 1], [3, 1]],
        [[5, 3], [3, 3], [5, 5]],
    ]],
    ["S", [
        [[5, 1]],
        [[3, 1], [1, 3], [5, 3], [3, 5]],
    ]],
    ["T", [
        [[1, 1]],
        [[3, 1], [5, 1]],
        [[2, 2], [5, 5]],
    ]],
    ["U", [
        [[3, 1]],
        [[2, 2], [1, 3], [3, 5], [5, 3]],
    ]],
    ["W", [
        [[1, 1]],
        [[4, 1], [5, 2]],
        [[1, 5], [3, 3], [5, 5]],
    ]],
    ["X", [
        [[5, 1]],
        [[1, 1], [2, 2]],
        [[2, 4], [3, 3], [5, 5]],
    ]],
    ["Y", [
        [[5, 1]],
        [[1, 1], [2, 2]],
        [[4, 2], [1, 5]],
        [[4, 4], [5, 5]],
    ]],
    ["Z", [
        [[1, 5]],
        [[1, 1]],
        [[3, 5], [5, 5]],
        [[2, 1], [5, 1], [2, 4]],
    ]],
    ["/", [
        [[5, 1]],
        [[1, 5], [4, 2]],
    ]],
]);

export class MartianGlyphShape { constructor(public width: number, public strokes: Strokes) {} }

export const MartianGlyphShapes: Map<string, MartianGlyphShape> = new Map([
    ["3", new MartianGlyphShape(7, [
        [[1, 1], [4, 1]],
        [[1, 5], [4, 5]],
        [[1, 9], [7, 9]],
    ])],
]);
