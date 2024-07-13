/**
 * DevExtreme (esm/exporter/jspdf/common/rows_spliting_utils/get_multipage_row_pages.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
const isHeader = rect => "header" === (null === rect || void 0 === rect ? void 0 : rect.sourceCellInfo.gridCell.rowType);
const spitMultiPageRows = (rectsToPatch, isCurrentPageContainsOnlyHeader, firstRectYAdjustment, splitMultiPageRowFunc, checkIsFitToPageFunc) => {
    let [newPageRects, remainPageRects] = splitMultiPageRowFunc(isCurrentPageContainsOnlyHeader, rectsToPatch);
    const newPageRectsArray = [isCurrentPageContainsOnlyHeader ? newPageRects.map((rect => _extends({}, rect, {
        y: firstRectYAdjustment
    }))) : newPageRects];
    while (!checkIsFitToPageFunc(false, remainPageRects[0].h)) {
        [newPageRects, remainPageRects] = splitMultiPageRowFunc(false, remainPageRects);
        newPageRectsArray.push(newPageRects)
    }
    return [newPageRectsArray, remainPageRects]
};
const patchRects = (rectsToSplit, rectsToPatch, remainPageRects) => {
    rectsToPatch.forEach(((rect, rectIndex) => {
        rect.sourceCellInfo.text = remainPageRects[rectIndex].sourceCellInfo.text;
        rect.h = remainPageRects[rectIndex].h
    }));
    const untouchedRowIdx = rectsToSplit.indexOf(rectsToPatch[rectsToPatch.length - 1]) + 1;
    if (untouchedRowIdx >= rectsToSplit.length) {
        return
    }
    const delta = rectsToSplit[untouchedRowIdx].y - (rectsToPatch[0].y + remainPageRects[0].h);
    for (let idx = untouchedRowIdx; idx < rectsToSplit.length; idx++) {
        rectsToSplit[idx].y = rectsToSplit[idx].y - delta
    }
};
export const checkPageContainsOnlyHeader = (pageRects, isFirstPage) => isFirstPage && isHeader(pageRects[pageRects.length - 1]);
export const getMultiPageRowPages = (currentPageRects, rectsToSplit, isCurrentPageContainsOnlyHeader, splitMultiPageRowFunc, checkIsFitToPageFunc) => {
    if (!splitMultiPageRowFunc) {
        return []
    }
    const currentPageLastRect = currentPageRects[currentPageRects.length - 1];
    const nextPageFirstRect = rectsToSplit[currentPageRects.length];
    if (!nextPageFirstRect || isHeader(nextPageFirstRect)) {
        return []
    }
    const isRectsFitsToPage = checkIsFitToPageFunc(isCurrentPageContainsOnlyHeader, nextPageFirstRect.h);
    if (isRectsFitsToPage && !isCurrentPageContainsOnlyHeader) {
        return []
    }
    const rectsToPatch = rectsToSplit.filter((_ref => {
        let {
            y: y
        } = _ref;
        return y === nextPageFirstRect.y
    }));
    const firstRectYAdjustment = currentPageLastRect.y + currentPageLastRect.h;
    const [multiPageRowPages, remainPageRects] = spitMultiPageRows(rectsToPatch, isCurrentPageContainsOnlyHeader, firstRectYAdjustment, splitMultiPageRowFunc, checkIsFitToPageFunc);
    patchRects(rectsToSplit, rectsToPatch, remainPageRects);
    return multiPageRowPages
};