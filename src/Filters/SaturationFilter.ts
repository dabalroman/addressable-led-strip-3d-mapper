/* eslint-disable no-param-reassign */

import Filter from './Filter';
import Pixel from '../Pixel';

export default class SaturationFilter extends Filter {
    apply (pixel: Pixel): void {
        const value: number = (pixel.r + pixel.g + pixel.b) / 3;

        pixel.r = value;
        pixel.g = value;
        pixel.b = value;
    }
}
