/**
 * DevExtreme (esm/ui/diagram/ui.diagram.scroll_view.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    getWidth,
    getHeight
} from "../../core/utils/size";
import $ from "../../core/renderer";
import Widget from "../widget/ui.widget";
import ScrollView from "../scroll_view";
import {
    calculateScrollbarWidth
} from "../../__internal/grids/pivot_grid/m_widget_utils";
import {
    getDiagram
} from "./diagram.importer";
class DiagramScrollView extends Widget {
    _init() {
        super._init();
        const {
            EventDispatcher: EventDispatcher
        } = getDiagram();
        this.onScroll = new EventDispatcher;
        this._createOnCreateDiagramAction()
    }
    _initMarkup() {
        super._initMarkup();
        const $scrollViewWrapper = $("<div>").appendTo(this.$element());
        const options = {
            direction: "both",
            bounceEnabled: false,
            scrollByContent: false,
            onScroll: _ref => {
                let {
                    scrollOffset: scrollOffset
                } = _ref;
                this._raiseOnScroll(scrollOffset.left, scrollOffset.top)
            }
        };
        const useNativeScrolling = this.option("useNativeScrolling");
        if (void 0 !== useNativeScrolling) {
            options.useNative = useNativeScrolling
        }
        this._scrollView = this._createComponent($scrollViewWrapper, ScrollView, options);
        this._onCreateDiagramAction({
            $parent: $(this._scrollView.content()),
            scrollView: this
        })
    }
    setScroll(left, top) {
        this._scrollView.scrollTo({
            left: left,
            top: top
        });
        this._raiseOnScrollWithoutPoint()
    }
    offsetScroll(left, top) {
        this._scrollView.scrollBy({
            left: left,
            top: top
        });
        this._raiseOnScrollWithoutPoint()
    }
    getSize() {
        const {
            Size: Size
        } = getDiagram();
        const $element = this._scrollView.$element();
        return new Size(Math.floor(getWidth($element)), Math.floor(getHeight($element)))
    }
    getScrollContainer() {
        return this._scrollView.$element()[0]
    }
    getScrollBarWidth() {
        return this.option("useNativeScrolling") ? calculateScrollbarWidth() : 0
    }
    detachEvents() {}
    _raiseOnScroll(left, top) {
        const {
            Point: Point
        } = getDiagram();
        this.onScroll.raise("notifyScrollChanged", (() => new Point(left, top)))
    }
    _raiseOnScrollWithoutPoint() {
        const {
            Point: Point
        } = getDiagram();
        this.onScroll.raise("notifyScrollChanged", (() => new Point(this._scrollView.scrollLeft(), this._scrollView.scrollTop())))
    }
    _createOnCreateDiagramAction() {
        this._onCreateDiagramAction = this._createActionByOption("onCreateDiagram")
    }
    _optionChanged(args) {
        switch (args.name) {
            case "onCreateDiagram":
                this._createOnCreateDiagramAction();
                break;
            case "useNativeScrolling":
                break;
            default:
                super._optionChanged(args)
        }
    }
}
export default DiagramScrollView;
