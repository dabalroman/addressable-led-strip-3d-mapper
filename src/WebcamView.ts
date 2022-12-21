import p5 from 'p5';
import CanvasRenderer from './CanvasRenderer';
import ImageWrapper from './ImageWrapper';
import HighPassFilter from './Filters/HighPassFilter';
import VPixel from './VPixel';
import BlobFinder from './BlobFinder/BlobFinder';
import Blob from './BlobFinder/Blob';
import BlobTracer from './BlobTracer';
import Position2D from './Position2D';

export default class WebcamView extends CanvasRenderer {
    capture: p5.Element | null = null;
    image!: ImageWrapper;

    highPassFilter: HighPassFilter = new HighPassFilter(230);
    blobFinder: BlobFinder = new BlobFinder();
    ledMapper: BlobTracer = new BlobTracer();

    constructor (p: p5) {
        super(p);

        this.p.mouseClicked = this.mouseClicked.bind(this);
    }

    setup () {
        super.setup();

        this.p.frameRate(5);
        this.p.ellipseMode(this.p.CENTER);
        this.p.strokeWeight(2);

        this.capture = this.p.createCapture(this.p.VIDEO);
        this.capture.size(this.p.width, this.p.height);
        this.capture.hide();

        this.image = new ImageWrapper(this.capture);
    }

    draw () {
        this.p.background(0);

        if (this.capture === null || !this.image.update()) {
            return;
        }

        this.image.resetPosition();

        for (let vPixel: VPixel | null = this.image.nextVPixel(); vPixel !== null; vPixel = this.image.nextVPixel()) {
            this.highPassFilter.apply(vPixel);
            this.image.commitVPixel(vPixel);
        }

        this.p.image(this.image.raw, 0, 0, 1280, 720);

        if (this.p.frameCount < 2) {
            return;
        }

        this.p.noFill();

        const blobs: Blob[] = this.blobFinder.search(this.image);
        this.ledMapper.processBlobsFromFrame(blobs);

        this.p.push();
        blobs.forEach((blob: Blob) => {
            this.p.stroke(200, 0, 0);
            this.p.rect(blob.xMin, blob.yMin, blob.xMax - blob.xMin + 1, blob.yMax - blob.yMin + 1);

            this.p.stroke(0, 100, 100);
            const {
                x,
                y
            } = blob.getCenter();
            this.p.line(x, blob.yMin, x, blob.yMax + 1);
            this.p.line(blob.xMin, y, blob.xMax + 1, y);

            this.p.noStroke();
            this.p.fill(255);
            this.p.text(`X${x} Y${y}`, blob.xMax + 10, blob.yMax + 10);
            this.p.noFill();
        });
        this.p.pop();

        this.p.push();
        let prevPositionHelper: Position2D | null = null;
        this.ledMapper.ledPositions.forEach((position: Position2D) => {
            this.displayLed(position);

            if (prevPositionHelper) {
                this.p.stroke(255, 0, 255);
                this.p.line(prevPositionHelper.x, prevPositionHelper.y, position.x, position.y);
                this.p.noStroke();
            }

            prevPositionHelper = position;
        });
        this.p.pop();
    }

    displayLed (position: Position2D) {
        this.p.push();
        this.p.fill(255, 100, 100);
        this.p.circle(position.x, position.y, 10);
        this.p.pop();
    }

    resetAction () {
        this.ledMapper.reset();
    }

    grabDataAction (): string {
        return this.ledMapper.ledPositions.reduce(
            (carry: string, position: Position2D) => `${carry}[${position.x}, ${position.y}],\n`,
            ''
        ) as string;
    }

    setFilterThresholdAction (value: number) {
        this.highPassFilter.cutoffValue = value;
    }

    mouseClicked () {
        this.p.loop();
    }
}
