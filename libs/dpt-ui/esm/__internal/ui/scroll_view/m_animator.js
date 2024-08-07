/**
 * DevExtreme (esm/__internal/ui/scroll_view/m_animator.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    cancelAnimationFrame,
    requestAnimationFrame
} from "../../../animation/frame";
import Class from "../../../core/class";
import {
    noop
} from "../../../core/utils/common";
const {
    abstract: abstract
} = Class;
const Animator = Class.inherit({
    ctor() {
        this._finished = true;
        this._stopped = false;
        this._proxiedStepCore = this._stepCore.bind(this)
    },
    start() {
        this._stopped = false;
        this._finished = false;
        this._stepCore()
    },
    stop() {
        this._stopped = true;
        cancelAnimationFrame(this._stepAnimationFrame)
    },
    _stepCore() {
        if (this._isStopped()) {
            this._stop();
            return
        }
        if (this._isFinished()) {
            this._finished = true;
            this._complete();
            return
        }
        this._step();
        this._stepAnimationFrame = requestAnimationFrame(this._proxiedStepCore)
    },
    _step: abstract,
    _isFinished: noop,
    _stop: noop,
    _complete: noop,
    _isStopped() {
        return this._stopped
    },
    inProgress() {
        return !(this._stopped || this._finished)
    }
});
export default Animator;
