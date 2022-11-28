/* eslint-disable no-param-reassign */

import VPixel from '../VPixel';
import LineMatch from './LineMatch';
import Blob from './Blob';

export default class BlobFinder {
    lineMatches: LineMatch[] = [];
    blobs: Blob[] = [];

    work (canvas: VPixel[][]): Blob[] {
        for (let y: number = 0; y < canvas.length; y++) {
            this.lineMatches = [];

            for (let x: number = 0; x < canvas[0].length; x++) {
                if (canvas[y][x].v === 0) {
                    continue;
                }

                const lineMatch: LineMatch | null = this.findLeftLineMatch(x, y);

                if (lineMatch !== null) {
                    lineMatch.xMax++;
                    lineMatch.xWeight += lineMatch.xMax;
                    continue;
                }

                this.lineMatches.push({
                    xMin: x,
                    xMax: x,
                    xWeight: x,
                    y
                });
            }

            this.lineMatches.forEach((lineMatch: LineMatch) => {
                const foundBlobs: Blob[] = this.findUpperBlobs(lineMatch);

                if (foundBlobs.length === 0) {
                    const blob: Blob = Blob.fromLineMatch(lineMatch);
                    this.blobs[blob.id] = blob;
                    return;
                }

                // @ts-ignore
                const masterBlob: Blob = foundBlobs.shift();
                masterBlob.addLineMatch(lineMatch);

                if (foundBlobs.length === 0) {
                    return;
                }

                foundBlobs.forEach((otherBlob: Blob) => {
                    masterBlob.merge(otherBlob);
                    otherBlob.active = false;
                });
            });
        }

        return this.blobs.filter((blob: Blob) => blob.active);
    }

    findLeftLineMatch (x: number, y: number): LineMatch | null {
        return this.lineMatches.find(
            (lineMatch: LineMatch) => (
                lineMatch.y === y
                && lineMatch.xMax === x
            )
        ) ?? null;
    }

    findUpperBlobs (lineMatch: LineMatch): Blob[] {
        return this.blobs.filter(
            (blob: Blob) => (
                blob.active
                && lineMatch.y - 1 >= blob.yMax
                && (
                    (lineMatch.xMin >= blob.xMin && lineMatch.xMin <= blob.xMax)
                    || (lineMatch.xMax >= blob.xMin && lineMatch.xMin <= blob.xMax)
                    || (lineMatch.xMin <= blob.xMin && lineMatch.xMax >= blob.yMax)
                )
            )
        );
    }
}
