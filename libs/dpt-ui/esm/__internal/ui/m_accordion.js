/**
 * DevExtreme (esm/__internal/ui/m_accordion.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import fx from "../../animation/fx";
import registerComponent from "../../core/component_registrator";
import devices from "../../core/devices";
import domAdapter from "../../core/dom_adapter";
import {
    getPublicElement
} from "../../core/element";
import $ from "../../core/renderer";
import {
    BindableTemplate
} from "../../core/templates/bindable_template";
import {
    deferRender
} from "../../core/utils/common";
import {
    Deferred,
    when
} from "../../core/utils/deferred";
import {
    extend
} from "../../core/utils/extend";
import {
    getImageContainer
} from "../../core/utils/icon";
import * as iteratorUtils from "../../core/utils/iterator";
import {
    getHeight,
    getOuterHeight,
    setHeight
} from "../../core/utils/size";
import {
    isDefined,
    isPlainObject
} from "../../core/utils/type";
import {
    name as clickEventName
} from "../../events/click";
import eventsEngine from "../../events/core/events_engine";
import {
    addNamespace
} from "../../events/utils/index";
import CollectionWidget from "../../ui/collection/ui.collection_widget.live_update";
import {
    isMaterialBased
} from "../../ui/themes";
const ACCORDION_CLASS = "dx-accordion";
const ACCORDION_WRAPPER_CLASS = "dx-accordion-wrapper";
const ACCORDION_ITEM_CLASS = "dx-accordion-item";
const ACCORDION_ITEM_OPENED_CLASS = "dx-accordion-item-opened";
const ACCORDION_ITEM_CLOSED_CLASS = "dx-accordion-item-closed";
const ACCORDION_ITEM_TITLE_CLASS = "dx-accordion-item-title";
const ACCORDION_ITEM_BODY_CLASS = "dx-accordion-item-body";
const ACCORDION_ITEM_TITLE_CAPTION_CLASS = "dx-accordion-item-title-caption";
const ACCORDION_ITEM_DATA_KEY = "dxAccordionItemData";
const Accordion = CollectionWidget.inherit({
    _activeStateUnit: ".dx-accordion-item",
    _getDefaultOptions() {
        return extend(this.callBase(), {
            hoverStateEnabled: true,
            height: void 0,
            itemTitleTemplate: "title",
            onItemTitleClick: null,
            selectedIndex: 0,
            collapsible: false,
            multiple: false,
            animationDuration: 300,
            deferRendering: true,
            selectByClick: true,
            activeStateEnabled: true,
            _itemAttributes: {
                role: "tab"
            },
            _animationEasing: "ease"
        })
    },
    _defaultOptionsRules() {
        return this.callBase().concat([{
            device: () => "desktop" === devices.real().deviceType && !devices.isSimulator(),
            options: {
                focusStateEnabled: true
            }
        }, {
            device: () => isMaterialBased(),
            options: {
                animationDuration: 200,
                _animationEasing: "cubic-bezier(0.4, 0, 0.2, 1)"
            }
        }])
    },
    _itemElements() {
        return this._itemContainer().children(this._itemSelector())
    },
    _init() {
        this.callBase();
        this.option("selectionRequired", !this.option("collapsible"));
        this.option("selectionMode", this.option("multiple") ? "multiple" : "single");
        const $element = this.$element();
        $element.addClass("dx-accordion");
        this._$container = $("<div>").addClass("dx-accordion-wrapper");
        $element.append(this._$container)
    },
    _initTemplates() {
        this.callBase();
        this._templateManager.addDefaultTemplates({
            title: new BindableTemplate((($container, data) => {
                if (isPlainObject(data)) {
                    const $iconElement = getImageContainer(data.icon);
                    if ($iconElement) {
                        $container.append($iconElement)
                    }
                    if (isDefined(data.title) && !isPlainObject(data.title)) {
                        $container.append(domAdapter.createTextNode(data.title))
                    }
                } else if (isDefined(data)) {
                    $container.text(String(data))
                }
                $container.wrapInner($("<div>").addClass("dx-accordion-item-title-caption"))
            }), ["title", "icon"], this.option("integrationOptions.watchMethod"))
        })
    },
    _initMarkup() {
        this._deferredItems = [];
        this._deferredTemplateItems = [];
        this.callBase();
        this.setAria({
            role: "tablist",
            multiselectable: this.option("multiple")
        });
        deferRender((() => {
            const selectedItemIndices = this._getSelectedItemIndices();
            this._renderSelection(selectedItemIndices, [])
        }))
    },
    _render() {
        this.callBase();
        when.apply(this, this._deferredTemplateItems).done((() => {
            this._updateItemHeights(true)
        }))
    },
    _itemDataKey: () => "dxAccordionItemData",
    _itemClass: () => "dx-accordion-item",
    _itemContainer() {
        return this._$container
    },
    _itemTitles() {
        return this._itemElements().find(".dx-accordion-item-title")
    },
    _itemContents() {
        return this._itemElements().find(".dx-accordion-item-body")
    },
    _getItemData(target) {
        return $(target).parent().data(this._itemDataKey()) || this.callBase.apply(this, arguments)
    },
    _executeItemRenderAction(itemData) {
        if (itemData.type) {
            return
        }
        this.callBase.apply(this, arguments)
    },
    _itemSelectHandler(e) {
        if ($(e.target).closest(this._itemContents()).length) {
            return
        }
        this.callBase.apply(this, arguments)
    },
    _afterItemElementDeleted($item, deletedActionArgs) {
        this._deferredItems.splice(deletedActionArgs.itemIndex, 1);
        this.callBase.apply(this, arguments)
    },
    _renderItemContent(args) {
        this._deferredTemplateItems[args.index] = new Deferred;
        const itemTitle = this.callBase(extend({}, args, {
            contentClass: "dx-accordion-item-title",
            templateProperty: "titleTemplate",
            defaultTemplateName: this.option("itemTitleTemplate")
        }));
        this._attachItemTitleClickAction(itemTitle);
        const deferred = new Deferred;
        if (isDefined(this._deferredItems[args.index])) {
            this._deferredItems[args.index] = deferred
        } else {
            this._deferredItems.push(deferred)
        }
        if (!this.option("deferRendering") || this._getSelectedItemIndices().indexOf(args.index) >= 0) {
            deferred.resolve()
        }
        deferred.done(this.callBase.bind(this, extend({}, args, {
            contentClass: "dx-accordion-item-body",
            container: getPublicElement($("<div>").appendTo($(itemTitle).parent()))
        })))
    },
    _onItemTemplateRendered(_, renderArgs) {
        return () => {
            const item = this._deferredTemplateItems[renderArgs.index];
            item && item.resolve()
        }
    },
    _attachItemTitleClickAction(itemTitle) {
        const eventName = addNamespace(clickEventName, this.NAME);
        eventsEngine.off(itemTitle, eventName);
        eventsEngine.on(itemTitle, eventName, this._itemTitleClickHandler.bind(this))
    },
    _itemTitleClickHandler(e) {
        this._itemDXEventHandler(e, "onItemTitleClick")
    },
    _renderSelection(addedSelection, removedSelection) {
        this._itemElements().addClass("dx-accordion-item-closed");
        this.setAria("hidden", true, this._itemContents());
        this._updateItems(addedSelection, removedSelection)
    },
    _updateSelection(addedSelection, removedSelection) {
        this._updateItems(addedSelection, removedSelection);
        this._updateItemHeightsWrapper(false)
    },
    _updateItems(addedSelection, removedSelection) {
        const $items = this._itemElements();
        iteratorUtils.each(addedSelection, ((_, index) => {
            this._deferredItems[index].resolve();
            const $item = $items.eq(index).addClass("dx-accordion-item-opened").removeClass("dx-accordion-item-closed");
            this.setAria("hidden", false, $item.find(".dx-accordion-item-body"))
        }));
        iteratorUtils.each(removedSelection, ((_, index) => {
            const $item = $items.eq(index).removeClass("dx-accordion-item-opened");
            this.setAria("hidden", true, $item.find(".dx-accordion-item-body"))
        }))
    },
    _updateItemHeightsWrapper(skipAnimation) {
        if (this.option("templatesRenderAsynchronously")) {
            this._animationTimer = setTimeout((() => {
                this._updateItemHeights(skipAnimation)
            }))
        } else {
            this._updateItemHeights(skipAnimation)
        }
    },
    _updateItemHeights(skipAnimation) {
        const that = this;
        const deferredAnimate = that._deferredAnimate;
        const itemHeight = this._splitFreeSpace(this._calculateFreeSpace());
        clearTimeout(this._animationTimer);
        return when.apply($, [].slice.call(this._itemElements()).map((item => that._updateItemHeight($(item), itemHeight, skipAnimation)))).done((() => {
            if (deferredAnimate) {
                deferredAnimate.resolveWith(that)
            }
        }))
    },
    _updateItemHeight($item, itemHeight, skipAnimation) {
        const $title = $item.children(".dx-accordion-item-title");
        if (fx.isAnimating($item)) {
            fx.stop($item)
        }
        const startItemHeight = getOuterHeight($item);
        let finalItemHeight;
        if ($item.hasClass("dx-accordion-item-opened")) {
            finalItemHeight = itemHeight + getOuterHeight($title);
            if (!finalItemHeight) {
                setHeight($item, "auto");
                finalItemHeight = getOuterHeight($item)
            }
        } else {
            finalItemHeight = getOuterHeight($title)
        }
        return this._animateItem($item, startItemHeight, finalItemHeight, skipAnimation, !!itemHeight)
    },
    _animateItem($element, startHeight, endHeight, skipAnimation, fixedHeight) {
        let d;
        if (skipAnimation || startHeight === endHeight) {
            $element.css("height", endHeight);
            d = (new Deferred).resolve()
        } else {
            d = fx.animate($element, {
                type: "custom",
                from: {
                    height: startHeight
                },
                to: {
                    height: endHeight
                },
                duration: this.option("animationDuration"),
                easing: this.option("_animationEasing")
            })
        }
        return d.done((() => {
            if ($element.hasClass("dx-accordion-item-opened") && !fixedHeight) {
                $element.css("height", "")
            }
            $element.not(".dx-accordion-item-opened").addClass("dx-accordion-item-closed")
        }))
    },
    _splitFreeSpace(freeSpace) {
        if (!freeSpace) {
            return freeSpace
        }
        return freeSpace / this.option("selectedItems").length
    },
    _calculateFreeSpace() {
        const height = this.option("height");
        if (void 0 === height || "auto" === height) {
            return
        }
        const $titles = this._itemTitles();
        let itemsHeight = 0;
        iteratorUtils.each($titles, ((_, title) => {
            itemsHeight += getOuterHeight(title)
        }));
        return getHeight(this.$element()) - itemsHeight
    },
    _visibilityChanged(visible) {
        if (visible) {
            this._dimensionChanged()
        }
    },
    _dimensionChanged() {
        this._updateItemHeights(true)
    },
    _clean() {
        this._deferredTemplateItems.forEach((item => {
            item.reject()
        }));
        this._deferredTemplateItems = [];
        clearTimeout(this._animationTimer);
        this.callBase()
    },
    _tryParseItemPropertyName(fullName) {
        const matches = fullName.match(/.*\.(.*)/);
        if (isDefined(matches) && matches.length >= 1) {
            return matches[1]
        }
    },
    _optionChanged(args) {
        switch (args.name) {
            case "items":
                this.callBase(args);
                if ("title" === this._tryParseItemPropertyName(args.fullName)) {
                    this._renderSelection(this._getSelectedItemIndices(), [])
                }
                if ("visible" === this._tryParseItemPropertyName(args.fullName)) {
                    this._updateItemHeightsWrapper(true)
                }
                if (true === this.option("repaintChangesOnly") && "items" === args.fullName) {
                    this._updateItemHeightsWrapper(true);
                    this._renderSelection(this._getSelectedItemIndices(), [])
                }
                break;
            case "animationDuration":
            case "onItemTitleClick":
            case "_animationEasing":
                break;
            case "collapsible":
                this.option("selectionRequired", !this.option("collapsible"));
                break;
            case "itemTitleTemplate":
            case "height":
            case "deferRendering":
                this._invalidate();
                break;
            case "multiple":
                this.option("selectionMode", args.value ? "multiple" : "single");
                break;
            default:
                this.callBase(args)
        }
    },
    expandItem(index) {
        this._deferredAnimate = new Deferred;
        this.selectItem(index);
        return this._deferredAnimate.promise()
    },
    collapseItem(index) {
        this._deferredAnimate = new Deferred;
        this.unselectItem(index);
        return this._deferredAnimate.promise()
    },
    updateDimensions() {
        return this._updateItemHeights(false)
    }
});
registerComponent("dxAccordion", Accordion);
export default Accordion;
