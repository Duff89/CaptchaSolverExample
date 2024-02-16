(() => {

    setInterval(function () {
        let cf = document.getElementById("cf-turnstile");
        if (!cf) {
            const inputResponse = document.querySelector('input[name="cf-turnstile-response"]');
            cf = inputResponse && inputResponse.parentNode;
        }

        if (!cf) return;

        if (isCaptchaWidgetRegistered("turnstile", 0)) return;

        getTurnstileWidgetInfo(cf);
    }, 2000);

    const getTurnstileData = function (cf) {
        if (cf) {
            return cf.getAttribute('data-sitekey');
        }

        return null;
    };

    const getTurnstileWidgetInfo = function (cf) {
        const sitekey = getTurnstileData(cf);

        if (sitekey) {
            if (!cf.id) {
                cf.id = "turnstile-input-" + sitekey;
            }

            registerCaptchaWidget({
                captchaType: "turnstile",
                widgetId: sitekey,
                sitekey: sitekey,
                inputId: cf.id,
            });
        }
    };
})()