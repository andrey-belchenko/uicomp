/**
 * DevExtreme (esm/animation/translator.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import $ from "../core/renderer";
import {
    data as elementData,
    removeData
} from "../core/element_data";
import {
    type
} from "../core/utils/type";
const TRANSLATOR_DATA_KEY = "dxTranslator";
const TRANSFORM_MATRIX_REGEX = /matrix(3d)?\((.+?)\)/;
const TRANSLATE_REGEX = /translate(?:3d)?\((.+?)\)/;
export const locate = function($element) {
    $element = $($element);
    const translate = getTranslate($element);
    return {
        left: translate.x,
        top: translate.y
    }
};

function isPercentValue(value) {
    return "string" === type(value) && "%" === value[value.length - 1]
}

function cacheTranslate($element, translate) {
    if ($element.length) {
        elementData($element.get(0), "dxTranslator", translate)
    }
}
export const clearCache = function($element) {
    if ($element.length) {
        removeData($element.get(0), "dxTranslator")
    }
};
export const getTranslateCss = function(translate) {
    translate.x = translate.x || 0;
    translate.y = translate.y || 0;
    const xValueString = isPercentValue(translate.x) ? translate.x : translate.x + "px";
    const yValueString = isPercentValue(translate.y) ? translate.y : translate.y + "px";
    return "translate(" + xValueString + ", " + yValueString + ")"
};
export const getTranslate = function($element) {
    let result = $element.length ? elementData($element.get(0), "dxTranslator") : null;
    if (!result) {
        const transformValue = $element.css("transform") || getTranslateCss({
            x: 0,
            y: 0
        });
        let matrix = transformValue.match(TRANSFORM_MATRIX_REGEX);
        const is3D = matrix && matrix[1];
        if (matrix) {
            matrix = matrix[2].split(",");
            if ("3d" === is3D) {
                matrix = matrix.slice(12, 15)
            } else {
                matrix.push(0);
                matrix = matrix.slice(4, 7)
            }
        } else {
            matrix = [0, 0, 0]
        }
        result = {
            x: parseFloat(matrix[0]),
            y: parseFloat(matrix[1]),
            z: parseFloat(matrix[2])
        };
        cacheTranslate($element, result)
    }
    return result
};
export const move = function($element, position) {
    $element = $($element);
    const left = position.left;
    const top = position.top;
    let translate;
    if (void 0 === left) {
        translate = getTranslate($element);
        translate.y = top || 0
    } else if (void 0 === top) {
        translate = getTranslate($element);
        translate.x = left || 0
    } else {
        translate = {
            x: left || 0,
            y: top || 0,
            z: 0
        };
        cacheTranslate($element, translate)
    }
    $element.css({
        transform: getTranslateCss(translate)
    });
    if (isPercentValue(left) || isPercentValue(top)) {
        clearCache($element)
    }
};
export const resetPosition = function($element, finishTransition) {
    $element = $($element);
    let originalTransition;
    const stylesConfig = {
        left: 0,
        top: 0,
        transform: "none"
    };
    if (finishTransition) {
        originalTransition = $element.css("transition");
        stylesConfig.transition = "none"
    }
    $element.css(stylesConfig);
    clearCache($element);
    if (finishTransition) {
        $element.get(0).offsetHeight;
        $element.css("transition", originalTransition)
    }
};
export const parseTranslate = function(translateString) {
    let result = translateString.match(TRANSLATE_REGEX);
    if (!result || !result[1]) {
        return
    }
    result = result[1].split(",");
    result = {
        x: parseFloat(result[0]),
        y: parseFloat(result[1]),
        z: parseFloat(result[2])
    };
    return result
};