/**
 * DevExtreme (esm/__internal/grids/tree_list/m_virtual_scrolling.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import {
    extend
} from "../../../core/utils/extend";
import {
    data as virtualScrollingDataControllerExtender,
    dataSourceAdapterExtender as virtualScrollingDataSourceAdapterExtender,
    virtualScrollingModule
} from "../../grids/grid_core/virtual_scrolling/m_virtual_scrolling";
import dataSourceAdapterProvider from "./data_source_adapter/m_data_source_adapter";
import gridCore from "./m_core";
const oldDefaultOptions = virtualScrollingModule.defaultOptions;
virtualScrollingModule.extenders.controllers.data = Base => class extends(virtualScrollingDataControllerExtender(Base)) {
    _loadOnOptionChange() {
        var _this$_dataSource;
        const virtualScrollController = null === (_this$_dataSource = this._dataSource) || void 0 === _this$_dataSource ? void 0 : _this$_dataSource._virtualScrollController;
        null === virtualScrollController || void 0 === virtualScrollController || virtualScrollController.reset();
        super._loadOnOptionChange()
    }
};
const dataSourceAdapterExtender = Base => class extends(virtualScrollingDataSourceAdapterExtender(Base)) {
    changeRowExpand() {
        return super.changeRowExpand.apply(this, arguments).done((() => {
            const viewportItemIndex = this.getViewportItemIndex();
            viewportItemIndex >= 0 && this.setViewportItemIndex(viewportItemIndex)
        }))
    }
};
gridCore.registerModule("virtualScrolling", _extends({}, virtualScrollingModule, {
    defaultOptions: () => extend(true, oldDefaultOptions(), {
        scrolling: {
            mode: "virtual"
        }
    })
}));
dataSourceAdapterProvider.extend(dataSourceAdapterExtender);
