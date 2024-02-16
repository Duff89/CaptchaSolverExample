(() => {

    let timer = setInterval(() => {
        if (window.turnstile) {
            interceptorFunc();
            clearInterval(timer);
        }
    }, 1)

    const interceptorFunc = function () {
        const initCaptcha = ([div, params]) => {
            const input = div.parentElement;

            if (!input.id) {
                input.id = "turnstile-input-" + params.sitekey;
            }

            registerCaptchaWidget({
                captchaType: "turnstile",
                widgetId: params.sitekey,
                sitekey: params.sitekey,
                pageurl: window.location.href,
                data: params.cData,
                pagedata: params.chlPageData,
                action: params.action,
                inputId: input.id
            });
        }

        window.turnstile = new Proxy(window.turnstile, {
            get: function (target, prop) {
                if (prop === 'render') {
                    return new Proxy(target[prop], {
                        apply: (target, thisArg, argumentsList) => {
                            initCaptcha(argumentsList);
                            const obj = Reflect.apply(target, thisArg, argumentsList);
                            return obj;
                        }
                    });
                }

                return target[prop];
            }
        });
    }
})()