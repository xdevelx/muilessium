import * as Utils from '../utils';
import { Input } from './input';


export class InputRange extends Input {
    constructor(element, options) {
        super(element, options);

        Utils.console.log('creating mui-range (mui-input extended) for ' + element +
                        ' with options ' + JSON.stringify(options));
    }
}
