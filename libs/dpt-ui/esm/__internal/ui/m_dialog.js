/**
 * DevExtreme (esm/__internal/ui/m_dialog.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import Action from "../../core/action";
import config from "../../core/config";
import devices from "../../core/devices";
import Guid from "../../core/guid";
import $ from "../../core/renderer";
import {
    ensureDefined
} from "../../core/utils/common";
import {
    Deferred
} from "../../core/utils/deferred";
import {
    resetActiveElement
} from "../../core/utils/dom";
import {
    extend
} from "../../core/utils/extend";
import {
    getHeight,
    getWidth
} from "../../core/utils/size";
import {
    isPlainObject
} from "../../core/utils/type";
import {
    value as getViewport
} from "../../core/utils/view_port";
import {
    getWindow
} from "../../core/utils/window";
import eventsEngine from "../../events/core/events_engine";
import messageLocalization from "../../localization/message";
import Popup from "../../ui/popup/ui.popup";
import {
    isFluent
} from "../../ui/themes";
import errors from "../../ui/widget/ui.errors";
const window = getWindow();
const DEFAULT_BUTTON = {
    text: "OK",
    onClick: () => true
};
const DX_DIALOG_CLASSNAME = "dx-dialog";
const DX_DIALOG_WRAPPER_CLASSNAME = "dx-dialog-wrapper";
const DX_DIALOG_ROOT_CLASSNAME = "dx-dialog-root";
const DX_DIALOG_CONTENT_CLASSNAME = "dx-dialog-content";
const DX_DIALOG_MESSAGE_CLASSNAME = "dx-dialog-message";
const DX_DIALOG_BUTTONS_CLASSNAME = "dx-dialog-buttons";
const DX_DIALOG_BUTTON_CLASSNAME = "dx-dialog-button";
const DX_BUTTON_CLASSNAME = "dx-button";
const getApplyButtonConfig = () => {
    if (isFluent()) {
        return {
            stylingMode: "contained",
            type: "default"
        }
    }
    return {}
};
const getCancelButtonConfig = () => {
    if (isFluent()) {
        return {
            stylingMode: "outlined",
            type: "default"
        }
    }
    return {}
};
export const custom = function(options) {
    const deferred = Deferred();
    options = options || {};
    const $element = $("<div>").addClass("dx-dialog").appendTo(getViewport());
    const isMessageDefined = "message" in options;
    const isMessageHtmlDefined = "messageHtml" in options;
    if (isMessageDefined) {
        errors.log("W1013")
    }
    const messageHtml = String(isMessageHtmlDefined ? options.messageHtml : options.message);
    const messageId = options.title ? null : new Guid;
    const $message = $("<div>").addClass("dx-dialog-message").html(messageHtml).attr("id", messageId);
    const popupToolbarItems = [];
    const popupInstance = new Popup($element, extend({
        title: options.title ?? "",
        showTitle: ensureDefined(options.showTitle, true),
        dragEnabled: ensureDefined(options.dragEnabled, true),
        height: "auto",
        width: options.width,
        showCloseButton: options.showCloseButton || false,
        ignoreChildEvents: false,
        container: $element,
        visualContainer: window,
        dragAndResizeArea: window,
        onContentReady(args) {
            args.component.$content().addClass("dx-dialog-content").append($message);
            if (messageId) {
                args.component.$overlayContent().attr("aria-labelledby", messageId)
            }
        },
        onShowing(e) {
            e.component.bottomToolbar().addClass("dx-dialog-buttons").find(".dx-button").addClass("dx-dialog-button");
            resetActiveElement()
        },
        onShown(e) {
            const $firstButton = e.component.bottomToolbar().find(".dx-button").first();
            eventsEngine.trigger($firstButton, "focus")
        },
        onHiding() {
            deferred.reject()
        },
        onHidden(_ref) {
            let {
                element: element
            } = _ref;
            $(element).remove()
        },
        animation: {
            show: {
                type: "pop",
                duration: 400
            },
            hide: {
                type: "pop",
                duration: 400,
                to: {
                    opacity: 0,
                    scale: 0
                },
                from: {
                    opacity: 1,
                    scale: 1
                }
            }
        },
        rtlEnabled: config().rtlEnabled,
        position: {
            boundaryOffset: {
                h: 10,
                v: 0
            }
        }
    }, options.popupOptions));
    const buttonOptions = options.buttons || [DEFAULT_BUTTON];
    buttonOptions.forEach((options => {
        const action = new Action(options.onClick, {
            context: popupInstance
        });
        popupToolbarItems.push({
            toolbar: "bottom",
            location: devices.current().android ? "after" : "center",
            widget: "dxButton",
            options: _extends({}, options, {
                onClick() {
                    const result = action.execute(...arguments);
                    hide(result)
                }
            })
        })
    }));
    popupInstance.option("toolbarItems", popupToolbarItems);
    popupInstance.$wrapper().addClass("dx-dialog-wrapper");
    if (options.position) {
        popupInstance.option("position", options.position)
    }
    popupInstance.$wrapper().addClass("dx-dialog-root");

    function hide(value) {
        deferred.resolve(value);
        popupInstance.hide()
    }
    return {
        show: function() {
            if ("phone" === devices.real().deviceType) {
                const isPortrait = getHeight(window) > getWidth(window);
                const width = isPortrait ? "90%" : "60%";
                popupInstance.option({
                    width: width
                })
            }
            popupInstance.show();
            return deferred.promise()
        },
        hide: hide
    }
};
export const alert = function(messageHtml) {
    let title = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
    let showTitle = arguments.length > 2 ? arguments[2] : void 0;
    const options = isPlainObject(messageHtml) ? messageHtml : {
        title: title,
        messageHtml: messageHtml,
        showTitle: showTitle,
        buttons: [_extends({}, DEFAULT_BUTTON, getApplyButtonConfig())],
        dragEnabled: showTitle
    };
    return custom(options).show()
};
export const confirm = function(messageHtml) {
    let title = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
    let showTitle = arguments.length > 2 ? arguments[2] : void 0;
    const options = isPlainObject(messageHtml) ? messageHtml : {
        title: title,
        messageHtml: messageHtml,
        showTitle: showTitle,
        buttons: [_extends({
            text: messageLocalization.format("Yes"),
            onClick: () => true
        }, getApplyButtonConfig()), _extends({
            text: messageLocalization.format("No"),
            onClick: () => false
        }, getCancelButtonConfig())],
        dragEnabled: showTitle
    };
    return custom(options).show()
};
