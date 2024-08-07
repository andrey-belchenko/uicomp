/**
 * DevExtreme (cjs/core/templates/function_template.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
exports.FunctionTemplate = void 0;
var _template_base = require("./template_base");
var _dom = require("../utils/dom");
class FunctionTemplate extends _template_base.TemplateBase {
    constructor(render) {
        super();
        this._render = render
    }
    _renderCore(options) {
        return (0, _dom.normalizeTemplateElement)(this._render(options))
    }
}
exports.FunctionTemplate = FunctionTemplate;
