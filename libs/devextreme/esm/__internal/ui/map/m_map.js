/**
 * DevExtreme (esm/__internal/ui/map/m_map.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import registerComponent from "../../../core/component_registrator";
import devices from "../../../core/devices";
import $ from "../../../core/renderer";
import {
    wrapToArray
} from "../../../core/utils/array";
import {
    noop
} from "../../../core/utils/common";
import {
    fromPromise
} from "../../../core/utils/deferred";
import {
    extend
} from "../../../core/utils/extend";
import {
    titleize
} from "../../../core/utils/inflector";
import {
    each
} from "../../../core/utils/iterator";
import {
    isNumeric
} from "../../../core/utils/type";
import eventsEngine from "../../../events/core/events_engine";
import pointerEvents from "../../../events/pointer";
import {
    addNamespace
} from "../../../events/utils/index";
import errors from "../../../ui/widget/ui.errors";
import Widget from "../../../ui/widget/ui.widget";
import bing from "./m_provider.dynamic.bing";
import google from "./m_provider.dynamic.google";
import googleStatic from "./m_provider.google_static";
const PROVIDERS = {
    googleStatic: googleStatic,
    google: google,
    bing: bing
};
const MAP_CLASS = "dx-map";
const MAP_CONTAINER_CLASS = "dx-map-container";
const MAP_SHIELD_CLASS = "dx-map-shield";
const Map = Widget.inherit({
    _getDefaultOptions() {
        return extend(this.callBase(), {
            bounds: {
                northEast: null,
                southWest: null
            },
            center: {
                lat: 0,
                lng: 0
            },
            zoom: 1,
            width: 300,
            height: 300,
            type: "roadmap",
            provider: "google",
            autoAdjust: true,
            markers: [],
            markerIconSrc: null,
            onMarkerAdded: null,
            onMarkerRemoved: null,
            routes: [],
            onRouteAdded: null,
            onRouteRemoved: null,
            apiKey: {
                bing: "",
                google: "",
                googleStatic: ""
            },
            controls: false,
            onReady: null,
            onUpdated: null,
            onClick: null
        })
    },
    _defaultOptionsRules() {
        return this.callBase().concat([{
            device: () => "desktop" === devices.real().deviceType && !devices.isSimulator(),
            options: {
                focusStateEnabled: true
            }
        }])
    },
    _renderFocusTarget: noop,
    _init() {
        this.callBase();
        this.$element().addClass("dx-map");
        this._lastAsyncAction = Promise.resolve();
        this._checkOption("provider");
        this._checkOption("markers");
        this._checkOption("routes");
        this._initContainer();
        this._grabEvents();
        this._rendered = {}
    },
    _useTemplates: () => false,
    _checkOption(option) {
        const value = this.option(option);
        if ("markers" === option && !Array.isArray(value)) {
            throw errors.Error("E1022")
        }
        if ("routes" === option && !Array.isArray(value)) {
            throw errors.Error("E1023")
        }
    },
    _initContainer() {
        this._$container = $("<div>").addClass("dx-map-container");
        this.$element().append(this._$container)
    },
    _grabEvents() {
        const eventName = addNamespace(pointerEvents.down, this.NAME);
        eventsEngine.on(this.$element(), eventName, this._cancelEvent.bind(this))
    },
    _cancelEvent(e) {
        const cancelByProvider = this._provider && this._provider.isEventsCanceled(e) && !this.option("disabled");
        if (cancelByProvider) {
            e.stopPropagation()
        }
    },
    _saveRendered(option) {
        const value = this.option(option);
        this._rendered[option] = value.slice()
    },
    _render() {
        this.callBase();
        this._renderShield();
        this._saveRendered("markers");
        this._saveRendered("routes");
        this._provider = new(PROVIDERS[this.option("provider")])(this, this._$container);
        this._queueAsyncAction("render", this._rendered.markers, this._rendered.routes)
    },
    _renderShield() {
        let $shield;
        if (this.option("disabled")) {
            $shield = $("<div>").addClass("dx-map-shield");
            this.$element().append($shield)
        } else {
            $shield = this.$element().find(".dx-map-shield");
            $shield.remove()
        }
    },
    _clean() {
        this._cleanFocusState();
        if (this._provider) {
            this._provider.clean()
        }
        this._provider = null;
        this._lastAsyncAction = Promise.resolve();
        this.setOptionSilent("bounds", {
            northEast: null,
            southWest: null
        });
        delete this._suppressAsyncAction
    },
    _optionChanged(args) {
        const {
            name: name
        } = args;
        const changeBag = this._optionChangeBag;
        this._optionChangeBag = null;
        switch (name) {
            case "disabled":
                this._renderShield();
                this.callBase(args);
                break;
            case "width":
            case "height":
                this.callBase(args);
                this._dimensionChanged();
                break;
            case "provider":
                this._suppressAsyncAction = true;
                this._invalidate();
                break;
            case "apiKey":
                errors.log("W1001");
                break;
            case "bounds":
                this._queueAsyncAction("updateBounds");
                break;
            case "center":
                this._queueAsyncAction("updateCenter");
                break;
            case "zoom":
                this._queueAsyncAction("updateZoom");
                break;
            case "type":
                this._queueAsyncAction("updateMapType");
                break;
            case "controls":
                this._queueAsyncAction("updateControls", this._rendered.markers, this._rendered.routes);
                break;
            case "autoAdjust":
                this._queueAsyncAction("adjustViewport");
                break;
            case "markers":
            case "routes": {
                this._checkOption(name);
                const prevValue = this._rendered[name];
                this._saveRendered(name);
                this._queueAsyncAction(`update${titleize(name)}`, changeBag ? changeBag.removed : prevValue, changeBag ? changeBag.added : this._rendered[name]).then((result => {
                    if (changeBag) {
                        changeBag.resolve(result)
                    }
                }));
                break
            }
            case "markerIconSrc":
                this._queueAsyncAction("updateMarkers", this._rendered.markers, this._rendered.markers);
                break;
            case "onReady":
            case "onUpdated":
            case "onMarkerAdded":
            case "onMarkerRemoved":
            case "onRouteAdded":
            case "onRouteRemoved":
            case "onClick":
                break;
            default:
                this.callBase.apply(this, arguments)
        }
    },
    _visibilityChanged(visible) {
        if (visible) {
            this._dimensionChanged()
        }
    },
    _dimensionChanged() {
        this._queueAsyncAction("updateDimensions")
    },
    _queueAsyncAction(name) {
        const options = [].slice.call(arguments).slice(1);
        const isActionSuppressed = this._suppressAsyncAction;
        this._lastAsyncAction = this._lastAsyncAction.then((() => {
            if (!this._provider || isActionSuppressed) {
                return Promise.resolve()
            }
            return this._provider[name].apply(this._provider, options).then((result => {
                result = wrapToArray(result);
                const mapRefreshed = result[0];
                if (mapRefreshed && !this._disposed) {
                    this._triggerReadyAction()
                }
                return result[1]
            }))
        }));
        return this._lastAsyncAction
    },
    _triggerReadyAction() {
        this._createActionByOption("onReady")({
            originalMap: this._provider.map()
        })
    },
    _triggerUpdateAction() {
        this._createActionByOption("onUpdated")()
    },
    setOptionSilent(name, value) {
        this._setOptionWithoutOptionChange(name, value)
    },
    addMarker(marker) {
        return this._addFunction("markers", marker)
    },
    removeMarker(marker) {
        return this._removeFunction("markers", marker)
    },
    addRoute(route) {
        return this._addFunction("routes", route)
    },
    removeRoute(route) {
        return this._removeFunction("routes", route)
    },
    _addFunction(optionName, addingValue) {
        const optionValue = this.option(optionName);
        const addingValues = wrapToArray(addingValue);
        optionValue.push.apply(optionValue, addingValues);
        return this._partialArrayOptionChange(optionName, optionValue, addingValues, [])
    },
    _removeFunction(optionName, removingValue) {
        const optionValue = this.option(optionName);
        const removingValues = wrapToArray(removingValue);
        each(removingValues, ((removingIndex, removingValue) => {
            const index = isNumeric(removingValue) ? removingValue : null === optionValue || void 0 === optionValue ? void 0 : optionValue.indexOf(removingValue);
            if (-1 !== index) {
                const removing = optionValue.splice(index, 1)[0];
                removingValues.splice(removingIndex, 1, removing)
            } else {
                throw errors.log("E1021", titleize(optionName.substring(0, optionName.length - 1)), removingValue)
            }
        }));
        return this._partialArrayOptionChange(optionName, optionValue, [], removingValues)
    },
    _partialArrayOptionChange(optionName, optionValue, addingValues, removingValues) {
        return fromPromise(new Promise((resolve => {
            this._optionChangeBag = {
                resolve: resolve,
                added: addingValues,
                removed: removingValues
            };
            this.option(optionName, optionValue)
        })).then((result => result && 1 === result.length ? result[0] : result)), this)
    }
});
registerComponent("dxMap", Map);
export default Map;
