import Pixel from '../Pixel';

export default class Filter {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    apply (pixel: Pixel): void {
        throw new Error('This is an abstract function!');
    }
}
