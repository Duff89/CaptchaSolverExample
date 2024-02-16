CaptchaProcessors.register({

    captchaType: "arkoselabs",

    canBeProcessed: function(widget, config) {
        if (!config.enabledForArkoselabs) return false;

        if (!widget.pkey) return false;

        return true;
    },

    attachButton: function(widget, config, button) {
        let input = $("#" + widget.inputId);

        input.after(button);
    },

    clickButton: function(widget, config, button) {
        if (config.autoSolveArkoselabs) button.click();
    },

    getOriginUrl: function() {
        const href = document.location.href;
        const referrer = document.referrer;
        // we in iframe?
        if(window.parent != window) {
            return referrer;
        } else {
            return href;
        }
    },

    getName: function (widget, config) {
        return `FunCaptcha`;
    },

    getParams: function(widget, config) {
        let params = {
            method: "funcaptcha",
            pageurl: this.getOriginUrl(),
            publickey: widget.pkey,
        };

        if (widget.surl) {
            params.surl = widget.surl;
        }

        if (widget.data) {
            params.data = JSON.parse(decodeURIComponent(widget.data));
        }

        return params;
    },

    getParamsV2: function(widget, config) {
        let params = {
            type: "FunCaptchaTaskProxyless",
            websiteURL: this.getOriginUrl(),
            websitePublicKey: widget.pkey,
        };

        if (widget.surl) {
            params.funcaptchaApiJSSubdomain = widget.surl;
        }

        if (widget.data) {
            params.data = JSON.parse(decodeURIComponent(widget.data));
        }

        return params;
    },

    onSolved: function(widget, answer) {
        $("#" + widget.inputId).val(answer);
    },

    getForm: function(widget) {
        return $("#" + widget.containerId).closest("form");
    },

    getCallback: function(widget) {
        return widget.callback;
    },

});