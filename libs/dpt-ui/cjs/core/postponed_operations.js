/**
 * DevExtreme (cjs/core/postponed_operations.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
exports.PostponedOperations = void 0;
var _deferred = require("./utils/deferred");
var _type = require("./utils/type");
class PostponedOperations {
    constructor() {
        this._postponedOperations = {}
    }
    add(key, fn, postponedPromise) {
        if (key in this._postponedOperations) {
            postponedPromise && this._postponedOperations[key].promises.push(postponedPromise)
        } else {
            const completePromise = new _deferred.Deferred;
            this._postponedOperations[key] = {
                fn: fn,
                completePromise: completePromise,
                promises: postponedPromise ? [postponedPromise] : []
            }
        }
        return this._postponedOperations[key].completePromise.promise()
    }
    callPostponedOperations() {
        for (const key in this._postponedOperations) {
            const operation = this._postponedOperations[key];
            if ((0, _type.isDefined)(operation)) {
                if (operation.promises && operation.promises.length) {
                    (0, _deferred.when)(...operation.promises).done(operation.fn).then(operation.completePromise.resolve)
                } else {
                    operation.fn().done(operation.completePromise.resolve)
                }
            }
        }
        this._postponedOperations = {}
    }
}
exports.PostponedOperations = PostponedOperations;
