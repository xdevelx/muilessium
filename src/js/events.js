export class Events {
    constructor() {
        if (typeof Events.instance === 'object') {
            return Events.instance;
        }

        this.data = {
            window: {}
        };

        this.eventsData = {};

        this.initDefaultEvents();

        Events.instance = this;
    }


    initDefaultEvents() {
        this.addEvent('resizeWindowHeight');
        this.addEvent('resizeWindowWidth');

        this.data.window.height = window.innerHeight;
        this.data.window.width  = window.innerWidth;

        window.addEventListener('resize', () => {
            const height = window.innerHeight;
            const width  = window.innerWidth;

            if (this.data.window.height != height) {
                this.data.window.height = height;

                this.fireEvent('resizeWindowHeight');
            }

            if (this.data.window.width != width) {
                this.data.window.width = width;

                this.fireEvent('resizeWindowWidth');
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

