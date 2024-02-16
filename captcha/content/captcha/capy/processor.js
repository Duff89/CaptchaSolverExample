CaptchaProcessors.register({

    captchaType: "capy",

    canBeProcessed: function(widget, config) {
        if (!config.enabledForCapyPuzzle) return false;

        if (!widget.captchakey) return false;

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
        if (config.autoSolveCapyPuzzle) button.click();
    },

    getName: function () {
        return `Capy Puzzle`;
    },

    getParams: function(widget, config) {
        return {
            method: "capy",
            url: location.href,
            captchakey: widget.captchakey,
            apiServer: widget.apiServer
        };
    },

    getParamsV2: function(widget, config) {
        return {
            type: "CapyTaskProxyless",
            websiteURL: location.href,
            websiteKey: widget.captchakey
        };
    },

    onSolved: function(widget, answer) {
        let helper = this.getHelper(widget);
        helper.find("input[name=capy_captchakey]").val(answer.captchakey);
        helper.find("input[name=capy_challengekey]").val(answer.challengekey);
        helper.find("input[name=capy_answer]").val(answer.answer);
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
