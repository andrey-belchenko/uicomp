/**
 * DevExtreme (cjs/__internal/scheduler/r1/components/wrappers/header_panel_timeline.js)
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
exports.HeaderPanelTimelineComponent = void 0;
var _component_registrator = _interopRequireDefault(require("../../../../../core/component_registrator"));
var _header_panel_timeline = require("../timeline/header_panel_timeline");
var _header_panel = require("./header_panel");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
class HeaderPanelTimelineComponent extends _header_panel.HeaderPanelComponent {
    get _propsInfo() {
        return {
            twoWay: [],
            allowNull: [],
            elements: [],
            templates: ["dateCellTemplate", "timeCellTemplate", "dateHeaderTemplate", "resourceCellTemplate"],
            props: ["viewContext", "dateHeaderData", "isRenderDateHeader", "dateCellTemplate", "timeCellTemplate", "dateHeaderTemplate", "groups", "groupOrientation", "groupPanelData", "groupByDate", "height", "className", "resourceCellTemplate"]
        }
    }
    get _viewComponent() {
        return _header_panel_timeline.HeaderPanelTimeline
    }
}
exports.HeaderPanelTimelineComponent = HeaderPanelTimelineComponent;
(0, _component_registrator.default)("dxTimelineHeaderPanelLayout", HeaderPanelTimelineComponent);
