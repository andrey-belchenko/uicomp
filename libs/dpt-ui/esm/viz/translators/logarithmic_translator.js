/**
 * DevExtreme (esm/viz/translators/logarithmic_translator.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    raiseToExt as raiseTo,
    getLogExt as getLog
} from "../core/utils";
import {
    isDefined
} from "../../core/utils/type";
export default {
    fromValue: function(value) {
        return null !== value ? getLog(value, this._canvasOptions.base, this._businessRange.allowNegatives, this._businessRange.linearThreshold) : value
    },
    toValue: function(value) {
        return null !== value ? raiseTo(value, this._canvasOptions.base, this._businessRange.allowNegatives, this._businessRange.linearThreshold) : value
    },
    getMinBarSize: function(minBarSize) {
        const visibleArea = this.getCanvasVisibleArea();
        const minValue = this.from(visibleArea.min + minBarSize);
        const canvasOptions = this._canvasOptions;
        const startValue = this.fromValue(this.from(visibleArea.min));
        const endValue = this.fromValue(minValue ?? this.from(visibleArea.max));
        const value = Math.abs(startValue - endValue);
        return Math.pow(canvasOptions.base, value)
    },
    checkMinBarSize: function(initialValue, minShownValue, stackValue) {
        const canvasOptions = this._canvasOptions;
        const prevValue = stackValue ? stackValue - initialValue : 0;
        const baseMethod = this.constructor.prototype.checkMinBarSize;
        let minBarSize;
        let updateValue;
        if (isDefined(minShownValue) && prevValue > 0) {
            minBarSize = baseMethod(this.fromValue(stackValue / prevValue), this.fromValue(minShownValue) - canvasOptions.rangeMinVisible);
            updateValue = Math.pow(canvasOptions.base, this.fromValue(prevValue) + minBarSize) - prevValue
        } else {
            updateValue = baseMethod(initialValue, minShownValue)
        }
        return updateValue
    }
};