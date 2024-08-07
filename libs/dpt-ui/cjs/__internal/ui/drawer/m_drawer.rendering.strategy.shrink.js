/**
 * DevExtreme (cjs/__internal/ui/drawer/m_drawer.rendering.strategy.shrink.js)
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
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _inflector = require("../../../core/utils/inflector");
var _m_drawer = require("./m_drawer.animation");
var _m_drawerRendering = _interopRequireDefault(require("./m_drawer.rendering.strategy"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
class ShrinkStrategy extends _m_drawerRendering.default {
    _internalRenderPosition(changePositionUsingFxAnimation, whenAnimationCompleted) {
        const drawer = this.getDrawerInstance();
        const direction = drawer.calcTargetPosition();
        const $panel = (0, _renderer.default)(drawer.content());
        const panelSize = this._getPanelSize(drawer.option("opened"));
        const panelOffset = this._getPanelOffset(drawer.option("opened"));
        const revealMode = drawer.option("revealMode");
        if (changePositionUsingFxAnimation) {
            if ("slide" === revealMode) {
                _m_drawer.animation.margin({
                    complete: () => {
                        whenAnimationCompleted.resolve()
                    },
                    $element: $panel,
                    duration: drawer.option("animationDuration"),
                    direction: direction,
                    margin: panelOffset
                })
            } else if ("expand" === revealMode) {
                _m_drawer.animation.size({
                    complete: () => {
                        whenAnimationCompleted.resolve()
                    },
                    $element: $panel,
                    duration: drawer.option("animationDuration"),
                    direction: direction,
                    size: panelSize
                })
            }
        } else if ("slide" === revealMode) {
            $panel.css(`margin${(0,_inflector.camelize)(direction,true)}`, panelOffset)
        } else if ("expand" === revealMode) {
            $panel.css(drawer.isHorizontalDirection() ? "width" : "height", panelSize)
        }
    }
    isViewContentFirst(position, isRtl) {
        return (isRtl ? "left" === position : "right" === position) || "bottom" === position
    }
}
var _default = exports.default = ShrinkStrategy;
