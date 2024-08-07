/**
 * DevExtreme (esm/__internal/scheduler/m_loading.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import $ from "../../core/renderer";
import {
    Deferred
} from "../../core/utils/deferred";
import {
    value as viewPort
} from "../../core/utils/view_port";
import LoadPanel from "../../ui/load_panel";
let loading = null;
const createLoadPanel = function(options) {
    return new LoadPanel($("<div>").appendTo(options && options.container || viewPort()), options)
};
const removeLoadPanel = function() {
    if (!loading) {
        return
    }
    loading.$element().remove();
    loading = null
};
export function show(options) {
    removeLoadPanel();
    loading = createLoadPanel(options);
    return loading.show()
}
export function hide() {
    if (!loading) {
        return (new Deferred).resolve()
    }
    return loading.hide().done(removeLoadPanel).promise()
}
