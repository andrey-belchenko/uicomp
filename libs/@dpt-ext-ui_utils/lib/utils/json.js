"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonUtils = void 0;
var JsonUtils = (function () {
    function JsonUtils() {
    }
    JsonUtils.isValid = function (json) {
        return !(/[^,:{}[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(json.replace(/"(\\.|[^"\\])*"/g, '')));
    };
    return JsonUtils;
}());
exports.JsonUtils = JsonUtils;