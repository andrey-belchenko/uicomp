/*!
 * devextreme-react
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file in the root of the project for details.
 *
 * https://github.com/DevExpress/devextreme-react
 */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOption = void 0;
let config = {
    useLegacyTemplateEngine: false,
};
function setOptions(options) {
    config = { ...config, ...options };
}
function getOption(optionName) {
    return config[optionName];
}
exports.getOption = getOption;
exports.default = setOptions;
