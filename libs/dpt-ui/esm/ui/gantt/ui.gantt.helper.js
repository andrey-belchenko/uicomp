/**
 * DevExtreme (esm/ui/gantt/ui.gantt.helper.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    compileGetter,
    compileSetter
} from "../../core/utils/data";
import {
    isFunction
} from "../../core/utils/type";
import messageLocalization from "../../localization/message";
export const GanttHelper = {
    prepareMapHandler: getters => data => Object.keys(getters).reduce(((previous, key) => {
        const resultKey = "key" === key ? "id" : key;
        previous[resultKey] = getters[key](data);
        return previous
    }), {}),
    prepareSetterMapHandler: setters => data => Object.keys(setters).reduce(((previous, key) => {
        const resultKey = "key" === key ? "id" : key;
        setters[key](previous, data[resultKey]);
        return previous
    }), {}),
    compileGettersByOption(optionValue) {
        const getters = {};
        for (const field in optionValue) {
            const exprMatches = field.match(/(\w*)Expr/);
            if (exprMatches) {
                getters[exprMatches[1]] = compileGetter(optionValue[exprMatches[0]])
            }
        }
        return getters
    },
    compileSettersByOption(optionValue) {
        const setters = {};
        for (const field in optionValue) {
            const exprMatches = field.match(/(\w*)Expr/);
            if (exprMatches && !isFunction(optionValue[exprMatches[0]])) {
                setters[exprMatches[1]] = compileSetter(optionValue[exprMatches[0]])
            }
        }
        return setters
    },
    compileFuncSettersByOption(optionValue) {
        const setters = {};
        for (const field in optionValue) {
            const exprMatches = field.match(/(\w*)Expr/);
            if (exprMatches && isFunction(optionValue[exprMatches[0]])) {
                setters[exprMatches[1]] = optionValue[exprMatches[0]]
            }
        }
        return setters
    },
    getStoreObject(option, modelObject) {
        const setters = GanttHelper.compileSettersByOption(option);
        return Object.keys(setters).reduce(((previous, key) => {
            if ("key" !== key) {
                setters[key](previous, modelObject[key])
            }
            return previous
        }), {})
    },
    getInvertedData(data, keyGetter) {
        const inverted = {};
        if (data) {
            for (let i = 0; i < data.length; i++) {
                const dataItem = data[i];
                const key = keyGetter(dataItem);
                inverted[key] = dataItem
            }
        }
        return inverted
    },
    getArrayFromOneElement: element => void 0 === element || null === element ? [] : [element],
    getSelectionMode: allowSelection => allowSelection ? "single" : "none",
    convertTreeToList(node, array) {
        if (null !== node && void 0 !== node && node.data && null !== node && void 0 !== node && node.visible) {
            array.push(node.data)
        }
        for (let i = 0; i < (null === (_node$children = node.children) || void 0 === _node$children ? void 0 : _node$children.length); i++) {
            var _node$children;
            const child = node.children[i];
            GanttHelper.convertTreeToList(child, array)
        }
    },
    getAllParentNodesKeys(node, array) {
        var _node$parent;
        if (null !== node && void 0 !== node && node.data) {
            array.push(node.key)
        }
        if (null !== node && void 0 !== node && null !== (_node$parent = node.parent) && void 0 !== _node$parent && _node$parent.data) {
            GanttHelper.getAllParentNodesKeys(node.parent, array)
        }
    },
    getDefaultOptions: () => ({
        tasks: {
            dataSource: null,
            keyExpr: "id",
            parentIdExpr: "parentId",
            startExpr: "start",
            endExpr: "end",
            progressExpr: "progress",
            titleExpr: "title",
            colorExpr: "color"
        },
        dependencies: {
            dataSource: null,
            keyExpr: "id",
            predecessorIdExpr: "predecessorId",
            successorIdExpr: "successorId",
            typeExpr: "type"
        },
        resources: {
            dataSource: null,
            keyExpr: "id",
            textExpr: "text",
            colorExpr: "color"
        },
        resourceAssignments: {
            dataSource: null,
            keyExpr: "id",
            taskIdExpr: "taskId",
            resourceIdExpr: "resourceId"
        },
        columns: void 0,
        taskListWidth: 300,
        showResources: true,
        showDependencies: true,
        taskTitlePosition: "inside",
        firstDayOfWeek: void 0,
        selectedRowKey: void 0,
        onSelectionChanged: null,
        onTaskClick: null,
        onTaskDblClick: null,
        onTaskInserting: null,
        onTaskInserted: null,
        onTaskDeleting: null,
        onTaskDeleted: null,
        onTaskUpdating: null,
        onTaskUpdated: null,
        onTaskMoving: null,
        onTaskEditDialogShowing: null,
        onDependencyInserting: null,
        onDependencyInserted: null,
        onDependencyDeleting: null,
        onDependencyDeleted: null,
        onResourceInserting: null,
        onResourceInserted: null,
        onResourceDeleting: null,
        onResourceDeleted: null,
        onResourceAssigning: null,
        onResourceAssigned: null,
        onResourceUnassigning: null,
        onResourceUnassigned: null,
        onCustomCommand: null,
        onContextMenuPreparing: null,
        allowSelection: true,
        showRowLines: true,
        stripLines: void 0,
        scaleType: "auto",
        scaleTypeRange: {
            min: "minutes",
            max: "years"
        },
        editing: {
            enabled: false,
            allowTaskAdding: true,
            allowTaskDeleting: true,
            allowTaskUpdating: true,
            allowDependencyAdding: true,
            allowDependencyDeleting: true,
            allowResourceAdding: true,
            allowResourceDeleting: true,
            allowResourceUpdating: true,
            allowTaskResourceUpdating: true
        },
        validation: {
            validateDependencies: false,
            autoUpdateParentTasks: false,
            enablePredecessorGap: false
        },
        toolbar: null,
        contextMenu: {
            enabled: true,
            items: void 0
        },
        taskTooltipContentTemplate: null,
        taskProgressTooltipContentTemplate: null,
        taskTimeTooltipContentTemplate: null,
        taskContentTemplate: null,
        rootValue: 0,
        sorting: {
            ascendingText: messageLocalization.format("dxGantt-sortingAscendingText"),
            descendingText: messageLocalization.format("dxGantt-sortingDescendingText"),
            clearText: messageLocalization.format("dxGantt-sortingClearText"),
            mode: "single",
            showSortIndexes: false
        },
        filterRow: void 0,
        headerFilter: void 0,
        rtlEnabled: false
    })
};
