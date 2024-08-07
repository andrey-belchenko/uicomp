/**
 * DevExtreme (cjs/__internal/ui/scroll_view/m_scroll_view.native.pull_down.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _translator = require("../../../animation/translator");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _callbacks = _interopRequireDefault(require("../../../core/utils/callbacks"));
var _deferred = require("../../../core/utils/deferred");
var _iterator = require("../../../core/utils/iterator");
var _load_indicator = _interopRequireDefault(require("../../../ui/load_indicator"));
var _m_scrollable = _interopRequireDefault(require("./m_scrollable.native"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const SCROLLVIEW_PULLDOWN_REFRESHING_CLASS = "dx-scrollview-pull-down-loading";
const SCROLLVIEW_PULLDOWN_READY_CLASS = "dx-scrollview-pull-down-ready";
const SCROLLVIEW_PULLDOWN_IMAGE_CLASS = "dx-scrollview-pull-down-image";
const SCROLLVIEW_PULLDOWN_INDICATOR_CLASS = "dx-scrollview-pull-down-indicator";
const SCROLLVIEW_PULLDOWN_TEXT_CLASS = "dx-scrollview-pull-down-text";
const SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS = "dx-scrollview-pull-down-text-visible";
const STATE_RELEASED = 0;
const STATE_READY = 1;
const STATE_REFRESHING = 2;
const STATE_LOADING = 3;
const PULLDOWN_RELEASE_TIME = 400;
const PullDownNativeScrollViewStrategy = _m_scrollable.default.inherit({
    _init(scrollView) {
        this.callBase(scrollView);
        this._$topPocket = scrollView._$topPocket;
        this._$pullDown = scrollView._$pullDown;
        this._$refreshingText = scrollView._$refreshingText;
        this._$scrollViewContent = (0, _renderer.default)(scrollView.content());
        this._$container = (0, _renderer.default)(scrollView.container());
        this._initCallbacks()
    },
    _initCallbacks() {
        this.pullDownCallbacks = (0, _callbacks.default)();
        this.releaseCallbacks = (0, _callbacks.default)();
        this.reachBottomCallbacks = (0, _callbacks.default)()
    },
    render() {
        this.callBase();
        this._renderPullDown();
        this._releaseState()
    },
    _renderPullDown() {
        const $image = (0, _renderer.default)("<div>").addClass("dx-scrollview-pull-down-image");
        const $loadContainer = (0, _renderer.default)("<div>").addClass("dx-scrollview-pull-down-indicator");
        const $loadIndicator = new _load_indicator.default((0, _renderer.default)("<div>")).$element();
        const $text = this._$pullDownText = (0, _renderer.default)("<div>").addClass("dx-scrollview-pull-down-text");
        this._$pullingDownText = (0, _renderer.default)("<div>").text(this.option("pullingDownText")).appendTo($text);
        this._$pulledDownText = (0, _renderer.default)("<div>").text(this.option("pulledDownText")).appendTo($text);
        this._$refreshingText = (0, _renderer.default)("<div>").text(this.option("refreshingText")).appendTo($text);
        this._$pullDown.empty().append($image).append($loadContainer.append($loadIndicator)).append($text)
    },
    _releaseState() {
        this._state = 0;
        this._refreshPullDownText()
    },
    _refreshPullDownText() {
        const that = this;
        const pullDownTextItems = [{
            element: this._$pullingDownText,
            visibleState: 0
        }, {
            element: this._$pulledDownText,
            visibleState: 1
        }, {
            element: this._$refreshingText,
            visibleState: 2
        }];
        (0, _iterator.each)(pullDownTextItems, ((_, item) => {
            const action = that._state === item.visibleState ? "addClass" : "removeClass";
            item.element[action]("dx-scrollview-pull-down-text-visible")
        }))
    },
    update() {
        this.callBase();
        this._setTopPocketOffset()
    },
    _updateDimensions() {
        this.callBase();
        this._topPocketSize = this._$topPocket.get(0).clientHeight;
        const contentEl = this._$scrollViewContent.get(0);
        const containerEl = this._$container.get(0);
        this._bottomBoundary = Math.max(contentEl.clientHeight - containerEl.clientHeight, 0)
    },
    _allowedDirections() {
        const allowedDirections = this.callBase();
        allowedDirections.vertical = allowedDirections.vertical || this._pullDownEnabled;
        return allowedDirections
    },
    _setTopPocketOffset() {
        this._$topPocket.css({
            top: -this._topPocketSize
        })
    },
    handleEnd() {
        this.callBase();
        this._complete()
    },
    handleStop() {
        this.callBase();
        this._complete()
    },
    _complete() {
        if (1 === this._state) {
            this._setPullDownOffset(this._topPocketSize);
            clearTimeout(this._pullDownRefreshTimeout);
            this._pullDownRefreshTimeout = setTimeout((() => {
                this._pullDownRefreshing()
            }), 400)
        }
    },
    _setPullDownOffset(offset) {
        (0, _translator.move)(this._$topPocket, {
            top: offset
        });
        (0, _translator.move)(this._$scrollViewContent, {
            top: offset
        })
    },
    handleScroll(e) {
        this.callBase(e);
        if (2 === this._state) {
            return
        }
        const currentLocation = this.location().top;
        const scrollDelta = (this._location || 0) - currentLocation;
        this._location = currentLocation;
        if (this._isPullDown()) {
            this._pullDownReady()
        } else if (scrollDelta > 0 && this._isReachBottom()) {
            this._reachBottom()
        } else {
            this._stateReleased()
        }
    },
    _isPullDown() {
        return this._pullDownEnabled && this._location >= this._topPocketSize
    },
    _isReachBottom() {
        return this._reachBottomEnabled && Math.round(this._bottomBoundary + Math.floor(this._location)) <= 1
    },
    _reachBottom() {
        if (3 === this._state) {
            return
        }
        this._state = 3;
        this.reachBottomCallbacks.fire()
    },
    _pullDownReady() {
        if (1 === this._state) {
            return
        }
        this._state = 1;
        this._$pullDown.addClass("dx-scrollview-pull-down-ready");
        this._refreshPullDownText()
    },
    _stateReleased() {
        if (0 === this._state) {
            return
        }
        this._$pullDown.removeClass("dx-scrollview-pull-down-loading").removeClass("dx-scrollview-pull-down-ready");
        this._releaseState()
    },
    _pullDownRefreshing() {
        if (2 === this._state) {
            return
        }
        this._state = 2;
        this._$pullDown.addClass("dx-scrollview-pull-down-loading").removeClass("dx-scrollview-pull-down-ready");
        this._refreshPullDownText();
        this.pullDownCallbacks.fire()
    },
    pullDownEnable(enabled) {
        if (enabled) {
            this._updateDimensions();
            this._setTopPocketOffset()
        }
        this._pullDownEnabled = enabled
    },
    reachBottomEnable(enabled) {
        this._reachBottomEnabled = enabled
    },
    pendingRelease() {
        this._state = 1
    },
    release() {
        const deferred = (0, _deferred.Deferred)();
        this._updateDimensions();
        clearTimeout(this._releaseTimeout);
        if (3 === this._state) {
            this._state = 0
        }
        this._releaseTimeout = setTimeout((() => {
            this._setPullDownOffset(0);
            this._stateReleased();
            this.releaseCallbacks.fire();
            this._updateAction();
            deferred.resolve()
        }), 400);
        return deferred.promise()
    },
    dispose() {
        clearTimeout(this._pullDownRefreshTimeout);
        clearTimeout(this._releaseTimeout);
        this.callBase()
    }
});
var _default = exports.default = PullDownNativeScrollViewStrategy;
