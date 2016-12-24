import * as Utils from '../utils';
import { Component } from '../component';


export class Radio extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.log(`creating radio for the <${element.nodeName}> with options ${JSON.stringify(options)}`);

        this.dom = Utils.extend(this.dom, {
            inputs: element.getElementsByTagName('input'),
            labels: element.getElementsByTagName('label'),
            inputLabel: element.parentNode.getElementsByClassName('mui-input-label')[0],
            icons: element.getElementsByClassName('icon')
        });

        this.state = Utils.extend(this.state, {
            checkedIndex: -1
        });

        this.initAria();
        this.initControls();
        this.updateState();

        Utils.console.ok('radio has been created');
    }


    initAria() {
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

        [].forEach.call(this.dom.labels, (label, index) => {
            label.setAttribute('for', this.dom.inputs[index].getAttribute('id'));
            Utils.aria.setRole(label, 'radio');
        });

        return this;
    }


    initControls() {
        Utils.makeChildElementsClickable(this.element, this.dom.labels, (index) => {
            this.updateState(index);
        });

        return this;
    }


    updateState(index) {
        Utils.console.log(`updating radio state to the #${index} item selected`);

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
