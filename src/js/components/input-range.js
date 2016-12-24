import * as Utils from '../utils';
import { Input } from './input';


export class InputRange extends Input {
    constructor(element, options) {
        super(element, options);

        Utils.console.log(`creating input-range for the <${element.nodeName}> with options ${JSON.stringify(options)}`);

        this.initAria();
        this.initControls();

        Utils.console.log('input-range has been created');
    }
}
