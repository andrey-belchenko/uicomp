/**
 * DevExtreme (renovation/ui/pager/pager.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
exports.viewFunction = exports.Pager = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@dpt-ui/runtime/inferno");
var _resizable_container = require("./resizable_container");
var _pager_props = require("./common/pager_props");
var _content = require("./content");
var _combine_classes = require("../../utils/combine_classes");
const _excluded = ["className", "defaultPageIndex", "defaultPageSize", "displayMode", "gridCompatibility", "hasKnownLastPage", "infoText", "label", "lightModeEnabled", "maxPagesCount", "onKeyDown", "pageCount", "pageIndex", "pageIndexChange", "pageSize", "pageSizeChange", "pageSizes", "pagesCountText", "pagesNavigatorVisible", "rtlEnabled", "showInfo", "showNavigationButtons", "showPageSizes", "totalCount", "visible"];

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
const viewFunction = _ref => {
    let {
        pagerProps: pagerProps,
        restAttributes: restAttributes
    } = _ref;
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _resizable_container.ResizableContainer, _extends({
        contentTemplate: _content.PagerContent,
        pagerProps: pagerProps
    }, restAttributes)))
};
exports.viewFunction = viewFunction;
class Pager extends _inferno2.InfernoWrapperComponent {
    constructor(props) {
        super(props);
        this.__getterCache = {};
        this.state = {
            pageSize: void 0 !== this.props.pageSize ? this.props.pageSize : this.props.defaultPageSize,
            pageIndex: void 0 !== this.props.pageIndex ? this.props.pageIndex : this.props.defaultPageIndex
        };
        this.pageIndexChange = this.pageIndexChange.bind(this);
        this.pageSizeChange = this.pageSizeChange.bind(this)
    }
    createEffects() {
        return [(0, _inferno2.createReRenderEffect)()]
    }
    pageIndexChange(newPageIndex) {
        if (this.props.gridCompatibility) {
            let __newValue;
            this.setState((__state_argument => {
                __newValue = newPageIndex + 1;
                return {
                    pageIndex: __newValue
                }
            }));
            this.props.pageIndexChange(__newValue)
        } else {
            let __newValue;
            this.setState((__state_argument => {
                __newValue = newPageIndex;
                return {
                    pageIndex: __newValue
                }
            }));
            this.props.pageIndexChange(__newValue)
        }
    }
    get pageIndex() {
        if (this.props.gridCompatibility) {
            return (void 0 !== this.props.pageIndex ? this.props.pageIndex : this.state.pageIndex) - 1
        }
        return void 0 !== this.props.pageIndex ? this.props.pageIndex : this.state.pageIndex
    }
    pageSizeChange(newPageSize) {
        {
            let __newValue;
            this.setState((__state_argument => {
                __newValue = newPageSize;
                return {
                    pageSize: __newValue
                }
            }));
            this.props.pageSizeChange(__newValue)
        }
    }
    get className() {
        if (this.props.gridCompatibility) {
            return (0, _combine_classes.combineClasses)({
                "dx-datagrid-pager": true,
                [`${this.props.className}`]: !!this.props.className
            })
        }
        return this.props.className
    }
    get pagerProps() {
        if (void 0 !== this.__getterCache.pagerProps) {
            return this.__getterCache.pagerProps
        }
        return this.__getterCache.pagerProps = (() => _extends({}, _extends({}, this.props, {
            pageSize: void 0 !== this.props.pageSize ? this.props.pageSize : this.state.pageSize,
            pageIndex: void 0 !== this.props.pageIndex ? this.props.pageIndex : this.state.pageIndex
        }), {
            className: this.className,
            pageIndex: this.pageIndex,
            pageIndexChange: pageIndex => this.pageIndexChange(pageIndex),
            pageSizeChange: pageSize => this.pageSizeChange(pageSize)
        }))()
    }
    get restAttributes() {
        const _this$props$pageSize$ = _extends({}, this.props, {
                pageSize: void 0 !== this.props.pageSize ? this.props.pageSize : this.state.pageSize,
                pageIndex: void 0 !== this.props.pageIndex ? this.props.pageIndex : this.state.pageIndex
            }),
            restProps = _objectWithoutPropertiesLoose(_this$props$pageSize$, _excluded);
        return restProps
    }
    componentWillUpdate(nextProps, nextState, context) {
        super.componentWillUpdate();
        if (this.props !== nextProps || this.props.gridCompatibility !== nextProps.gridCompatibility || this.props.className !== nextProps.className || this.state.pageIndex !== nextState.pageIndex || this.props.pageIndex !== nextProps.pageIndex || this.props.pageIndexChange !== nextProps.pageIndexChange || this.props.pageSizeChange !== nextProps.pageSizeChange) {
            this.__getterCache.pagerProps = void 0
        }
    }
    render() {
        const props = this.props;
        return viewFunction({
            props: _extends({}, props, {
                pageSize: void 0 !== this.props.pageSize ? this.props.pageSize : this.state.pageSize,
                pageIndex: void 0 !== this.props.pageIndex ? this.props.pageIndex : this.state.pageIndex
            }),
            pageIndexChange: this.pageIndexChange,
            pageIndex: this.pageIndex,
            pageSizeChange: this.pageSizeChange,
            className: this.className,
            pagerProps: this.pagerProps,
            restAttributes: this.restAttributes
        })
    }
}
exports.Pager = Pager;
Pager.defaultProps = _pager_props.PagerProps;
