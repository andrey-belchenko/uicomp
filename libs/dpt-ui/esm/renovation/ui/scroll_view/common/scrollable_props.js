/**
 * DevExtreme (esm/renovation/ui/scroll_view/common/scrollable_props.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    ScrollableSimulatedProps
} from "./simulated_strategy_props";
import {
    getDefaultUseNative,
    getDefaultNativeRefreshStrategy,
    getDefaultUseSimulatedScrollbar
} from "../utils/get_default_option_value";
export const ScrollableProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(ScrollableSimulatedProps), Object.getOwnPropertyDescriptors({
    get useNative() {
        return getDefaultUseNative()
    },
    get useSimulatedScrollbar() {
        return getDefaultUseSimulatedScrollbar()
    },
    get refreshStrategy() {
        return getDefaultNativeRefreshStrategy()
    }
})));
