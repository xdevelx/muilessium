// -----------------------------------------------------------------------------
// UTILITIES INDEX
// -----------------------------------------------------------------------------
//
// This is the index file for utilities from /src/js/utils/
//
// -----------------------------------------------------------------------------


import * as ajax          from './utils/ajax';
import * as animations    from './utils/animations.js';
import * as aria          from './utils/aria';
import * as attributes    from './utils/attributes';
import * as checks        from './utils/checks';
import * as classes       from './utils/classes';
import * as console       from './utils/console';
import * as focusAndClick from './utils/focus-and-click';
import * as scroll        from './utils/scroll';
import * as uncategorized from './utils/uncategorized';
import * as viewport      from './utils/viewport';


// -----------------------------------------------------------------------------

export let UTILS = uncategorized.extend(
    {},
    ajax,
    animations,
    aria,
    attributes,
    checks,
    classes,
    console,
    focusAndClick,
    scroll,
    uncategorized,
    viewport
);

