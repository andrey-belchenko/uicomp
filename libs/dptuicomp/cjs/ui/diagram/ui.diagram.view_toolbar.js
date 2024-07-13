/**
 * DevExtreme (cjs/ui/diagram/ui.diagram.view_toolbar.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _uiDiagram = _interopRequireDefault(require("./ui.diagram.toolbar"));
var _diagram = _interopRequireDefault(require("./diagram.commands_manager"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
class DiagramViewToolbar extends _uiDiagram.default {
    _getCommands() {
        return _diagram.default.getViewToolbarCommands(this.option("commands"), this.option("excludeCommands"))
    }
}
var _default = exports.default = DiagramViewToolbar;
module.exports = exports.default;
module.exports.default = exports.default;