export class Events {
    constructor() {
        if (typeof Events.instance === 'object') {
            return Events.instance;
        }

        this.data = {
            window: {}
        };

        this.timeouts = {
            
        };

        this.eventsData = {};

        this.initDefaultEvents();

        Events.instance = this;
    }


    initDefaultEvents() {
        this.initWindowResizeEvents();
        this.initScrollEvents();
    }


    initWindowResizeEvents() {
        this.addEvent('resize-window-height');
        this.addEvent('resize-window-width');

        this.data.window.height = window.innerHeight;
        this.data.window.width  = window.innerWidth;

        this.timeouts.resizeWindowHeight = null;
        this.timeouts.resizeWindowWidth  = null;

        window.addEventListener('resize', () => {
            const height = window.innerHeight;
            const width  = window.innerWidth;

            if (this.data.window.height != height) {
                this.data.window.height = height;
                clearTimeout(this.timeouts.resizeWindowHeight);

                this.timeouts.resizeWindowHeight = setTimeout(() => {
                    this.fireEvent('resize-window-height');
                }, 150);
            }

            if (this.data.window.width != width) {
                this.data.window.width = width;
                clearTimeout(this.timeouts.resizeWindowWidth);

                this.timeouts.resizeWindowHeight = setTimeout(() => {
                    this.fireEvent('resize-window-width');
                }, 150);
            }
        });
    }


    initScrollEvents() {
        this.addEvent('scroll-start');
        this.addEvent('scroll-end');

        this.timeouts.scroll = null;

        window.addEventListener('scroll', () => {
            if (!this.timeouts.scroll) {
                this.fireEvent('scroll-start');
            } else {
                clearTimeout(this.timeouts.scroll);
            }

            this.timeouts.scroll = setTimeout(() => {
                this.fireEvent('scroll-end');
                this.timeouts.scroll = null;
            }, 150);
        });
    }


    addEvent(name) {
        if (!(name in this.eventsData)) {
            this.eventsData[name] = {
                callbacks: [],
                counter: 0
            };
        }

        return this;
    }


    addEventListener(name, callback, executeIfAlreadyFired = false) {
        if ((name in this.eventsData) && (typeof callback === 'function')) {
            this.eventsData[name].callbacks.push(callback);

            if (executeIfAlreadyFired && (this.eventsData[name].counter > 0)) {
                callback();
            }
        }

        return this;
    }


    fireEvent(name) {
        if (name in this.eventsData) {
            this.eventsData[name].counter++;

            this.eventsData[name].callbacks.forEach((callback) => {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }

        return this;
    }
}

