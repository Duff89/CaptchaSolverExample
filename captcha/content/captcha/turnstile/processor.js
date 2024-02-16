CaptchaProcessors.register({

    captchaType: "turnstile",

    canBeProcessed: function(widget, config) {
        if (!config.enabledForTurnstile) return false;

        if (!widget.sitekey) return false;

        return true;
    },

    attachButton: function(widget, config, button) {
        let helper = this.getHelper(widget);
        if (helper.find('.captcha-solver').length !== 0) {
            return;
        }

        button.css({
            width: helper.outerWidth() + "px"
        });
        button[0].dataset.disposable = true;

        helper.append(button);
    },

    clickButton: function(widget, config, button) {
        if (config.autoSolveTurnstile) button.click();
    },

    getName: function (widget, config) {
        return `Cloudflare Turnstile`;
    },

    getParams: function(widget, config) {
        return {
            method: "turnstile",
            url: location.href,
            sitekey: widget.sitekey,
            pageurl: widget.pageurl,
            data: widget.data,
            pagedata: widget.pagedata,
            action: widget.action,
            userAgent: navigator.userAgent,
        };
    },

    getParamsV2: function(widget, config) {
        return {
            type: "TurnstileTaskProxyless",
            websiteURL: location.href,
            websiteKey: widget.sitekey,
            data: widget.data,
            pagedata: widget.pagedata,
            action: widget.action,
            userAgent: navigator.userAgent,
        };
    },

    onSolved: function(widget, answer) {
        let helper = this.getHelper(widget);
        this.setValueInput(helper, 'input[name="cf-turnstile-response"]', answer);
        // if reCAPTCHA compatibility mode is enabled
        this.setValueInput(helper, 'input[name="g-recaptcha-response"]', answer);
    },

    setValueInput(helper, name, answer) {
        const input = helper.find(name);
        if (input && input.length) {
            input.val(answer);
        }
    },

    getForm: function(widget) {
        return this.getHelper(widget).closest("form");
    },

    getCallback: function(widget) {
        return null;
    },

    getHelper: function(widget) {
        let container = $("#" + widget.inputId);
        return container.parent();
    },

});
