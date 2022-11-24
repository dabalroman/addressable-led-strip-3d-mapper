/* eslint-disable no-param-reassign */

import Filter from './Filter';
import Pixel from '../Pixel';

export default class HighPassFilter extends Filter {
    cutoffValue: number;

    constructor (cutoffValue: number = 200) {
        super();

        this.cutoffValue = cutoffValue;
    }

    apply (pixel: Pixel): void {
        const value: number = (pixel.r + pixel.g + pixel.b) / 3;

        if (value <= this.cutoffValue) {
            pixel.r = 0;
            pixel.g = 0;
            pixel.b = 0;
        }
    }
}
