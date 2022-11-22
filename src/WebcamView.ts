import p5 from 'p5';
import CanvasRenderer from './CanvasRenderer';
import ImageWrapper from './ImageWrapper';
import Pixel from './Pixel';

export default class WebcamView extends CanvasRenderer {
    capture: p5.Element | null = null;

    setup () {
        super.setup();

        this.capture = this.p.createCapture(this.p.VIDEO);
        this.capture.size(this.p.width, this.p.height);
        this.capture.hide();
    }

    draw () {
        if (this.capture === null) {
            return;
        }

        const image: ImageWrapper = new ImageWrapper(this.capture);

        if (image.raw.width <= 0) {
            return;
        }

        image.raw.loadPixels();

        for (let pixel: Pixel | null = image.nextPixel(); pixel !== null; pixel = image.nextPixel()) {
            pixel.r *= 2;
            image.commitPixel(pixel);
        }

        image.raw.updatePixels();

        this.p.image(image.raw, 0, 0, 1280, 720);
    }
}
