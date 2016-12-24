import * as Utils from '../utils';
import { Input } from './input';


export class InputRange extends Input {
    constructor(element, options) {
        super(element, options);

        Utils.console.info(`creating input-range for the ${element} with options ${JSON.stringify(options)}`);

        this.initAria();
        this.initControls();
    }
}
