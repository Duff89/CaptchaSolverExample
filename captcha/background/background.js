/*
 * Show options page after installation
 */
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == 'install') {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            self.open(chrome.runtime.getURL('options/options.html'));
        }
    }
});


var API;

Config.getAll().then(config => {
    if (config.apiKey) {
        initApiClient(config.apiKey);
        if (config.valute === "RUB") {
            API.service = "rucaptcha.com";
        }
    }
});

function initApiClient(apiKey) {
    API = new TwoCaptcha({
        apiKey: apiKey,
        service: "2captcha.com",
        defaultTimeout: 300,
        pollingInterval: 5,
        softId: 2834,
    });
}

var devtoolsConnections = {};

/*
 * Manage message passing
 */
chrome.runtime.onConnect.addListener(function(port) {
    // Listen to messages sent from the DevTools page
    port.onMessage.addListener(function (message) {
        // Register initial connection
        if (message.name === 'init') {
            devtoolsConnections[message.tabId] = port;
            port.onDisconnect.addListener(function() {
                delete devtoolsConnections[message.tabId];
            });
            return;
        }

        if (message.source === '2captcha-devtools') {
            for (tabId in devtoolsConnections) {
                devtoolsConnections[tabId].postMessage(message);
            }
        }

        let messageHandler = port.name + '_' + message.action;
        if (self[messageHandler] === undefined) return;
        self[messageHandler](message)
            .then((response) => {
                port.postMessage({action: message.action, request: message, response});
            })
            .catch(error => {
                port.postMessage({action: message.action, request: message, error: error.message});
            });
    });
});

chrome.runtime.onMessage.addListener(function(message, sender) {
    if (sender && sender.tab) {
        var tabId = sender.tab.id;
        if (tabId in devtoolsConnections) {
            devtoolsConnections[tabId].postMessage(message);
        } else {
            console.log("Tab not found in connection list.");
        }
    } else {
        console.log("sender.tab not defined.");
    }
    return true;
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if (tabId in devtoolsConnections && changeInfo.status === 'complete') {
        devtoolsConnections[tabId].postMessage({
            name: 'reloaded'
        });
    }
});

/*
 * Message handlers
 */
async function popup_login(msg) {
    initApiClient(msg.apiKey);

    let info = await API.userInfo();

    if (info.key_type !== "customer") {
        throw new Error("You entered worker key! Switch your account into \"customer\" mode to get right API-KEY");
    }

    info.valute = info.valute.toUpperCase();

    if (info.valute === "RUB") {
        API.service = "rucaptcha.com";
    }

    Config.set({
        apiKey: msg.apiKey,
        email:  info.email,
        valute: info.valute,
    });

    return info;
}

async function popup_logout(msg) {
    Config.set({apiKey: null});

    return {};
}

async function popup_getAccountInfo(msg) {
    let config = await Config.getAll();

    if (!config.apiKey) throw new Error("No apiKey");

    let info = await API.userInfo();

    info.valute = info.valute.toUpperCase();

    return info;
}

async function content_solve(msg) {
    return await API[msg.captchaType](msg.params);
}