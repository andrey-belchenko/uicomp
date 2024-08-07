/**
 * DevExtreme (esm/ui/form/components/button_item.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import $ from "../../../core/renderer";
import {
    isDefined
} from "../../../core/utils/type";
import {
    extend
} from "../../../core/utils/extend";
const FIELD_BUTTON_ITEM_CLASS = "dx-field-button-item";
export function renderButtonItem(_ref) {
    let {
        item: item,
        $parent: $parent,
        rootElementCssClassList: rootElementCssClassList,
        validationGroup: validationGroup,
        createComponentCallback: createComponentCallback
    } = _ref;
    const $rootElement = $("<div>").appendTo($parent).addClass(rootElementCssClassList.join(" ")).addClass("dx-field-button-item").css("textAlign", convertAlignmentToTextAlign(item.horizontalAlignment));
    $parent.css("justifyContent", convertAlignmentToJustifyContent(item.verticalAlignment));
    const $button = $("<div>").appendTo($rootElement);
    return {
        $rootElement: $rootElement,
        buttonInstance: createComponentCallback($button, "dxButton", extend({
            validationGroup: validationGroup
        }, item.buttonOptions))
    }
}

function convertAlignmentToTextAlign(horizontalAlignment) {
    return isDefined(horizontalAlignment) ? horizontalAlignment : "right"
}

function convertAlignmentToJustifyContent(verticalAlignment) {
    switch (verticalAlignment) {
        case "center":
            return "center";
        case "bottom":
            return "flex-end";
        default:
            return "flex-start"
    }
}
