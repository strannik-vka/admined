import Tab from "./Tab";

class EditingTab extends Tab {

    constructor() {
        super();
        this.showEditingData = {};
        this.channels = {};
        this.channelHookInName = 'admined-edit-';
    }

    onActive() {
        this.switchMode();
    }

    switchMode() {
        if (this.checkChannelsTimer) {
            clearTimeout(this.checkChannelsTimer);
        }

        this.offMessageHook();

        if (this.isActive && this.isEditing() == false) {
            this.onMessageHook();
            let channels = this.getChannels(this.channelHookInName);
            this.checkChannels(channels);
        }

        if (!this.isActive && this.isEditing()) {
            this.onMessageHook();
        }
    }

    checkChannels(channels) {
        for (let channelName in channels) {
            let message = channels[channelName];

            if (message.isEditing) {
                message.isEditing = false;
                this.sendMessage(channelName, message);
            } else {
                delete channels[channelName];
                this.removeMessage(channelName);
            }
        }

        this.editingHook(channels);

        if (this.checkChannelsTimer) {
            clearTimeout(this.checkChannelsTimer);
        }

        this.checkChannelsTimer = setTimeout(() => {
            this.checkChannels(this.channels);
        }, 5000);
    }

    onMessageActive(channelName, message) {
        let channels = Object.assign({}, this.channels);

        if (channels[channelName]) {
            if (message && message.isEditing) {
                channels[channelName] = message;
            } else {
                delete channels[channelName];
            }
        } else {
            if (message && message.isEditing) {
                channels[channelName] = message;
            }
        }

        this.editingHook(channels);
    }

    onMessageEditing(channelName, message) {
        message.isEditing = true;
        this.sendMessage(channelName, message);
    }

    onMessage(channelName, message) {
        if (this.isEditing()) {
            if (channelName == this.channelName()) {
                this.onMessageEditing(channelName, message)
            }
        } else if (this.isActive) {
            this.onMessageActive(channelName, message);
        }
    }

    editingHook(channels) {
        if (JSON.stringify(channels) !== JSON.stringify(this.channels)) {
            this.channels = channels;

            if (typeof this.onEditing === 'function') {
                this.onEditing(channels);
            }
        }
    }

    showEditing(data) {
        data.isEditing = true;
        this.showEditingData = data;
        this.sendMessage(this.channelName(), data);
        this.switchMode();
    }

    hideEditing() {
        this.removeMessage(this.channelName());
        this.showEditingData = {};
        this.switchMode();
    }

    close() {
        if (this.isEditing()) {
            this.removeMessage(this.channelName());
        }
    }

    channelName() {
        return this.channelHookInName + '' + this.showEditingData.id;
    }

    isEditing() {
        return this.showEditingData.id ? true : false;
    }

}

export default EditingTab;