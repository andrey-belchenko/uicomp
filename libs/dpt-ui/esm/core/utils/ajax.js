/**
 * DevExtreme (esm/core/utils/ajax.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    Deferred
} from "./deferred";
import httpRequest from "../../core/http_request";
import {
    getWindow
} from "../../core/utils/window";
const window = getWindow();
import {
    isDefined
} from "./type";
import injector from "./dependency_injector";
import {
    isCrossDomain,
    getJsonpCallbackName as getJsonpOptions,
    getRequestHeaders,
    getRequestOptions,
    evalScript,
    evalCrossDomainScript,
    getMethod
} from "./ajax_utils";
const SUCCESS = "success";
const ERROR = "error";
const TIMEOUT = "timeout";
const NO_CONTENT = "nocontent";
const PARSER_ERROR = "parsererror";
const isStatusSuccess = function(status) {
    return 200 <= status && status < 300
};
const hasContent = function(status) {
    return 204 !== status
};
const getDataFromResponse = function(xhr) {
    return xhr.responseType && "text" !== xhr.responseType || "string" !== typeof xhr.responseText ? xhr.response : xhr.responseText
};
const postProcess = function(deferred, xhr, dataType) {
    const data = getDataFromResponse(xhr);
    switch (dataType) {
        case "jsonp":
            evalScript(data);
            break;
        case "script":
            evalScript(data);
            deferred.resolve(data, SUCCESS, xhr);
            break;
        case "json":
            try {
                deferred.resolve(JSON.parse(data), SUCCESS, xhr)
            } catch (e) {
                deferred.reject(xhr, PARSER_ERROR, e)
            }
            break;
        default:
            deferred.resolve(data, SUCCESS, xhr)
    }
};
const setHttpTimeout = function(timeout, xhr) {
    return timeout && setTimeout((function() {
        xhr.customStatus = TIMEOUT;
        xhr.abort()
    }), timeout)
};
const sendRequest = function(options) {
    const xhr = httpRequest.getXhr();
    const d = new Deferred;
    const result = d.promise();
    const async = isDefined(options.async) ? options.async : true;
    const dataType = options.dataType;
    const timeout = options.timeout || 0;
    let timeoutId;
    options.crossDomain = isCrossDomain(options.url);
    const needScriptEvaluation = "jsonp" === dataType || "script" === dataType;
    if (void 0 === options.cache) {
        options.cache = !needScriptEvaluation
    }
    const callbackName = getJsonpOptions(options);
    const headers = getRequestHeaders(options);
    const requestOptions = getRequestOptions(options, headers);
    const url = requestOptions.url;
    const parameters = requestOptions.parameters;
    if (callbackName) {
        window[callbackName] = function(data) {
            d.resolve(data, SUCCESS, xhr)
        }
    }
    if (options.crossDomain && needScriptEvaluation) {
        const reject = function() {
            d.reject(xhr, ERROR)
        };
        const resolve = function() {
            if ("jsonp" === dataType) {
                return
            }
            d.resolve(null, SUCCESS, xhr)
        };
        evalCrossDomainScript(url).then(resolve, reject);
        return result
    }
    if (options.crossDomain && !("withCredentials" in xhr)) {
        d.reject(xhr, ERROR);
        return result
    }
    xhr.open(getMethod(options), url, async, options.username, options.password);
    if (async) {
        xhr.timeout = timeout;
        timeoutId = setHttpTimeout(timeout, xhr)
    }
    xhr.onreadystatechange = function(e) {
        if (4 === xhr.readyState) {
            clearTimeout(timeoutId);
            if (isStatusSuccess(xhr.status)) {
                if (hasContent(xhr.status)) {
                    postProcess(d, xhr, dataType)
                } else {
                    d.resolve(null, NO_CONTENT, xhr)
                }
            } else {
                d.reject(xhr, xhr.customStatus || ERROR)
            }
        }
    };
    if (options.upload) {
        xhr.upload.onprogress = options.upload.onprogress;
        xhr.upload.onloadstart = options.upload.onloadstart;
        xhr.upload.onabort = options.upload.onabort
    }
    if (options.xhrFields) {
        for (const field in options.xhrFields) {
            xhr[field] = options.xhrFields[field]
        }
    }
    if ("arraybuffer" === options.responseType) {
        xhr.responseType = options.responseType
    }
    for (const name in headers) {
        if (Object.prototype.hasOwnProperty.call(headers, name) && isDefined(headers[name])) {
            xhr.setRequestHeader(name, headers[name])
        }
    }
    if (options.beforeSend) {
        options.beforeSend(xhr)
    }
    xhr.send(parameters);
    result.abort = function() {
        xhr.abort()
    };
    return result
};
export default injector({
    sendRequest: sendRequest
});
