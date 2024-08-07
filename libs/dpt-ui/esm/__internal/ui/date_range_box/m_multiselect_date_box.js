/**
 * DevExtreme (esm/__internal/ui/date_range_box/m_multiselect_date_box.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import $ from "../../../core/renderer";
import {
    getWidth
} from "../../../core/utils/size";
import eventsEngine from "../../../events/core/events_engine";
import {
    addNamespace
} from "../../../events/utils";
import DateBox from "../../../ui/date_box";
import {
    getDeserializedDate,
    monthDifference
} from "./m_date_range.utils";
import RangeCalendarStrategy from "./strategy/m_rangeCalendar";
const START_DATEBOX_CLASS = "dx-start-datebox";
const TypedDateBox = DateBox;
class MultiselectDateBox extends TypedDateBox {
    _initStrategy() {
        this._strategy = new RangeCalendarStrategy(this)
    }
    _initMarkup() {
        super._initMarkup();
        this._renderInputClickEvent()
    }
    _renderInputClickEvent() {
        const clickEventName = addNamespace("dxclick", this.NAME);
        eventsEngine.off(this._input(), clickEventName);
        eventsEngine.on(this._input(), clickEventName, (e => {
            this._processValueChange(e)
        }))
    }
    _applyButtonHandler(_ref) {
        let {
            event: event
        } = _ref;
        const strategy = this.getStrategy();
        const value = strategy.getValue();
        strategy.getDateRangeBox().updateValue(value, event);
        this.close();
        this.option("focusStateEnabled") && this.focus()
    }
    _openHandler(e) {
        if (this.getStrategy().getDateRangeBox().option("opened")) {
            return
        }
        super._openHandler(e)
    }
    _renderOpenedState() {
        const {
            opened: opened
        } = this.option();
        this._getDateRangeBox().option("opened", opened);
        if (this._isStartDateBox()) {
            if (opened) {
                this._createPopup()
            }
            this._getDateRangeBox()._popupContentIdentifier(this._getControlsAria());
            this._setPopupOption("visible", opened);
            this._getDateRangeBox()._setAriaAttributes()
        }
    }
    _getDateRangeBox() {
        return this.getStrategy().getDateRangeBox()
    }
    _isStartDateBox() {
        return $(this.element()).hasClass("dx-start-datebox")
    }
    _renderPopup() {
        super._renderPopup();
        if (this._isStartDateBox()) {
            this._getDateRangeBox()._bindInnerWidgetOptions(this._popup, "dropDownOptions")
        }
    }
    _popupShownHandler() {
        var _this$_getDateRangeBo;
        super._popupShownHandler();
        null === (_this$_getDateRangeBo = this._getDateRangeBox()._validationMessage) || void 0 === _this$_getDateRangeBo || _this$_getDateRangeBo.option("positionSide", this._getValidationMessagePositionSide())
    }
    _popupHiddenHandler() {
        var _this$_getDateRangeBo2;
        super._popupHiddenHandler();
        null === (_this$_getDateRangeBo2 = this._getDateRangeBox()._validationMessage) || void 0 === _this$_getDateRangeBo2 || _this$_getDateRangeBo2.option("positionSide", this._getValidationMessagePositionSide())
    }
    _focusInHandler(e) {
        super._focusInHandler(e);
        this._processValueChange(e)
    }
    _popupTabHandler(e) {
        const $element = $(e.target);
        if (e.shiftKey && $element.is(this._getFirstPopupElement())) {
            this._getDateRangeBox().getEndDateBox().focus();
            e.preventDefault()
        }
        if (!e.shiftKey && $element.is(this._getLastPopupElement())) {
            this._getDateRangeBox().getStartDateBox().focus();
            e.preventDefault()
        }
    }
    _processValueChange(e) {
        const {
            target: target
        } = e;
        const dateRangeBox = this._getDateRangeBox();
        const [startDateInput, endDateInput] = dateRangeBox.field();
        if ($(target).is($(startDateInput))) {
            dateRangeBox.option("_currentSelection", "startDate")
        }
        if ($(target).is($(endDateInput))) {
            dateRangeBox.option("_currentSelection", "endDate")
        }
        if (!dateRangeBox.getStartDateBox().getStrategy().getWidget()) {
            return
        }
        const calendar = dateRangeBox.getStartDateBox().getStrategy().getWidget();
        const {
            value: value
        } = calendar.option();
        const startDate = getDeserializedDate(null === value || void 0 === value ? void 0 : value[0]);
        const endDate = getDeserializedDate(null === value || void 0 === value ? void 0 : value[1]);
        if ($(target).is($(startDateInput))) {
            if (startDate) {
                calendar._skipNavigate = true;
                calendar.option("currentDate", startDate)
            }
            this.getStrategy().setActiveStartDateBox();
            calendar.option("_currentSelection", "startDate");
            if (dateRangeBox.option("disableOutOfRangeSelection")) {
                calendar._setViewsMaxOption(endDate)
            }
        }
        if ($(target).is($(endDateInput))) {
            if (endDate) {
                if (startDate && monthDifference(startDate, endDate) > 1) {
                    calendar.option("currentDate", calendar._getDateByOffset(null, endDate));
                    calendar.option("currentDate", calendar._getDateByOffset(-1, endDate))
                }
                calendar._skipNavigate = true;
                calendar.option("currentDate", endDate)
            }
            dateRangeBox.getStartDateBox().getStrategy().setActiveEndDateBox();
            calendar.option("_currentSelection", "endDate");
            if (dateRangeBox.option("disableOutOfRangeSelection")) {
                calendar._setViewsMinOption(startDate)
            }
        }
    }
    _invalidate() {
        super._invalidate();
        this._refreshStrategy()
    }
    _updateInternalValidationState(isValid, validationMessage) {
        this.option({
            isValid: isValid,
            validationError: isValid ? null : {
                message: validationMessage
            }
        })
    }
    _recallInternalValidation(value) {
        this._applyInternalValidation(value)
    }
    _isTargetOutOfComponent(target) {
        const $dateRangeBox = $(this._getDateRangeBox().element());
        const isTargetOutOfDateRangeBox = 0 === $(target).closest($dateRangeBox).length;
        return super._isTargetOutOfComponent(target) && isTargetOutOfDateRangeBox
    }
    _updateLabelWidth() {
        const $beforeButtonsContainer = this._getDateRangeBox()._$beforeButtonsContainer;
        const {
            labelMode: labelMode
        } = this.option();
        if ("outside" === labelMode && $beforeButtonsContainer && this._isStartDateBox()) {
            this._label._updateLabelTransform(getWidth($beforeButtonsContainer));
            return
        }
        super._updateLabelWidth()
    }
    _optionChanged(args) {
        switch (args.name) {
            case "isValid": {
                const isValid = this._getDateRangeBox().option("isValid");
                if (this._skipIsValidOptionChange || isValid === args.value) {
                    super._optionChanged(args);
                    return
                }
                this._skipIsValidOptionChange = true;
                this.option({
                    isValid: isValid
                });
                this._skipIsValidOptionChange = false;
                break
            }
            default:
                super._optionChanged(args)
        }
    }
    close() {
        this.getStrategy().getDateRangeBox().getStartDateBox().option("opened", false)
    }
    getStrategy() {
        return this._strategy
    }
}
export default MultiselectDateBox;
