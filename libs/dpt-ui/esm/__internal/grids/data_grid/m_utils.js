/**
 * DevExtreme (esm/__internal/grids/data_grid/m_utils.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    normalizeSortingInfo
} from "../../../data/utils";
import gridCoreUtils from "../../grids/grid_core/m_utils";
export function createGroupFilter(path, storeLoadOptions) {
    const groups = normalizeSortingInfo(storeLoadOptions.group);
    const filter = [];
    for (let i = 0; i < path.length; i++) {
        filter.push([groups[i].selector, "=", path[i]])
    }
    if (storeLoadOptions.filter) {
        filter.push(storeLoadOptions.filter)
    }
    return gridCoreUtils.combineFilters(filter)
}
