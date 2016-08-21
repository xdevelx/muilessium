import * as Utils from "../utils";

export class like {
    constructor(element, options) {
        Utils.console.log('creating mui-like for ' + element +
                          ' with options ' + JSON.stringify(options));

        element.addEventListener('click', function() {
            Utils.console.log('like button clicked');
            Utils.toggleClass(element, '-liked');
        });
    }
}