/**
 * DevExtreme (cjs/data/query.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _query_implementation = require("./query_implementation");
const query = function() {
    const impl = Array.isArray(arguments[0]) ? "array" : "remote";
    return _query_implementation.queryImpl[impl].apply(this, arguments)
};
var _default = exports.default = query;
module.exports = exports.default;
module.exports.default = exports.default;
