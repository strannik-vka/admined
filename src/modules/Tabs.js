class Tabs {

    constructor() {
        this.tabs = this.getStorageTabs();
        this.tabId = this.generateId();
        this.lastCount = this.count();

        this.update(this.tabId);

        window.addEventListener('storage', this.onChangeStorage);
        window.addEventListener('beforeunload', this.onCloseTab);
    }

    getStorageTabs() {
        let list = {};

        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);

            if (key.indexOf('admined-tab-') > -1) {
                let tab = JSON.parse(localStorage.getItem(key)),
                    id = key.replace('admined-tab-', '');

                list[id] = tab;
            }
        }

        return list;
    }

    generateId() {
        let ids = Object.keys(this.tabs);

        return ids.length ? parseInt(ids[ids.length - 1]) + 1 : 1;
    }

    count() {
        let count = Object.keys(this.tabs).length;

        return count ? count : 1;
    }

    update(tabId) {
        if (this.tabs[tabId]) {
            this.tabs[tabId].updated_at = Date.now();
        } else {
            this.tabs[tabId] = {
                updated_at: Date.now()
            }
        }

        localStorage.setItem('admined-tab-' + tabId, JSON.stringify(this.tabs[tabId]));

        if (tabId == this.tabId) {
            this.updateTimeout();
        }
    }

    updateTimeout() {
        if (this.updateTimer) clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(() => {
            this.update(this.tabId);
            this.removeOfflineList();
        }, 1000);
    }

    removeOfflineList() {
        let isDelete = false;

        for (let id in this.tabs) {
            let tab = this.tabs[id];

            if (Date.now() - tab.updated_at > (this.lastCount * 1000) + 1000) {
                delete this.tabs[id];
                isDelete = true;
            }
        }

        if (isDelete) {
            this.eventChangeCount();
        }
    }

    eventChangeCount() {
        if (typeof this.onChangeCount === 'function') {
            let count = this.count();

            if (count != this.lastCount) {
                this.lastCount = count;
                this.onChangeCount(count);
            }
        }
    }

    onChangeStorage = (event) => {
        if (event.key.indexOf('admined-tab-') > -1) {
            let id = event.key.replace('admined-tab-', '');

            if (event.newValue) {
                this.tabs[id] = JSON.parse(event.newValue);
            } else {
                delete this.tabs[id];
            }

            this.eventChangeCount();
        }
    }

    onCloseTab = () => {
        clearTimeout(this.updateTimer);
        localStorage.removeItem('admined-tab-' + this.tabId);
    }

    getData(tabId) {
        return this.tabs[tabId] ? this.tabs[tabId] : {};
    }

    setData(tabId, data) {
        if (this.tabs[tabId]) {
            this.tabs[tabId] = Object.assign(this.tabs[tabId], data);
            this.update(tabId);
        }
    }

}

export default Tabs;