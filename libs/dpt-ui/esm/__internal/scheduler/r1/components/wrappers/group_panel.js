/**
 * DevExtreme (esm/__internal/scheduler/r1/components/wrappers/group_panel.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import registerComponent from "../../../../../core/component_registrator";
import {
    ComponentWrapper
} from "../../../../core/r1/index";
import {
    GroupPanel
} from "../base/group_panel";
export class GroupPanelComponent extends ComponentWrapper {
    _setOptionsByReference() {
        super._setOptionsByReference();
        this._optionsByReference = _extends({}, this._optionsByReference, {
            resourceCellTemplate: true
        })
    }
    get _propsInfo() {
        return {
            twoWay: [],
            allowNull: [],
            elements: [],
            templates: ["resourceCellTemplate"],
            props: ["viewContext", "groups", "groupOrientation", "groupPanelData", "groupByDate", "height", "className", "resourceCellTemplate"]
        }
    }
    get _viewComponent() {
        return GroupPanel
    }
}
registerComponent("dxGroupPanel", GroupPanelComponent);
