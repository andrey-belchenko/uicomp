/**
 * DevExtreme (esm/ui/file_manager/ui.file_manager.dialog.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import $ from "../../core/renderer";
import {
    extend
} from "../../core/utils/extend";
import {
    isDefined
} from "../../core/utils/type";
import messageLocalization from "../../localization/message";
import Widget from "../widget/ui.widget";
import Popup from "../popup/ui.popup";
const FILE_MANAGER_DIALOG_CONTENT = "dx-filemanager-dialog";
const FILE_MANAGER_DIALOG_POPUP = "dx-filemanager-dialog-popup";
class FileManagerDialogBase extends Widget {
    _initMarkup() {
        super._initMarkup();
        this._createOnClosedAction();
        const options = this._getDialogOptions();
        const $popup = $("<div>").appendTo(this.$element());
        const popupOptions = {
            showTitle: true,
            title: options.title,
            visible: false,
            hideOnOutsideClick: true,
            contentTemplate: this._createContentTemplate.bind(this),
            toolbarItems: [{
                widget: "dxButton",
                toolbar: "bottom",
                location: "after",
                options: {
                    text: options.buttonText,
                    onClick: this._applyDialogChanges.bind(this)
                }
            }, {
                widget: "dxButton",
                toolbar: "bottom",
                location: "after",
                options: {
                    text: messageLocalization.format("dxFileManager-dialogButtonCancel"),
                    onClick: this._closeDialog.bind(this)
                }
            }],
            onInitialized: _ref => {
                let {
                    component: component
                } = _ref;
                component.registerKeyHandler("enter", this._applyDialogChanges.bind(this))
            },
            onHiding: this._onPopupHiding.bind(this),
            onShown: this._onPopupShown.bind(this),
            _wrapperClassExternal: `${FILE_MANAGER_DIALOG_POPUP} ${options.popupCssClass??""}`
        };
        if (isDefined(options.height)) {
            popupOptions.height = options.height
        }
        if (isDefined(options.maxHeight)) {
            popupOptions.maxHeight = options.maxHeight
        }
        this._popup = this._createComponent($popup, Popup, popupOptions)
    }
    show() {
        this._dialogResult = null;
        this._popup.show()
    }
    _getDialogOptions() {
        return {
            title: "Title",
            buttonText: "ButtonText",
            contentCssClass: "",
            popupCssClass: ""
        }
    }
    _createContentTemplate(element) {
        this._$contentElement = $("<div>").appendTo(element).addClass("dx-filemanager-dialog");
        const cssClass = this._getDialogOptions().contentCssClass;
        if (cssClass) {
            this._$contentElement.addClass(cssClass)
        }
    }
    _getDialogResult() {
        return null
    }
    _applyDialogChanges() {
        const result = this._getDialogResult();
        if (result) {
            this._dialogResult = result;
            this._closeDialog()
        }
    }
    _closeDialog() {
        this._popup.hide()
    }
    _onPopupHiding() {
        this._onClosedAction({
            dialogResult: this._dialogResult
        })
    }
    _onPopupShown() {}
    _createOnClosedAction() {
        this._onClosedAction = this._createActionByOption("onClosed")
    }
    _setTitle(newTitle) {
        this._popup.option("title", newTitle)
    }
    _setApplyButtonOptions(options) {
        this._popup.option("toolbarItems[0].options", options)
    }
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            onClosed: null
        })
    }
    _optionChanged(args) {
        const name = args.name;
        if ("onClosed" === name) {
            this._createOnPathChangedAction()
        } else {
            super._optionChanged(args)
        }
    }
}
export default FileManagerDialogBase;
