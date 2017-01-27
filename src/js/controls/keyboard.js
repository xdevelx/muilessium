export function onEnterPressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
            callback(e);
        }
    });
};


export function onTabPressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode == 9) {
            e.preventDefault();
            callback(e);
        }
    });
};


export function onArrowLeftPressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode == 37) {
            e.preventDefault();
            callback(e);
        }
    });
};


export function onArrowUpPressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode == 38) {
            e.preventDefault();
            callback(e);
        }
    });
};


export function onArrowRightPressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode == 39) {
            e.preventDefault();
            callback(e);
        }
    });
};


export function onArrowDownPressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode == 40) {
            e.preventDefault();
            callback(e);
        }
    });
};

