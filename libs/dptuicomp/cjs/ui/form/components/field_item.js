/**
 * DevExtreme (cjs/ui/form/components/field_item.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.TOGGLE_CONTROLS_PADDING_CLASS = exports.LABEL_VERTICAL_ALIGNMENT_CLASS = exports.LABEL_HORIZONTAL_ALIGNMENT_CLASS = exports.FLEX_LAYOUT_CLASS = exports.FIELD_ITEM_REQUIRED_CLASS = exports.FIELD_ITEM_OPTIONAL_CLASS = exports.FIELD_ITEM_LABEL_ALIGN_CLASS = exports.FIELD_ITEM_HELP_TEXT_CLASS = exports.FIELD_ITEM_CONTENT_WRAPPER_CLASS = exports.FIELD_ITEM_CONTENT_LOCATION_CLASS = void 0;
exports.renderFieldItem = renderFieldItem;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _click = require("../../../events/click");
var _element = require("../../../core/element");
var _inflector = require("../../../core/utils/inflector");
var _string = require("../../../core/utils/string");
var _themes = require("../../themes");
var _ui = _interopRequireDefault(require("../../widget/ui.errors"));
var _validator = _interopRequireDefault(require("../../validator"));
var _constants = require("../constants");
var _label = require("./label");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const FLEX_LAYOUT_CLASS = exports.FLEX_LAYOUT_CLASS = "dx-flex-layout";
const FIELD_ITEM_OPTIONAL_CLASS = exports.FIELD_ITEM_OPTIONAL_CLASS = "dx-field-item-optional";
const FIELD_ITEM_REQUIRED_CLASS = exports.FIELD_ITEM_REQUIRED_CLASS = "dx-field-item-required";
const FIELD_ITEM_CONTENT_WRAPPER_CLASS = exports.FIELD_ITEM_CONTENT_WRAPPER_CLASS = "dx-field-item-content-wrapper";
const FIELD_ITEM_CONTENT_LOCATION_CLASS = exports.FIELD_ITEM_CONTENT_LOCATION_CLASS = "dx-field-item-content-location-";
const FIELD_ITEM_LABEL_ALIGN_CLASS = exports.FIELD_ITEM_LABEL_ALIGN_CLASS = "dx-field-item-label-align";
const FIELD_ITEM_HELP_TEXT_CLASS = exports.FIELD_ITEM_HELP_TEXT_CLASS = "dx-field-item-help-text";
const LABEL_VERTICAL_ALIGNMENT_CLASS = exports.LABEL_VERTICAL_ALIGNMENT_CLASS = "dx-label-v-align";
const LABEL_HORIZONTAL_ALIGNMENT_CLASS = exports.LABEL_HORIZONTAL_ALIGNMENT_CLASS = "dx-label-h-align";
const TOGGLE_CONTROLS_PADDING_CLASS = exports.TOGGLE_CONTROLS_PADDING_CLASS = "dx-toggle-controls-paddings";
const TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";
const VALIDATION_TARGET_CLASS = "dx-validation-target";
const INVALID_CLASS = "dx-invalid";

function renderFieldItem(_ref) {
    let {
        $parent: $parent,
        rootElementCssClassList: rootElementCssClassList,
        formOrLayoutManager: formOrLayoutManager,
        createComponentCallback: createComponentCallback,
        labelOptions: labelOptions,
        labelNeedBaselineAlign: labelNeedBaselineAlign,
        labelLocation: labelLocation,
        needRenderLabel: needRenderLabel,
        formLabelLocation: formLabelLocation,
        item: item,
        editorOptions: editorOptions,
        isSimpleItem: isSimpleItem,
        isRequired: isRequired,
        template: template,
        helpID: helpID,
        labelID: labelID,
        name: name,
        helpText: helpText,
        requiredMessageTemplate: requiredMessageTemplate,
        validationGroup: validationGroup
    } = _ref;
    const $rootElement = (0, _renderer.default)("<div>").addClass(rootElementCssClassList.join(" ")).appendTo($parent);
    $rootElement.addClass(isRequired ? FIELD_ITEM_REQUIRED_CLASS : FIELD_ITEM_OPTIONAL_CLASS);
    if (isSimpleItem) {
        $rootElement.addClass(FLEX_LAYOUT_CLASS)
    }
    if (isSimpleItem && labelNeedBaselineAlign) {
        $rootElement.addClass(FIELD_ITEM_LABEL_ALIGN_CLASS)
    }
    const $fieldEditorContainer = (0, _renderer.default)("<div>");
    $fieldEditorContainer.data("dx-form-item", item);
    $fieldEditorContainer.addClass(_constants.FIELD_ITEM_CONTENT_CLASS).addClass(FIELD_ITEM_CONTENT_LOCATION_CLASS + {
        right: "left",
        left: "right",
        top: "bottom"
    } [formLabelLocation]);
    let $label = null;
    if (needRenderLabel) {
        if (labelOptions.labelTemplate) {
            labelOptions.labelTemplateData = getTemplateData(item, editorOptions, formOrLayoutManager)
        }
        $label = (0, _label.renderLabel)(labelOptions)
    }
    if ($label) {
        const {
            editorType: editorType
        } = item;
        $rootElement.append($label);
        if ("top" === labelLocation || "left" === labelLocation) {
            $rootElement.append($fieldEditorContainer)
        }
        if ("right" === labelLocation) {
            $rootElement.prepend($fieldEditorContainer)
        }
        if ("top" === labelLocation) {
            $rootElement.addClass(LABEL_VERTICAL_ALIGNMENT_CLASS)
        } else {
            $rootElement.addClass(LABEL_HORIZONTAL_ALIGNMENT_CLASS)
        }
        if ("dxCheckBox" === editorType || "dxSwitch" === editorType) {
            _events_engine.default.on($label, _click.name, (function() {
                _events_engine.default.trigger($fieldEditorContainer.children(), _click.name)
            }))
        }
        const toggleControls = ["dxCheckBox", "dxSwitch", "dxRadioGroup"];
        const isToggleControls = toggleControls.includes(editorType);
        const labelAlignment = labelOptions.alignment;
        const isLabelAlignmentLeft = "left" === labelAlignment || !labelAlignment;
        const hasNotTemplate = !template;
        const isLabelOnTop = "top" === labelLocation;
        if (hasNotTemplate && isToggleControls && isLabelOnTop && isLabelAlignmentLeft) {
            $fieldEditorContainer.addClass(TOGGLE_CONTROLS_PADDING_CLASS)
        }
    } else {
        $rootElement.append($fieldEditorContainer)
    }
    let widgetInstance;
    if (template) {
        template.render({
            container: (0, _element.getPublicElement)($fieldEditorContainer),
            model: getTemplateData(item, editorOptions, formOrLayoutManager),
            onRendered() {
                const $validationTarget = getValidationTarget($fieldEditorContainer);
                const validationTargetInstance = tryGetValidationTargetInstance($validationTarget);
                subscribeWrapperInvalidClassToggle(validationTargetInstance)
            }
        })
    } else {
        const $div = (0, _renderer.default)("<div>").appendTo($fieldEditorContainer);
        try {
            widgetInstance = createComponentCallback($div, item.editorType, editorOptions);
            widgetInstance.setAria("describedby", helpID);
            if (labelID) {
                widgetInstance.setAria("labelledby", labelID)
            }
            widgetInstance.setAria("required", isRequired)
        } catch (e) {
            _ui.default.log("E1035", e.message)
        }
    }
    const $validationTarget = getValidationTarget($fieldEditorContainer);
    const validationTargetInstance = $validationTarget && $validationTarget.data(VALIDATION_TARGET_CLASS);
    if (validationTargetInstance) {
        const isItemHaveCustomLabel = item.label && item.label.text;
        const itemName = isItemHaveCustomLabel ? null : name;
        const fieldName = isItemHaveCustomLabel ? item.label.text : itemName && (0, _inflector.captionize)(itemName);
        let validationRules;
        if (isSimpleItem) {
            if (item.validationRules) {
                validationRules = item.validationRules
            } else {
                const requiredMessage = (0, _string.format)(requiredMessageTemplate, fieldName || "");
                validationRules = item.isRequired ? [{
                    type: "required",
                    message: requiredMessage
                }] : null
            }
        }
        if (Array.isArray(validationRules) && validationRules.length) {
            createComponentCallback($validationTarget, _validator.default, {
                validationRules: validationRules,
                validationGroup: validationGroup,
                dataGetter: function() {
                    return {
                        formItem: item
                    }
                }
            })
        }
        subscribeWrapperInvalidClassToggle(validationTargetInstance)
    }
    if (helpText && isSimpleItem) {
        const $editorParent = $fieldEditorContainer.parent();
        $editorParent.append((0, _renderer.default)("<div>").addClass(FIELD_ITEM_CONTENT_WRAPPER_CLASS).append($fieldEditorContainer).append((0, _renderer.default)("<div>").addClass(FIELD_ITEM_HELP_TEXT_CLASS).attr("id", helpID).text(helpText)))
    }
    return {
        $fieldEditorContainer: $fieldEditorContainer,
        $rootElement: $rootElement,
        widgetInstance: widgetInstance
    }
}

function getValidationTarget($fieldEditorContainer) {
    const $editor = $fieldEditorContainer.children().first();
    return $editor.hasClass(TEMPLATE_WRAPPER_CLASS) ? $editor.children().first() : $editor
}

function tryGetValidationTargetInstance($validationTarget) {
    var _$validationTarget$pa;
    return (null === $validationTarget || void 0 === $validationTarget ? void 0 : $validationTarget.data(VALIDATION_TARGET_CLASS)) || (null === $validationTarget || void 0 === $validationTarget || null === (_$validationTarget$pa = $validationTarget.parent) || void 0 === _$validationTarget$pa || null === (_$validationTarget$pa = _$validationTarget$pa.call($validationTarget)) || void 0 === _$validationTarget$pa ? void 0 : _$validationTarget$pa.data(VALIDATION_TARGET_CLASS))
}

function subscribeWrapperInvalidClassToggle(validationTargetInstance) {
    if (validationTargetInstance && (0, _themes.isMaterialBased)()) {
        const wrapperClass = `.${FIELD_ITEM_CONTENT_WRAPPER_CLASS}`;
        const toggleInvalidClass = _ref2 => {
            let {
                element: element,
                component: component
            } = _ref2;
            const {
                isValid: isValid,
                validationMessageMode: validationMessageMode
            } = component.option();
            (0, _renderer.default)(element).parents(wrapperClass).toggleClass(INVALID_CLASS, false === isValid && (component._isFocused() || "always" === validationMessageMode))
        };
        validationTargetInstance.on("optionChanged", (e => {
            if ("isValid" !== e.name) {
                return
            }
            toggleInvalidClass(e)
        }));
        validationTargetInstance.on("focusIn", toggleInvalidClass).on("focusOut", toggleInvalidClass).on("enterKey", toggleInvalidClass)
    }
}

function getTemplateData(item, editorOptions, formOrLayoutManager) {
    return {
        dataField: item.dataField,
        editorType: item.editorType,
        editorOptions: editorOptions,
        component: formOrLayoutManager,
        name: item.name
    }
}