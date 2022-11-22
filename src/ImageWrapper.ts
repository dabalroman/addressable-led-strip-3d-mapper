import p5 from 'p5';
import Pixel from './Pixel';

export default class ImageWrapper {
    raw: p5.Image;

    currentPosition: { x: number, y: number } = {
        x: 0,
        y: 0
    };

    constructor (capture: p5.Element) {
        // @ts-ignore
        this.raw = capture.get();
        this.resetPosition();
    }

    getPixel (x: number, y: number): Pixel {
        const address: number = this.getAddress(x, y, this.raw.width);

        return {
            x,
            y,
            address,
            r: this.raw.pixels[address],
            g: this.raw.pixels[address + 1],
            b: this.raw.pixels[address + 2]
        };
    }

    commitPixel (pixel: Pixel) {
        this.raw.pixels[pixel.address] = pixel.r;
        this.raw.pixels[pixel.address + 1] = pixel.g;
        this.raw.pixels[pixel.address + 2] = pixel.b;
    }

    getAddress (x: number, y: number, width: number): number {
        return (x + y * width) * 4;
    }

    resetPosition () {
        this.currentPosition.x = -1;
        this.currentPosition.y = 0;
    }

    nextPixel (): Pixel | null {
        this.currentPosition.x++;

        if (this.currentPosition.x >= this.raw.width) {
            this.currentPosition.x = 0;
            this.currentPosition.y++;
        }

        if (this.currentPosition.y >= this.raw.height) {
            return null;
        }

        return this.getPixel(this.currentPosition.x, this.currentPosition.y);
    }
}
