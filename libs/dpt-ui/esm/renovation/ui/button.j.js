/**
 * DevExtreme (esm/renovation/ui/button.j.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import registerComponent from "../../core/component_registrator";
import BaseComponent from "../component_wrapper/button";
import {
    Button as ButtonComponent,
    defaultOptions
} from "./button";
export default class Button extends BaseComponent {
    getProps() {
        const props = super.getProps();
        props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
        return props
    }
    focus() {
        var _this$viewRef;
        return null === (_this$viewRef = this.viewRef) || void 0 === _this$viewRef ? void 0 : _this$viewRef.focus(...arguments)
    }
    activate() {
        var _this$viewRef2;
        return null === (_this$viewRef2 = this.viewRef) || void 0 === _this$viewRef2 ? void 0 : _this$viewRef2.activate(...arguments)
    }
    deactivate() {
        var _this$viewRef3;
        return null === (_this$viewRef3 = this.viewRef) || void 0 === _this$viewRef3 ? void 0 : _this$viewRef3.deactivate(...arguments)
    }
    _getActionConfigs() {
        return {
            onClick: {
                excludeValidators: ["readOnly"]
            },
            onSubmit: {}
        }
    }
    get _propsInfo() {
        return {
            twoWay: [],
            allowNull: [],
            elements: ["onSubmit"],
            templates: ["template", "iconTemplate"],
            props: ["activeStateEnabled", "hoverStateEnabled", "icon", "iconPosition", "onClick", "onSubmit", "pressed", "stylingMode", "template", "iconTemplate", "text", "type", "useInkRipple", "useSubmitBehavior", "templateData", "className", "accessKey", "disabled", "focusStateEnabled", "height", "hint", "onKeyDown", "rtlEnabled", "tabIndex", "visible", "width"]
        }
    }
    get _viewComponent() {
        return ButtonComponent
    }
}
registerComponent("dxButton", Button);
Button.defaultOptions = defaultOptions;
