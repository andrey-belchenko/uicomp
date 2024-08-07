/**
 * DevExtreme (cjs/__internal/ui/drawer/m_drawer.rendering.strategy.js)
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
var _deferred = require("../../../core/utils/deferred");
var _size = require("../../../core/utils/size");
var _m_drawer = require("./m_drawer.animation");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
class DrawerStrategy {
    constructor(drawer) {
        this._drawer = drawer
    }
    getDrawerInstance() {
        return this._drawer
    }
    renderPanelContent(whenPanelContentRendered) {
        const drawer = this.getDrawerInstance();
        const template = drawer._getTemplate(drawer.option("template"));
        if (template) {
            template.render({
                container: drawer.content(),
                onRendered: () => {
                    whenPanelContentRendered.resolve()
                }
            })
        }
    }
    renderPosition(changePositionUsingFxAnimation, animationDuration) {
        const whenPositionAnimationCompleted = (0, _deferred.Deferred)();
        const whenShaderAnimationCompleted = (0, _deferred.Deferred)();
        const drawer = this.getDrawerInstance();
        if (changePositionUsingFxAnimation) {
            _deferred.when.apply(_renderer.default, [whenPositionAnimationCompleted, whenShaderAnimationCompleted]).done((() => {
                drawer._animationCompleteHandler()
            }))
        }
        this._internalRenderPosition(changePositionUsingFxAnimation, whenPositionAnimationCompleted);
        if (!changePositionUsingFxAnimation) {
            drawer.resizeViewContent()
        }
        this.renderShaderVisibility(changePositionUsingFxAnimation, animationDuration, whenShaderAnimationCompleted)
    }
    _getPanelOffset(isDrawerOpened) {
        const drawer = this.getDrawerInstance();
        const size = drawer.isHorizontalDirection() ? drawer.getRealPanelWidth() : drawer.getRealPanelHeight();
        if (isDrawerOpened) {
            return -(size - drawer.getMaxSize())
        }
        return -(size - drawer.getMinSize())
    }
    _getPanelSize(isDrawerOpened) {
        return isDrawerOpened ? this.getDrawerInstance().getMaxSize() : this.getDrawerInstance().getMinSize()
    }
    renderShaderVisibility(changePositionUsingFxAnimation, duration, whenAnimationCompleted) {
        const drawer = this.getDrawerInstance();
        const isShaderVisible = drawer.option("opened");
        const fadeConfig = isShaderVisible ? {
            from: 0,
            to: 1
        } : {
            from: 1,
            to: 0
        };
        if (changePositionUsingFxAnimation) {
            _m_drawer.animation.fade((0, _renderer.default)(drawer._$shader), fadeConfig, duration, (() => {
                this._drawer._toggleShaderVisibility(isShaderVisible);
                whenAnimationCompleted.resolve()
            }))
        } else {
            drawer._toggleShaderVisibility(isShaderVisible);
            drawer._$shader.css("opacity", fadeConfig.to)
        }
    }
    getPanelContent() {
        return (0, _renderer.default)(this.getDrawerInstance().content())
    }
    setPanelSize(calcFromRealPanelSize) {
        this.refreshPanelElementSize(calcFromRealPanelSize)
    }
    refreshPanelElementSize(calcFromRealPanelSize) {
        const drawer = this.getDrawerInstance();
        const panelSize = this._getPanelSize(drawer.option("opened"));
        if (drawer.isHorizontalDirection()) {
            (0, _size.setWidth)((0, _renderer.default)(drawer.content()), calcFromRealPanelSize ? drawer.getRealPanelWidth() : panelSize)
        } else {
            (0, _size.setHeight)((0, _renderer.default)(drawer.content()), calcFromRealPanelSize ? drawer.getRealPanelHeight() : panelSize)
        }
    }
    isViewContentFirst() {
        return false
    }
    onPanelContentRendered() {}
}
var _default = exports.default = DrawerStrategy;
