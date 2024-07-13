/**
 * DevExtreme (esm/renovation/ui/scroll_view/common/simulated_strategy_props.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    BaseScrollableProps
} from "./base_scrollable_props";
import {
    isDesktop
} from "../utils/get_default_option_value";
export const ScrollableSimulatedProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(BaseScrollableProps), Object.getOwnPropertyDescriptors({
    inertiaEnabled: true,
    useKeyboard: true,
    get showScrollbar() {
        return isDesktop() ? "onHover" : "onScroll"
    },
    get scrollByThumb() {
        return isDesktop()
    },
    refreshStrategy: "simulated"
})));