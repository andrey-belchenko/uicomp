/**
 * DevExtreme (esm/__internal/grids/grid_core/data_source_adapter/m_data_source_adapter_utils.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import {
    executeAsync
} from "../../../../core/utils/common";
import {
    extend
} from "../../../../core/utils/extend";
import {
    isDefined
} from "../../../../core/utils/type";
import gridCoreUtils from "../m_utils";
export const cloneItems = function(items, groupCount) {
    if (items) {
        items = items.slice(0);
        if (groupCount) {
            for (let i = 0; i < items.length; i++) {
                items[i] = extend({
                    key: items[i].key
                }, items[i]);
                items[i].items = cloneItems(items[i].items, groupCount - 1)
            }
        }
    }
    return items
};
export const calculateOperationTypes = function(loadOptions, lastLoadOptions, isFullReload) {
    let operationTypes = {
        reload: true,
        fullReload: true
    };
    if (lastLoadOptions) {
        operationTypes = {
            sorting: !gridCoreUtils.equalSortParameters(loadOptions.sort, lastLoadOptions.sort),
            grouping: !gridCoreUtils.equalSortParameters(loadOptions.group, lastLoadOptions.group, true),
            groupExpanding: !gridCoreUtils.equalSortParameters(loadOptions.group, lastLoadOptions.group) || lastLoadOptions.groupExpand,
            filtering: !gridCoreUtils.equalFilterParameters(loadOptions.filter, lastLoadOptions.filter),
            pageIndex: loadOptions.pageIndex !== lastLoadOptions.pageIndex,
            skip: loadOptions.skip !== lastLoadOptions.skip,
            take: loadOptions.take !== lastLoadOptions.take,
            pageSize: loadOptions.pageSize !== lastLoadOptions.pageSize,
            fullReload: isFullReload,
            reload: false,
            paging: false
        };
        operationTypes.reload = isFullReload || operationTypes.sorting || operationTypes.grouping || operationTypes.filtering;
        operationTypes.paging = operationTypes.pageIndex || operationTypes.pageSize || operationTypes.take
    }
    return operationTypes
};
export const executeTask = function(action, timeout) {
    if (isDefined(timeout)) {
        executeAsync(action, timeout)
    } else {
        action()
    }
};
export const createEmptyCachedData = function() {
    return {
        items: {}
    }
};
export const getPageDataFromCache = function(options, updatePaging) {
    const groupCount = gridCoreUtils.normalizeSortingInfo(options.group || options.storeLoadOptions.group || options.loadOptions.group).length;
    const items = [];
    if (fillItemsFromCache(items, options, groupCount)) {
        return items
    }
    if (updatePaging) {
        updatePagingOptionsByCache(items, options, groupCount)
    }
};
export const fillItemsFromCache = function(items, options, groupCount, fromEnd) {
    var _options$cachedData;
    const {
        storeLoadOptions: storeLoadOptions
    } = options;
    const take = options.take ?? storeLoadOptions.take ?? 0;
    const cachedItems = null === (_options$cachedData = options.cachedData) || void 0 === _options$cachedData ? void 0 : _options$cachedData.items;
    if (take && cachedItems) {
        const skip = options.skip ?? storeLoadOptions.skip ?? 0;
        for (let i = 0; i < take; i += 1) {
            const localIndex = fromEnd ? take - 1 - i : i;
            const cacheItemIndex = localIndex + skip;
            const cacheItem = cachedItems[cacheItemIndex];
            if (void 0 === cacheItem && cacheItemIndex in cachedItems) {
                return true
            }
            const item = getItemFromCache(options, cacheItem, groupCount, localIndex, take);
            if (item) {
                items.push(item)
            } else {
                return false
            }
        }
        return true
    }
    return false
};
export const getItemFromCache = function(options, cacheItem, groupCount, index, take) {
    if (groupCount && cacheItem) {
        const skips = 0 === index && options.skips || [];
        const takes = index === take - 1 && options.takes || [];
        return getGroupItemFromCache(cacheItem, groupCount, skips, takes)
    }
    return cacheItem
};
export const getGroupItemFromCache = function(cacheItem, groupCount, skips, takes) {
    if (groupCount && cacheItem) {
        const result = _extends({}, cacheItem);
        const skip = skips[0] || 0;
        const take = takes[0];
        const {
            items: items
        } = cacheItem;
        if (items) {
            if (void 0 === take && !items[skip]) {
                return
            }
            result.items = [];
            if (skips.length) {
                result.isContinuation = true
            }
            if (take) {
                result.isContinuationOnNextPage = cacheItem.count > take
            }
            for (let i = 0; void 0 === take ? items[i + skip] : i < take; i += 1) {
                const childCacheItem = items[i + skip];
                const isLast = i + 1 === take;
                const item = getGroupItemFromCache(childCacheItem, groupCount - 1, 0 === i ? skips.slice(1) : [], isLast ? takes.slice(1) : []);
                if (void 0 !== item) {
                    result.items.push(item)
                } else {
                    return
                }
            }
        }
        return result
    }
    return cacheItem
};
export const updatePagingOptionsByCache = function(cacheItemsFromBegin, options, groupCount) {
    const cacheItemBeginCount = cacheItemsFromBegin.length;
    const {
        storeLoadOptions: storeLoadOptions
    } = options;
    if (void 0 !== storeLoadOptions.skip && storeLoadOptions.take && !groupCount) {
        const cacheItemsFromEnd = [];
        fillItemsFromCache(cacheItemsFromEnd, options, groupCount, true);
        const cacheItemEndCount = cacheItemsFromEnd.length;
        if (cacheItemBeginCount || cacheItemEndCount) {
            options.skip = options.skip ?? storeLoadOptions.skip;
            options.take = options.take ?? storeLoadOptions.take
        }
        if (cacheItemBeginCount) {
            storeLoadOptions.skip += cacheItemBeginCount;
            storeLoadOptions.take -= cacheItemBeginCount;
            options.cachedDataPartBegin = cacheItemsFromBegin
        }
        if (cacheItemEndCount) {
            storeLoadOptions.take -= cacheItemEndCount;
            options.cachedDataPartEnd = cacheItemsFromEnd.reverse()
        }
    }
};
export const setPageDataToCache = function(options, data, groupCount) {
    const {
        storeLoadOptions: storeLoadOptions
    } = options;
    const skip = options.skip ?? storeLoadOptions.skip ?? 0;
    const take = options.take ?? storeLoadOptions.take ?? 0;
    for (let i = 0; i < take; i += 1) {
        const globalIndex = i + skip;
        const cacheItems = options.cachedData.items;
        const skips = 0 === i && options.skips || [];
        cacheItems[globalIndex] = getCacheItem(cacheItems[globalIndex], data[i], groupCount, skips)
    }
};
export const getCacheItem = function(cacheItem, loadedItem, groupCount, skips) {
    if (groupCount && loadedItem) {
        const result = _extends({}, loadedItem);
        delete result.isContinuation;
        delete result.isContinuationOnNextPage;
        const skip = skips[0] || 0;
        if (loadedItem.items) {
            result.items = (null === cacheItem || void 0 === cacheItem ? void 0 : cacheItem.items) || {};
            loadedItem.items.forEach(((item, index) => {
                const globalIndex = index + skip;
                const childSkips = 0 === index ? skips.slice(1) : [];
                result.items[globalIndex] = getCacheItem(result.items[globalIndex], item, groupCount - 1, childSkips)
            }))
        }
        return result
    }
    return loadedItem
};
