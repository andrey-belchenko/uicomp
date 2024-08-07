/**
 * DevExtreme (esm/viz/tree_map/tiling.rotated_slice_and_dice.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    getAlgorithm,
    addAlgorithm
} from "./tiling";
const sliceAndDiceAlgorithm = getAlgorithm("sliceanddice");

function rotatedSliceAndDice(data) {
    data.isRotated = !data.isRotated;
    return sliceAndDiceAlgorithm.call(this, data)
}
addAlgorithm("rotatedsliceanddice", rotatedSliceAndDice);
