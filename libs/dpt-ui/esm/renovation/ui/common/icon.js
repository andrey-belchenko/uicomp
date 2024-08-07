/**
 * DevExtreme (esm/renovation/ui/common/icon.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["iconTemplate", "position", "source"];
import {
    createVNode,
    createFragment,
    createComponentVNode,
    normalizeProps
} from "inferno";
import {
    Fragment
} from "inferno";
import {
    BaseInfernoComponent
} from "@dpt-ui/runtime/inferno";
import {
    getImageSourceType
} from "../../../core/utils/icon";
import {
    combineClasses
} from "../../utils/combine_classes";
export const viewFunction = _ref => {
    let {
        iconClassName: iconClassName,
        props: {
            iconTemplate: IconTemplate,
            source: source
        },
        sourceType: sourceType
    } = _ref;
    return createFragment(["dxIcon" === sourceType && createVNode(1, "i", iconClassName), "fontIcon" === sourceType && createVNode(1, "i", iconClassName), "image" === sourceType && createVNode(1, "img", iconClassName, null, 1, {
        alt: "",
        src: source
    }), IconTemplate && createVNode(1, "i", iconClassName, IconTemplate({}), 0)], 0)
};
export const IconProps = {
    position: "left",
    source: ""
};
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);
export class Icon extends BaseInfernoComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    get sourceType() {
        return getImageSourceType(this.props.source)
    }
    get cssClass() {
        return "left" !== this.props.position ? "dx-icon-right" : ""
    }
    get iconClassName() {
        const generalClasses = {
            "dx-icon": true,
            [this.cssClass]: !!this.cssClass
        };
        const {
            source: source
        } = this.props;
        if ("dxIcon" === this.sourceType) {
            return combineClasses(_extends({}, generalClasses, {
                [`dx-icon-${source}`]: true
            }))
        }
        if ("fontIcon" === this.sourceType) {
            return combineClasses(_extends({}, generalClasses, {
                [String(source)]: !!source
            }))
        }
        if ("image" === this.sourceType) {
            return combineClasses(generalClasses)
        }
        if ("svg" === this.sourceType) {
            return combineClasses(_extends({}, generalClasses, {
                "dx-svg-icon": true
            }))
        }
        return ""
    }
    get restAttributes() {
        const _this$props = this.props,
            restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
        return restProps
    }
    render() {
        const props = this.props;
        return viewFunction({
            props: _extends({}, props, {
                iconTemplate: getTemplate(props.iconTemplate)
            }),
            sourceType: this.sourceType,
            cssClass: this.cssClass,
            iconClassName: this.iconClassName,
            restAttributes: this.restAttributes
        })
    }
}
Icon.defaultProps = IconProps;
