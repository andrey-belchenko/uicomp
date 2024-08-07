/**
 * DevExtreme (renovation/ui/scroll_view/utils/get_permissible_wheel_direction.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
exports.permissibleWheelDirection = permissibleWheelDirection;
var _consts = require("../common/consts");

function permissibleWheelDirection(direction, isShiftKey) {
    switch (direction) {
        case _consts.DIRECTION_HORIZONTAL:
            return _consts.DIRECTION_HORIZONTAL;
        case _consts.DIRECTION_VERTICAL:
            return _consts.DIRECTION_VERTICAL;
        default:
            return isShiftKey ? _consts.DIRECTION_HORIZONTAL : _consts.DIRECTION_VERTICAL
    }
}
