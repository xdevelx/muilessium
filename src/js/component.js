import * as Utils from './utils';


export class Component {
    constructor(element, options) {
        Utils.console.info('creating component');
        
        this.element = element;

        this.dom   = {};
        this.state = {};
    }
}
