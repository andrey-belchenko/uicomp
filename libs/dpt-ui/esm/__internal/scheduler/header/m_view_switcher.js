/**
 * DevExtreme (esm/__internal/scheduler/header/m_view_switcher.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import {
    isFluent
} from "../../../ui/themes";
import {
    formatViews,
    getViewName,
    isOneView
} from "./m_utils";
const VIEW_SWITCHER_CLASS = "dx-scheduler-view-switcher";
const VIEW_SWITCHER_DROP_DOWN_BUTTON_CLASS = "dx-scheduler-view-switcher-dropdown-button";
const VIEW_SWITCHER_DROP_DOWN_BUTTON_CONTENT_CLASS = "dx-scheduler-view-switcher-dropdown-button-content";
const getViewsAndSelectedView = header => {
    const views = formatViews(header.views);
    let selectedView = getViewName(header.currentView);
    const isSelectedViewInViews = views.some((view => view.name === selectedView));
    selectedView = isSelectedViewInViews ? selectedView : void 0;
    return {
        selectedView: selectedView,
        views: views
    }
};
export const getViewSwitcher = (header, item) => {
    const {
        selectedView: selectedView,
        views: views
    } = getViewsAndSelectedView(header);
    const stylingMode = isFluent() ? "outlined" : "contained";
    return _extends({
        widget: "dxButtonGroup",
        locateInMenu: "auto",
        cssClass: VIEW_SWITCHER_CLASS,
        options: {
            items: views,
            keyExpr: "name",
            selectedItemKeys: [selectedView],
            stylingMode: stylingMode,
            onItemClick: e => {
                const {
                    view: view
                } = e.itemData;
                header._updateCurrentView(view)
            },
            onContentReady: e => {
                const viewSwitcher = e.component;
                header._addEvent("currentView", (view => {
                    viewSwitcher.option("selectedItemKeys", [getViewName(view)])
                }))
            }
        }
    }, item)
};
export const getDropDownViewSwitcher = (header, item) => {
    const {
        selectedView: selectedView,
        views: views
    } = getViewsAndSelectedView(header);
    const oneView = isOneView(views, selectedView);
    return _extends({
        widget: "dxDropDownButton",
        locateInMenu: "never",
        cssClass: VIEW_SWITCHER_CLASS,
        options: {
            items: views,
            useSelectMode: true,
            keyExpr: "name",
            selectedItemKey: selectedView,
            displayExpr: "text",
            showArrowIcon: !oneView,
            elementAttr: {
                class: VIEW_SWITCHER_DROP_DOWN_BUTTON_CLASS
            },
            onItemClick: e => {
                const {
                    view: view
                } = e.itemData;
                header._updateCurrentView(view)
            },
            onContentReady: e => {
                const viewSwitcher = e.component;
                header._addEvent("currentView", (view => {
                    const views = formatViews(header.views);
                    if (isOneView(views, view)) {
                        header.repaint()
                    }
                    viewSwitcher.option("selectedItemKey", getViewName(view))
                }))
            },
            dropDownOptions: {
                onShowing: e => {
                    if (oneView) {
                        e.cancel = true
                    }
                },
                width: "max-content",
                _wrapperClassExternal: VIEW_SWITCHER_DROP_DOWN_BUTTON_CONTENT_CLASS
            }
        }
    }, item)
};
