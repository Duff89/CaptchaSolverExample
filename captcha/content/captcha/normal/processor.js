CaptchaProcessors.register({

    captchaType: "normal",

    canBeProcessed: function(widget, config) {
        if (!config.enabledForNormal) return false;

        return true;
    },

    attachButton: function(widget, config, button) {
        $("#" + widget.inputId).after(button);
    },

    clickButton: function(widget, config, button) {
        if (config.autoSolveNormal) button.click();
    },

    getName: function (widget, config) {
        return `Normal CAPTCHA (Image)`;
    },

    getParams: function(widget, config) {
        return {
            method: "base64",
            body: widget.base64,
        };
    },

    getParamsV2: function(widget, config) {
        return {
            type: "ImageToTextTask",
            body: widget.base64,
        };
    },

    onSolved: function(widget, answer) {
        let input = document.getElementById(widget.inputId);

        input.value = answer;

        input.dispatchEvent(new Event('input', {
            bubbles: true,
            data: answer,
        }));
    },

    getForm: function(widget) {
        return $("#" + widget.inputId).closest("form");
    },

    getCallback: function(widget) {
        return null;
    },

});