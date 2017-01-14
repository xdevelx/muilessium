import * as Utils from '../utils';
import { Input } from './input';


export class InputRange extends Input {
    constructor(element, options) {
        super(element, options);

        this.initAria();
        this.initControls();
    }

    changeValueHandler() {
        return this;
    }
}
