export default ({ onChange }) => {
    let tabsCount = 1;

    const currentTab = () => {
        let dateNow = Date.now();

        window.currentTabId = window.currentTabId ? window.currentTabId : dateNow;

        return {
            id: window.currentTabId,
            time: dateNow
        }
    }

    const updateTabs = (tabs, tab) => {
        for (let key in tabs) {
            let diff = Date.now() - tabs[key].time;

            if (diff > 2000) {
                delete tabs[key];
            }
        }

        tabs[tab.id] = tab;

        return tabs;
    }

    setInterval(() => {
        let tabs = storage('tabs') ?? {},
            tab = currentTab();

        tabs = updateTabs(tabs, tab);

        storage('tabs', tabs);

        if (Object.keys(tabs).length != tabsCount) {
            tabsCount = Object.keys(tabs).length;
            onChange(tabsCount);
        }
    }, 1000);
}