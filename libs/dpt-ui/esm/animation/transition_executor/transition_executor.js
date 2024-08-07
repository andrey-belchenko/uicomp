/**
 * DevExtreme (esm/animation/transition_executor/transition_executor.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import $ from "../../core/renderer";
import Class from "../../core/class";
import {
    extend
} from "../../core/utils/extend";
import {
    executeAsync
} from "../../core/utils/common";
import {
    isFunction,
    isPlainObject
} from "../../core/utils/type";
import {
    map
} from "../../core/utils/iterator";
import fx from "../fx";
import {
    presets
} from "../presets/presets";
import {
    when,
    Deferred
} from "../../core/utils/deferred";
const directionPostfixes = {
    forward: " dx-forward",
    backward: " dx-backward",
    none: " dx-no-direction",
    undefined: " dx-no-direction"
};
const DX_ANIMATING_CLASS = "dx-animating";
export const TransitionExecutor = Class.inherit({
    ctor: function() {
        this._accumulatedDelays = {
            enter: 0,
            leave: 0
        };
        this._animations = [];
        this.reset()
    },
    _createAnimations: function($elements, initialConfig, configModifier, type) {
        $elements = $($elements);
        const that = this;
        const result = [];
        configModifier = configModifier || {};
        const animationConfig = this._prepareElementAnimationConfig(initialConfig, configModifier, type);
        if (animationConfig) {
            $elements.each((function() {
                const animation = that._createAnimation($(this), animationConfig, configModifier);
                if (animation) {
                    animation.element.addClass("dx-animating");
                    animation.setup();
                    result.push(animation)
                }
            }))
        }
        return result
    },
    _prepareElementAnimationConfig: function(config, configModifier, type) {
        let result;
        if ("string" === typeof config) {
            const presetName = config;
            config = presets.getPreset(presetName)
        }
        if (!config) {
            result = void 0
        } else if (isFunction(config[type])) {
            result = config[type]
        } else {
            result = extend({
                skipElementInitialStyles: true,
                cleanupWhen: this._completePromise
            }, config, configModifier);
            if (!result.type || "css" === result.type) {
                const cssClass = "dx-" + type;
                const extraCssClasses = (result.extraCssClasses ? " " + result.extraCssClasses : "") + directionPostfixes[result.direction];
                result.type = "css";
                result.from = (result.from || cssClass) + extraCssClasses;
                result.to = result.to || cssClass + "-active"
            }
            result.staggerDelay = result.staggerDelay || 0;
            result.delay = result.delay || 0;
            if (result.staggerDelay) {
                result.delay += this._accumulatedDelays[type];
                this._accumulatedDelays[type] += result.staggerDelay
            }
        }
        return result
    },
    _createAnimation: function($element, animationConfig, configModifier) {
        let result;
        if (isPlainObject(animationConfig)) {
            result = fx.createAnimation($element, animationConfig)
        } else if (isFunction(animationConfig)) {
            result = animationConfig($element, configModifier)
        }
        return result
    },
    _startAnimations: function() {
        const animations = this._animations;
        for (let i = 0; i < animations.length; i++) {
            animations[i].start()
        }
    },
    _stopAnimations: function(jumpToEnd) {
        const animations = this._animations;
        for (let i = 0; i < animations.length; i++) {
            animations[i].stop(jumpToEnd)
        }
    },
    _clearAnimations: function() {
        const animations = this._animations;
        for (let i = 0; i < animations.length; i++) {
            animations[i].element.removeClass("dx-animating")
        }
        this._animations.length = 0
    },
    reset: function() {
        this._accumulatedDelays.enter = 0;
        this._accumulatedDelays.leave = 0;
        this._clearAnimations();
        this._completeDeferred = new Deferred;
        this._completePromise = this._completeDeferred.promise()
    },
    enter: function($elements, animationConfig, configModifier) {
        const animations = this._createAnimations($elements, animationConfig, configModifier, "enter");
        this._animations.push.apply(this._animations, animations)
    },
    leave: function($elements, animationConfig, configModifier) {
        const animations = this._createAnimations($elements, animationConfig, configModifier, "leave");
        this._animations.push.apply(this._animations, animations)
    },
    start: function() {
        const that = this;
        let result;
        if (!this._animations.length) {
            that.reset();
            result = (new Deferred).resolve().promise()
        } else {
            const animationDeferreds = map(this._animations, (function(animation) {
                const result = new Deferred;
                animation.deferred.always((function() {
                    result.resolve()
                }));
                return result.promise()
            }));
            result = when.apply($, animationDeferreds).always((function() {
                that._completeDeferred.resolve();
                that.reset()
            }));
            executeAsync((function() {
                that._startAnimations()
            }))
        }
        return result
    },
    stop: function(jumpToEnd) {
        this._stopAnimations(jumpToEnd)
    }
});
