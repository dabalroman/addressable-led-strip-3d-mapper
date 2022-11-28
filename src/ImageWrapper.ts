import p5 from 'p5';
import Pixel from './Pixel';
import VPixel from './VPixel';

export default class ImageWrapper {
    raw!: p5.Image;
    capture: p5.Element;
    addressLookup: number[][] = [];

    currentPosition: { x: number, y: number } = {
        x: 0,
        y: 0
    };

    constructor (capture: p5.Element) {
        this.capture = capture;
        this.update();
        this.generateAddressLookupTable();
    }

    update (): boolean {
        // @ts-ignore
        this.raw = this.capture.get();
        this.resetPosition();

        if (this.raw.width <= 0) {
            return false;
        }

        this.raw.loadPixels();

        return true;
    }

    getPixel (x: number, y: number): Pixel {
        const address: number = this.addressLookup[x][y];

        return {
            x,
            y,
            address,
            r: this.raw.pixels[address],
            g: this.raw.pixels[address + 1],
            b: this.raw.pixels[address + 2]
        };
    }

    getVPixel (x: number, y: number): VPixel {
        const address: number = this.addressLookup[x][y];

        return {
            x,
            y,
            address,
            v: this.raw.pixels[address]
        };
    }

    commitPixel (pixel: Pixel): void {
        this.raw.pixels[pixel.address] = pixel.r;
        this.raw.pixels[pixel.address + 1] = pixel.g;
        this.raw.pixels[pixel.address + 2] = pixel.b;
    }

    commitVPixel (pixel: VPixel): void {
        this.raw.pixels[pixel.address] = pixel.v;
        this.raw.pixels[pixel.address + 1] = pixel.v;
        this.raw.pixels[pixel.address + 2] = pixel.v;
    }

    commit (): void {
        this.raw.updatePixels();
    }

    getAddress (x: number, y: number, width: number): number {
        return (x + y * width) * 4;
    }

    resetPosition (): void {
        this.currentPosition.x = -1;
        this.currentPosition.y = 0;
    }

    nextPosition (): boolean {
        this.currentPosition.x++;

        if (this.currentPosition.x >= this.raw.width) {
            this.currentPosition.x = 0;
            this.currentPosition.y++;
        }

        return this.currentPosition.y < this.raw.height;
    }

    nextPixel (): Pixel | null {
        return this.nextPosition() ? this.getPixel(this.currentPosition.x, this.currentPosition.y) : null;
    }

    nextVPixel (): VPixel | null {
        return this.nextPosition() ? this.getVPixel(this.currentPosition.x, this.currentPosition.y) : null;
    }

    generateAddressLookupTable (): void {
        for (let y: number = 0; y < this.raw.height; y++) {
            for (let x: number = 0; x < this.raw.width; x++) {
                if (this.addressLookup[x] === undefined) {
                    this.addressLookup[x] = [];
                }

                this.addressLookup[x][y] = this.getAddress(x, y, this.raw.width);
            }
        }
    }
}
