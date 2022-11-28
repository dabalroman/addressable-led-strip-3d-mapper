import LineMatch from './LineMatch';
import gUniqueIdGenerator from '../UniqueIdGenerator';

export default class Blob {
    id: number = 0;
    xMin: number = 10000;
    yMin: number = 10000;
    xMax: number = 0;
    yMax: number = 0;
    xWeight: number = 0;
    yWeight: number = 0;
    amountOfPixels: number = 0;
    active: boolean = true;

    constructor () {
        this.id = gUniqueIdGenerator.getId();
    }

    addPixel (x: number, y: number) {
        if (this.xMin > x) {
            this.xMin = x;
        }

        if (this.xMax < x) {
            this.xMax = x;
        }

        if (this.yMin > y) {
            this.yMin = y;
        }

        if (this.yMax < y) {
            this.yMax = y;
        }

        this.xWeight += x;
        this.yWeight += y;
        this.amountOfPixels++;
    }

    addLineMatch (lineMatch: LineMatch) {
        for (let x: number = lineMatch.xMin; x < lineMatch.xMax; x++) {
            this.addPixel(x, lineMatch.y);
        }
    }

    merge (blob: Blob) {
        this.xMin = this.xMin < blob.xMin ? this.xMin : blob.xMin;
        this.yMin = this.yMin < blob.yMin ? this.yMin : blob.yMin;
        this.xMax = this.xMax > blob.xMax ? this.xMax : blob.xMax;
        this.yMax = this.yMax > blob.yMax ? this.yMax : blob.yMax;
        this.xWeight += blob.xWeight;
        this.yWeight += blob.yWeight;
        this.amountOfPixels += blob.amountOfPixels;
    }

    static fromLineMatch (lineMatch: LineMatch) {
        const blob: Blob = new Blob();
        blob.addLineMatch(lineMatch);

        return blob;
    }
}
