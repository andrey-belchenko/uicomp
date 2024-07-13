/**
 * DevExtreme (esm/ui/file_manager/ui.file_manager.item_list.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    extend
} from "../../core/utils/extend";
import {
    when
} from "../../core/utils/deferred";
import {
    hasWindow
} from "../../core/utils/window";
import {
    name as dblClickName
} from "../../events/double_click";
import {
    addNamespace
} from "../../events/utils/index";
import eventsEngine from "../../events/core/events_engine";
import {
    getImageContainer
} from "../../core/utils/icon";
import devices from "../../core/devices";
import CustomStore from "../../data/custom_store";
import Widget from "../widget/ui.widget";
const FILE_MANAGER_FILES_VIEW_CLASS = "dx-filemanager-files-view";
const FILE_MANAGER_ITEM_LIST_ITEM_OPEN_EVENT_NAMESPACE = "dxFileManager_open";
class FileManagerItemListBase extends Widget {
    _init() {
        this._initActions();
        this._lockFocusedItemProcessing = false;
        this._focusedItemKey = this.option("focusedItemKey");
        super._init()
    }
    _initMarkup() {
        this._needResetScrollPosition = false;
        this.$element().addClass("dx-filemanager-files-view");
        const dblClickEventName = addNamespace(dblClickName, "dxFileManager_open");
        eventsEngine.on(this.$element(), dblClickEventName, this._getItemSelector(), this._onItemDblClick.bind(this));
        super._initMarkup()
    }
    _initActions() {
        this._actions = {
            onError: this._createActionByOption("onError"),
            onSelectionChanged: this._createActionByOption("onSelectionChanged"),
            onFocusedItemChanged: this._createActionByOption("onFocusedItemChanged"),
            onSelectedItemOpened: this._createActionByOption("onSelectedItemOpened"),
            onContextMenuShowing: this._createActionByOption("onContextMenuShowing"),
            onItemListDataLoaded: this._createActionByOption("onItemListDataLoaded")
        }
    }
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            selectionMode: "single",
            selectedItemKeys: [],
            focusedItemKey: void 0,
            contextMenu: null,
            getItems: null,
            getItemThumbnail: null,
            onError: null,
            onSelectionChanged: null,
            onFocusedItemChanged: null,
            onSelectedItemOpened: null,
            onContextMenuShowing: null
        })
    }
    _optionChanged(args) {
        const name = args.name;
        switch (name) {
            case "selectionMode":
            case "contextMenu":
            case "getItems":
            case "getItemThumbnail":
                this.repaint();
                break;
            case "selectedItemKeys":
                this._setSelectedItemKeys(args.value);
                break;
            case "focusedItemKey":
                if (!this._lockFocusedItemProcessing) {
                    this._setFocusedItemKey(args.value)
                }
                break;
            case "onError":
            case "onSelectedItemOpened":
            case "onSelectionChanged":
            case "onFocusedItemChanged":
            case "onContextMenuShowing":
            case "onItemListDataLoaded":
                this._actions[name] = this._createActionByOption(name);
                break;
            default:
                super._optionChanged(args)
        }
    }
    _getItems() {
        return this._getItemsInternal().done((itemInfos => {
            this._itemCount = itemInfos.length;
            if (0 === this._itemCount) {
                this._resetFocus()
            }
            const parentDirectoryItem = this._findParentDirectoryItem(itemInfos);
            this._hasParentDirectoryItem = !!parentDirectoryItem;
            this._parentDirectoryItemKey = parentDirectoryItem ? parentDirectoryItem.fileItem.key : null
        })).always((() => {
            this._onDataLoaded()
        }))
    }
    _getItemsInternal() {
        const itemsGetter = this.option("getItems");
        const itemsResult = itemsGetter ? itemsGetter() : [];
        return when(itemsResult)
    }
    _raiseOnError(error) {
        this._actions.onError({
            error: error
        })
    }
    _raiseSelectionChanged(args) {
        this._actions.onSelectionChanged(args)
    }
    _raiseFocusedItemChanged(args) {
        this._actions.onFocusedItemChanged(args)
    }
    _raiseSelectedItemOpened(fileItemInfo) {
        this._actions.onSelectedItemOpened({
            fileItemInfo: fileItemInfo
        })
    }
    _raiseContextMenuShowing(e) {
        this._actions.onContextMenuShowing(e)
    }
    _raiseItemListDataLoaded() {
        this._actions.onItemListDataLoaded()
    }
    _onDataLoaded() {
        var _this$_refreshDeferre;
        this._raiseItemListDataLoaded();
        null === (_this$_refreshDeferre = this._refreshDeferred) || void 0 === _this$_refreshDeferre || _this$_refreshDeferre.resolve()
    }
    _onContentReady() {
        if (this._needResetScrollPosition) {
            this._resetScrollTopPosition();
            this._needResetScrollPosition = false
        }
    }
    _tryRaiseSelectionChanged(_ref) {
        let {
            selectedItemInfos: selectedItemInfos,
            selectedItems: selectedItems,
            selectedItemKeys: selectedItemKeys,
            currentSelectedItemKeys: currentSelectedItemKeys,
            currentDeselectedItemKeys: currentDeselectedItemKeys
        } = _ref;
        const parentDirectoryItem = this._findParentDirectoryItem(this.getSelectedItems());
        if (parentDirectoryItem) {
            this._deselectItem(parentDirectoryItem)
        }
        let raiseEvent = !this._hasParentDirectoryItem;
        raiseEvent = raiseEvent || this._hasValidKeys(currentSelectedItemKeys) || this._hasValidKeys(currentDeselectedItemKeys);
        if (raiseEvent) {
            selectedItemInfos = this._filterOutItemByPredicate(selectedItemInfos, (item => item.fileItem.key === this._parentDirectoryItemKey));
            selectedItems = this._filterOutParentDirectory(selectedItems);
            selectedItemKeys = this._filterOutParentDirectoryKey(selectedItemKeys, true);
            currentSelectedItemKeys = this._filterOutParentDirectoryKey(currentSelectedItemKeys, true);
            currentDeselectedItemKeys = this._filterOutParentDirectoryKey(currentDeselectedItemKeys, true);
            this._raiseSelectionChanged({
                selectedItemInfos: selectedItemInfos,
                selectedItems: selectedItems,
                selectedItemKeys: selectedItemKeys,
                currentSelectedItemKeys: currentSelectedItemKeys,
                currentDeselectedItemKeys: currentDeselectedItemKeys
            })
        }
    }
    _onFocusedItemChanged(args) {
        if (this._focusedItemKey === args.itemKey) {
            return
        }
        this._focusedItemKey = args.itemKey;
        this._lockFocusedItemProcessing = true;
        this.option("focusedItemKey", args.itemKey);
        this._lockFocusedItemProcessing = false;
        this._raiseFocusedItemChanged(args)
    }
    _resetFocus() {}
    _resetScrollTopPosition() {
        if (!hasWindow()) {
            return
        }
        setTimeout((() => {
            var _this$_getScrollable;
            return null === (_this$_getScrollable = this._getScrollable()) || void 0 === _this$_getScrollable ? void 0 : _this$_getScrollable.scrollTo(0)
        }))
    }
    _getScrollable() {}
    _getItemThumbnail(fileInfo) {
        const itemThumbnailGetter = this.option("getItemThumbnail");
        return itemThumbnailGetter ? itemThumbnailGetter(fileInfo) : {
            thumbnail: ""
        }
    }
    _getItemThumbnailContainer(fileInfo) {
        const {
            thumbnail: thumbnail,
            cssClass: cssClass
        } = this._getItemThumbnail(fileInfo);
        const $itemThumbnail = getImageContainer(thumbnail).addClass(this._getItemThumbnailCssClass());
        if (cssClass) {
            $itemThumbnail.addClass(cssClass)
        }
        return $itemThumbnail
    }
    _getItemThumbnailCssClass() {
        return ""
    }
    _getItemSelector() {}
    _onItemDblClick(e) {}
    _isDesktop() {
        return "desktop" === devices.real().deviceType
    }
    _showContextMenu(items, element, event, target) {
        this._contextMenu.showAt(items, element, event, target)
    }
    get _contextMenu() {
        return this.option("contextMenu")
    }
    _findParentDirectoryItem(itemInfos) {
        for (let i = 0; i < itemInfos.length; i++) {
            const itemInfo = itemInfos[i];
            if (this._isParentDirectoryItem(itemInfo)) {
                return itemInfo
            }
        }
        return null
    }
    _getFileItemsForContextMenu(fileItem) {
        const result = this.getSelectedItems();
        if (this._isParentDirectoryItem(fileItem)) {
            result.push(fileItem)
        }
        return result
    }
    _isParentDirectoryItem(itemInfo) {
        return itemInfo.fileItem.isParentFolder
    }
    _hasValidKeys(keys) {
        return keys.length > 1 || 1 === keys.length && keys[0] !== this._parentDirectoryItemKey
    }
    _filterOutParentDirectory(array, createNewArray) {
        return this._filterOutItemByPredicate(array, (item => item.key === this._parentDirectoryItemKey), createNewArray)
    }
    _filterOutParentDirectoryKey(array, createNewArray) {
        return this._filterOutItemByPredicate(array, (key => key === this._parentDirectoryItemKey), createNewArray)
    }
    _filterOutItemByPredicate(array, predicate, createNewArray) {
        let result = array;
        let index = -1;
        for (let i = 0; i < array.length; i++) {
            if (predicate(array[i])) {
                index = i;
                break
            }
        }
        if (-1 !== index) {
            if (createNewArray) {
                result = [...array]
            }
            result.splice(index, 1)
        }
        return result
    }
    _isMultipleSelectionMode() {
        return "multiple" === this.option("selectionMode")
    }
    _deselectItem(item) {}
    _setSelectedItemKeys(itemKeys) {}
    _setFocusedItemKey(itemKey) {}
    _createDataSource() {
        return {
            store: new CustomStore({
                key: "fileItem.key",
                load: this._getItems.bind(this)
            })
        }
    }
    getSelectedItems() {}
    clearSelection() {}
    selectItem() {}
    refresh(options, operation) {}
}
export default FileManagerItemListBase;