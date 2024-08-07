/**
 * DevExtreme (esm/data/endpoint_selector.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import errors from "../core/errors";
import {
    getWindow
} from "../core/utils/window";
const window = getWindow();
let IS_WINJS_ORIGIN;
let IS_LOCAL_ORIGIN;

function isLocalHostName(url) {
    return /^(localhost$|127\.)/i.test(url)
}
const EndpointSelector = function(config) {
    this.config = config;
    IS_WINJS_ORIGIN = "ms-appx:" === window.location.protocol;
    IS_LOCAL_ORIGIN = isLocalHostName(window.location.hostname)
};
EndpointSelector.prototype = {
    urlFor: function(key) {
        const bag = this.config[key];
        if (!bag) {
            throw errors.Error("E0006")
        }
        if (bag.production) {
            if (IS_WINJS_ORIGIN && !Debug.debuggerEnabled || !IS_WINJS_ORIGIN && !IS_LOCAL_ORIGIN) {
                return bag.production
            }
        }
        return bag.local
    }
};
export default EndpointSelector;
