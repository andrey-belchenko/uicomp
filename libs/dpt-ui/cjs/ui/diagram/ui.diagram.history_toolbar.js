/**
 * DevExtreme (cjs/ui/diagram/ui.diagram.history_toolbar.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
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
class DiagramHistoryToolbar extends _uiDiagram.default {
    _getCommands() {
        return _diagram.default.getHistoryToolbarCommands(this.option("commands"), this._getExcludeCommands())
    }
    _getExcludeCommands() {
        const commands = [].concat(this.option("excludeCommands"));
        if (!this.option("isMobileView")) {
            commands.push(_diagram.default.SHOW_TOOLBOX_COMMAND_NAME)
        }
        return commands
    }
}
var _default = exports.default = DiagramHistoryToolbar;
module.exports = exports.default;
module.exports.default = exports.default;