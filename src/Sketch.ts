import CanvasRenderer from './CanvasRenderer';

export default class Sketch extends CanvasRenderer {
    input: { text: string, color: string } = {
        text: '',
        color: '#000000'
    };

    textSize: number = 40;

    x: number = 0;
    y: number = 0;
    deltaX: number = 3;
    deltaY: number = 5;

    setup () {
        super.setup();
        this.p.textSize(this.textSize);

        this.x = this.p.width / 2;
        this.y = this.p.height / 2;
    }

    draw () {
        if (this.x <= 0 || this.x >= this.p.width - this.p.textWidth(this.input.text)) {
            this.deltaX *= -1;
        }

        if (this.y <= this.textSize || this.y >= this.p.height) {
            this.deltaY *= -1;
        }

        this.x += this.deltaX;
        this.y += this.deltaY;

        this.p.background(this.input.color);
        this.p.fill(255);
        this.p.text(this.input.text, this.x, this.y);
    }
}
