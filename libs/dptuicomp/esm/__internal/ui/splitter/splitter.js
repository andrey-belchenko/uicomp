/**
 * DevExtreme (esm/__internal/ui/splitter/splitter.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import registerComponent from "../../../core/component_registrator";
import {
    getPublicElement
} from "../../../core/element";
import $ from "../../../core/renderer";
import resizeObserverSingleton from "../../../core/resize_observer";
import {
    Deferred
} from "../../../core/utils/deferred";
import {
    extend
} from "../../../core/utils/extend";
import {
    getOuterHeight,
    getOuterWidth
} from "../../../core/utils/size";
import {
    isDefined,
    isObject
} from "../../../core/utils/type";
import {
    hasWindow
} from "../../../core/utils/window";
import {
    lock
} from "../../../events/core/emitter.feedback";
import CollectionWidget from "../../ui/collection/live_update";
import {
    RESIZE_HANDLE_CLASS
} from "./resize_handle";
import SplitterItem from "./splitter_item";
import {
    getComponentInstance
} from "./utils/component";
import {
    getActionNameByEventName,
    ITEM_COLLAPSED_EVENT,
    ITEM_EXPANDED_EVENT,
    RESIZE_EVENT
} from "./utils/event";
import {
    calculateDelta,
    convertSizeToRatio,
    findIndexOfNextVisibleItem,
    findLastIndexOfNonCollapsedItem,
    findLastIndexOfVisibleItem,
    getElementSize,
    getNextLayout,
    isElementVisible,
    setFlexProp
} from "./utils/layout";
import {
    getDefaultLayout
} from "./utils/layout_default";
import {
    compareNumbersWithPrecision
} from "./utils/number_comparison";
import {
    CollapseExpandDirection
} from "./utils/types";
const SPLITTER_CLASS = "dx-splitter";
const SPLITTER_ITEM_CLASS = "dx-splitter-item";
const SPLITTER_ITEM_HIDDEN_CONTENT_CLASS = "dx-splitter-item-hidden-content";
const SPLITTER_ITEM_DATA_KEY = "dxSplitterItemData";
const HORIZONTAL_ORIENTATION_CLASS = "dx-splitter-horizontal";
const VERTICAL_ORIENTATION_CLASS = "dx-splitter-vertical";
const INVISIBLE_STATE_CLASS = "dx-state-invisible";
const DEFAULT_RESIZE_HANDLE_SIZE = 8;
const FLEX_PROPERTY = {
    flexGrow: "flexGrow",
    flexShrink: "flexShrink",
    flexBasis: "flexBasis"
};
const DEFAULT_FLEX_SHRINK_PROP = 0;
const DEFAULT_FLEX_BASIS_PROP = 0;
const ORIENTATION = {
    horizontal: "horizontal",
    vertical: "vertical"
};
class Splitter extends CollectionWidget {
    constructor() {
        super(...arguments);
        this._renderQueue = [];
        this._panesCacheSize = [];
        this._itemRestrictions = []
    }
    _getDefaultOptions() {
        const defaultOptions = super._getDefaultOptions();
        return _extends({}, defaultOptions, {
            orientation: ORIENTATION.horizontal,
            onItemCollapsed: void 0,
            onItemExpanded: void 0,
            onResize: void 0,
            onResizeEnd: void 0,
            onResizeStart: void 0,
            allowKeyboardNavigation: true,
            separatorSize: 8,
            _itemAttributes: _extends({}, defaultOptions._itemAttributes, {
                role: "group"
            }),
            _renderQueue: void 0
        })
    }
    _itemClass() {
        return "dx-splitter-item"
    }
    _itemDataKey() {
        return "dxSplitterItemData"
    }
    _init() {
        super._init();
        this._initializeRenderQueue()
    }
    _initializeRenderQueue() {
        this._renderQueue = this.option("_renderQueue") ?? []
    }
    _isRenderQueueEmpty() {
        return this._renderQueue.length <= 0
    }
    _pushItemToRenderQueue(itemContent, splitterConfig) {
        this._renderQueue.push({
            itemContent: itemContent,
            splitterConfig: splitterConfig
        })
    }
    _shiftItemFromQueue() {
        return this._renderQueue.shift()
    }
    _initMarkup() {
        $(this.element()).addClass("dx-splitter");
        this._toggleOrientationClass();
        super._initMarkup();
        this._panesCacheSize = [];
        this._attachResizeObserverSubscription()
    }
    _getItemDimension(element) {
        return this._isHorizontalOrientation() ? getOuterWidth(element) : getOuterHeight(element)
    }
    _attachResizeObserverSubscription() {
        if (hasWindow()) {
            const element = $(this.element()).get(0);
            resizeObserverSingleton.unobserve(element);
            resizeObserverSingleton.observe(element, (() => {
                this._resizeHandler()
            }))
        }
    }
    _attachHoldEvent() {}
    _resizeHandler() {
        if (!this._shouldRecalculateLayout) {
            return
        }
        this._layout = this._getDefaultLayoutBasedOnSize();
        this._applyStylesFromLayout(this._layout);
        this._updateItemSizes();
        this._shouldRecalculateLayout = false
    }
    _renderItems(items) {
        super._renderItems(items);
        this._updateResizeHandlesResizableState();
        this._updateResizeHandlesCollapsibleState();
        if (isElementVisible($(this.element())[0])) {
            this._layout = this._getDefaultLayoutBasedOnSize();
            this._applyStylesFromLayout(this._layout);
            this._updateItemSizes()
        } else {
            this._shouldRecalculateLayout = true
        }
        this._processRenderQueue()
    }
    _processRenderQueue() {
        if (this._isRenderQueueEmpty()) {
            return
        }
        const item = this._shiftItemFromQueue();
        if (!item) {
            return
        }
        this._createComponent($(item.itemContent), Splitter, extend({
            itemTemplate: this.option("itemTemplate"),
            onResize: this.option("onResize"),
            onResizeStart: this.option("onResizeStart"),
            onResizeEnd: this.option("onResizeEnd"),
            onItemClick: this.option("onItemClick"),
            onItemContextMenu: this.option("onItemContextMenu"),
            onItemRendered: this.option("onItemRendered"),
            onItemExpanded: this.option("onItemExpanded"),
            onItemCollapsed: this.option("onItemCollapsed"),
            separatorSize: this.option("separatorSize"),
            allowKeyboardNavigation: this.option("allowKeyboardNavigation"),
            rtlEnabled: this.option("rtlEnabled"),
            _renderQueue: this._renderQueue
        }, item.splitterConfig));
        this._processRenderQueue()
    }
    _itemElements() {
        return $(this._itemContainer()).children(this._itemSelector())
    }
    _isLastVisibleItem(index) {
        const {
            items: items = []
        } = this.option();
        return index === findLastIndexOfVisibleItem(items)
    }
    _renderItem(index, itemData, $container, $itemToReplace) {
        const $itemFrame = super._renderItem(index, itemData, $container, $itemToReplace);
        const itemElement = $itemFrame.get(0);
        setFlexProp(itemElement, FLEX_PROPERTY.flexShrink, 0);
        setFlexProp(itemElement, FLEX_PROPERTY.flexBasis, 0);
        this._getItemInstance($itemFrame)._renderResizeHandle();
        return $itemFrame
    }
    _getItemInstance($item) {
        return Splitter.ItemClass.getInstance($item)
    }
    _updateResizeHandlesResizableState() {
        this._getResizeHandles().forEach((resizeHandle => {
            const $resizeHandle = resizeHandle.$element();
            const $leftItem = this._getResizeHandleLeftItem($resizeHandle);
            const $rightItem = this._getResizeHandleRightItem($resizeHandle);
            const leftItemData = this._getItemData($leftItem);
            const rightItemData = this._getItemData($rightItem);
            const resizable = false !== leftItemData.resizable && false !== rightItemData.resizable && true !== leftItemData.collapsed && true !== rightItemData.collapsed;
            resizeHandle.option("resizable", resizable);
            resizeHandle.option("disabled", resizeHandle.isInactive())
        }))
    }
    _updateResizeHandlesCollapsibleState() {
        this._getResizeHandles().forEach((resizeHandle => {
            const $resizeHandle = $(resizeHandle.element());
            const $leftItem = this._getResizeHandleLeftItem($resizeHandle);
            const $rightItem = this._getResizeHandleRightItem($resizeHandle);
            const leftItemData = this._getItemData($leftItem);
            const rightItemData = this._getItemData($rightItem);
            const showCollapsePrev = true === rightItemData.collapsed ? true === rightItemData.collapsible && true !== leftItemData.collapsed : true === leftItemData.collapsible && true !== leftItemData.collapsed;
            const showCollapseNext = true === leftItemData.collapsed ? true === leftItemData.collapsible : true === rightItemData.collapsible && true !== rightItemData.collapsed;
            resizeHandle.option({
                showCollapsePrev: showCollapsePrev,
                showCollapseNext: showCollapseNext
            });
            resizeHandle.option("disabled", resizeHandle.isInactive())
        }))
    }
    _updateNestedSplitterOption(optionName, optionValue) {
        const {
            items: items = []
        } = this.option();
        items.forEach((item => {
            if (null !== item && void 0 !== item && item.splitter) {
                const $nestedSplitter = this._findItemElementByItem(item).find(".dx-splitter").eq(0);
                if ($nestedSplitter.length) {
                    getComponentInstance($nestedSplitter).option(optionName, optionValue)
                }
            }
        }))
    }
    _updateResizeHandlesOption(optionName, optionValue) {
        this._getResizeHandles().forEach((resizeHandle => {
            resizeHandle.option(optionName, optionValue)
        }))
    }
    _getNextVisibleItemData(index) {
        const {
            items: items = []
        } = this.option();
        return this._getItemDataByIndex(findIndexOfNextVisibleItem(items, index))
    }
    _getItemDataByIndex(index) {
        return this._editStrategy.getItemDataByIndex(index)
    }
    _createEventAction(eventName) {
        const actionName = getActionNameByEventName(eventName);
        this[actionName] = this._createActionByOption(eventName, {
            excludeValidators: ["disabled", "readOnly"]
        })
    }
    _getAction(eventName) {
        const actionName = getActionNameByEventName(eventName);
        if (!this[actionName]) {
            this._createEventAction(eventName)
        }
        return this[actionName]
    }
    _getResizeHandleConfig(paneId) {
        const {
            orientation: orientation,
            rtlEnabled: rtlEnabled,
            allowKeyboardNavigation: allowKeyboardNavigation,
            separatorSize: separatorSize
        } = this.option();
        return {
            direction: orientation,
            focusStateEnabled: allowKeyboardNavigation,
            hoverStateEnabled: true,
            separatorSize: separatorSize,
            elementAttr: {
                "aria-controls": paneId
            },
            onCollapsePrev: e => {
                var _e$event;
                null === (_e$event = e.event) || void 0 === _e$event || _e$event.stopPropagation();
                this._savedCollapsingEvent = e.event;
                this.handleCollapseEvent(this._getResizeHandleLeftItem($(e.element)), CollapseExpandDirection.Previous)
            },
            onCollapseNext: e => {
                var _e$event2;
                null === (_e$event2 = e.event) || void 0 === _e$event2 || _e$event2.stopPropagation();
                this._savedCollapsingEvent = e.event;
                this.handleCollapseEvent(this._getResizeHandleLeftItem($(e.element)), CollapseExpandDirection.Next)
            },
            onResizeStart: e => {
                const {
                    element: element,
                    event: event
                } = e;
                if (!event) {
                    return
                }
                const $resizeHandle = $(element);
                const eventArgs = {
                    event: event,
                    handleElement: getPublicElement($resizeHandle)
                };
                this._getAction(RESIZE_EVENT.onResizeStart)(eventArgs);
                if (eventArgs.cancel) {
                    event.cancel = true;
                    return
                }
                this._feedbackDeferred = Deferred();
                lock(this._feedbackDeferred);
                this._toggleActiveState($resizeHandle, true);
                const $leftItem = this._getResizeHandleLeftItem($resizeHandle);
                const leftItemData = this._getItemData($leftItem);
                const leftItemIndex = this._getIndexByItem(leftItemData);
                this._activeResizeHandleIndex = leftItemIndex;
                this._currentOnePxRatio = convertSizeToRatio(1, getElementSize($(this.element()), orientation), this._getResizeHandlesSize());
                this._currentLayout = this.getLayout();
                this._updateItemsRestrictions()
            },
            onResize: e => {
                const {
                    element: element,
                    event: event
                } = e;
                if (!event) {
                    return
                }
                const eventArgs = {
                    event: event,
                    handleElement: getPublicElement($(element))
                };
                this._getAction(RESIZE_EVENT.onResize)(eventArgs);
                if (eventArgs.cancel) {
                    event.cancel = true;
                    return
                }
                const newLayout = getNextLayout(this._currentLayout ?? [], calculateDelta(event.offset, this.option("orientation"), rtlEnabled, this._currentOnePxRatio), this._activeResizeHandleIndex, this._itemRestrictions);
                this._applyStylesFromLayout(newLayout);
                this._layout = newLayout
            },
            onResizeEnd: e => {
                var _this$_feedbackDeferr;
                const {
                    element: element,
                    event: event
                } = e;
                this._activeResizeHandleIndex = void 0;
                if (!event) {
                    return
                }
                const $resizeHandle = $(element);
                const eventArgs = {
                    event: event,
                    handleElement: getPublicElement($resizeHandle)
                };
                this._getAction(RESIZE_EVENT.onResizeEnd)(eventArgs);
                if (eventArgs.cancel) {
                    event.cancel = true;
                    return
                }
                null === (_this$_feedbackDeferr = this._feedbackDeferred) || void 0 === _this$_feedbackDeferr || _this$_feedbackDeferr.resolve();
                this._toggleActiveState($resizeHandle, false);
                this._updateItemSizes()
            }
        }
    }
    handleCollapseEvent($resizeHandle, direction, isItemCollapsed) {
        const $leftItem = $resizeHandle;
        const leftItemData = this._getItemData($leftItem);
        const leftItemIndex = this._getIndexByItem(leftItemData);
        const $rightItem = this._getResizeHandleRightItem($leftItem);
        const rightItemData = this._getItemData($rightItem);
        const rightItemIndex = this._getIndexByItem(rightItemData);
        this._activeResizeHandleIndex = leftItemIndex;
        this._collapseDirection = direction;
        const isCollapsed = isItemCollapsed ?? (direction === CollapseExpandDirection.Previous ? rightItemData.collapsed : leftItemData.collapsed);
        let index = 0;
        if (direction === CollapseExpandDirection.Previous) {
            index = isCollapsed ? rightItemIndex : leftItemIndex
        } else {
            index = isCollapsed ? leftItemIndex : rightItemIndex
        }
        this._updateItemData("collapsed", index, !isCollapsed, false)
    }
    _getResizeHandleLeftItem($element) {
        let $leftItem = $element.prev();
        while ($leftItem.hasClass("dx-state-invisible") || $leftItem.hasClass(RESIZE_HANDLE_CLASS)) {
            $leftItem = $leftItem.prev()
        }
        return $leftItem
    }
    _getResizeHandleRightItem($element) {
        let $rightItem = $element.next();
        while ($rightItem.hasClass("dx-state-invisible") || $rightItem.hasClass(RESIZE_HANDLE_CLASS)) {
            $rightItem = $rightItem.next()
        }
        return $rightItem
    }
    _getResizeHandlesSize() {
        return this._getResizeHandles().reduce(((size, resizeHandle) => size + resizeHandle.getSize()), 0)
    }
    _createItemByTemplate(itemTemplate, args) {
        const {
            itemData: itemData
        } = args;
        if (itemData.splitter) {
            return itemTemplate.source ? itemTemplate.source() : $()
        }
        return super._createItemByTemplate(itemTemplate, args)
    }
    _postprocessRenderItem(args) {
        const splitterConfig = args.itemData.splitter;
        if (!splitterConfig) {
            return
        }
        this._pushItemToRenderQueue(args.itemContent, splitterConfig)
    }
    _isHorizontalOrientation() {
        return this.option("orientation") === ORIENTATION.horizontal
    }
    _toggleOrientationClass() {
        $(this.element()).toggleClass("dx-splitter-horizontal", this._isHorizontalOrientation()).toggleClass("dx-splitter-vertical", !this._isHorizontalOrientation())
    }
    _itemOptionChanged(item, property, value, prevValue) {
        switch (property) {
            case "size":
            case "maxSize":
            case "minSize":
            case "collapsedSize":
                this._layout = this._getDefaultLayoutBasedOnSize();
                this._applyStylesFromLayout(this.getLayout());
                this._updateItemSizes();
                break;
            case "collapsed":
                this._itemCollapsedOptionChanged(item, value, prevValue);
                break;
            case "resizable":
                this._updateResizeHandlesResizableState();
                break;
            case "collapsible":
                this._updateResizeHandlesCollapsibleState();
                break;
            case "visible":
                this._invalidate();
                break;
            default:
                super._itemOptionChanged(item, property, value, prevValue)
        }
    }
    _itemCollapsedOptionChanged(item, value, prevValue) {
        if (Boolean(value) === Boolean(prevValue)) {
            return
        }
        const itemIndex = this._getIndexByItem(item);
        const $item = $(this._itemElements()[itemIndex]);
        const {
            items: items = []
        } = this.option();
        if (!isDefined(this._activeResizeHandleIndex)) {
            if (value) {
                const isLastNonCollapsedItem = itemIndex > findLastIndexOfNonCollapsedItem(items);
                if (this._isLastVisibleItem(itemIndex) || isLastNonCollapsedItem) {
                    this.handleCollapseEvent(this._getResizeHandleLeftItem($item), CollapseExpandDirection.Next, !!prevValue)
                } else {
                    this.handleCollapseEvent($item, CollapseExpandDirection.Previous, !!prevValue)
                }
            } else {
                var _this$_panesCacheSize;
                const isLastNonCollapsedItem = itemIndex >= findLastIndexOfNonCollapsedItem(items);
                if (this._isLastVisibleItem(itemIndex) || isLastNonCollapsedItem) {
                    this.handleCollapseEvent(this._getResizeHandleLeftItem($item), CollapseExpandDirection.Previous, !!prevValue)
                } else if ((null === (_this$_panesCacheSize = this._panesCacheSize[itemIndex]) || void 0 === _this$_panesCacheSize ? void 0 : _this$_panesCacheSize.direction) === CollapseExpandDirection.Previous) {
                    this.handleCollapseEvent(this._getResizeHandleLeftItem($item), CollapseExpandDirection.Previous, !!prevValue)
                } else {
                    this.handleCollapseEvent($item, CollapseExpandDirection.Next, !!prevValue)
                }
            }
        }
        this._updateItemsRestrictions();
        const collapsedDelta = this._getCollapseDelta(item, value);
        this._itemRestrictions.map((pane => {
            pane.maxSize = void 0;
            pane.resizable = void 0;
            return item
        }));
        this._layout = getNextLayout(this.getLayout(), collapsedDelta, this._activeResizeHandleIndex, this._itemRestrictions);
        this._applyStylesFromLayout(this.getLayout());
        this._updateItemSizes();
        this._updateResizeHandlesResizableState();
        this._updateResizeHandlesCollapsibleState();
        this._fireCollapsedStateChanged(!value, $item, this._savedCollapsingEvent);
        this._savedCollapsingEvent = void 0;
        this._collapseDirection = void 0;
        this._activeResizeHandleIndex = void 0
    }
    _calculateExpandToLeftSize(leftItemIndex) {
        const {
            items: items = []
        } = this.option();
        for (let i = leftItemIndex; i >= 0; i -= 1) {
            const {
                collapsed: collapsed,
                visible: visible
            } = items[i];
            if (true !== collapsed && false !== visible) {
                return this.getLayout()[i] / 2
            }
        }
        return 0
    }
    _calculateExpandToRightSize(rightItemIndex) {
        const {
            items: items = []
        } = this.option();
        for (let i = rightItemIndex; i <= items.length - 1; i += 1) {
            const {
                collapsed: collapsed,
                visible: visible
            } = items[i];
            if (true !== collapsed && false !== visible) {
                return this.getLayout()[i] / 2
            }
        }
        return 0
    }
    _getCollapseDelta(item, newCollapsedState) {
        const itemIndex = this._getIndexByItem(item);
        const {
            collapsedSize: collapsedSize = 0,
            minSize: minSize = 0,
            maxSize: maxSize = 100
        } = this._itemRestrictions[itemIndex];
        const currentPaneSize = this.getLayout()[itemIndex];
        if (newCollapsedState) {
            const targetPaneSize = collapsedSize;
            if (currentPaneSize > targetPaneSize) {
                this._panesCacheSize[itemIndex] = {
                    size: currentPaneSize,
                    direction: this._collapseDirection === CollapseExpandDirection.Next ? CollapseExpandDirection.Previous : CollapseExpandDirection.Next
                }
            }
            const delta = this._collapseDirection === CollapseExpandDirection.Previous ? targetPaneSize - currentPaneSize : currentPaneSize - targetPaneSize;
            return delta
        }
        const paneCache = this._panesCacheSize[itemIndex];
        this._panesCacheSize[itemIndex] = void 0;
        let targetPaneSize = 0;
        if (paneCache && paneCache.direction === this._collapseDirection) {
            targetPaneSize = paneCache.size - collapsedSize
        } else {
            targetPaneSize = this._collapseDirection === CollapseExpandDirection.Previous ? this._calculateExpandToLeftSize(itemIndex - 1) : this._calculateExpandToRightSize(itemIndex + 1)
        }
        let adjustedSize = compareNumbersWithPrecision(targetPaneSize, minSize) < 0 ? minSize : targetPaneSize;
        adjustedSize = Math.min(maxSize, adjustedSize);
        const deltaSign = this._collapseDirection === CollapseExpandDirection.Previous ? -1 : 1;
        const delta = adjustedSize * deltaSign;
        return delta
    }
    _fireCollapsedStateChanged(isExpanded, $item, e) {
        const eventName = isExpanded ? ITEM_EXPANDED_EVENT : ITEM_COLLAPSED_EVENT;
        this._itemEventHandler($item, eventName, {
            event: e
        })
    }
    _getDefaultLayoutBasedOnSize() {
        this._updateItemsRestrictions();
        return getDefaultLayout(this._itemRestrictions)
    }
    _updateItemsRestrictions() {
        const {
            orientation: orientation,
            items: items = []
        } = this.option();
        const handlesSizeSum = this._getResizeHandlesSize();
        const elementSize = getElementSize($(this.element()), orientation);
        this._itemRestrictions = [];
        items.forEach((item => {
            this._itemRestrictions.push({
                resizable: false !== item.resizable,
                visible: false !== item.visible,
                collapsed: true === item.collapsed,
                collapsedSize: convertSizeToRatio(item.collapsedSize, elementSize, handlesSizeSum),
                size: convertSizeToRatio(item.size, elementSize, handlesSizeSum),
                maxSize: convertSizeToRatio(item.maxSize, elementSize, handlesSizeSum),
                minSize: convertSizeToRatio(item.minSize, elementSize, handlesSizeSum)
            })
        }))
    }
    _applyStylesFromLayout(layout) {
        this._iterateItems(((index, itemElement) => {
            setFlexProp($(itemElement)[0], FLEX_PROPERTY.flexGrow, layout[index]);
            const itemData = this._getItemData(itemElement);
            const shouldHideContent = 0 === layout[index] && false !== itemData.visible;
            $(itemElement).toggleClass("dx-splitter-item-hidden-content", shouldHideContent)
        }))
    }
    _updateItemSizes() {
        this._iterateItems(((index, itemElement) => {
            this._updateItemData("size", index, this._getItemDimension(itemElement))
        }))
    }
    _updateItemData(prop, itemIndex, value) {
        let silent = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : true;
        const itemPath = `items[${itemIndex}]`;
        const itemData = this.option(itemPath);
        if (isObject(itemData)) {
            this._updateItemOption(`${itemPath}.${prop}`, value, silent)
        } else {
            this._updateItemOption(itemPath, {
                text: itemData,
                [prop]: value
            }, silent)
        }
    }
    _updateItemOption(path, value) {
        let silent = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : false;
        if (silent) {
            this._options.silent(path, value)
        } else {
            this.option(path, value)
        }
    }
    _iterateItems(callback) {
        this._itemElements().each(((index, itemElement) => {
            callback(index, itemElement);
            return true
        }))
    }
    _getResizeHandles() {
        const handles = [];
        this._iterateItems(((_, itemElement) => {
            const instance = this._getItemInstance($(itemElement));
            const resizeHandle = instance.getResizeHandle();
            if (resizeHandle) {
                handles.push(resizeHandle)
            }
        }));
        return handles
    }
    _getResizeHandleItems() {
        return $(this.element()).children(`.${RESIZE_HANDLE_CLASS}`)
    }
    _iterateResizeHandles(callback) {
        this._getResizeHandleItems().each(((index, element) => {
            callback(getComponentInstance($(element)));
            return true
        }))
    }
    _dimensionChanged() {
        this._updateItemSizes();
        this._layout = this._getDefaultLayoutBasedOnSize()
    }
    _optionChanged(args) {
        const {
            name: name,
            value: value
        } = args;
        switch (name) {
            case "width":
            case "height":
                super._optionChanged(args);
                this._dimensionChanged();
                break;
            case "allowKeyboardNavigation":
                this._iterateResizeHandles((instance => {
                    instance.option("focusStateEnabled", !!value)
                }));
                this._updateNestedSplitterOption(name, value);
                break;
            case "orientation":
                this._toggleOrientationClass();
                this._updateResizeHandlesOption("direction", value);
                break;
            case "onResizeStart":
            case "onResizeEnd":
            case "onResize":
            case "onItemCollapsed":
            case "onItemExpanded":
                this._createEventAction(name);
                this._updateNestedSplitterOption(name, value);
                break;
            case "separatorSize":
                this._updateResizeHandlesOption(name, value);
                this._updateNestedSplitterOption(name, value);
                break;
            case "_renderQueue":
                this._invalidate();
                break;
            default:
                super._optionChanged(args)
        }
    }
    registerKeyHandler(key, handler) {
        $(this.element()).find(`.${RESIZE_HANDLE_CLASS}`).each(((index, element) => {
            getComponentInstance($(element)).registerKeyHandler(key, handler);
            return true
        }))
    }
    getLayout() {
        return this._layout ?? []
    }
}
Splitter.ItemClass = SplitterItem;
registerComponent("dxSplitter", Splitter);
export default Splitter;