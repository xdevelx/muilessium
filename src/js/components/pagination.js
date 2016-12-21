import * as Utils from '../utils';
import { Component } from '../component';


export class Pagination extends Component {
    constructor(element, options) {
        super(element, options);
 
        Utils.console.info(`creating button for the ${element} with options ${JSON.stringify(options)}`);

        this.dom = Utils.extend(this.dom, {
            icons: element.getElementsByClassName('fa')
        });

        Utils.aria.setRole(this.element, 'navigation');

        Utils.ifNodeList(this.dom.icons, () => {
            [].forEach.call(this.dom.icons, (icon) => {
                Utils.aria.set(icon, 'hidden', true);
            });
        }, false);
    }
}
