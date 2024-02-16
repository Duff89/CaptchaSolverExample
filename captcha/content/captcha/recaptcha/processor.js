CaptchaProcessors.register({

    captchaType: "recaptcha",

    canBeProcessed: function(widget, config) {
        if (widget.version === "v2" && !config.enabledForRecaptchaV2) return false;
        if (widget.version === "v2_invisible" && !config.enabledForInvisibleRecaptchaV2) return false;
        if (widget.version === "v3" && !config.enabledForRecaptchaV3) return false;

        let binded = this.getBindedElements(widget);

        return !(!binded.button && !binded.textarea);
    },

    attachButton: function(widget, config, button) {
        let binded = this.getBindedElements(widget);

        if (binded.textarea) {
            const container = binded.textarea.parent();
            container.css({height: "auto", display: "block"});
            container.parent().css({height: "auto"});
            if (widget.version === "v2" || widget.version === "v2_invisible") {
                container.append(button);
            } else {
                const formBinded = $('form');
                if (formBinded.length) {
                    formBinded.after(button);
                } else {
                    container.append(button);
                }
            }
        } else {
            binded.button.after(button);
        }
    },

    clickButton: function(widget, config, button) {
        if (
            (widget.version === "v2" && config.autoSolveRecaptchaV2) ||
            (widget.version === "v2_invisible" && config.autoSolveInvisibleRecaptchaV2) ||
            (widget.version === "v3" && config.autoSolveRecaptchaV3)
        ) {
            button.click();
        }
    },

    onSolved: function(widget, answer) {
        let textarea = this.getBindedElements(widget).textarea;

        if (!textarea) {
            textarea = this.getForm(widget).find("textarea[name=g-recaptcha-response]");
        }

        textarea.val(answer);
    },

    getForm: function(widget) {
        let binded = this.getBindedElements(widget);

        if (binded.textarea) {
            return binded.textarea.closest("form");
        }

        return binded.button.closest("form");
    },

    getCallback: function(widget) {
        return widget.callback;
    },

    getName: function (widget, config) {
        const names = ['reCAPTCHA'];

        if (widget.version === "v3") {
            names.push('V3');
        } else if (widget.version === "v2_invisible") {
            names.push('V2 Invisible');
        } else {
            names.push('V2');
        }

        if (widget.enterprise) {
            names.push('Enterprise');
        }

        return names.join(' ');
    },

    getParams: function(widget, config) {
        let params = {
            method: "userrecaptcha",
            googlekey: widget.sitekey,
            url: location.href,
            invisible: 0,
            enterprise: 0,
            version: 'v2',
        };

        if (widget.version === "v2_invisible") {
            params.invisible = 1;
        }

        if (widget.version === "v3") {
            params.version = "v3";
            params.score = config.recaptchaV3MinScore;
        }

        if (widget.action) {
            params.action = widget.action;
        }

        if (widget.s) {
            params["data-s"] = widget.s;
        }

        if (widget.enterprise) {
            params.enterprise = 1;
        }

        return params;
    },

    getParamsV2: function(widget, config) {
        let params = {
            type: "RecaptchaV2TaskProxyless",
            websiteKey: widget.sitekey,
            websiteURL: location.href
        };

        if (widget.enterprise) {
            params.type = "RecaptchaV2EnterpriseTaskProxyless";
        }

        if (widget.version === "v2_invisible") {
            params.isInvisible = true;
        }

        if (widget.version === "v3") {
            params.type = "RecaptchaV3TaskProxyless";
            params.minScore = config.recaptchaV3MinScore;

            if (widget.enterprise) {
                params.isEnterprise = true;
            }
        }

        if (widget.action) {
            params.pageAction = widget.action;
        }

        if (widget.s) {
            params.recaptchaDataSValue = widget.s;
        }

        return params;
    },

    getBindedElements: function(widget) {
        let elements = {
            button: null,
            textarea: null,
        };

        if (widget.bindedButtonId) {
            let button = $("#" + widget.bindedButtonId);
            if (button.length) elements.button = button;
        } else {
            let textarea = $((widget.containerId ? `#${widget.containerId} ` : '') + 'textarea[name=g-recaptcha-response]');
            if (textarea.length) elements.textarea = textarea;
        }

        return elements;
    },

});