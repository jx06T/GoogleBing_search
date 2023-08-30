chrome.commands.onCommand.addListener((command, tab) => {
    if (command == "google") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            let tab = tabs[0];
            let key = tab.title
            if (tab.url.includes('https://www.bing.com/search')) {
                key = key.slice(0, key.length - 5)
                chrome.tabs.create({ url: 'https://www.google.com.tw/search?q=' + key });
            } else if (tab.url.includes('https://www.google.com.tw/search')){
                key = key.slice(0, key.length -11)
                chrome.tabs.create({ url: 'https://www.bing.com/search?q=' + key });
            }
        });
    }
});
