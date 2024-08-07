/**
 * DevExtreme (esm/events/core/keyboard_processor.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import Class from "../../core/class";
import {
    addNamespace,
    normalizeKeyName
} from "../../events/utils/index";
const COMPOSITION_START_EVENT = "compositionstart";
const COMPOSITION_END_EVENT = "compositionend";
const KEYDOWN_EVENT = "keydown";
const NAMESPACE = "KeyboardProcessor";
const createKeyDownOptions = e => ({
    keyName: normalizeKeyName(e),
    key: e.key,
    code: e.code,
    ctrl: e.ctrlKey,
    location: e.location,
    metaKey: e.metaKey,
    shift: e.shiftKey,
    alt: e.altKey,
    which: e.which,
    originalEvent: e
});
const KeyboardProcessor = Class.inherit({
    _keydown: addNamespace("keydown", NAMESPACE),
    _compositionStart: addNamespace("compositionstart", NAMESPACE),
    _compositionEnd: addNamespace("compositionend", NAMESPACE),
    ctor: function(options) {
        options = options || {};
        if (options.element) {
            this._element = $(options.element)
        }
        if (options.focusTarget) {
            this._focusTarget = options.focusTarget
        }
        this._handler = options.handler;
        if (this._element) {
            this._processFunction = e => {
                const focusTargets = $(this._focusTarget).toArray();
                const isNotFocusTarget = this._focusTarget && this._focusTarget !== e.target && !focusTargets.includes(e.target);
                const shouldSkipProcessing = this._isComposingJustFinished && 229 === e.which || this._isComposing || isNotFocusTarget;
                this._isComposingJustFinished = false;
                if (!shouldSkipProcessing) {
                    this.process(e)
                }
            };
            this._toggleProcessingWithContext = this.toggleProcessing.bind(this);
            eventsEngine.on(this._element, this._keydown, this._processFunction);
            eventsEngine.on(this._element, this._compositionStart, this._toggleProcessingWithContext);
            eventsEngine.on(this._element, this._compositionEnd, this._toggleProcessingWithContext)
        }
    },
    dispose: function() {
        if (this._element) {
            eventsEngine.off(this._element, this._keydown, this._processFunction);
            eventsEngine.off(this._element, this._compositionStart, this._toggleProcessingWithContext);
            eventsEngine.off(this._element, this._compositionEnd, this._toggleProcessingWithContext)
        }
        this._element = void 0;
        this._handler = void 0
    },
    process: function(e) {
        this._handler(createKeyDownOptions(e))
    },
    toggleProcessing: function(_ref) {
        let {
            type: type
        } = _ref;
        this._isComposing = "compositionstart" === type;
        this._isComposingJustFinished = !this._isComposing
    }
});
KeyboardProcessor.createKeyDownOptions = createKeyDownOptions;
export default KeyboardProcessor;
