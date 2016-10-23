import * as Utils from './utils';

export class Component {
    constructor(element, options) {
        Utils.console.log('creating component');
        
        this.element = element;
    }
}
