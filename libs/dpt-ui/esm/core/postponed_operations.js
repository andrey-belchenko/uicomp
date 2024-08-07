/**
 * DevExtreme (esm/core/postponed_operations.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    Deferred,
    when
} from "./utils/deferred";
import {
    isDefined
} from "./utils/type";
export class PostponedOperations {
    constructor() {
        this._postponedOperations = {}
    }
    add(key, fn, postponedPromise) {
        if (key in this._postponedOperations) {
            postponedPromise && this._postponedOperations[key].promises.push(postponedPromise)
        } else {
            const completePromise = new Deferred;
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
            if (isDefined(operation)) {
                if (operation.promises && operation.promises.length) {
                    when(...operation.promises).done(operation.fn).then(operation.completePromise.resolve)
                } else {
                    operation.fn().done(operation.completePromise.resolve)
                }
            }
        }
        this._postponedOperations = {}
    }
}
