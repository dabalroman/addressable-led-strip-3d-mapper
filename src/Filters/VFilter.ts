import VPixel from '../VPixel';

export default class VFilter {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    apply (pixel: VPixel): void {
        throw new Error('This is an abstract function!');
    }
}
