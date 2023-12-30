import {martianP} from "$lib/Parser";
import {MartianShapes, placeholder, rotate, rotationFromTone} from "$lib/MartianShapes";
import {type Martian, Space} from "$lib/Martian";

const SENTENCE_ROW_NUMBER = 9;
const LETTER_ROW_NUMBER = 5;
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

    /*
         1  3  5  7  9
         |  |  |  |  |
    1 -  @  @  @  @  @
    3 -  @  *  *  *  @
    5 -  @  *  *  *  @
    7 -  @  *  *  *  @
    9 -  @  @  @  @  @
    */
    async drawLetter(letter: string, rotation = 0)
    {
        if (letter.length !== 1) {
            throw new Error("Letter must be a single character.");
        }

        this.canvas.width = this.resolution;

        if (this.background != null) {
            this.ctx.fillStyle = this.background;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        const shape = MartianShapes.get(letter.toUpperCase());
        if (shape == undefined) {
            throw new Error(`Shape of "${letter}" not found.`);
        }

        for (const lines of rotate(shape, rotation)) {
            this.drawLines(lines, letterCoordsToCanvas);
        }
    }

    async drawSentence(sentence: string | Martian)
    {
        if (typeof sentence == "string") {
            const [martian,] = await martianP(sentence);
            await this.drawSentenceFromMartian(martian);
        } else {
            await this.drawSentenceFromMartian(sentence);
        }
    }

    /*
         0  1  2  3  4  5  6  7  8  9  10 11 12
         |  |  |  |  |  |  |  |  |  |  |  |  |
     0 - @  @  @  @  @  @  @  @  @  _  _  _  @
     1 - @  *  *  *  @  *  *  *  @  _  _  _  @
     2 - @  *  *  *  @  *  *  *  @  _  _  _  @
     3 - @  *  *  *  @  *  *  *  @  _  _  _  @
     4 - @  @  @  @  @  @  @  @  @  _  _  _  @
     5 - @  *  *  *  @  *  *  *  @  _  _  _  @
     6 - @  *  *  *  @  *  *  *  @  _  _  _  @
     7 - @  *  *  *  @  *  *  *  @  _  _  _  @
     8 - @  @  @  @  @  @  @  @  @  _  _  _  @
    */
    async drawSentenceFromMartian(martian: Martian)
    {
        let columnNumber = 0;
        for (const syllable of martian) {
            if (syllable instanceof Space) {
                columnNumber += 3;
            } else {
                columnNumber += 1 + 4 * Math.ceil(syllable.syllable.length / 2);
            }
        }

        this.canvas.width = this.resolution * columnNumber / 9;

        if (this.background != null) {
            this.ctx.fillStyle = this.background;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        let cursor = 0;
        let top = true;
        for (const syllable of martian) {
            if (syllable instanceof Space) {
                cursor += 4;
                top = true;
                continue;
            }
            for (const letter of syllable.syllable) {
                const shape = MartianShapes.get(letter.toUpperCase());
                if (shape == undefined) {
                    throw new Error(`Shape of "${letter}" not found.`);
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
                    cursor += 4;
                }
                top = !top;
            }

            if (!top) {
                for (const lines of placeholder) {
                    this.drawLines(lines, sentenceCoordsToCanvas, cursor, 4);
                }
                top = true;
                cursor += 4;
            }
        }
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
        points: Array<[number, number]>,
        coordsMap: (x: number) => number,
        dx = 0,
        dy = 0)
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