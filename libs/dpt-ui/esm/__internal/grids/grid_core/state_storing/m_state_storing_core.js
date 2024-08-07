/**
 * DevExtreme (esm/__internal/grids/grid_core/state_storing/m_state_storing_core.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    fromPromise
} from "../../../../core/utils/deferred";
import {
    extend
} from "../../../../core/utils/extend";
import {
    each
} from "../../../../core/utils/iterator";
import {
    sessionStorage
} from "../../../../core/utils/storage";
import {
    isDefined,
    isEmptyObject,
    isPlainObject
} from "../../../../core/utils/type";
import {
    getWindow
} from "../../../../core/utils/window";
import eventsEngine from "../../../../events/core/events_engine";
import errors from "../../../../ui/widget/ui.errors";
import modules from "../m_modules";
const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;
const parseDates = function(state) {
    if (!state) {
        return
    }
    each(state, ((key, value) => {
        if (isPlainObject(value) || Array.isArray(value)) {
            parseDates(value)
        } else if ("string" === typeof value) {
            const date = DATE_REGEX.exec(value);
            if (date) {
                state[key] = new Date(Date.UTC(+date[1], +date[2] - 1, +date[3], +date[4], +date[5], +date[6]))
            }
        }
    }))
};
const getStorage = function(options) {
    const storage = "sessionStorage" === options.type ? sessionStorage() : getWindow().localStorage;
    if (!storage) {
        throw new Error("E1007")
    }
    return storage
};
const getUniqueStorageKey = function(options) {
    return isDefined(options.storageKey) ? options.storageKey : "storage"
};
export class StateStoringController extends modules.ViewController {
    getDataController() {
        return this.getController("data")
    }
    getExportController() {
        return this.getController("export")
    }
    getColumnsController() {
        return this.getController("columns")
    }
    init() {
        this._state = {};
        this._isLoaded = false;
        this._isLoading = false;
        this._windowUnloadHandler = () => {
            if (void 0 !== this._savingTimeoutID) {
                this._saveState(this.state())
            }
        };
        eventsEngine.on(getWindow(), "unload", this._windowUnloadHandler);
        return this
    }
    optionChanged(args) {
        const that = this;
        if ("stateStoring" === args.name) {
            if (that.isEnabled() && !that.isLoading()) {
                that.load()
            }
            args.handled = true
        } else {
            super.optionChanged(args)
        }
    }
    dispose() {
        clearTimeout(this._savingTimeoutID);
        eventsEngine.off(getWindow(), "unload", this._windowUnloadHandler)
    }
    _loadState() {
        const options = this.option("stateStoring");
        if ("custom" === options.type) {
            return options.customLoad && options.customLoad()
        }
        try {
            return JSON.parse(getStorage(options).getItem(getUniqueStorageKey(options)))
        } catch (e) {
            errors.log("W1022", "State storing", e.message)
        }
    }
    _saveState(state) {
        const options = this.option("stateStoring");
        if ("custom" === options.type) {
            options.customSave && options.customSave(state);
            return
        }
        try {
            getStorage(options).setItem(getUniqueStorageKey(options), JSON.stringify(state))
        } catch (e) {
            errors.log(e.message)
        }
    }
    publicMethods() {
        return ["state"]
    }
    isEnabled() {
        return this.option("stateStoring.enabled")
    }
    isLoaded() {
        return this._isLoaded
    }
    isLoading() {
        return this._isLoading
    }
    load() {
        this._isLoading = true;
        const loadResult = fromPromise(this._loadState());
        loadResult.always((() => {
            this._isLoaded = true;
            this._isLoading = false
        })).done((state => {
            if (null !== state && !isEmptyObject(state)) {
                this.state(state)
            }
        }));
        return loadResult
    }
    state(state) {
        const that = this;
        if (!arguments.length) {
            return extend(true, {}, that._state)
        }
        that._state = extend({}, state);
        parseDates(that._state)
    }
    save() {
        const that = this;
        clearTimeout(that._savingTimeoutID);
        that._savingTimeoutID = setTimeout((() => {
            that._saveState(that.state());
            that._savingTimeoutID = void 0
        }), that.option("stateStoring.savingTimeout"))
    }
}
export default {
    StateStoringController: StateStoringController
};
