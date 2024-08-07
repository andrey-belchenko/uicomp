/**
 * DevExtreme (cjs/viz/sankey/data_validator.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _graph = _interopRequireDefault(require("./graph"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const validator = {
    validate: function(data, incidentOccurred) {
        let result = null;
        if (this._hasCycle(data)) {
            result = "E2006";
            incidentOccurred("E2006")
        }
        return result
    },
    _hasCycle: function(data) {
        return _graph.default.struct.hasCycle(data)
    }
};
var _default = exports.default = validator;
module.exports = exports.default;
module.exports.default = exports.default;
