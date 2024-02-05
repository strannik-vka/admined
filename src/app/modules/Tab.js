class Tab {

    constructor() {
        this.isMessageHook = null;
    }

    onMessageHook() {
        if (!this.isMessageHook) {
            this.isMessageHook = true;
            window.addEventListener('storage', this.channelHook);
        }
    }

    offMessageHook() {
        if (this.isMessageHook) {
            this.isMessageHook = false;
            window.removeEventListener('storage', this.channelHook);
        }
    }

    setActive(status) {
        this.isActive = status;

        if (typeof this.onActive === 'function') {
            this.onActive(status);
        }
    }

    sendMessage(channel, data) {
        localStorage.setItem(channel, JSON.stringify(data));
    }

    removeMessage(channel) {
        localStorage.removeItem(channel);
    }

    getChannels(inName) {
        let list = {};

        for (let i = 0; i < localStorage.length; i++) {
            let channelName = localStorage.key(i);

            if (inName) {
                if (channelName.indexOf(inName) > -1) {
                    list[channelName] = this.dataFormat(localStorage.getItem(channelName));
                }
            } else {
                list[channelName] = this.dataFormat(localStorage.getItem(channelName));
            }
        }

        return list;
    }

    channelHookCallback(channelName, data) {
        if (typeof this.onMessage === 'function') {
            this.onMessage(channelName, this.dataFormat(data));
        }
    }

    channelHook = (event) => {
        if (this.channelHookInName) {
            if (event.key.indexOf(this.channelHookInName) > -1) {
                this.channelHookCallback(event.key, event.newValue);
            }
        } else {
            this.channelHookCallback(event.key, event.newValue);
        }
    }

    dataFormat(data) {
        return this.isJsonString(data) ? JSON.parse(data) : data
    }

    isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }

        return true;
    }

}

export default Tab;