/**
 * DevExtreme (esm/__internal/grids/pivot_grid/xmla_store/m_xmla_store.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import Class from "../../../../core/class";
import $ from "../../../../core/renderer";
import {
    noop
} from "../../../../core/utils/common";
import {
    Deferred,
    when
} from "../../../../core/utils/deferred";
import {
    extend
} from "../../../../core/utils/extend";
import {
    each,
    map
} from "../../../../core/utils/iterator";
import {
    format as stringFormat
} from "../../../../core/utils/string";
import {
    isDefined,
    isFunction,
    isNumeric,
    isString
} from "../../../../core/utils/type";
import {
    getWindow
} from "../../../../core/utils/window";
import {
    errors
} from "../../../../data/errors";
import {
    getLanguageId
} from "../../../../localization/language_codes";
import pivotGridUtils, {
    foreachTree,
    getExpandedLevel,
    storeDrillDownMixin
} from "../m_widget_utils";
const window = getWindow();
const XmlaStore = Class.inherit(function() {
    const discover = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Body><Discover xmlns="urn:schemas-microsoft-com:xml-analysis"><RequestType>{2}</RequestType><Restrictions><RestrictionList><CATALOG_NAME>{0}</CATALOG_NAME><CUBE_NAME>{1}</CUBE_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>{0}</Catalog>{3}</PropertyList></Properties></Discover></Body></Envelope>';
    const mdx = "SELECT {2} FROM {0} {1} CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS";
    const mdxFilterSelect = "(SELECT {0} FROM {1})";
    const mdxSubset = "Subset({0}, {1}, {2})";
    const mdxOrder = "Order({0}, {1}, {2})";
    const mdxWith = "{0} {1} as {2}";
    const mdxSlice = "WHERE ({0})";
    const mdxNonEmpty = "NonEmpty({0}, {1})";
    const mdxAxis = "{0} DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON {1}";
    const mdxCrossJoin = "CrossJoin({0})";
    const mdxSet = "{{0}}";

    function execXMLA(requestOptions, data) {
        const deferred = new Deferred;
        const {
            beforeSend: beforeSend
        } = requestOptions;
        const ajaxSettings = {
            url: requestOptions.url,
            dataType: "text",
            data: data,
            headers: {
                "Content-Type": "text/xml"
            },
            xhrFields: {},
            method: "POST"
        };
        if (isFunction(beforeSend)) {
            beforeSend(ajaxSettings)
        }
        pivotGridUtils.sendRequest(ajaxSettings).fail((function() {
            deferred.reject(arguments)
        })).done((text => {
            const parser = new window.DOMParser;
            let xml;
            try {
                try {
                    xml = parser.parseFromString(text, "text/xml")
                } catch (e) {
                    xml = void 0
                }
                if (!xml || xml.getElementsByTagName("parsererror").length || 0 === xml.childNodes.length) {
                    throw new errors.Error("E4023", text)
                }
            } catch (e) {
                deferred.reject({
                    statusText: e.message,
                    stack: e.stack,
                    responseText: text
                })
            }
            deferred.resolve(xml)
        }));
        return deferred
    }

    function getLocaleIdProperty() {
        const languageId = getLanguageId();
        if (void 0 !== languageId) {
            return stringFormat("<LocaleIdentifier>{0}</LocaleIdentifier>", languageId)
        }
        return ""
    }

    function mdxDescendants(level, levelMember, nextLevel) {
        const memberExpression = levelMember || level;
        return `Descendants({${memberExpression}}, ${nextLevel}, SELF_AND_BEFORE)`
    }

    function getAllMember(dimension) {
        return `${dimension.hierarchyName||dimension.dataField}.[All]`
    }

    function getAllMembers(field) {
        let result = `${field.dataField}.allMembers`;
        let {
            searchValue: searchValue
        } = field;
        if (searchValue) {
            searchValue = searchValue.replace(/'/g, "''");
            result = `Filter(${result}, instr(${field.dataField}.currentmember.member_caption,'${searchValue}') > 0)`
        }
        return result
    }

    function crossJoinElements(elements) {
        const elementsString = elements.join(",");
        return elements.length > 1 ? stringFormat(mdxCrossJoin, elementsString) : elementsString
    }

    function generateCrossJoin(path, expandLevel, expandAllCount, expandIndex, slicePath, options, axisName, take) {
        const crossJoinArgs = [];
        const dimensions = options[axisName];
        const fields = [];
        let arg;
        let prevDimension;
        let member;
        for (let i = expandIndex; i <= expandLevel; i += 1) {
            const field = dimensions[i];
            const {
                dataField: dataField
            } = field;
            const prevHierarchyName = dimensions[i - 1] && dimensions[i - 1].hierarchyName;
            const {
                hierarchyName: hierarchyName
            } = field;
            const isLastDimensionInGroup = !hierarchyName || !dimensions[i + 1] || dimensions[i + 1].hierarchyName !== hierarchyName;
            const expandAllIndex = path.length + expandAllCount + expandIndex;
            arg = null;
            fields.push(field);
            if (i < path.length) {
                if (isLastDimensionInGroup) {
                    arg = `(${dataField}.${preparePathValue(path[i],dataField)})`
                }
            } else if (i <= expandAllIndex) {
                if (0 === i && 0 === expandAllCount) {
                    const allMember = getAllMember(dimensions[expandIndex]);
                    if (!hierarchyName) {
                        arg = getAllMembers(dimensions[expandIndex])
                    } else {
                        arg = `${allMember},${dimensions[expandIndex].dataField}`
                    }
                } else if (hierarchyName) {
                    member = preparePathValue(slicePath[slicePath.length - 1]);
                    if (isLastDimensionInGroup || i === expandAllIndex) {
                        if (prevHierarchyName === hierarchyName) {
                            if (slicePath.length) {
                                prevDimension = dimensions[slicePath.length - 1]
                            }
                            if (!prevDimension || prevDimension.hierarchyName !== hierarchyName) {
                                prevDimension = dimensions[i - 1];
                                member = ""
                            }
                            arg = mdxDescendants(prevDimension.dataField, member, dataField)
                        } else {
                            arg = getAllMembers(field)
                        }
                    }
                } else {
                    arg = getAllMembers(field)
                }
            } else {
                const isFirstDimensionInGroup = !hierarchyName || prevHierarchyName !== hierarchyName;
                if (isFirstDimensionInGroup) {
                    arg = `(${getAllMember(field)})`
                }
            }
            if (arg) {
                arg = stringFormat(mdxSet, arg);
                if (take) {
                    const sortBy = (field.hierarchyName || field.dataField) + ("displayText" === field.sortBy ? ".MEMBER_CAPTION" : ".MEMBER_VALUE");
                    arg = stringFormat(mdxOrder, arg, sortBy, "desc" === field.sortOrder ? "DESC" : "ASC")
                }
                crossJoinArgs.push(arg)
            }
        }
        return crossJoinElements(crossJoinArgs)
    }

    function fillCrossJoins(crossJoins, path, expandLevel, expandIndex, slicePath, options, axisName, cellsString, take, totalsOnly) {
        let expandAllCount = -1;
        const dimensions = options[axisName];
        let dimensionIndex;
        do {
            expandAllCount += 1;
            dimensionIndex = path.length + expandAllCount + expandIndex;
            let crossJoin = generateCrossJoin(path, expandLevel, expandAllCount, expandIndex, slicePath, options, axisName, take);
            if (!take && !totalsOnly) {
                crossJoin = stringFormat(mdxNonEmpty, crossJoin, cellsString)
            }
            crossJoins.push(crossJoin)
        } while (dimensions[dimensionIndex] && dimensions[dimensionIndex + 1] && dimensions[dimensionIndex].expanded)
    }

    function declare(expression, withArray, name, type) {
        name = name || `[DX_Set_${withArray.length}]`;
        type = type || "set";
        withArray.push(stringFormat(mdxWith, type, name, expression));
        return name
    }

    function generateAxisMdx(options, axisName, cells, withArray, parseOptions) {
        const dimensions = options[axisName];
        const crossJoins = [];
        let path = [];
        let expandedPaths = [];
        let expandIndex = 0;
        let expandLevel = 0;
        const result = [];
        const cellsString = stringFormat(mdxSet, cells.join(","));
        if (dimensions && dimensions.length) {
            if (options.headerName === axisName) {
                path = options.path;
                expandIndex = path.length
            } else if (options.headerName && options.oppositePath) {
                path = options.oppositePath;
                expandIndex = path.length
            } else {
                expandedPaths = ("columns" === axisName ? options.columnExpandedPaths : options.rowExpandedPaths) || expandedPaths
            }
            expandLevel = getExpandedLevel(options, axisName);
            fillCrossJoins(crossJoins, [], expandLevel, expandIndex, path, options, axisName, cellsString, "rows" === axisName ? options.rowTake : options.columnTake, options.totalsOnly);
            each(expandedPaths, ((_, expandedPath) => {
                fillCrossJoins(crossJoins, expandedPath, expandLevel, expandIndex, expandedPath, options, axisName, cellsString)
            }));
            for (let i = expandLevel; i >= path.length; i -= 1) {
                if (dimensions[i].hierarchyName) {
                    parseOptions.visibleLevels[dimensions[i].hierarchyName] = parseOptions.visibleLevels[dimensions[i].hierarchyName] || [];
                    parseOptions.visibleLevels[dimensions[i].hierarchyName].push(dimensions[i].dataField)
                }
            }
        }
        if (crossJoins.length) {
            let expression = function(elements) {
                const elementsString = elements.join(",");
                return elements.length > 1 ? `Union(${elementsString})` : elementsString
            }(crossJoins);
            if ("rows" === axisName && options.rowTake) {
                expression = stringFormat(mdxSubset, expression, options.rowSkip > 0 ? options.rowSkip + 1 : 0, options.rowSkip > 0 ? options.rowTake : options.rowTake + 1)
            }
            if ("columns" === axisName && options.columnTake) {
                expression = stringFormat(mdxSubset, expression, options.columnSkip > 0 ? options.columnSkip + 1 : 0, options.columnSkip > 0 ? options.columnTake : options.columnTake + 1)
            }
            const axisSet = `[DX_${axisName}]`;
            result.push(declare(expression, withArray, axisSet));
            if (options.totalsOnly) {
                result.push(declare(`COUNT(${axisSet})`, withArray, `[DX_${axisName}_count]`, "member"))
            }
        }
        if ("columns" === axisName && cells.length && !options.skipValues) {
            result.push(cellsString)
        }
        return stringFormat(mdxAxis, crossJoinElements(result), axisName)
    }

    function generateAxisFieldsFilter(fields) {
        const filterMembers = [];
        each(fields, ((_, field) => {
            const {
                dataField: dataField
            } = field;
            const filterExpression = [];
            const filterValues = field.filterValues || [];
            let filterStringExpression;
            if (field.hierarchyName && isNumeric(field.groupIndex)) {
                return
            }
            each(filterValues, ((_, filterValue) => {
                let filterMdx = `${dataField}.${preparePathValue(Array.isArray(filterValue)?filterValue[filterValue.length-1]:filterValue,dataField)}`;
                if ("exclude" === field.filterType) {
                    filterExpression.push(`${filterMdx}.parent`);
                    filterMdx = `Descendants(${filterMdx})`
                }
                filterExpression.push(filterMdx)
            }));
            if (filterValues.length) {
                filterStringExpression = stringFormat(mdxSet, filterExpression.join(","));
                if ("exclude" === field.filterType) {
                    filterStringExpression = `Except(${getAllMembers(field)},${filterStringExpression})`
                }
                filterMembers.push(filterStringExpression)
            }
        }));
        return filterMembers.length ? crossJoinElements(filterMembers) : ""
    }

    function generateMdxCore(axisStrings, withArray, columns, rows, filters, slice, cubeName) {
        let options = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : {};
        let mdxString = "";
        const withString = (withArray.length ? `with ${withArray.join(" ")}` : "") + " ";
        if (axisStrings.length) {
            let select;
            if (options.totalsOnly) {
                const countMembers = [];
                if (rows.length) {
                    countMembers.push("[DX_rows_count]")
                }
                if (columns.length) {
                    countMembers.push("[DX_columns_count]")
                }
                select = `{${countMembers.join(",")}} on columns`
            } else {
                select = axisStrings.join(",")
            }
            mdxString = withString + stringFormat(mdx, function(columnsFilter, rowsFilter, filter, cubeName) {
                let from = `[${cubeName}]`;
                each([columnsFilter, rowsFilter, filter], ((_, filter) => {
                    if (filter) {
                        from = stringFormat(mdxFilterSelect, `${filter}on 0`, from)
                    }
                }));
                return from
            }(generateAxisFieldsFilter(columns), generateAxisFieldsFilter(rows), generateAxisFieldsFilter(filters || []), cubeName), slice.length ? stringFormat(mdxSlice, slice.join(",")) : "", select)
        }
        return mdxString
    }

    function prepareDataFields(withArray, valueFields) {
        return map(valueFields, (cell => {
            if (isString(cell.expression)) {
                declare(cell.expression, withArray, cell.dataField, "member")
            }
            return cell.dataField
        }))
    }

    function addSlices(slices, options, headerName, path) {
        each(path, ((index, value) => {
            const dimension = options[headerName][index];
            if (!dimension.hierarchyName || dimension.hierarchyName !== options[headerName][index + 1].hierarchyName) {
                slices.push(`${dimension.dataField}.${preparePathValue(value,dimension.dataField)}`)
            }
        }))
    }

    function generateMDX(options, cubeName, parseOptions) {
        const columns = options.columns || [];
        const rows = options.rows || [];
        const values = options.values && options.values.length ? options.values : [{
            dataField: "[Measures]"
        }];
        const slice = [];
        const withArray = [];
        const axisStrings = [];
        const dataFields = prepareDataFields(withArray, values);
        parseOptions.measureCount = options.skipValues ? 1 : values.length;
        parseOptions.visibleLevels = {};
        if (options.headerName && options.path) {
            addSlices(slice, options, options.headerName, options.path)
        }
        if (options.headerName && options.oppositePath) {
            addSlices(slice, options, "rows" === options.headerName ? "columns" : "rows", options.oppositePath)
        }
        if (columns.length || dataFields.length) {
            axisStrings.push(generateAxisMdx(options, "columns", dataFields, withArray, parseOptions))
        }
        if (rows.length) {
            axisStrings.push(generateAxisMdx(options, "rows", dataFields, withArray, parseOptions))
        }
        return generateMdxCore(axisStrings, withArray, columns, rows, options.filters, slice, cubeName, options)
    }

    function createDrillDownAxisSlice(slice, fields, path) {
        each(path, ((index, value) => {
            const field = fields[index];
            if (field.hierarchyName && (fields[index + 1] || {}).hierarchyName === field.hierarchyName) {
                return
            }
            slice.push(`${field.dataField}.${preparePathValue(value,field.dataField)}`)
        }))
    }

    function getNumber(str) {
        return parseInt(str, 10)
    }

    function getFirstChildText(node, childTagName) {
        return getNodeText(function(node, tagName) {
            return (node.getElementsByTagName(tagName) || [])[0]
        }(node, childTagName))
    }

    function getNodeText(node) {
        return node && (node.textContent || node.text || node.innerHTML) || ""
    }

    function parseCells(xml, axes, measureCount) {
        const cells = [];
        let cell = [];
        let index = 0;
        const cellsOriginal = [];
        const cellElements = xml.getElementsByTagName("Cell");
        const errorDictionary = {};
        for (let i = 0; i < cellElements.length; i += 1) {
            const xmlCell = cellElements[i];
            const valueElement = xmlCell.getElementsByTagName("Value")[0];
            const errorElements = valueElement && valueElement.getElementsByTagName("Error") || [];
            const text = 0 === errorElements.length ? getNodeText(valueElement) : "#N/A";
            const value = parseFloat(text);
            const isNumeric = text - value + 1 > 0;
            const cellOrdinal = getNumber(xmlCell.getAttribute("CellOrdinal"));
            if (errorElements.length) {
                errorDictionary[getNodeText(errorElements[0].getElementsByTagName("ErrorCode")[0])] = getNodeText(errorElements[0].getElementsByTagName("Description")[0])
            }
            cellsOriginal[cellOrdinal] = {
                value: isNumeric ? value : text || null
            }
        }
        each(axes[1], (() => {
            const row = [];
            cells.push(row);
            each(axes[0], (() => {
                const measureIndex = index % measureCount;
                if (0 === measureIndex) {
                    cell = [];
                    row.push(cell)
                }
                cell.push(cellsOriginal[index] ? cellsOriginal[index].value : null);
                index += 1
            }))
        }));
        Object.keys(errorDictionary).forEach((key => {
            errors.log("W4002", errorDictionary[key])
        }));
        return cells
    }

    function preparePathValue(pathValue, dataField) {
        if (pathValue) {
            pathValue = isString(pathValue) && pathValue.includes("&") ? pathValue : `[${pathValue}]`;
            if (dataField && 0 === pathValue.indexOf(`${dataField}.`)) {
                pathValue = pathValue.slice(dataField.length + 1, pathValue.length)
            }
        }
        return pathValue
    }

    function getItem(hash, name, member, index) {
        let item = hash[name];
        if (!item) {
            item = {};
            hash[name] = item
        }
        if (!isDefined(item.value) && member) {
            item.text = member.caption;
            item.value = member.value;
            item.key = name || "";
            item.levelName = member.levelName;
            item.hierarchyName = member.hierarchyName;
            item.parentName = member.parentName;
            item.index = index;
            item.level = member.level
        }
        return item
    }

    function getVisibleChildren(item, visibleLevels) {
        const result = [];
        const children = item.children && (item.children.length ? item.children : Object.keys(item.children.grandTotalHash || {}).reduce(((result, name) => result.concat(item.children.grandTotalHash[name].children)), []));
        const firstChild = children && children[0];
        if (firstChild && (visibleLevels[firstChild.hierarchyName] && visibleLevels[firstChild.hierarchyName].includes(firstChild.levelName) || !visibleLevels[firstChild.hierarchyName] || 0 === firstChild.level)) {
            const newChildren = children.filter((child => child.hierarchyName === firstChild.hierarchyName));
            newChildren.grandTotalHash = children.grandTotalHash;
            return newChildren
        }
        if (firstChild) {
            for (let i = 0; i < children.length; i += 1) {
                if (children[i].hierarchyName === firstChild.hierarchyName) {
                    result.push.apply(result, getVisibleChildren(children[i], visibleLevels))
                }
            }
        }
        return result
    }

    function fillDataSourceAxes(dataSourceAxis, axisTuples, measureCount, visibleLevels) {
        const result = [];
        each(axisTuples, ((tupleIndex, members) => {
            let parentItem = {
                children: result
            };
            const dataIndex = isDefined(measureCount) ? Math.floor(tupleIndex / measureCount) : tupleIndex;
            each(members, ((_, member) => {
                parentItem = function(dataIndex, member, parentItem) {
                    let children = parentItem.children = parentItem.children || [];
                    const hash = children.hash = children.hash || {};
                    const grandTotalHash = children.grandTotalHash = children.grandTotalHash || {};
                    if (member.parentName) {
                        parentItem = getItem(hash, member.parentName);
                        children = parentItem.children = parentItem.children || []
                    }
                    const currentItem = getItem(hash, member.name, member, dataIndex);
                    if (member.hasValue && !currentItem.added) {
                        currentItem.index = dataIndex;
                        currentItem.added = true;
                        children.push(currentItem)
                    }
                    if ((!parentItem.value || !parentItem.parentName) && member.parentName) {
                        grandTotalHash[member.parentName] = parentItem
                    } else if (grandTotalHash[parentItem.name]) {
                        delete grandTotalHash[member.parentName]
                    }
                    return currentItem
                }(dataIndex, member, parentItem)
            }))
        }));
        const parentItem = {
            children: result
        };
        parentItem.children = getVisibleChildren(parentItem, visibleLevels);
        const grandTotalIndex = function(parentItem, visibleLevels) {
            let grandTotalIndex;
            if (1 === parentItem.children.length && "" === parentItem.children[0].parentName) {
                grandTotalIndex = parentItem.children[0].index;
                const {
                    grandTotalHash: grandTotalHash
                } = parentItem.children;
                parentItem.children = parentItem.children[0].children || [];
                parentItem.children.grandTotalHash = grandTotalHash;
                parentItem.children = getVisibleChildren(parentItem, visibleLevels)
            } else if (0 === parentItem.children.length) {
                grandTotalIndex = 0
            }
            return grandTotalIndex
        }(parentItem, visibleLevels);
        foreachTree(parentItem.children, (items => {
            const item = items[0];
            const children = getVisibleChildren(item, visibleLevels);
            if (children.length) {
                item.children = children
            } else {
                delete item.children
            }
            delete item.levelName;
            delete item.hierarchyName;
            delete item.added;
            delete item.parentName;
            delete item.level
        }), true);
        each(parentItem.children || [], ((_, e) => {
            dataSourceAxis.push(e)
        }));
        return grandTotalIndex
    }

    function checkError(xml) {
        const faultElementNS = xml.getElementsByTagName("soap:Fault");
        const faultElement = xml.getElementsByTagName("Fault");
        const errorElement = $([].slice.call(faultElement.length ? faultElement : faultElementNS)).find("Error");
        if (errorElement.length) {
            const description = errorElement.attr("Description");
            const error = new errors.Error("E4000", description);
            errors.log("E4000", description);
            return error
        }
        return null
    }

    function parseResult(xml, parseOptions) {
        const dataSource = {
            columns: [],
            rows: []
        };
        const {
            measureCount: measureCount
        } = parseOptions;
        const axes = function(xml, skipValues) {
            const axes = [];
            each(xml.getElementsByTagName("Axis"), ((_, axisElement) => {
                const name = axisElement.getAttribute("name");
                const axis = [];
                let index = 0;
                if (0 === name.indexOf("Axis") && isNumeric(getNumber(name.substr(4)))) {
                    axes.push(axis);
                    each(axisElement.getElementsByTagName("Tuple"), ((_, tupleElement) => {
                        const tupleMembers = tupleElement.childNodes;
                        let levelSum = 0;
                        const members = [];
                        let membersCount = skipValues ? tupleMembers.length : tupleMembers.length - 1;
                        const isAxisWithMeasure = 1 === axes.length;
                        if (isAxisWithMeasure) {
                            membersCount -= 1
                        }
                        axis.push(members);
                        for (let i = membersCount; i >= 0; i -= 1) {
                            const tuple = tupleMembers[i];
                            const level = getNumber(getFirstChildText(tuple, "LNum"));
                            members[i] = {
                                caption: getFirstChildText(tuple, "Caption"),
                                value: (valueText = getFirstChildText(tuple, "MEMBER_VALUE"), isNumeric(valueText) ? parseFloat(valueText) : valueText),
                                level: level,
                                index: index++,
                                hasValue: !levelSum && (!!level || 0 === i),
                                name: getFirstChildText(tuple, "UName"),
                                hierarchyName: tupleMembers[i].getAttribute("Hierarchy"),
                                parentName: getFirstChildText(tuple, "PARENT_UNIQUE_NAME"),
                                levelName: getFirstChildText(tuple, "LName")
                            };
                            levelSum += level
                        }
                        var valueText
                    }))
                }
            }));
            while (axes.length < 2) {
                axes.push([
                    [{
                        level: 0
                    }]
                ])
            }
            return axes
        }(xml, parseOptions.skipValues);
        dataSource.grandTotalColumnIndex = fillDataSourceAxes(dataSource.columns, axes[0], measureCount, parseOptions.visibleLevels);
        dataSource.grandTotalRowIndex = fillDataSourceAxes(dataSource.rows, axes[1], void 0, parseOptions.visibleLevels);
        dataSource.values = parseCells(xml, axes, measureCount);
        return dataSource
    }

    function parseDiscoverRowSet(xml, schema, dimensions, translatedDisplayFolders) {
        const result = [];
        const isMeasure = "MEASURE" === schema;
        const displayFolderField = isMeasure ? "MEASUREGROUP_NAME" : `${schema}_DISPLAY_FOLDER`;
        each(xml.getElementsByTagName("row"), ((_, row) => {
            const hierarchyName = "LEVEL" === schema ? getFirstChildText(row, "HIERARCHY_UNIQUE_NAME") : void 0;
            const levelNumber = getFirstChildText(row, "LEVEL_NUMBER");
            let displayFolder = getFirstChildText(row, displayFolderField);
            if (isMeasure) {
                displayFolder = translatedDisplayFolders[displayFolder] || displayFolder
            }
            if (("0" !== levelNumber || "true" !== getFirstChildText(row, `${schema}_IS_VISIBLE`)) && "2" !== getFirstChildText(row, "DIMENSION_TYPE")) {
                const dimension = isMeasure ? "DX_MEASURES" : getFirstChildText(row, "DIMENSION_UNIQUE_NAME");
                const dataField = getFirstChildText(row, `${schema}_UNIQUE_NAME`);
                result.push({
                    dimension: dimensions.names[dimension] || dimension,
                    groupIndex: levelNumber ? getNumber(levelNumber) - 1 : void 0,
                    dataField: dataField,
                    caption: getFirstChildText(row, `${schema}_CAPTION`),
                    hierarchyName: hierarchyName,
                    groupName: hierarchyName,
                    displayFolder: displayFolder,
                    isMeasure: isMeasure,
                    isDefault: !!dimensions.defaultHierarchies[dataField]
                })
            }
        }));
        return result
    }

    function parseStringWithUnicodeSymbols(str) {
        str = str.replace(/_x(....)_/g, ((_, group1) => String.fromCharCode(parseInt(group1, 16))));
        const stringArray = str.match(/\[.+?\]/gi);
        if (stringArray && stringArray.length) {
            str = stringArray[stringArray.length - 1]
        }
        return str.replace(/\[/gi, "").replace(/\]/gi, "").replace(/\$/gi, "").replace(/\./gi, " ")
    }

    function sendQuery(storeOptions, mdxString) {
        mdxString = $("<div>").text(mdxString).html();
        return execXMLA(storeOptions, stringFormat('<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Body><Execute xmlns="urn:schemas-microsoft-com:xml-analysis"><Command><Statement>{0}</Statement></Command><Properties><PropertyList><Catalog>{1}</Catalog><ShowHiddenCubes>True</ShowHiddenCubes><SspropInitAppName>Microsoft SQL Server Management Studio</SspropInitAppName><Timeout>3600</Timeout>{2}</PropertyList></Properties></Execute></Body></Envelope>', mdxString, storeOptions.catalog, getLocaleIdProperty()))
    }
    return {
        ctor(options) {
            this._options = options
        },
        getFields() {
            const options = this._options;
            const {
                catalog: catalog
            } = options;
            const {
                cube: cube
            } = options;
            const localeIdProperty = getLocaleIdProperty();
            const dimensionsRequest = execXMLA(options, stringFormat(discover, catalog, cube, "MDSCHEMA_DIMENSIONS", localeIdProperty));
            const measuresRequest = execXMLA(options, stringFormat(discover, catalog, cube, "MDSCHEMA_MEASURES", localeIdProperty));
            const hierarchiesRequest = execXMLA(options, stringFormat(discover, catalog, cube, "MDSCHEMA_HIERARCHIES", localeIdProperty));
            const levelsRequest = execXMLA(options, stringFormat(discover, catalog, cube, "MDSCHEMA_LEVELS", localeIdProperty));
            const result = new Deferred;
            when(dimensionsRequest, measuresRequest, hierarchiesRequest, levelsRequest).then(((dimensionsResponse, measuresResponse, hierarchiesResponse, levelsResponse) => {
                execXMLA(options, stringFormat(discover, catalog, cube, "MDSCHEMA_MEASUREGROUPS", localeIdProperty)).done((measureGroupsResponse => {
                    const dimensions = function(xml) {
                        const result = {
                            names: {},
                            defaultHierarchies: {}
                        };
                        each($(xml).find("row"), (function() {
                            const $row = $(this);
                            const type = $row.children("DIMENSION_TYPE").text();
                            const dimensionName = "2" === type ? "DX_MEASURES" : $row.children("DIMENSION_UNIQUE_NAME").text();
                            result.names[dimensionName] = $row.children("DIMENSION_CAPTION").text();
                            result.defaultHierarchies[$row.children("DEFAULT_HIERARCHY").text()] = true
                        }));
                        return result
                    }(dimensionsResponse);
                    const hierarchies = parseDiscoverRowSet(hierarchiesResponse, "HIERARCHY", dimensions);
                    const levels = parseDiscoverRowSet(levelsResponse, "LEVEL", dimensions);
                    const measureGroups = function(xml) {
                        const measureGroups = {};
                        each(xml.getElementsByTagName("row"), ((_, row) => {
                            measureGroups[getFirstChildText(row, "MEASUREGROUP_NAME")] = getFirstChildText(row, "MEASUREGROUP_CAPTION")
                        }));
                        return measureGroups
                    }(measureGroupsResponse);
                    const fields = parseDiscoverRowSet(measuresResponse, "MEASURE", dimensions, measureGroups).concat(hierarchies);
                    const levelsByHierarchy = {};
                    each(levels, ((_, level) => {
                        levelsByHierarchy[level.hierarchyName] = levelsByHierarchy[level.hierarchyName] || [];
                        levelsByHierarchy[level.hierarchyName].push(level)
                    }));
                    each(hierarchies, ((_, hierarchy) => {
                        if (levelsByHierarchy[hierarchy.dataField] && levelsByHierarchy[hierarchy.dataField].length > 1) {
                            hierarchy.groupName = hierarchy.hierarchyName = hierarchy.dataField;
                            fields.push.apply(fields, levelsByHierarchy[hierarchy.hierarchyName])
                        }
                    }));
                    result.resolve(fields)
                })).fail(result.reject)
            })).fail(result.reject);
            return result
        },
        load(options) {
            const result = new Deferred;
            const storeOptions = this._options;
            const parseOptions = {
                skipValues: options.skipValues
            };
            const mdxString = generateMDX(options, storeOptions.cube, parseOptions);
            let rowCountMdx;
            if (options.rowSkip || options.rowTake || options.columnTake || options.columnSkip) {
                rowCountMdx = generateMDX(extend({}, options, {
                    totalsOnly: true,
                    rowSkip: null,
                    rowTake: null,
                    columnSkip: null,
                    columnTake: null
                }), storeOptions.cube, {})
            }
            const load = () => {
                if (mdxString) {
                    when(sendQuery(storeOptions, mdxString), rowCountMdx && sendQuery(storeOptions, rowCountMdx)).done(((executeXml, rowCountXml) => {
                        const error = checkError(executeXml) || rowCountXml && checkError(rowCountXml);
                        if (!error) {
                            const response = parseResult(executeXml, parseOptions);
                            if (rowCountXml) {
                                ! function(data, options, totalCountXml) {
                                    const axes = [];
                                    const columnOptions = options.columns || [];
                                    const rowOptions = options.rows || [];
                                    if (columnOptions.length) {
                                        axes.push({})
                                    }
                                    if (rowOptions.length) {
                                        axes.push({})
                                    }
                                    const cells = parseCells(totalCountXml, [
                                        [{}],
                                        [{}, {}]
                                    ], 1);
                                    if (!columnOptions.length && rowOptions.length) {
                                        data.rowCount = Math.max(cells[0][0][0] - 1, 0)
                                    }
                                    if (!rowOptions.length && columnOptions.length) {
                                        data.columnCount = Math.max(cells[0][0][0] - 1, 0)
                                    }
                                    if (rowOptions.length && columnOptions.length) {
                                        data.rowCount = Math.max(cells[0][0][0] - 1, 0);
                                        data.columnCount = Math.max(cells[1][0][0] - 1, 0)
                                    }
                                    if (void 0 !== data.rowCount && options.rowTake) {
                                        data.rows = [...Array(options.rowSkip)].concat(data.rows);
                                        data.rows.length = data.rowCount;
                                        for (let i = 0; i < data.rows.length; i += 1) {
                                            data.rows[i] = data.rows[i] || {}
                                        }
                                    }
                                    if (void 0 !== data.columnCount && options.columnTake) {
                                        data.columns = [...Array(options.columnSkip)].concat(data.columns);
                                        data.columns.length = data.columnCount;
                                        for (let i = 0; i < data.columns.length; i += 1) {
                                            data.columns[i] = data.columns[i] || {}
                                        }
                                    }
                                }(response, options, rowCountXml)
                            }
                            result.resolve(response)
                        } else {
                            result.reject(error)
                        }
                    })).fail(result.reject)
                } else {
                    result.resolve({
                        columns: [],
                        rows: [],
                        values: [],
                        grandTotalColumnIndex: 0,
                        grandTotalRowIndex: 0
                    })
                }
            };
            if (options.delay) {
                setTimeout(load, options.delay)
            } else {
                load()
            }
            return result
        },
        supportPaging: () => true,
        getDrillDownItems(options, params) {
            const result = new Deferred;
            const storeOptions = this._options;
            const mdxString = function(options, cubeName, params) {
                const columns = options.columns || [];
                const rows = options.rows || [];
                const values = options.values && options.values.length ? options.values : [{
                    dataField: "[Measures]"
                }];
                const slice = [];
                const withArray = [];
                const axisStrings = [];
                const dataFields = prepareDataFields(withArray, values);
                const {
                    maxRowCount: maxRowCount
                } = params;
                const customColumns = params.customColumns || [];
                const customColumnsString = customColumns.length > 0 ? ` return ${customColumns.join(",")}` : "";
                createDrillDownAxisSlice(slice, columns, params.columnPath || []);
                createDrillDownAxisSlice(slice, rows, params.rowPath || []);
                if (columns.length || dataFields.length) {
                    axisStrings.push([`${dataFields[params.dataIndex]||dataFields[0]} on 0`])
                }
                const coreMDX = generateMdxCore(axisStrings, withArray, columns, rows, options.filters, slice, cubeName);
                return coreMDX ? `drillthrough${maxRowCount>0?` maxrows ${maxRowCount}`:""}${coreMDX}${customColumnsString}` : coreMDX
            }(options, storeOptions.cube, params);
            if (mdxString) {
                when(sendQuery(storeOptions, mdxString)).done((executeXml => {
                    const error = checkError(executeXml);
                    if (!error) {
                        result.resolve(function(xml) {
                            const rows = xml.getElementsByTagName("row");
                            const result = [];
                            const columnNames = {};
                            for (let i = 0; i < rows.length; i += 1) {
                                const children = rows[i].childNodes;
                                const item = {};
                                for (let j = 0; j < children.length; j += 1) {
                                    const {
                                        tagName: tagName
                                    } = children[j];
                                    const name = columnNames[tagName] = columnNames[tagName] || parseStringWithUnicodeSymbols(tagName);
                                    item[name] = getNodeText(children[j])
                                }
                                result.push(item)
                            }
                            return result
                        }(executeXml))
                    } else {
                        result.reject(error)
                    }
                })).fail(result.reject)
            } else {
                result.resolve([])
            }
            return result
        },
        key: noop,
        filter: noop
    }
}()).include(storeDrillDownMixin);
export default {
    XmlaStore: XmlaStore
};
export {
    XmlaStore
};