import p5 from 'p5';
import CanvasRenderer from './CanvasRenderer';

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

        const image: p5.Image = this.getFrameFromCapture();

        if (image.width <= 0) {
            return;
        }

        image.loadPixels();

        for (let i: number = 0; i < image.pixels.length; i += 4) {
            const r: number = image.pixels[i];
            const g: number = image.pixels[i + 1];
            const b: number = image.pixels[i + 2];

            image.pixels[i] = r;
            image.pixels[i + 1] = g;
            image.pixels[i + 2] = b;
        }

        image.updatePixels();

        this.p.image(image, 0, 0, 1280, 720);
    }

    getFrameFromCapture (): p5.Image {
        // @ts-ignore
        return this.capture.get();
    }
}
