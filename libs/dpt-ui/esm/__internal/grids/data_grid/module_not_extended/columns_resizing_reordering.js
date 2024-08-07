/**
 * DevExtreme (esm/__internal/grids/data_grid/module_not_extended/columns_resizing_reordering.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    columnsResizingReorderingModule
} from "../../../grids/grid_core/columns_resizing_reordering/m_columns_resizing_reordering";
import gridCore from "../m_core";
export const DraggingHeaderView = columnsResizingReorderingModule.views.draggingHeaderView;
export const DraggingHeaderViewController = columnsResizingReorderingModule.controllers.draggingHeader;
export const ColumnsSeparatorView = columnsResizingReorderingModule.views.columnsSeparatorView;
export const TablePositionViewController = columnsResizingReorderingModule.controllers.tablePosition;
export const ColumnsResizerViewController = columnsResizingReorderingModule.controllers.columnsResizer;
export const TrackerView = columnsResizingReorderingModule.views.trackerView;
gridCore.registerModule("columnsResizingReordering", columnsResizingReorderingModule);
export default {
    DraggingHeaderView: DraggingHeaderView,
    DraggingHeaderViewController: DraggingHeaderViewController,
    ColumnsSeparatorView: ColumnsSeparatorView,
    TablePositionViewController: TablePositionViewController,
    ColumnsResizerViewController: ColumnsResizerViewController,
    TrackerView: TrackerView
};
