/**
 * DevExtreme (esm/renovation/ui/resizable/handle.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["direction", "disabled", "onResize", "onResizeEnd", "onResizeStart"];
import {
    createVNode
} from "inferno";
import {
    InfernoEffect,
    InfernoComponent
} from "@dpt-ui/runtime/inferno";
import {
    start as dragEventStart,
    move as dragEventMove,
    end as dragEventEnd
} from "../../../events/drag";
import {
    addNamespace
} from "../../../events/utils/index";
import eventsEngine from "../../../events/core/events_engine";
const namespace = "dxResizable";
const dragStartEvent = addNamespace(dragEventStart, namespace);
const dragEvent = addNamespace(dragEventMove, namespace);
const dragEndEvent = addNamespace(dragEventEnd, namespace);
export const viewFunction = viewModel => {
    const {
        mainRef: mainRef,
        props: props
    } = viewModel;
    const {
        direction: direction
    } = props;
    return createVNode(1, "div", `dx-resizable-handle dx-resizable-handle-${direction}`, null, 1, null, null, mainRef)
};
export const ResizableHandleProps = {
    direction: "top",
    disabled: false
};
import {
    convertRulesToOptions
} from "../../../core/options/utils";
import {
    createRef as infernoCreateRef
} from "inferno";
export class ResizableHandle extends InfernoComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.mainRef = infernoCreateRef();
        this.dragEventsEffect = this.dragEventsEffect.bind(this)
    }
    createEffects() {
        return [new InfernoEffect(this.dragEventsEffect, [this.props.disabled, this.props.onResize, this.props.onResizeEnd, this.props.onResizeStart])]
    }
    updateEffects() {
        var _this$_effects$;
        null === (_this$_effects$ = this._effects[0]) || void 0 === _this$_effects$ || _this$_effects$.update([this.props.disabled, this.props.onResize, this.props.onResizeEnd, this.props.onResizeStart])
    }
    dragEventsEffect() {
        const {
            disabled: disabled,
            onResize: onResize,
            onResizeEnd: onResizeEnd,
            onResizeStart: onResizeStart
        } = this.props;
        if (!disabled) {
            const handleEl = this.mainRef.current;
            const opts = {
                direction: "both",
                immediate: true
            };
            eventsEngine.on(handleEl, {
                [dragStartEvent]: event => {
                    eventsEngine.on(handleEl, {
                        [dragEvent]: onResize,
                        [dragEndEvent]: onResizeEnd
                    }, opts);
                    null === onResizeStart || void 0 === onResizeStart || onResizeStart(event)
                }
            }, opts);
            return () => eventsEngine.off(handleEl, void 0, void 0)
        }
        return
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
            mainRef: this.mainRef,
            restAttributes: this.restAttributes
        })
    }
}
ResizableHandle.defaultProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(ResizableHandleProps), Object.getOwnPropertyDescriptors(_extends({}, convertRulesToOptions([])))));
const __defaultOptionRules = [];
export function defaultOptions(rule) {
    __defaultOptionRules.push(rule);
    ResizableHandle.defaultProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(ResizableHandle.defaultProps), Object.getOwnPropertyDescriptors(convertRulesToOptions([])), Object.getOwnPropertyDescriptors(convertRulesToOptions(__defaultOptionRules))))
}
