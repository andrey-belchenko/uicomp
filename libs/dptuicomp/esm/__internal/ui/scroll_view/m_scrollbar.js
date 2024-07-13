/**
 * DevExtreme (esm/__internal/ui/scroll_view/m_scrollbar.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    move
} from "../../../animation/translator";
import domAdapter from "../../../core/dom_adapter";
import $ from "../../../core/renderer";
import {
    deferRenderer
} from "../../../core/utils/common";
import {
    extend
} from "../../../core/utils/extend";
import readyCallback from "../../../core/utils/ready_callbacks";
import {
    isPlainObject
} from "../../../core/utils/type";
import eventsEngine from "../../../events/core/events_engine";
import pointerEvents from "../../../events/pointer";
import {
    addNamespace
} from "../../../events/utils/index";
import Widget from "../../../ui/widget/ui.widget";
const SCROLLBAR = "dxScrollbar";
const SCROLLABLE_SCROLLBAR_CLASS = "dx-scrollable-scrollbar";
const SCROLLABLE_SCROLLBAR_ACTIVE_CLASS = "dx-scrollable-scrollbar-active";
const SCROLLABLE_SCROLL_CLASS = "dx-scrollable-scroll";
const SCROLLABLE_SCROLL_CONTENT_CLASS = "dx-scrollable-scroll-content";
const HOVER_ENABLED_STATE = "dx-scrollbar-hoverable";
const HORIZONTAL = "horizontal";
const THUMB_MIN_SIZE = 15;
const SCROLLBAR_VISIBLE = {
    onScroll: "onScroll",
    onHover: "onHover",
    always: "always",
    never: "never"
};
let activeScrollbar = null;
const Scrollbar = Widget.inherit({
    _getDefaultOptions() {
        return extend(this.callBase(), {
            direction: null,
            visible: false,
            activeStateEnabled: false,
            visibilityMode: SCROLLBAR_VISIBLE.onScroll,
            containerSize: 0,
            contentSize: 0,
            expandable: true,
            scaleRatio: 1
        })
    },
    _init() {
        this.callBase();
        this._isHovered = false
    },
    _initMarkup() {
        this._renderThumb();
        this.callBase()
    },
    _render() {
        this.callBase();
        this._renderDirection();
        this._update();
        this._attachPointerDownHandler();
        this.option("hoverStateEnabled", this._isHoverMode());
        this.$element().toggleClass(HOVER_ENABLED_STATE, this.option("hoverStateEnabled"))
    },
    _renderThumb() {
        this._$thumb = $("<div>").addClass("dx-scrollable-scroll");
        $("<div>").addClass("dx-scrollable-scroll-content").appendTo(this._$thumb);
        this.$element().addClass("dx-scrollable-scrollbar").append(this._$thumb)
    },
    isThumb($element) {
        return !!this.$element().find($element).length
    },
    _isHoverMode() {
        const visibilityMode = this.option("visibilityMode");
        return (visibilityMode === SCROLLBAR_VISIBLE.onHover || visibilityMode === SCROLLBAR_VISIBLE.always) && this.option("expandable")
    },
    _renderDirection() {
        const direction = this.option("direction");
        this.$element().addClass(`dx-scrollbar-${direction}`);
        this._dimension = direction === HORIZONTAL ? "width" : "height";
        this._prop = direction === HORIZONTAL ? "left" : "top"
    },
    _attachPointerDownHandler() {
        eventsEngine.on(this._$thumb, addNamespace(pointerEvents.down, SCROLLBAR), this.feedbackOn.bind(this))
    },
    feedbackOn() {
        this.$element().addClass("dx-scrollable-scrollbar-active");
        activeScrollbar = this
    },
    feedbackOff() {
        this.$element().removeClass("dx-scrollable-scrollbar-active");
        activeScrollbar = null
    },
    cursorEnter() {
        this._isHovered = true;
        if (this._needScrollbar()) {
            this.option("visible", true)
        }
    },
    cursorLeave() {
        this._isHovered = false;
        this.option("visible", false)
    },
    _renderDimensions() {
        this._$thumb.css({
            width: this.option("width"),
            height: this.option("height")
        })
    },
    _toggleVisibility(visible) {
        if (this.option("visibilityMode") === SCROLLBAR_VISIBLE.onScroll) {
            this._$thumb.css("opacity")
        }
        visible = this._adjustVisibility(visible);
        this.option().visible = visible;
        this._$thumb.toggleClass("dx-state-invisible", !visible)
    },
    _adjustVisibility(visible) {
        if (this._baseContainerToContentRatio && !this._needScrollbar()) {
            return false
        }
        switch (this.option("visibilityMode")) {
            case SCROLLBAR_VISIBLE.onScroll:
                break;
            case SCROLLBAR_VISIBLE.onHover:
                visible = visible || !!this._isHovered;
                break;
            case SCROLLBAR_VISIBLE.never:
                visible = false;
                break;
            case SCROLLBAR_VISIBLE.always:
                visible = true
        }
        return visible
    },
    moveTo(location) {
        if (this._isHidden()) {
            return
        }
        if (isPlainObject(location)) {
            location = location[this._prop] || 0
        }
        const scrollBarLocation = {};
        scrollBarLocation[this._prop] = this._calculateScrollBarPosition(location);
        move(this._$thumb, scrollBarLocation)
    },
    _calculateScrollBarPosition(location) {
        return -location * this._thumbRatio
    },
    _update() {
        const containerSize = Math.round(this.option("containerSize"));
        const contentSize = Math.round(this.option("contentSize"));
        let baseContainerSize = Math.round(this.option("baseContainerSize"));
        let baseContentSize = Math.round(this.option("baseContentSize"));
        if (isNaN(baseContainerSize)) {
            baseContainerSize = containerSize;
            baseContentSize = contentSize
        }
        this._baseContainerToContentRatio = baseContentSize ? baseContainerSize / baseContentSize : baseContainerSize;
        this._realContainerToContentRatio = contentSize ? containerSize / contentSize : containerSize;
        const thumbSize = Math.round(Math.max(Math.round(containerSize * this._realContainerToContentRatio), 15));
        this._thumbRatio = (containerSize - thumbSize) / (this.option("scaleRatio") * (contentSize - containerSize));
        this.option(this._dimension, thumbSize / this.option("scaleRatio"));
        this.$element().css("display", this._needScrollbar() ? "" : "none")
    },
    _isHidden() {
        return this.option("visibilityMode") === SCROLLBAR_VISIBLE.never
    },
    _needScrollbar() {
        return !this._isHidden() && this._baseContainerToContentRatio < 1
    },
    containerToContentRatio() {
        return this._realContainerToContentRatio
    },
    _normalizeSize(size) {
        return isPlainObject(size) ? size[this._dimension] || 0 : size
    },
    _clean() {
        this.callBase();
        if (this === activeScrollbar) {
            activeScrollbar = null
        }
        eventsEngine.off(this._$thumb, `.${SCROLLBAR}`)
    },
    _optionChanged(args) {
        if (this._isHidden()) {
            return
        }
        switch (args.name) {
            case "containerSize":
            case "contentSize":
                this.option()[args.name] = this._normalizeSize(args.value);
                this._update();
                break;
            case "baseContentSize":
            case "baseContainerSize":
            case "scaleRatio":
                this._update();
                break;
            case "visibilityMode":
            case "direction":
                this._invalidate();
                break;
            default:
                this.callBase.apply(this, arguments)
        }
    },
    update: deferRenderer((function() {
        this._adjustVisibility() && this.option("visible", true)
    }))
});
readyCallback.add((() => {
    eventsEngine.subscribeGlobal(domAdapter.getDocument(), addNamespace(pointerEvents.up, SCROLLBAR), (() => {
        if (activeScrollbar) {
            activeScrollbar.feedbackOff()
        }
    }))
}));
export default Scrollbar;