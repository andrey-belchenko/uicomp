/**
 * DevExtreme (renovation/ui/box/box.j.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _component = _interopRequireDefault(require("../../component_wrapper/common/component"));
var _box = require("./box");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
class Box extends _component.default {
    get _propsInfo() {
        return {
            twoWay: [],
            allowNull: [],
            elements: [],
            templates: [],
            props: ["direction", "align", "crossAlign"]
        }
    }
    get _viewComponent() {
        return _box.Box
    }
}
exports.default = Box;
(0, _component_registrator.default)("dxBox", Box);
module.exports = exports.default;
module.exports.default = exports.default;
