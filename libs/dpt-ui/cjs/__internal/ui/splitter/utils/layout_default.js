/**
 * DevExtreme (cjs/__internal/ui/splitter/utils/layout_default.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getDefaultLayout = getDefaultLayout;
var _type = require("../../../../core/utils/type");
var _utils = require("../../../../localization/utils");
var _layout = require("./layout");
var _number_comparison = require("./number_comparison");

function getDefaultLayout(layoutRestrictions) {
    let layout = new Array(layoutRestrictions.length).fill(null);
    let numPanelsWithDefinedSize = 0;
    let remainingSize = 100;
    layoutRestrictions.forEach(((paneRestrictions, index) => {
        const {
            size: size,
            visible: visible,
            collapsed: collapsed,
            collapsedSize: collapsedSize = 0
        } = paneRestrictions;
        if (false === visible) {
            numPanelsWithDefinedSize += 1;
            layout[index] = 0;
            remainingSize -= 0;
            return
        }
        if (true === collapsed) {
            numPanelsWithDefinedSize += 1;
            layout[index] = collapsedSize;
            remainingSize -= collapsedSize;
            return
        }
        if ((0, _type.isDefined)(size)) {
            numPanelsWithDefinedSize += 1;
            if (remainingSize - size < 0) {
                layout[index] = remainingSize;
                remainingSize = 0;
                return
            }
            layout[index] = size;
            remainingSize -= size
        }
    }));
    let panelsToDistribute = layoutRestrictions.length - numPanelsWithDefinedSize;
    if (0 === panelsToDistribute) {
        layout[(0, _layout.findLastIndexOfVisibleItem)(layoutRestrictions)] += remainingSize;
        remainingSize = 0
    } else {
        layoutRestrictions.forEach(((paneRestrictions, index) => {
            if (null === layout[index]) {
                if ((0, _type.isDefined)(paneRestrictions.maxSize) && 1 === panelsToDistribute) {
                    layout[index] = remainingSize > paneRestrictions.maxSize ? remainingSize : paneRestrictions.maxSize;
                    remainingSize -= layout[index];
                    numPanelsWithDefinedSize += 1
                } else if ((0, _type.isDefined)(paneRestrictions.maxSize) && paneRestrictions.maxSize < remainingSize / panelsToDistribute) {
                    layout[index] = paneRestrictions.maxSize;
                    remainingSize -= paneRestrictions.maxSize;
                    numPanelsWithDefinedSize += 1;
                    panelsToDistribute -= 1
                }
            }
        }));
        panelsToDistribute = layoutRestrictions.length - numPanelsWithDefinedSize;
        if (panelsToDistribute > 0) {
            const spacePerPanel = remainingSize / panelsToDistribute;
            layout.forEach(((panelSize, index) => {
                if (null === panelSize) {
                    layout[index] = spacePerPanel
                }
            }))
        }
    }
    layout = layout.map((size => null === size ? 0 : parseFloat((0, _utils.toFixed)(size, _number_comparison.PRECISION))));
    if (1 === layout.length) {
        return layout
    }
    let nextLayout = [...layout];
    const nextLayoutTotalSize = nextLayout.reduce(((accumulated, current) => accumulated + current), 0);
    if (!(0 === (0, _number_comparison.compareNumbersWithPrecision)(nextLayoutTotalSize, 100))) {
        for (let index = 0; index < layoutRestrictions.length; index += 1) {
            const unsafeSize = nextLayout[index];
            const safeSize = 100 / nextLayoutTotalSize * unsafeSize;
            nextLayout[index] = safeSize
        }
    }
    remainingSize = 0;
    nextLayout = layout.map(((panelSize, index) => {
        const restriction = layoutRestrictions[index];
        const adjustedSize = (0, _layout.normalizePanelSize)(restriction, panelSize);
        remainingSize += panelSize - adjustedSize;
        return adjustedSize
    }));
    if (0 !== (0, _number_comparison.compareNumbersWithPrecision)(remainingSize, 0)) {
        for (let index = 0; index < nextLayout.length && 0 !== (0, _number_comparison.compareNumbersWithPrecision)(remainingSize, 0); index += 1) {
            const currentSize = nextLayout[index];
            const adjustedSize = (0, _layout.normalizePanelSize)(layoutRestrictions[index], currentSize + remainingSize);
            remainingSize -= adjustedSize - currentSize;
            nextLayout[index] = adjustedSize
        }
        if (remainingSize > 0) {
            const paneIndex = (0, _layout.findLastIndexOfVisibleItem)(layoutRestrictions);
            if (false === layoutRestrictions[paneIndex].collapsed) {
                nextLayout[paneIndex] += remainingSize
            }
        }
    }
    return nextLayout
}