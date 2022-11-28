import p5 from 'p5';
import CanvasRenderer from './CanvasRenderer';
import ImageWrapper from './ImageWrapper';
import HighPassFilter from './Filters/HighPassFilter';
import VPixel from './VPixel';

export default class WebcamView extends CanvasRenderer {
    capture: p5.Element | null = null;
    image!: ImageWrapper;

    highPassFilter: HighPassFilter = new HighPassFilter(200);

    setup () {
        super.setup();

        this.capture = this.p.createCapture(this.p.VIDEO);
        this.capture.size(this.p.width, this.p.height);
        this.capture.hide();

        this.image = new ImageWrapper(this.capture);
    }

    draw () {
        if (this.capture === null || !this.image.update()) {
            return;
        }

        this.image.resetPosition();

        for (let vPixel: VPixel | null = this.image.nextVPixel(); vPixel !== null; vPixel = this.image.nextVPixel()) {
            this.highPassFilter.apply(vPixel);
            this.image.commitVPixel(vPixel);
        }

        this.image.commit();

        this.p.image(this.image.raw, 0, 0, 1280, 720);
    }
}
