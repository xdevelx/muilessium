export function onClick(element, callback) {
    element.addEventListener('click', (e) => {
        e.preventDefault();
        callback(e);
    });
};


export function onMouseOver(element, callback) {
    element.addEventListener('mouseover', (e) => {
        e.preventDefault();
        callback(e);
    });
};


export function onMouseOut(element, callback) {
    element.addEventListener('mouseout', (e) => {
        e.preventDefault();
        callback(e);
    });
};

