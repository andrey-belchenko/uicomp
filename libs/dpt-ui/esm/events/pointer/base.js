/**
 * DevExtreme (esm/events/pointer/base.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import eventsEngine from "../../events/core/events_engine";
import browser from "../../core/utils/browser";
import domAdapter from "../../core/dom_adapter";
import Class from "../../core/class";
import {
    addNamespace,
    eventSource,
    fireEvent
} from "../utils/index";
import {
    getEventTarget
} from "../utils/event_target";
const POINTER_EVENTS_NAMESPACE = "dxPointerEvents";
const BaseStrategy = Class.inherit({
    ctor: function(eventName, originalEvents) {
        this._eventName = eventName;
        this._originalEvents = addNamespace(originalEvents, "dxPointerEvents");
        this._handlerCount = 0;
        this.noBubble = this._isNoBubble()
    },
    _isNoBubble: function() {
        const eventName = this._eventName;
        return "dxpointerenter" === eventName || "dxpointerleave" === eventName
    },
    _handler: function(e) {
        const delegateTarget = this._getDelegateTarget(e);
        const event = {
            type: this._eventName,
            pointerType: e.pointerType || eventSource(e),
            originalEvent: e,
            delegateTarget: delegateTarget,
            timeStamp: browser.mozilla ? (new Date).getTime() : e.timeStamp
        };
        const target = getEventTarget(e);
        event.target = target;
        return this._fireEvent(event)
    },
    _getDelegateTarget: function(e) {
        let delegateTarget;
        if (this.noBubble) {
            delegateTarget = e.delegateTarget
        }
        return delegateTarget
    },
    _fireEvent: function(args) {
        return fireEvent(args)
    },
    _setSelector: function(handleObj) {
        this._selector = this.noBubble && handleObj ? handleObj.selector : null
    },
    _getSelector: function() {
        return this._selector
    },
    setup: function() {
        return true
    },
    add: function(element, handleObj) {
        if (this._handlerCount <= 0 || this.noBubble) {
            element = this.noBubble ? element : domAdapter.getDocument();
            this._setSelector(handleObj);
            const that = this;
            eventsEngine.on(element, this._originalEvents, this._getSelector(), (function(e) {
                that._handler(e)
            }))
        }
        if (!this.noBubble) {
            this._handlerCount++
        }
    },
    remove: function(handleObj) {
        this._setSelector(handleObj);
        if (!this.noBubble) {
            this._handlerCount--
        }
    },
    teardown: function(element) {
        if (this._handlerCount && !this.noBubble) {
            return
        }
        element = this.noBubble ? element : domAdapter.getDocument();
        if (".dxPointerEvents" !== this._originalEvents) {
            eventsEngine.off(element, this._originalEvents, this._getSelector())
        }
    },
    dispose: function(element) {
        element = this.noBubble ? element : domAdapter.getDocument();
        eventsEngine.off(element, this._originalEvents)
    }
});
export default BaseStrategy;
