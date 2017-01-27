// -----------------------------------------------------------------------------
// Custom console
// -----------------------------------------------------------------------------

export const console = {

    // Log
    // ---
    // Prints message to the standart browser console

    log: (message) => {
        window.console.log(`${message}`);
    },



    // Info
    // ----
    // Prints info message to the standart browser console

    info: (message) => {
        window.console.info(`[ INFO ] ${message}`);
    },



    // Warning
    // -------
    // Prints warning message to the standart browser console

    warning: (message) => {
        window.console.warn(`[ WARNING ] ${message}`);
    },



    // Error
    // -----
    // Prints error message to the standart browser console

    error: (message) => {
        window.console.error(`[ ERROR ] ${message}`);
    }
};

