import p5 from 'p5';
import CanvasRenderer from './CanvasRenderer';
import ImageWrapper from './ImageWrapper';
import Pixel from './Pixel';
import HighPassFilter from './Filters/HighPassFilter';

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

        for (let pixel: Pixel | null = this.image.nextPixel(); pixel !== null; pixel = this.image.nextPixel()) {
            this.highPassFilter.apply(pixel);
            this.image.commitPixel(pixel);
        }

        this.image.commit();

        this.p.image(this.image.raw, 0, 0, 1280, 720);
    }
}
