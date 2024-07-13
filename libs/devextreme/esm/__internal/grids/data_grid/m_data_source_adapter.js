/**
 * DevExtreme (esm/__internal/grids/data_grid/m_data_source_adapter.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import DataSourceAdapter from "../../grids/grid_core/data_source_adapter/m_data_source_adapter";
let DataSourceAdapterType = DataSourceAdapter;
export default {
    extend(extender) {
        DataSourceAdapterType = extender(DataSourceAdapterType)
    },
    create: component => new DataSourceAdapterType(component)
};