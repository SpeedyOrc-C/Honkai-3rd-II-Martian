import {Tone} from "$lib/Tone";

export type Coordinate = [number, number];
export type Shape = Coordinate[][];
export type Rotation = 0 | 90 | 180 | 270;

export function rotationFromTone(tone: Tone): Rotation {
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

export function rotate(shape: Shape, rotation: Rotation): Shape {
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

export type Strokes = Shape;

export const placeholder: Strokes = [
    [[5, 1]],
    [[1, 5], [4, 2]],
];

export const MartianLetterShapes: Map<string, Strokes> = new Map([
    ["A", [
        [[5, 1]],
        [[1, 5], [4, 2]],
        [[4, 5], [5, 5]],
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
        [[4, 3], [5, 3]],
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
    ["Ü", [
        [[1, 1]],
        [[2, 2], [5, 5], [1, 5]],
    ]],
    ["W", [
        [[1, 1]],
        [[4, 1], [5, 2]],
        [[1, 5], [3, 3], [5, 5]],
    ]],
    ["X", [
        [[5, 1]],
        [[1, 5]],
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

const number = (strokes: Strokes) => new MartianGlyphShape(5, strokes);

export const MartianGlyphShapes: Map<string, MartianGlyphShape> = new Map([
    ["0", number([
        [[3, 1], [1, 1], [1, 9]],
        [[3, 7], [3, 9]],
        [[5, 1], [5, 9]],
    ])],
    ["1", number([
        [[1, 5], [3, 5]],
    ])],
    ["2", number([
        [[1, 1], [3, 1]],
        [[1, 9], [5, 9]],
    ])],
    ["3", number([
        [[1, 1], [3, 1]],
        [[1, 5], [3, 5]],
        [[1, 9], [5, 9]],
    ])],
    ["4", number([
        [[1, 1], [5, 1]],
        [[1, 5], [2, 5]],
        [[4, 5], [5, 5]],
        [[1, 9], [5, 9]],
    ])],
    ["5", number([
        [[1, 1], [5, 1], [5, 9]],
    ])],
    ["6", number([
        [[1, 1], [5, 1], [5, 9]],
        [[1, 5], [3, 5]],
    ])],
    ["7", number([
        [[3, 1], [5, 1], [5, 9]],
        [[1, 1], [1, 9], [3, 9]],
    ])],
    ["8", number([
        [[1, 1], [1, 9], [3, 9]],
        [[5, 1], [5, 9]],
        [[3, 5], [5, 5]],
    ])],
    ["9", number([
        [[1, 1], [1, 9], [5, 9], [5, 1]],
    ])],

    ["!", new MartianGlyphShape(1, [
        [[1, 1], [1, 7]],
        [[1, 9]],
    ])],
    ["?", new MartianGlyphShape(5, [
        [[1, 1], [5, 1], [5, 4], [3, 6], [3, 7]],
        [[3, 9]],
    ])],
]);
