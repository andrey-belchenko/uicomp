/**
 * DevExtreme (esm/__internal/grids/pivot_grid/summary_display_modes/m_summary_display_modes.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    extend
} from "../../../../core/utils/extend";
import {
    isDefined,
    isFunction,
    isObject
} from "../../../../core/utils/type";
import pivotGridUtils, {
    findField,
    foreachTree
} from "../m_widget_utils";
const COLUMN = "column";
const ROW = "row";
const NULL = null;
const calculatePercentValue = function(value, totalValue) {
    let result = value / totalValue;
    if (!isDefined(value) || isNaN(result)) {
        result = NULL
    }
    return result
};
const percentOfGrandTotal = function(e, dimension) {
    return calculatePercentValue(e.value(), e.grandTotal(dimension).value())
};
const percentOfParent = function(e, dimension) {
    const parent = e.parent(dimension);
    const parentValue = parent ? parent.value() : e.value();
    return calculatePercentValue(e.value(), parentValue)
};
const createAbsoluteVariationExp = function(allowCrossGroup) {
    return function(e) {
        const prevCell = e.prev(COLUMN, allowCrossGroup);
        const prevValue = prevCell && prevCell.value();
        if (isDefined(prevValue) && isDefined(e.value())) {
            return e.value() - prevValue
        }
        return NULL
    }
};
const createPercentVariationExp = function(allowCrossGroup) {
    const absoluteExp = createAbsoluteVariationExp(allowCrossGroup);
    return function(e) {
        const absVar = absoluteExp(e);
        const prevCell = e.prev(COLUMN, allowCrossGroup);
        const prevValue = prevCell && prevCell.value();
        return absVar !== NULL && prevValue ? absVar / prevValue : NULL
    }
};
const summaryDictionary = {
    percentOfColumnTotal: e => percentOfParent(e, ROW),
    percentOfRowTotal: e => percentOfParent(e, COLUMN),
    percentOfColumnGrandTotal: e => percentOfGrandTotal(e, ROW),
    percentOfRowGrandTotal: e => percentOfGrandTotal(e, COLUMN),
    percentOfGrandTotal: e => percentOfGrandTotal(e)
};
const getPrevCellCrossGroup = function(cell, direction) {
    if (!cell || !cell.parent(direction)) {
        return
    }
    let prevCell = cell.prev(direction);
    if (!prevCell) {
        prevCell = getPrevCellCrossGroup(cell.parent(direction), direction)
    }
    return prevCell
};
const createRunningTotalExpr = field => {
    if (!field.runningTotal) {
        return
    }
    const direction = field.runningTotal === COLUMN ? ROW : COLUMN;
    return e => {
        const prevCell = field.allowCrossGroupCalculation ? getPrevCellCrossGroup(e, direction) : e.prev(direction, false);
        const calculatedValue = e.value(true);
        const originalValue = e.value(false);
        const prevCalculatedValue = null === prevCell || void 0 === prevCell ? void 0 : prevCell.value(true);
        switch (true) {
            case isDefined(calculatedValue) && isDefined(originalValue) && isDefined(prevCalculatedValue):
                return prevCalculatedValue + calculatedValue;
            case isDefined(prevCalculatedValue):
                return prevCalculatedValue;
            default:
                return calculatedValue
        }
    }
};

function createCache() {
    return {
        fields: {},
        positions: {}
    }
}

function getFieldPos(descriptions, field, cache) {
    let fieldParams = {
        index: -1
    };
    if (!isObject(field)) {
        if (cache.fields[field]) {
            field = cache[field]
        } else {
            const allFields = descriptions.columns.concat(descriptions.rows).concat(descriptions.values);
            const fieldIndex = findField(allFields, field);
            field = cache[field] = allFields[fieldIndex]
        }
    }
    if (field) {
        const area = field.area || "data";
        fieldParams = cache.positions[field.index] = cache.positions[field.index] || {
            area: area,
            index: descriptions["data" === area ? "values" : `${area}s`].indexOf(field)
        }
    }
    return fieldParams
}

function getPathFieldName(dimension) {
    return dimension === ROW ? "_rowPath" : "_columnPath"
}
const SummaryCell = function(columnPath, rowPath, data, descriptions, fieldIndex, fieldsCache) {
    this._columnPath = columnPath;
    this._rowPath = rowPath;
    this._fieldIndex = fieldIndex;
    this._fieldsCache = fieldsCache || createCache();
    this._data = data;
    this._descriptions = descriptions;
    const cell = data.values && data.values[rowPath[0].index] && data.values[rowPath[0].index][columnPath[0].index];
    if (cell) {
        cell.originalCell = cell.originalCell || cell.slice();
        cell.postProcessedFlags = cell.postProcessedFlags || [];
        this._cell = cell
    }
};
SummaryCell.prototype = extend(SummaryCell.prototype, {
    _getPath(dimension) {
        return this[getPathFieldName(dimension)]
    },
    _getDimension(dimension) {
        dimension = dimension === ROW ? "rows" : "columns";
        return this._descriptions[dimension]
    },
    _createCell(config) {
        return new SummaryCell(config._columnPath || this._columnPath, config._rowPath || this._rowPath, this._data, this._descriptions, this._fieldIndex)
    },
    parent(direction) {
        const path = this._getPath(direction).slice();
        const config = {};
        path.shift();
        if (path.length) {
            config[getPathFieldName(direction)] = path;
            return this._createCell(config)
        }
        return NULL
    },
    children(direction) {
        const path = this._getPath(direction).slice();
        const item = path[0];
        const result = [];
        const cellConfig = {};
        if (item.children) {
            for (let i = 0; i < item.children.length; i += 1) {
                cellConfig[getPathFieldName(direction)] = [item.children[i]].concat(path.slice());
                result.push(this._createCell(cellConfig))
            }
        }
        return result
    },
    grandTotal(direction) {
        const config = {};
        const rowPath = this._rowPath;
        const columnPath = this._columnPath;
        const dimensionPath = this._getPath(direction);
        const pathFieldName = getPathFieldName(direction);
        if (!direction) {
            config._rowPath = [rowPath[rowPath.length - 1]];
            config._columnPath = [columnPath[columnPath.length - 1]]
        } else {
            config[pathFieldName] = [dimensionPath[dimensionPath.length - 1]]
        }
        return this._createCell(config)
    },
    next(direction, allowCrossGroup) {
        const currentPath = this._getPath(direction);
        const item = currentPath[0];
        let parent = this.parent(direction);
        let siblings;
        if (parent) {
            const index = currentPath[1].children.indexOf(item);
            siblings = parent.children(direction);
            if (siblings[index + 1]) {
                return siblings[index + 1]
            }
        }
        if (allowCrossGroup && parent) {
            do {
                parent = parent.next(direction, allowCrossGroup);
                siblings = parent ? parent.children(direction) : []
            } while (parent && !siblings.length);
            return siblings[0] || NULL
        }
        return NULL
    },
    prev(direction, allowCrossGroup) {
        const currentPath = this._getPath(direction);
        const item = currentPath[0];
        let parent = this.parent(direction);
        let siblings;
        if (parent) {
            const index = currentPath[1].children.indexOf(item);
            siblings = parent.children(direction);
            if (siblings[index - 1]) {
                return siblings[index - 1]
            }
        }
        if (allowCrossGroup && parent) {
            do {
                parent = parent.prev(direction, allowCrossGroup);
                siblings = parent ? parent.children(direction) : []
            } while (parent && !siblings.length);
            return siblings[siblings.length - 1] || NULL
        }
        return NULL
    },
    cell() {
        return this._cell
    },
    field(area) {
        if ("data" === area) {
            return this._descriptions.values[this._fieldIndex]
        }
        const path = this._getPath(area);
        const descriptions = this._getDimension(area);
        const field = descriptions[path.length - 2];
        return field || NULL
    },
    child(direction, fieldValue) {
        let childLevelField;
        const children = this.children(direction);
        for (let i = 0; i < children.length; i += 1) {
            childLevelField = childLevelField || children[i].field(direction);
            if (children[i].value(childLevelField) === fieldValue) {
                return children[i]
            }
        }
        return NULL
    },
    slice(field, value) {
        const that = this;
        const config = {};
        const fieldPos = getFieldPos(this._descriptions, field, this._fieldsCache);
        const {
            area: area
        } = fieldPos;
        const fieldIndex = fieldPos.index;
        let sliceCell = NULL;
        const newPath = [];
        if (area === ROW || area === COLUMN) {
            const path = this._getPath(area).slice();
            const level = -1 !== fieldIndex && path.length - 2 - fieldIndex;
            if (path[level]) {
                newPath[path.length - 1] = path[path.length - 1];
                for (let i = level; i >= 0; i -= 1) {
                    if (path[i + 1]) {
                        const childItems = path[i + 1].children || [];
                        const currentValue = i === level ? value : path[i].value;
                        path[i] = void 0;
                        for (let childIndex = 0; childIndex < childItems.length; childIndex += 1) {
                            if (childItems[childIndex].value === currentValue) {
                                path[i] = childItems[childIndex];
                                break
                            }
                        }
                    }
                    if (void 0 === path[i]) {
                        return sliceCell
                    }
                }
                config[getPathFieldName(area)] = path;
                sliceCell = that._createCell(config)
            }
        }
        return sliceCell
    },
    value(arg1, arg2) {
        const cell = this._cell;
        let fieldIndex = this._fieldIndex;
        const fistArgIsBoolean = true === arg1 || false === arg1;
        const field = !fistArgIsBoolean ? arg1 : NULL;
        const needCalculatedValue = fistArgIsBoolean && arg1 || arg2;
        if (isDefined(field)) {
            const fieldPos = getFieldPos(this._descriptions, field, this._fieldsCache);
            fieldIndex = fieldPos.index;
            if ("data" !== fieldPos.area) {
                const path = this._getPath(fieldPos.area);
                const level = -1 !== fieldIndex && path.length - 2 - fieldIndex;
                return path[level] && path[level].value
            }
        }
        if (cell && cell.originalCell) {
            return needCalculatedValue ? cell[fieldIndex] : cell.originalCell[fieldIndex]
        }
        return NULL
    },
    isPostProcessed(field) {
        let fieldIndex = this._fieldIndex;
        if (isDefined(field)) {
            const fieldPos = getFieldPos(this._descriptions, field, this._fieldsCache);
            fieldIndex = fieldPos.index;
            if ("data" !== fieldPos.area) {
                return false
            }
        }
        return !!(this._cell && this._cell.postProcessedFlags[fieldIndex])
    }
});

function getExpression(field) {
    const {
        summaryDisplayMode: summaryDisplayMode
    } = field;
    const crossGroupCalculation = field.allowCrossGroupCalculation;
    let expression = NULL;
    if (isFunction(field.calculateSummaryValue)) {
        expression = field.calculateSummaryValue
    } else if (summaryDisplayMode) {
        if ("absoluteVariation" === summaryDisplayMode) {
            expression = createAbsoluteVariationExp(crossGroupCalculation)
        } else if ("percentVariation" === summaryDisplayMode) {
            expression = createPercentVariationExp(crossGroupCalculation)
        } else {
            expression = summaryDictionary[summaryDisplayMode]
        }
        if (expression && !field.format && -1 !== summaryDisplayMode.indexOf("percent")) {
            pivotGridUtils.setFieldProperty(field, "format", "percent")
        }
    }
    return expression
}

function processDataCell(data, rowIndex, columnIndex, isRunningTotalCalculation) {
    const values = data.values[rowIndex][columnIndex] = data.values[rowIndex][columnIndex] || [];
    const {
        originalCell: originalCell
    } = values;
    if (!originalCell) {
        return
    }
    if (values.allowResetting || !isRunningTotalCalculation) {
        data.values[rowIndex][columnIndex] = originalCell.slice()
    }
    data.values[rowIndex][columnIndex].allowResetting = isRunningTotalCalculation
}

function applyDisplaySummaryMode(descriptions, data) {
    const expressions = [];
    const columnElements = [{
        index: data.grandTotalColumnIndex,
        children: data.columns
    }];
    const rowElements = [{
        index: data.grandTotalRowIndex,
        children: data.rows
    }];
    const valueFields = descriptions.values;
    const fieldsCache = createCache();
    data.values = data.values || [];
    foreachTree(columnElements, (columnPath => {
        columnPath[0].isEmpty = []
    }), false);
    foreachTree(rowElements, (rowPath => {
        const rowItem = rowPath[0];
        rowItem.isEmpty = [];
        data.values[rowItem.index] = data.values[rowItem.index] || [];
        foreachTree(columnElements, (columnPath => {
            const columnItem = columnPath[0];
            let isEmptyCell;
            processDataCell(data, rowItem.index, columnItem.index, false);
            for (let i = 0; i < valueFields.length; i += 1) {
                const field = valueFields[i];
                const expression = expressions[i] = void 0 === expressions[i] ? getExpression(field) : expressions[i];
                isEmptyCell = false;
                if (expression) {
                    const expressionArg = new SummaryCell(columnPath, rowPath, data, descriptions, i, fieldsCache);
                    const cell = expressionArg.cell();
                    const value = cell[i] = expression(expressionArg);
                    cell.postProcessedFlags[i] = true;
                    isEmptyCell = null === value || void 0 === value
                }
                if (void 0 === columnItem.isEmpty[i]) {
                    columnItem.isEmpty[i] = true
                }
                if (void 0 === rowItem.isEmpty[i]) {
                    rowItem.isEmpty[i] = true
                }
                if (!isEmptyCell) {
                    rowItem.isEmpty[i] = columnItem.isEmpty[i] = false
                }
            }
        }), false)
    }), false);
    data.isEmptyGrandTotalRow = rowElements[0].isEmpty;
    data.isEmptyGrandTotalColumn = columnElements[0].isEmpty
}

function applyRunningTotal(descriptions, data) {
    const expressions = [];
    const columnElements = [{
        index: data.grandTotalColumnIndex,
        children: data.columns
    }];
    const rowElements = [{
        index: data.grandTotalRowIndex,
        children: data.rows
    }];
    const valueFields = descriptions.values;
    const fieldsCache = createCache();
    data.values = data.values || [];
    foreachTree(rowElements, (rowPath => {
        const rowItem = rowPath[0];
        data.values[rowItem.index] = data.values[rowItem.index] || [];
        foreachTree(columnElements, (columnPath => {
            const columnItem = columnPath[0];
            processDataCell(data, rowItem.index, columnItem.index, true);
            for (let i = 0; i < valueFields.length; i += 1) {
                const field = valueFields[i];
                const expression = expressions[i] = void 0 === expressions[i] ? createRunningTotalExpr(field) : expressions[i];
                if (expression) {
                    const expressionArg = new SummaryCell(columnPath, rowPath, data, descriptions, i, fieldsCache);
                    const cell = expressionArg.cell();
                    cell[i] = expression(expressionArg);
                    cell.postProcessedFlags[i] = true
                }
            }
        }), false)
    }), false)
}

function createMockSummaryCell(descriptions, fields, indices) {
    const summaryCell = new SummaryCell([], [], {}, descriptions, 0);
    summaryCell.value = function(fieldId) {
        if (isDefined(fieldId)) {
            const index = findField(fields, fieldId);
            const field = fields[index];
            if (!indices[index] && field && !isDefined(field.area)) {
                descriptions.values.push(field);
                indices[index] = true
            }
        }
    };
    summaryCell.grandTotal = function() {
        return this
    };
    summaryCell.children = function() {
        return []
    };
    return summaryCell
}
export default {
    Cell: SummaryCell,
    summaryDictionary: summaryDictionary,
    getExpression: getExpression,
    applyRunningTotal: applyRunningTotal,
    createMockSummaryCell: createMockSummaryCell,
    applyDisplaySummaryMode: applyDisplaySummaryMode
};
export {
    applyDisplaySummaryMode,
    applyRunningTotal,
    SummaryCell as Cell,
    createMockSummaryCell,
    getExpression,
    summaryDictionary
};