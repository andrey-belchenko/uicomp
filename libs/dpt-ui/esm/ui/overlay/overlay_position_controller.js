/**
 * DevExtreme (esm/ui/overlay/overlay_position_controller.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import $ from "../../core/renderer";
import {
    isDefined,
    isString,
    isWindow,
    isEvent
} from "../../core/utils/type";
import {
    extend
} from "../../core/utils/extend";
import positionUtils from "../../animation/position";
import {
    resetPosition,
    move,
    locate
} from "../../animation/translator";
import {
    getWindow
} from "../../core/utils/window";
import swatch from "../widget/swatch_container";
const window = getWindow();
const OVERLAY_POSITION_ALIASES = {
    top: {
        my: "top center",
        at: "top center"
    },
    bottom: {
        my: "bottom center",
        at: "bottom center"
    },
    right: {
        my: "right center",
        at: "right center"
    },
    left: {
        my: "left center",
        at: "left center"
    },
    center: {
        my: "center",
        at: "center"
    },
    "right bottom": {
        my: "right bottom",
        at: "right bottom"
    },
    "right top": {
        my: "right top",
        at: "right top"
    },
    "left bottom": {
        my: "left bottom",
        at: "left bottom"
    },
    "left top": {
        my: "left top",
        at: "left top"
    }
};
const OVERLAY_DEFAULT_BOUNDARY_OFFSET = {
    h: 0,
    v: 0
};
class OverlayPositionController {
    constructor(_ref) {
        let {
            position: position,
            container: container,
            visualContainer: visualContainer,
            $root: $root,
            $content: $content,
            $wrapper: $wrapper,
            onPositioned: onPositioned,
            onVisualPositionChanged: onVisualPositionChanged,
            restorePosition: restorePosition,
            _fixWrapperPosition: _fixWrapperPosition,
            _skipContentPositioning: _skipContentPositioning
        } = _ref;
        this._props = {
            position: position,
            container: container,
            visualContainer: visualContainer,
            restorePosition: restorePosition,
            onPositioned: onPositioned,
            onVisualPositionChanged: onVisualPositionChanged,
            _fixWrapperPosition: _fixWrapperPosition,
            _skipContentPositioning: _skipContentPositioning
        };
        this._$root = $root;
        this._$content = $content;
        this._$wrapper = $wrapper;
        this._$markupContainer = void 0;
        this._$visualContainer = void 0;
        this._shouldRenderContentInitialPosition = true;
        this._visualPosition = void 0;
        this._initialPosition = void 0;
        this._previousVisualPosition = void 0;
        this.updateContainer(container);
        this.updatePosition(position);
        this.updateVisualContainer(visualContainer)
    }
    get $container() {
        this.updateContainer();
        return this._$markupContainer
    }
    get $visualContainer() {
        return this._$visualContainer
    }
    get position() {
        return this._position
    }
    set fixWrapperPosition(fixWrapperPosition) {
        this._props._fixWrapperPosition = fixWrapperPosition;
        this.styleWrapperPosition()
    }
    set restorePosition(restorePosition) {
        this._props.restorePosition = restorePosition
    }
    restorePositionOnNextRender(value) {
        this._shouldRenderContentInitialPosition = value || !this._visualPosition
    }
    openingHandled() {
        const shouldRestorePosition = this._props.restorePosition;
        this.restorePositionOnNextRender(shouldRestorePosition)
    }
    updatePosition(positionProp) {
        this._props.position = positionProp;
        this._position = this._normalizePosition(positionProp);
        this.updateVisualContainer()
    }
    updateContainer() {
        let containerProp = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this._props.container;
        this._props.container = containerProp;
        this._$markupContainer = containerProp ? $(containerProp) : swatch.getSwatchContainer(this._$root);
        this.updateVisualContainer(this._props.visualContainer)
    }
    updateVisualContainer() {
        let visualContainer = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this._props.visualContainer;
        this._props.visualContainer = visualContainer;
        this._$visualContainer = this._getVisualContainer()
    }
    detectVisualPositionChange(event) {
        this._updateVisualPositionValue();
        this._raisePositionedEvents(event)
    }
    positionContent() {
        if (this._shouldRenderContentInitialPosition) {
            this._renderContentInitialPosition()
        } else {
            move(this._$content, this._visualPosition);
            this.detectVisualPositionChange()
        }
    }
    positionWrapper() {
        if (this._$visualContainer) {
            positionUtils.setup(this._$wrapper, {
                my: "top left",
                at: "top left",
                of: this._$visualContainer
            })
        }
    }
    styleWrapperPosition() {
        const useFixed = isWindow(this.$visualContainer.get(0)) || this._props._fixWrapperPosition;
        const positionStyle = useFixed ? "fixed" : "absolute";
        this._$wrapper.css("position", positionStyle)
    }
    _updateVisualPositionValue() {
        this._previousVisualPosition = this._visualPosition;
        this._visualPosition = locate(this._$content)
    }
    _renderContentInitialPosition() {
        this._renderBoundaryOffset();
        resetPosition(this._$content);
        const wrapperOverflow = this._$wrapper.css("overflow");
        this._$wrapper.css("overflow", "hidden");
        if (!this._props._skipContentPositioning) {
            const resultPosition = positionUtils.setup(this._$content, this._position);
            this._initialPosition = resultPosition
        }
        this._$wrapper.css("overflow", wrapperOverflow);
        this.detectVisualPositionChange()
    }
    _raisePositionedEvents(event) {
        const previousPosition = this._previousVisualPosition;
        const newPosition = this._visualPosition;
        const isVisualPositionChanged = (null === previousPosition || void 0 === previousPosition ? void 0 : previousPosition.top) !== newPosition.top || (null === previousPosition || void 0 === previousPosition ? void 0 : previousPosition.left) !== newPosition.left;
        if (isVisualPositionChanged) {
            this._props.onVisualPositionChanged({
                previousPosition: previousPosition,
                position: newPosition,
                event: event
            })
        }
        this._props.onPositioned({
            position: this._initialPosition
        })
    }
    _renderBoundaryOffset() {
        const boundaryOffset = this._position ?? {
            boundaryOffset: OVERLAY_DEFAULT_BOUNDARY_OFFSET
        };
        this._$content.css("margin", `${boundaryOffset.v}px ${boundaryOffset.h}px`)
    }
    _getVisualContainer() {
        var _this$_props$position, _this$_props$position2;
        const containerProp = this._props.container;
        const visualContainerProp = this._props.visualContainer;
        const positionOf = isEvent(null === (_this$_props$position = this._props.position) || void 0 === _this$_props$position ? void 0 : _this$_props$position.of) ? this._props.position.of.target : null === (_this$_props$position2 = this._props.position) || void 0 === _this$_props$position2 ? void 0 : _this$_props$position2.of;
        if (visualContainerProp) {
            return $(visualContainerProp)
        }
        if (containerProp) {
            return $(containerProp)
        }
        if (positionOf) {
            return $(positionOf)
        }
        return $(window)
    }
    _normalizePosition(positionProp) {
        const defaultPositionConfig = {
            boundaryOffset: OVERLAY_DEFAULT_BOUNDARY_OFFSET
        };
        if (isDefined(positionProp)) {
            return extend(true, {}, defaultPositionConfig, this._positionToObject(positionProp))
        } else {
            return defaultPositionConfig
        }
    }
    _positionToObject(position) {
        if (isString(position)) {
            return extend({}, OVERLAY_POSITION_ALIASES[position])
        }
        return position
    }
}
export {
    OVERLAY_POSITION_ALIASES,
    OverlayPositionController
};
