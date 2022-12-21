import Blob from './BlobFinder/Blob';
import Position2D from './Position2D';

export default class BlobTracer {
    ledPositions: Position2D[] = [];
    currentBlobPositionHistory: Position2D[] = [];

    constructor () {
        this.reset();
    }

    reset () {
        this.ledPositions.length = 0;
    }

    processBlobsFromFrame (blobs: Blob[]) {
        if (blobs.length === 0) {
            if (this.currentBlobPositionHistory.length === 0) {
                return;
            }

            this.ledPositions.push(this.reduceBlobPositionHistoryToAveragePosition(this.currentBlobPositionHistory));
            this.currentBlobPositionHistory.length = 0;

            return;
        }

        const blob: Blob = blobs.sort((a: Blob, b: Blob) => (a.getSize() > b.getSize() ? -1 : 0))[0];
        this.currentBlobPositionHistory.push(blob.getCenter());
    }

    reduceBlobPositionHistoryToAveragePosition (blobPositionHistory: Position2D[]) {
        const amountOfRecords: number = blobPositionHistory.length;
        const summaryPosition: Position2D = blobPositionHistory.reduce(
            (carry: Position2D, position: Position2D) => ({
                x: carry.x + position.x,
                y: carry.y + position.y
            }),
            ({
                x: 0,
                y: 0
            })
        );

        return {
            x: Math.floor(summaryPosition.x / amountOfRecords),
            y: Math.floor(summaryPosition.y / amountOfRecords)
        };
    }
}
