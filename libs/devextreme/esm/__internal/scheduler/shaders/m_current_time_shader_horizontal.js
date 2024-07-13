/**
 * DevExtreme (esm/__internal/scheduler/shaders/m_current_time_shader_horizontal.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    getBoundingRect
} from "../../../core/utils/position";
import {
    setWidth
} from "../../../core/utils/size";
import CurrentTimeShader from "./m_current_time_shader";
class HorizontalCurrentTimeShader extends CurrentTimeShader {
    renderShader() {
        const groupCount = this._workSpace._isHorizontalGroupedWorkSpace() ? this._workSpace._getGroupCount() : 1;
        for (let i = 0; i < groupCount; i += 1) {
            const isFirstShader = 0 === i;
            const $shader = isFirstShader ? this._$shader : this.createShader();
            if (this._workSpace.isGroupedByDate()) {
                this._customizeGroupedByDateShader($shader, i)
            } else {
                this._customizeShader($shader, i)
            }!isFirstShader && this._shader.push($shader)
        }
    }
    _customizeShader($shader, groupIndex) {
        const shaderWidth = this._workSpace.getIndicationWidth();
        this._applyShaderWidth($shader, shaderWidth);
        if (groupIndex >= 1) {
            const workSpace = this._workSpace;
            const indicationWidth = workSpace._getCellCount() * workSpace.getCellWidth();
            $shader.css("left", indicationWidth)
        } else {
            $shader.css("left", 0)
        }
    }
    _applyShaderWidth($shader, width) {
        const maxWidth = getBoundingRect(this._$container.get(0)).width;
        if (width > maxWidth) {
            width = maxWidth
        }
        if (width > 0) {
            setWidth($shader, width)
        }
    }
    _customizeGroupedByDateShader($shader, groupIndex) {
        const cellCount = this._workSpace.getIndicationCellCount();
        const integerPart = Math.floor(cellCount);
        const fractionPart = cellCount - integerPart;
        const isFirstShaderPart = 0 === groupIndex;
        const workSpace = this._workSpace;
        const shaderWidth = isFirstShaderPart ? workSpace.getIndicationWidth() : fractionPart * workSpace.getCellWidth();
        let shaderLeft;
        this._applyShaderWidth($shader, shaderWidth);
        if (isFirstShaderPart) {
            shaderLeft = workSpace._getCellCount() * workSpace.getCellWidth() * groupIndex
        } else {
            shaderLeft = workSpace.getCellWidth() * integerPart * workSpace._getGroupCount() + groupIndex * workSpace.getCellWidth()
        }
        $shader.css("left", shaderLeft)
    }
}
export default HorizontalCurrentTimeShader;
