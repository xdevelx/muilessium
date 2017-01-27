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
    }


    initWindowResizeEvents() {
        this.addEvent('resizeWindowHeight');
        this.addEvent('resizeWindowWidth');

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
                    this.fireEvent('resizeWindowHeight');
                }, 100);
            }

            if (this.data.window.width != width) {
                this.data.window.width = width;
                clearTimeout(this.timeouts.resizeWindowWidth);

                this.timeouts.resizeWindowHeight = setTimeout(() => {
                    this.fireEvent('resizeWindowWidth');
                }, 100);
            }
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

