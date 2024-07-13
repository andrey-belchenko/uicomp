/**
 * DevExtreme (esm/ui/form/ui.form.layout_manager.utils.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    extend
} from "../../core/utils/extend";
import {
    isDefined
} from "../../core/utils/type";
import {
    each
} from "../../core/utils/iterator";
import {
    captionize
} from "../../core/utils/inflector";
import Guid from "../../core/guid";
import {
    SIMPLE_ITEM_TYPE
} from "./constants";
const EDITORS_WITH_ARRAY_VALUE = ["dxTagBox", "dxRangeSlider", "dxDateRangeBox"];
export const EDITORS_WITHOUT_LABELS = ["dxCalendar", "dxCheckBox", "dxHtmlEditor", "dxRadioGroup", "dxRangeSlider", "dxSlider", "dxSwitch"];
export function convertToRenderFieldItemOptions(_ref) {
    let {
        $parent: $parent,
        rootElementCssClassList: rootElementCssClassList,
        formOrLayoutManager: formOrLayoutManager,
        createComponentCallback: createComponentCallback,
        item: item,
        template: template,
        labelTemplate: labelTemplate,
        name: name,
        formLabelLocation: formLabelLocation,
        requiredMessageTemplate: requiredMessageTemplate,
        validationGroup: validationGroup,
        editorValue: editorValue,
        canAssignUndefinedValueToEditor: canAssignUndefinedValueToEditor,
        editorValidationBoundary: editorValidationBoundary,
        editorStylingMode: editorStylingMode,
        showColonAfterLabel: showColonAfterLabel,
        managerLabelLocation: managerLabelLocation,
        itemId: itemId,
        managerMarkOptions: managerMarkOptions,
        labelMode: labelMode,
        onLabelTemplateRendered: onLabelTemplateRendered
    } = _ref;
    const isRequired = isDefined(item.isRequired) ? item.isRequired : !!_hasRequiredRuleInSet(item.validationRules);
    const isSimpleItem = item.itemType === SIMPLE_ITEM_TYPE;
    const helpID = item.helpText ? "dx-" + new Guid : null;
    const labelOptions = _convertToLabelOptions({
        item: item,
        id: itemId,
        isRequired: isRequired,
        managerMarkOptions: managerMarkOptions,
        showColonAfterLabel: showColonAfterLabel,
        labelLocation: managerLabelLocation,
        formLabelMode: labelMode,
        labelTemplate: labelTemplate,
        onLabelTemplateRendered: onLabelTemplateRendered
    });
    const needRenderLabel = labelOptions.visible && (labelOptions.text || labelOptions.labelTemplate && isSimpleItem);
    const {
        location: labelLocation,
        labelID: labelID
    } = labelOptions;
    const labelNeedBaselineAlign = "top" !== labelLocation && ["dxTextArea", "dxRadioGroup", "dxCalendar", "dxHtmlEditor"].includes(item.editorType);
    const editorOptions = _convertToEditorOptions({
        editorType: item.editorType,
        editorValue: editorValue,
        defaultEditorName: item.dataField,
        canAssignUndefinedValueToEditor: canAssignUndefinedValueToEditor,
        externalEditorOptions: item.editorOptions,
        editorInputId: itemId,
        editorValidationBoundary: editorValidationBoundary,
        editorStylingMode: editorStylingMode,
        formLabelMode: labelMode,
        labelText: labelOptions.textWithoutColon,
        labelMark: labelOptions.markOptions.showRequiredMark ? String.fromCharCode(160) + labelOptions.markOptions.requiredMark : ""
    });
    const needRenderOptionalMarkAsHelpText = labelOptions.markOptions.showOptionalMark && !labelOptions.visible && "hidden" !== editorOptions.labelMode && !isDefined(item.helpText);
    const helpText = needRenderOptionalMarkAsHelpText ? labelOptions.markOptions.optionalMark : item.helpText;
    return {
        $parent: $parent,
        rootElementCssClassList: rootElementCssClassList,
        formOrLayoutManager: formOrLayoutManager,
        createComponentCallback: createComponentCallback,
        labelOptions: labelOptions,
        labelNeedBaselineAlign: labelNeedBaselineAlign,
        labelLocation: labelLocation,
        needRenderLabel: needRenderLabel,
        item: item,
        isSimpleItem: isSimpleItem,
        isRequired: isRequired,
        template: template,
        helpID: helpID,
        labelID: labelID,
        name: name,
        helpText: helpText,
        formLabelLocation: formLabelLocation,
        requiredMessageTemplate: requiredMessageTemplate,
        validationGroup: validationGroup,
        editorOptions: editorOptions
    }
}
export function getLabelMarkText(_ref2) {
    let {
        showRequiredMark: showRequiredMark,
        requiredMark: requiredMark,
        showOptionalMark: showOptionalMark,
        optionalMark: optionalMark
    } = _ref2;
    if (!showRequiredMark && !showOptionalMark) {
        return ""
    }
    return String.fromCharCode(160) + (showRequiredMark ? requiredMark : optionalMark)
}
export function convertToLabelMarkOptions(_ref3, isRequired) {
    let {
        showRequiredMark: showRequiredMark,
        requiredMark: requiredMark,
        showOptionalMark: showOptionalMark,
        optionalMark: optionalMark
    } = _ref3;
    return {
        showRequiredMark: showRequiredMark && isRequired,
        requiredMark: requiredMark,
        showOptionalMark: showOptionalMark && !isRequired,
        optionalMark: optionalMark
    }
}

function _convertToEditorOptions(_ref4) {
    let {
        editorType: editorType,
        defaultEditorName: defaultEditorName,
        editorValue: editorValue,
        canAssignUndefinedValueToEditor: canAssignUndefinedValueToEditor,
        externalEditorOptions: externalEditorOptions,
        editorInputId: editorInputId,
        editorValidationBoundary: editorValidationBoundary,
        editorStylingMode: editorStylingMode,
        formLabelMode: formLabelMode,
        labelText: labelText,
        labelMark: labelMark
    } = _ref4;
    const editorOptionsWithValue = {};
    if (void 0 !== editorValue || canAssignUndefinedValueToEditor) {
        editorOptionsWithValue.value = editorValue
    }
    if (-1 !== EDITORS_WITH_ARRAY_VALUE.indexOf(editorType)) {
        editorOptionsWithValue.value = editorOptionsWithValue.value || []
    }
    let labelMode = null === externalEditorOptions || void 0 === externalEditorOptions ? void 0 : externalEditorOptions.labelMode;
    if (!isDefined(labelMode)) {
        labelMode = "outside" === formLabelMode ? "hidden" : formLabelMode
    }
    const stylingMode = (null === externalEditorOptions || void 0 === externalEditorOptions ? void 0 : externalEditorOptions.stylingMode) || editorStylingMode;
    const result = extend(true, editorOptionsWithValue, externalEditorOptions, {
        inputAttr: {
            id: editorInputId
        },
        validationBoundary: editorValidationBoundary,
        stylingMode: stylingMode,
        label: labelText,
        labelMode: labelMode,
        labelMark: labelMark
    });
    if (externalEditorOptions) {
        if (result.dataSource) {
            result.dataSource = externalEditorOptions.dataSource
        }
        if (result.items) {
            result.items = externalEditorOptions.items
        }
    }
    if (defaultEditorName && !result.name) {
        result.name = defaultEditorName
    }
    return result
}

function _hasRequiredRuleInSet(rules) {
    let hasRequiredRule;
    if (rules && rules.length) {
        each(rules, (function(index, rule) {
            if ("required" === rule.type) {
                hasRequiredRule = true;
                return false
            }
        }))
    }
    return hasRequiredRule
}

function _convertToLabelOptions(_ref5) {
    let {
        item: item,
        id: id,
        isRequired: isRequired,
        managerMarkOptions: managerMarkOptions,
        showColonAfterLabel: showColonAfterLabel,
        labelLocation: labelLocation,
        labelTemplate: labelTemplate,
        formLabelMode: formLabelMode,
        onLabelTemplateRendered: onLabelTemplateRendered
    } = _ref5;
    const isEditorWithoutLabels = EDITORS_WITHOUT_LABELS.includes(item.editorType);
    const labelOptions = extend({
        showColon: showColonAfterLabel,
        location: labelLocation,
        id: id,
        visible: "outside" === formLabelMode || isEditorWithoutLabels && "hidden" !== formLabelMode,
        isRequired: isRequired
    }, item ? item.label : {}, {
        markOptions: convertToLabelMarkOptions(managerMarkOptions, isRequired),
        labelTemplate: labelTemplate,
        onLabelTemplateRendered: onLabelTemplateRendered
    });
    if (["dxRadioGroup", "dxCheckBox", "dxLookup", "dxSlider", "dxRangeSlider", "dxSwitch", "dxHtmlEditor", "dxDateRangeBox"].includes(item.editorType)) {
        labelOptions.labelID = `dx-label-${new Guid}`
    }
    if (!labelOptions.text && item.dataField) {
        labelOptions.text = captionize(item.dataField)
    }
    if (labelOptions.text) {
        labelOptions.textWithoutColon = labelOptions.text;
        labelOptions.text += labelOptions.showColon ? ":" : ""
    }
    return labelOptions
}