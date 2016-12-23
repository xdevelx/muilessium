import * as Utils from '../utils';
import { Component } from '../component';


export class Radio extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.info(`creating input for the ${element} with options ${JSON.stringify(options)}`);

        this.dom = Utils.extend(this.dom, {
            inputs: element.getElementsByTagName('input'),
            labels: element.getElementsByTagName('label'),
            inputLabel: element.parentNode.getElementsByClassName('mui-input-label')[0],
            icons: element.getElementsByClassName('icon')
        });

        this.state = Utils.extend(this.state, {
            checkedIndex: -1
        });

        Utils.aria.setRole(this.element, 'radiogroup');

        Utils.ifExists(this.dom.inputLabel, () => {
            Utils.aria.set(this.element, 'labelledby', Utils.aria.setId(this.dom.inputLabel));
            this.dom.inputLabel.setAttribute('for', Utils.aria.setId(this.element));
        });

        [].forEach.call(this.dom.inputs, (input, index) => {
            Utils.aria.set(input, 'hidden', true);
            input.setAttribute('type', 'radio');
            input.setAttribute('name', this.element.getAttribute('data-name'));

            if (input.checked) {
                this.state.checkedIndex = index;
            }
        });

        Utils.makeChildElementsClickable(this.element, this.dom.labels, (index) => {
            this.updateState(index);
        });

        [].forEach.call(this.dom.labels, (label, index) => {
            label.setAttribute('for', this.dom.inputs[index].getAttribute('id'));
            Utils.aria.setRole(label, 'radio');
        });

        this.updateState();

        this.state.initialized = true;
    }


    updateState(index) {
        if ((typeof index !== 'number') || (index < 0)) {
            return this;
        }

        this.dom.inputs[index].checked = true;

        if (this.state.checkedIndex >= 0) {
            Utils.aria.set(this.dom.labels[this.state.checkedIndex], 'checked', false);
        }

        Utils.aria.set(this.dom.labels[index], 'checked', true);

        this.state.checkedIndex = index;

        return this;
    }
}
