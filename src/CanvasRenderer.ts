import p5 from 'p5';
import { Ref } from 'react';

export default abstract class CanvasRenderer {
    p: p5;
    input: {} = {};

    protected constructor (p: p5) {
        this.p = p;

        this.p.draw = this.draw.bind(this);
        this.p.setup = this.setup.bind(this);
    }

    static create<T> (htmlRef: Ref<HTMLDivElement> | any, ...args: any): T {
        let renderer: CanvasRenderer | any;

        // eslint-disable-next-line new-cap,no-new
        new p5((p: p5) => {
            // @ts-ignore
            renderer = new this(p, ...args);
        }, htmlRef.current);

        return renderer;
    }

    teardown (): void {
        this.p.remove();
    }

    setup (): void {
        this.p.disableFriendlyErrors = true;
        this.p.ellipseMode(this.p.CENTER);
        this.p.createCanvas(1280, 720, this.p.P2D);
        this.p.noStroke();
    }

    resize (width: number, height: number): void {
        if (width === 0 || height === 0) {
            return;
        }

        this.p.resizeCanvas(width, height);
    }

    abstract draw (): void;

    updateInput (newInput: object) {
        this.input = { ...this.input, ...newInput };
    }
}
