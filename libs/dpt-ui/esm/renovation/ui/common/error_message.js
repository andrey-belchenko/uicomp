/**
 * DevExtreme (esm/renovation/ui/common/error_message.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["className", "message"];
import {
    createVNode,
    normalizeProps
} from "inferno";
import {
    BaseInfernoComponent
} from "@dpt-ui/runtime/inferno";
export const viewFunction = _ref => {
    let {
        props: {
            className: className,
            message: message
        },
        restAttributes: restAttributes
    } = _ref;
    return normalizeProps(createVNode(1, "div", `dx-validationsummary dx-validationsummary-item ${className}`, message, 0, _extends({}, restAttributes)))
};
export const ErrorMessageProps = {
    className: "",
    message: ""
};
export class ErrorMessage extends BaseInfernoComponent {
    constructor(props) {
        super(props);
        this.state = {}
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
ErrorMessage.defaultProps = ErrorMessageProps;
