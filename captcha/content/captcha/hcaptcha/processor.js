CaptchaProcessors.register({

    captchaType: "hcaptcha",

    canBeProcessed: function(widget, config) {
        if (!config.enabledForHCaptcha) return false;

        if (!$("#" + widget.containerId).length) return false;

        if (!widget.sitekey) return false;

        return true;
    },

    attachButton: function(widget, config, button) {
        let container = $("#" + widget.containerId);

        button.css({
            width: container.find('iframe').outerWidth() + "px"
        });

        container.append(button);
    },

    clickButton: function(widget, config, button) {
        if (config.autoSolveHCaptcha) button.click();
    },

    getName: function () {
        return `hCaptcha`;
    },

    getParams: function(widget, config) {
        return {
            method: "hcaptcha",
            url: location.href,
            sitekey: widget.sitekey,
        };
    },

    getParamsV2: function(widget, config) {
        return {
            type: "HCaptchaTaskProxyless",
            websiteURL: location.href,
            websiteKey: widget.sitekey,
        };
    },

    onSolved: function(widget, answer) {
        let container = $("#" + widget.containerId);

        container.find("textarea").val(answer);
        container.find("iframe").attr("data-hcaptcha-response", answer);
    },

    getForm: function(widget) {
        return $("#" + widget.containerId).closest("form");
    },

    getCallback: function(widget) {
        return widget.callback;
    },

});