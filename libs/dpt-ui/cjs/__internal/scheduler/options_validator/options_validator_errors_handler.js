/**
 * DevExtreme (cjs/__internal/scheduler/options_validator/options_validator_errors_handler.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SchedulerOptionsValidatorErrorsHandler = void 0;
var _ui = _interopRequireDefault(require("../../../ui/widget/ui.errors"));
var _index = require("./core/index");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const GLOBAL_ERROR_HANDLER = {
    logError: errorCode => {
        _ui.default.log(errorCode)
    },
    throwError: errorCode => {
        throw _ui.default.Error(errorCode)
    }
};
class SchedulerOptionsValidatorErrorsHandler extends _index.OptionsValidatorErrorHandler {
    constructor() {
        super({
            startDayHour: "E1058",
            endDayHour: "E1058",
            startDayHourAndEndDayHour: "E1058",
            offset: "E1061",
            cellDuration: "E1062",
            cellDurationAndVisibleInterval: "E1062"
        }, GLOBAL_ERROR_HANDLER)
    }
}
exports.SchedulerOptionsValidatorErrorsHandler = SchedulerOptionsValidatorErrorsHandler;
