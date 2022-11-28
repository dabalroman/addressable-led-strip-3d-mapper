/* eslint-disable no-param-reassign */

import VFilter from './VFilter';
import VPixel from '../VPixel';

export default class HighPassFilter extends VFilter {
    cutoffValue: number;

    constructor (cutoffValue: number = 200) {
        super();

        this.cutoffValue = cutoffValue;
    }

    apply (pixel: VPixel): void {
        pixel.v = pixel.v >= this.cutoffValue ? pixel.v : 0;
    }
}
