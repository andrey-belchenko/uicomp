/**
 * DevExtreme (esm/integration/knockout.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import ko from "knockout";
import errors from "../core/errors";
import {
    compare as compareVersion
} from "../core/utils/version";
if (ko) {
    if (compareVersion(ko.version, [2, 3]) < 0) {
        throw errors.Error("E0013")
    }
}
import "./knockout/component_registrator";
import "./knockout/event_registrator";
import "./knockout/components";
import "./knockout/validation";
import "./knockout/variable_wrapper_utils";
import "./knockout/clean_node";
import "./knockout/clean_node_old";
