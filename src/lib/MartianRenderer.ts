import {martianP} from "$lib/Parser";
import {MartianGlyphShapes, MartianLetterShapes, placeholder, rotate, type Rotation, rotationFromTone}
    from "$lib/MartianShapes";
import {type Martian, MartianGlyph, MartianSpace, MartianSyllable} from "$lib/Martian";
import {Parser} from "crazy-parser";

const SENTENCE_ROW_NUMBER = 9;
const LETTER_ROW_NUMBER = 5;
// One row of two letters overlaps, so minus 1.
const LETTER_MOVE_ROW_NUMBER = LETTER_ROW_NUMBER - 1;
const SPACE_ROW_NUMBER = 3;
const BOTTOM_LETTER_COORDS_Y_IN_SENTENCE = 4;

const letterCoordsToCanvas = (x: number) => (-0.5 + x) / LETTER_ROW_NUMBER;
const sentenceCoordsToCanvas = (x: number) => (-0.5 + x) / SENTENCE_ROW_NUMBER;

export default class MartianRenderer
{
    ctx: CanvasRenderingContext2D;
    strokeWidth: number;

    constructor(
        public canvas: HTMLCanvasElement,
        public foreground = "black",
        public weight = 0.1,
        public resolution = 500,
        public background: string | null = null)
    {
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not supported");
        this.ctx = ctx;

        this.canvas.height = this.resolution;
        this.canvas.width = this.resolution;
        this.strokeWidth = this.resolution * this.weight;
    }

    async drawSentenceFromMartian(martian: Martian)
    {
        let columnNumber = this.countColumnNumber(martian);

        this.canvas.width = this.resolution * columnNumber / 9;

        if (this.background != null) {
            this.ctx.fillStyle = this.background;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        let cursor = 0;
        for (const component of martian) {
            if (component instanceof MartianSpace) {
                cursor += SPACE_ROW_NUMBER;
                continue;
            }

            if (component instanceof MartianSyllable) {
                cursor = this.drawMartianSyllable(component, cursor);
                continue;
            }

            /* (component instanceof MartianGlyph) */ {
                cursor = this.drawMartianGlyph(component, cursor);
                continue;
            }
        }
    }

    async drawLetter(letter: string, rotation: Rotation = 0)
    {
        if (letter.length !== 1) {
            throw new Error("Letter must be a single character.");
        }

        this.canvas.width = this.resolution;

        if (this.background != null) {
            this.ctx.fillStyle = this.background;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        const shape = MartianLetterShapes.get(letter.toUpperCase());
        if (shape == undefined) {
            throw new Error(`Shape of letter "${letter}" not found.`);
        }

        for (const lines of rotate(shape, rotation)) {
            this.drawLines(lines, letterCoordsToCanvas);
        }
    }

    async drawSentence(sentence: string | Martian)
    {
        if (typeof sentence == "string") {
            const martian = await Parser.strict(martianP)(sentence);
            await this.drawSentenceFromMartian(martian);
        } else {
            await this.drawSentenceFromMartian(sentence);
        }
    }

    private countColumnNumber(martian: Martian): number
    {
        let width = 0;

        for (const syllable of martian) {
            if (syllable instanceof MartianSpace) {
                width += SPACE_ROW_NUMBER;
                continue;
            }

            if (syllable instanceof MartianSyllable) {
                width += 1 + LETTER_MOVE_ROW_NUMBER * Math.ceil(syllable.syllable.length / 2);
                continue;
            }

            /* (syllable instanceof MartianGlyph) */ {
                const shape = MartianGlyphShapes.get(syllable.glyph);
                if (shape == undefined) {
                    throw new Error(`Shape of glyph "${syllable.glyph}" not found.`);
                }
                width += shape.width;
                continue;
            }
        }

        return width;
    }

    private drawMartianSyllable(syllable: MartianSyllable, cursor: number): number
    {
        let top = true;

        for (const letter of syllable.syllable) {
            const shape = MartianLetterShapes.get(letter.toUpperCase());
            if (shape == undefined) {
                throw new Error(`Shape of letter "${letter}" not found.`);
            }

            const rotation = rotationFromTone(syllable.tone)
            const rotatedShape = rotate(shape, rotation);

            if (top) {
                for (const lines of rotatedShape) {
                    this.drawLines(lines, sentenceCoordsToCanvas, cursor);
                }
            } else {
                for (const lines of rotatedShape) {
                    this.drawLines(lines, sentenceCoordsToCanvas, cursor,
                        BOTTOM_LETTER_COORDS_Y_IN_SENTENCE);
                }
                cursor += LETTER_MOVE_ROW_NUMBER;
            }
            top = !top;
        }

        if (!top) {
            for (const lines of placeholder) {
                this.drawLines(lines, sentenceCoordsToCanvas, cursor, 4);
            }
            cursor += LETTER_MOVE_ROW_NUMBER;
        }

        return cursor + 1;
    }

    private drawMartianGlyph(glyph: MartianGlyph, cursor: number): number
    {
        const shape = MartianGlyphShapes.get(glyph.glyph);
        if (shape == undefined) {
            throw new Error(`Shape of glyph "${glyph.glyph}" not found.`);
        }

        for (const lines of shape.strokes) {
            this.drawLines(lines, sentenceCoordsToCanvas, cursor);
        }

        return cursor + shape.width;
    }

    private drawDot(x: number, y: number)
    {
        this.ctx.beginPath();
        {
            this.ctx.arc(this.resolution * (x), this.resolution * (y),
                this.strokeWidth / 2, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    private drawLine(x1: number, y1: number, x2: number, y2: number)
    {
        this.ctx.beginPath();
        {
            this.ctx.moveTo(this.resolution * (x1), this.resolution * (y1));
            this.ctx.lineTo(this.resolution * (x2), this.resolution * (y2));
            this.ctx.lineWidth = this.strokeWidth;
            this.ctx.stroke();
        }
    }

    private drawLines(
        points: Array<[number, number]>, coordsMap: (x: number) => number,
        dx: number = 0, dy: number = 0)
    {
        this.ctx.fillStyle = this.foreground;
        this.ctx.strokeStyle = this.foreground;

        const [nx, ny] = points[0];
        const x = coordsMap(nx + dx);
        const y = coordsMap(ny + dy);

        this.drawDot(x, y);

        for (let i = 1; i < points.length; i++) {
            const [nx1, ny1] = points[i - 1];
            const [nx2, ny2] = points[i];

            const x1 = coordsMap(nx1 + dx);
            const y1 = coordsMap(ny1 + dy);
            const x2 = coordsMap(nx2 + dx);
            const y2 = coordsMap(ny2 + dy);

            this.drawLine(x1, y1, x2, y2);
            this.drawDot(x2, y2);
        }
    }
}