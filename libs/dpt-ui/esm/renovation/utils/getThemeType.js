/**
 * DevExtreme (esm/renovation/utils/getThemeType.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    isMaterialBased,
    isFluent,
    isMaterial,
    isCompact,
    current
} from "../../ui/themes";
const getThemeType = () => {
    const theme = current();
    return {
        isCompact: isCompact(theme),
        isMaterial: isMaterial(theme),
        isFluent: isFluent(theme),
        isMaterialBased: isMaterialBased(theme)
    }
};
export default getThemeType;