/**
 * DevExtreme (esm/data/odata/store.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    isDefined
} from "../../core/utils/type";
import config from "../../core/config";
import {
    generateExpand,
    generateSelect,
    serializeKey,
    convertPrimitiveValue,
    formatFunctionInvocationUrl,
    escapeServiceOperationParams
} from "./utils";
import {
    errors
} from "../errors";
import query from "../query";
import Store from "../abstract_store";
import RequestDispatcher from "./request_dispatcher";
import {
    when,
    Deferred
} from "../../core/utils/deferred";
import "./query_adapter";
const ANONYMOUS_KEY_NAME = "5d46402c-7899-4ea9-bd81-8b73c47c7683";
const expandKeyType = (key, keyType) => ({
    [key]: keyType
});
const mergeFieldTypesWithKeyType = (fieldTypes, keyType) => {
    const result = {};
    for (const field in fieldTypes) {
        result[field] = fieldTypes[field]
    }
    for (const keyName in keyType) {
        if (keyName in result) {
            if (result[keyName] !== keyType[keyName]) {
                errors.log("W4001", keyName)
            }
        } else {
            result[keyName] = keyType[keyName]
        }
    }
    return result
};
const ODataStore = Store.inherit({
    ctor(options) {
        this.callBase(options);
        this._requestDispatcher = new RequestDispatcher(options);
        let key = this.key();
        let fieldTypes = options.fieldTypes;
        let keyType = options.keyType;
        if (keyType) {
            const keyTypeIsString = "string" === typeof keyType;
            if (!key) {
                key = keyTypeIsString ? ANONYMOUS_KEY_NAME : Object.keys(keyType);
                this._legacyAnonymousKey = key
            }
            if (keyTypeIsString) {
                keyType = expandKeyType(key, keyType)
            }
            fieldTypes = mergeFieldTypesWithKeyType(fieldTypes, keyType)
        }
        this._fieldTypes = fieldTypes || {};
        if (2 === this.version()) {
            this._updateMethod = "MERGE"
        } else {
            this._updateMethod = "PATCH"
        }
    },
    _customLoadOptions: () => ["expand", "customQueryParams"],
    _byKeyImpl(key, extraOptions) {
        const params = {};
        if (extraOptions) {
            params.$expand = generateExpand(this.version(), extraOptions.expand, extraOptions.select) || void 0;
            params.$select = generateSelect(this.version(), extraOptions.select) || void 0
        }
        return this._requestDispatcher.sendRequest(this._byKeyUrl(key), "GET", params)
    },
    createQuery(loadOptions) {
        let url;
        const queryOptions = {
            adapter: "odata",
            beforeSend: this._requestDispatcher.beforeSend,
            errorHandler: this._errorHandler,
            jsonp: this._requestDispatcher.jsonp,
            version: this._requestDispatcher.version,
            withCredentials: this._requestDispatcher._withCredentials,
            expand: null === loadOptions || void 0 === loadOptions ? void 0 : loadOptions.expand,
            requireTotalCount: null === loadOptions || void 0 === loadOptions ? void 0 : loadOptions.requireTotalCount,
            deserializeDates: this._requestDispatcher._deserializeDates,
            fieldTypes: this._fieldTypes
        };
        url = (null === loadOptions || void 0 === loadOptions ? void 0 : loadOptions.urlOverride) ?? this._requestDispatcher.url;
        if (isDefined(this._requestDispatcher.filterToLower)) {
            queryOptions.filterToLower = this._requestDispatcher.filterToLower
        }
        if (null !== loadOptions && void 0 !== loadOptions && loadOptions.customQueryParams) {
            const params = escapeServiceOperationParams(null === loadOptions || void 0 === loadOptions ? void 0 : loadOptions.customQueryParams, this.version());
            if (4 === this.version()) {
                url = formatFunctionInvocationUrl(url, params)
            } else {
                queryOptions.params = params
            }
        }
        return query(url, queryOptions)
    },
    _insertImpl(values) {
        this._requireKey();
        const d = new Deferred;
        when(this._requestDispatcher.sendRequest(this._requestDispatcher.url, "POST", null, values)).done((serverResponse => d.resolve(serverResponse && !config().useLegacyStoreResult ? serverResponse : values, this.keyOf(serverResponse)))).fail(d.reject);
        return d.promise()
    },
    _updateImpl(key, values) {
        const d = new Deferred;
        when(this._requestDispatcher.sendRequest(this._byKeyUrl(key), this._updateMethod, null, values)).done((serverResponse => config().useLegacyStoreResult ? d.resolve(key, values) : d.resolve(serverResponse || values, key))).fail(d.reject);
        return d.promise()
    },
    _removeImpl(key) {
        const d = new Deferred;
        when(this._requestDispatcher.sendRequest(this._byKeyUrl(key), "DELETE")).done((() => d.resolve(key))).fail(d.reject);
        return d.promise()
    },
    _convertKey(value) {
        let result = value;
        const fieldTypes = this._fieldTypes;
        const key = this.key() || this._legacyAnonymousKey;
        if (Array.isArray(key)) {
            result = {};
            for (let i = 0; i < key.length; i++) {
                const keyName = key[i];
                result[keyName] = convertPrimitiveValue(fieldTypes[keyName], value[keyName])
            }
        } else if (fieldTypes[key]) {
            result = convertPrimitiveValue(fieldTypes[key], value)
        }
        return result
    },
    _byKeyUrl(value) {
        const baseUrl = this._requestDispatcher.url;
        const convertedKey = this._convertKey(value);
        return `${baseUrl}(${encodeURIComponent(serializeKey(convertedKey,this.version()))})`
    },
    version() {
        return this._requestDispatcher.version
    }
}, "odata");
export default ODataStore;
