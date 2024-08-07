/**
 * DevExtreme (esm/__internal/scheduler/r1/components/base/group_panel_vertical.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    createVNode,
    createComponentVNode
} from "inferno";
import {
    BaseInfernoComponent,
    normalizeStyles
} from "@dpt-ui/runtime/inferno";
import {
    getTemplate
} from "../../../../core/r1/utils/index";
import {
    renderUtils
} from "../../utils/index";
import {
    GroupPanelBaseDefaultProps
} from "./group_panel_props";
import {
    GroupPanelVerticalRow
} from "./group_panel_vertical_row";
export class GroupPanelVertical extends BaseInfernoComponent {
    render() {
        const {
            className: className,
            elementRef: elementRef,
            groupPanelData: groupPanelData,
            resourceCellTemplate: resourceCellTemplate,
            height: height,
            styles: styles
        } = this.props;
        const style = normalizeStyles(renderUtils.addHeightToStyle(height, styles));
        const ResourceCellTemplateComponent = getTemplate(resourceCellTemplate);
        return createVNode(1, "div", className, createVNode(1, "div", "dx-scheduler-group-flex-container", groupPanelData.groupPanelItems.map((group => createComponentVNode(2, GroupPanelVerticalRow, {
            groupItems: group,
            cellTemplate: ResourceCellTemplateComponent
        }, group[0].key))), 0), 2, {
            style: style
        }, null, elementRef)
    }
}
GroupPanelVertical.defaultProps = GroupPanelBaseDefaultProps;
