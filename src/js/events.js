export class Events {
    constructor() {
        if (typeof Events.instance === 'object') {
            return Events.instance;
        }

        this.eventsData = {};

        Events.instance = this;
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

            if (executeIfAlreadyFired && (this.eventsData.counter > 0)) {
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

