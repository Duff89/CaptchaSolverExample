importScripts(
    '/common/config.js',
    '/common/api.js',
    '/background/background.js',
    '/content/captcha/normal/background.js'
);

setInterval(() => { self.serviceWorker.postMessage('ping') }, 20000);