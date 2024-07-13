/**
 * DevExtreme (esm/localization/globalize/message.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import "./core";
import Globalize from "globalize";
import messageLocalization from "../message";
import coreLocalization from "../core";
import "globalize/message";
if (Globalize && Globalize.formatMessage) {
    const DEFAULT_LOCALE = "en";
    const originalLoadMessages = Globalize.loadMessages;
    Globalize.loadMessages = messages => {
        messageLocalization.load(messages)
    };
    const globalizeMessageLocalization = {
        engine: function() {
            return "globalize"
        },
        ctor: function() {
            this.load(this._dictionary)
        },
        load: function(messages) {
            this.callBase(messages);
            originalLoadMessages(messages)
        },
        getMessagesByLocales: function() {
            return Globalize.cldr.get("globalize-messages")
        },
        getFormatter: function(key, locale) {
            const currentLocale = locale || coreLocalization.locale();
            let formatter = this._getFormatterBase(key, locale);
            if (!formatter) {
                formatter = this._formatterByGlobalize(key, locale)
            }
            if (!formatter && currentLocale !== DEFAULT_LOCALE) {
                formatter = this.getFormatter(key, DEFAULT_LOCALE)
            }
            return formatter
        },
        _formatterByGlobalize: function(key, locale) {
            const currentGlobalize = !locale || locale === coreLocalization.locale() ? Globalize : new Globalize(locale);
            let result;
            if (this._messageLoaded(key, locale)) {
                result = currentGlobalize.messageFormatter(key)
            }
            return result
        },
        _messageLoaded: function(key, locale) {
            const currentCldr = locale ? new Globalize(locale).cldr : Globalize.locale();
            const value = currentCldr.get(["globalize-messages/{bundle}", key]);
            return !!value
        },
        _loadSingle: function(key, value, locale) {
            const data = {};
            data[locale] = {};
            data[locale][key] = value;
            this.load(data)
        }
    };
    messageLocalization.inject(globalizeMessageLocalization)
}