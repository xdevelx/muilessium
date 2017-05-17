// -----------------------------------------------------------------------------
// ANIMATIONS
// -----------------------------------------------------------------------------
// Here is the full list of animations:
//  - typeText(element, text, delay = 120, cycle = false, times = -1, callback = null)
//  - typeTexts(element, textsList)


import { ifExists } from '../utils/checks';


// Type text
// ---------
// "Typing" effect for text in the element

export function typeText(element, text, delay = 120, cycle = false, times = -1, callback = null) {
    ifExists(element, () => {
        let lettersCounter = 0,
            pauseCounter   = 0,
            timesCounter   = 0,
            direction = 'right';
            
        let interval = setInterval(() => {
            element.innerHTML = text.substring(0, lettersCounter) || ' ';

            if (direction === 'right') {
                lettersCounter++;

                if (lettersCounter > text.length) {
                    if (cycle) {
                        pauseCounter++;

                        if (pauseCounter > 5) {
                            pauseCounter = 0;
                            lettersCounter--;
                            direction = 'left';
                        }
                    } else {
                        clearInterval(interval);

                        if (typeof callback == 'function') {
                            callback();
                        }
                    }
                }
            } else {
                lettersCounter--;
            
                if (lettersCounter < 0) {
                    if ((times < 0) || (timesCounter < times - 1)) {
                        pauseCounter++;

                        if (pauseCounter > 5) {
                            pauseCounter = 0;
                            direction = 'right';
                            timesCounter++;
                        }

                        lettersCounter = 0;
                    } else {
                        clearInterval(interval);

                        if (typeof callback == 'function') {
                            callback();
                        }
                    }
                }
            }
        }, delay);
    });    
};


// Type multiple texts
// -------------------
// "Typing" effect for texts in the element

export function typeTexts(element, texts) {
    ifExists(element, () => {
        let textIndex = 0,
            next = () => {
                typeText(element,
                        texts[(textIndex++)%texts.length],
                        120,   // delay
                        true,  // cycle
                        1,     // times
                        next); // callback
            };

        next();
    });
};

