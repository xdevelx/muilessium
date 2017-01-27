export function onSwipeLeft(element, callback) {
    let hammertime = new Hammer(element);

    hammertime.on('swipeleft', callback);
};


export function onSwipeRight(element, callback) {
    let hammertime = new Hammer(element);

    hammertime.on('swiperight', callback);
};


export function onPinchOut(element, callback) {
    let hammertime = new Hammer(element);

    hammertime.get('pinch').set({ enable: true });
    hammertime.on('pinchout', callback);
};

