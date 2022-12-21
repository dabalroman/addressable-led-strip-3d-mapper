/* eslint-disable no-param-reassign */

import VPixel from '../VPixel';
import LineMatch from './LineMatch';
import Blob from './Blob';
import ImageWrapper from '../ImageWrapper';

export default class BlobFinder {
    lineMatches: LineMatch[] = [];
    blobs: Blob[] = [];

    resolutionDivider: number;

    constructor (resolutionDivider: number = 2) {
        this.resolutionDivider = resolutionDivider;
    }

    search (imageWrapper: ImageWrapper): Blob[] {
        this.blobs.length = 0;

        for (let y: number = 0; y < imageWrapper.raw.height; y += this.resolutionDivider) {
            this.lineMatches.length = 0;

            for (let x: number = 0; x < imageWrapper.raw.width; x += this.resolutionDivider) {
                const vPixel: VPixel = imageWrapper.getVPixel(x, y);

                if (vPixel.v === 0) {
                    continue;
                }

                const lineMatch: LineMatch | null = this.findLeftLineMatch(vPixel.x, vPixel.y);

                if (lineMatch !== null) {
                    lineMatch.xMax = vPixel.x;
                    lineMatch.xWeight += vPixel.x * (vPixel.v / 255);
                    continue;
                }

                this.lineMatches.push({
                    xMin: vPixel.x,
                    xMax: vPixel.x,
                    xWeight: vPixel.x * (vPixel.v / 255),
                    y: vPixel.y
                });
            }

            this.lineMatches.forEach((lineMatch: LineMatch) => {
                const foundBlobs: Blob[] = this.findUpperBlobs(lineMatch);

                if (foundBlobs.length === 0) {
                    const blob: Blob = Blob.fromLineMatch(lineMatch);
                    this.blobs.push(blob);

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

        return this.blobs.filter((blob: Blob) => blob.active && blob.getSize() >= 100);
    }

    findLeftLineMatch (x: number, y: number): LineMatch | null {
        return this.lineMatches.find(
            (lineMatch: LineMatch) => (
                lineMatch.y === y
                && lineMatch.xMax + this.resolutionDivider === x
            )
        ) ?? null;
    }

    findUpperBlobs (lineMatch: LineMatch): Blob[] {
        return this.blobs.filter(
            (blob: Blob) => (
                blob.active
                && lineMatch.y - this.resolutionDivider === blob.yMax
                && (
                    (blob.xMin > lineMatch.xMin && blob.xMin <= lineMatch.xMax && blob.xMax >= lineMatch.xMax)
                    || (blob.xMin <= lineMatch.xMin && blob.xMax >= lineMatch.xMax)
                    || (blob.xMin <= lineMatch.xMin && blob.xMax >= lineMatch.xMin && blob.xMax < lineMatch.xMax)
                    || (blob.xMin > lineMatch.xMin && blob.xMax < lineMatch.xMax)
                )
            )
        );
    }
}
