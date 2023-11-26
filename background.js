chrome.commands.onCommand.addListener((command, tab) => {
    if (command == "google") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            let tab = tabs[0];
            let key = tab.title
            if (tab.url.includes('https://www.bing.com')) {
                // key = key.slice(0, key.length - 5)
                key = key.split(" - ")[0]
                chrome.tabs.create({ url: 'https://www.google.com/search?q=' + key });
            } else if (tab.url.includes('https://www.google.com/search')){
                key = key.slice(0, key.length -11)
                chrome.tabs.create({ url: 'https://www.bing.com/search?q=' + key });
            }
        });
    }
});
