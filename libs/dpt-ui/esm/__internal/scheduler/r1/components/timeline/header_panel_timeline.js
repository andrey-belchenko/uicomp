/**
 * DevExtreme (esm/__internal/scheduler/r1/components/timeline/header_panel_timeline.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    createComponentVNode
} from "inferno";
import {
    createReRenderEffect,
    InfernoWrapperComponent
} from "@dpt-ui/runtime/inferno";
import {
    getTemplate
} from "../../../../core/r1/utils/index";
import {
    HeaderPanel,
    HeaderPanelDefaultProps
} from "../base/header_panel";
import {
    TimelineDateHeaderLayout
} from "./date_header_timeline";
export class HeaderPanelTimeline extends InfernoWrapperComponent {
    createEffects() {
        return [createReRenderEffect()]
    }
    render() {
        const {
            viewContext: viewContext,
            dateCellTemplate: dateCellTemplate,
            dateHeaderData: dateHeaderData,
            groupByDate: groupByDate,
            groupOrientation: groupOrientation,
            groupPanelData: groupPanelData,
            groups: groups,
            isRenderDateHeader: isRenderDateHeader,
            resourceCellTemplate: resourceCellTemplate,
            timeCellTemplate: timeCellTemplate
        } = this.props;
        const DateCellTemplateComponent = getTemplate(dateCellTemplate);
        const ResourceCellTemplateComponent = getTemplate(resourceCellTemplate);
        const TimeCellTemplateComponent = getTemplate(timeCellTemplate);
        return createComponentVNode(2, HeaderPanel, {
            viewContext: viewContext,
            dateHeaderData: dateHeaderData,
            groupPanelData: groupPanelData,
            groupByDate: groupByDate,
            groups: groups,
            groupOrientation: groupOrientation,
            isRenderDateHeader: isRenderDateHeader,
            dateHeaderTemplate: TimelineDateHeaderLayout,
            resourceCellTemplate: ResourceCellTemplateComponent,
            dateCellTemplate: DateCellTemplateComponent,
            timeCellTemplate: TimeCellTemplateComponent
        })
    }
}
HeaderPanelTimeline.defaultProps = HeaderPanelDefaultProps;
