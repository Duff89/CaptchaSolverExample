(() => {
    setInterval(function () {
        let input = document.querySelector("input[name='fc-token']");
        if (!input) return;

        fixHeightIframe();

        if (isCaptchaWidgetRegistered("arkoselabs", 0)) return;

        const widgetInfo = getArkoselabsWidgetInfo(input);
        if (widgetInfo) {
            registerCaptchaWidget(widgetInfo);
        }
    }, 2000);

    let fixHeightIframe = function () {
        const iframes = document.querySelectorAll('iframe');
        if (iframes) {
            iframes.forEach(function (iframe) {
                if (iframe.getAttribute('data-e2e') === 'enforcement-frame') {
                    if (!iframe.hasAttribute('data-height') || iframe.offsetHeight < 200) {
                        iframe.setAttribute('data-height', iframe.offsetHeight);
                    }
                    iframe.style.height = (+iframe.getAttribute('data-height') + 100) + 'px';
                }
            })
        }
    }

    let getArkoselabsWidgetInfo = function (input) {
        if (!input.id) {
            input.id = "arkoselab-input-0";
        }

        let data = {};
        input.value.split('|').forEach(pair => {
            let p = pair.split('=');
            if (p[1] !== undefined) {
                data[p[0]] = unescape(p[1]);
            }
        });

        return {
            captchaType: "arkoselabs",
            widgetId: 0,
            pkey: data.pk,
            surl: data.surl,
            inputId: input.id,
        };
    };

})()