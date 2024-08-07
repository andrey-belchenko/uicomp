/**
 * DevExtreme (renovation/ui/responsive_box/responsive_box.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
exports.viewFunction = exports.ResponsiveBox = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@dpt-ui/runtime/inferno");
var _widget = require("../common/widget");
var _responsive_box_props = require("./responsive_box_props");
var _combine_classes = require("../../utils/combine_classes");
var _box = require("../box/box");
var _window = require("../../../core/utils/window");
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _screen_utils = require("./screen_utils");
const _excluded = ["screenByWidth"];

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}

function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key]
                }
            }
        }
        return target
    };
    return _extends.apply(this, arguments)
}

function _objectWithoutPropertiesLoose(source, excluded) {
    if (null == source) {
        return {}
    }
    var target = {};
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (excluded.indexOf(key) >= 0) {
                continue
            }
            target[key] = source[key]
        }
    }
    return target
}
const HD_SCREEN_WIDTH = 1920;
const RESPONSIVE_BOX_CLASS = "dx-responsivebox";
const SCREEN_SIZE_CLASS_PREFIX = "dx-responsivebox-screen-";
const viewFunction = viewModel => {
    const screenSizeQualifier = (() => {
        const screenWidth = (0, _window.hasWindow)() ? _dom_adapter.default.getDocumentElement().clientWidth : 1920;
        const screenSizeFunc = viewModel.props.screenByWidth ?? _screen_utils.convertToScreenSizeQualifier;
        return screenSizeFunc(screenWidth)
    })();
    const cssClasses = (0, _combine_classes.combineClasses)({
        [RESPONSIVE_BOX_CLASS]: true,
        [SCREEN_SIZE_CLASS_PREFIX + screenSizeQualifier]: true
    });
    return (0, _inferno.createComponentVNode)(2, _widget.Widget, {
        classes: cssClasses,
        children: (0, _inferno.createComponentVNode)(2, _box.Box)
    })
};
exports.viewFunction = viewFunction;
class ResponsiveBox extends _inferno2.InfernoWrapperComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    createEffects() {
        return [(0, _inferno2.createReRenderEffect)()]
    }
    get restAttributes() {
        const _this$props = this.props,
            restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
        return restProps
    }
    render() {
        const props = this.props;
        return viewFunction({
            props: _extends({}, props),
            restAttributes: this.restAttributes
        })
    }
}
exports.ResponsiveBox = ResponsiveBox;
ResponsiveBox.defaultProps = _responsive_box_props.ResponsiveBoxProps;
