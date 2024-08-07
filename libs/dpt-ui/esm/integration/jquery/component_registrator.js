/**
 * DevExtreme (esm/integration/jquery/component_registrator.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import jQuery from "jquery";
import componentRegistratorCallbacks from "../../core/component_registrator_callbacks";
import errors from "../../core/errors";
if (jQuery) {
    const registerJQueryComponent = function(name, componentClass) {
        jQuery.fn[name] = function(options) {
            const isMemberInvoke = "string" === typeof options;
            let result;
            if (isMemberInvoke) {
                const memberName = options;
                const memberArgs = [].slice.call(arguments).slice(1);
                this.each((function() {
                    const instance = componentClass.getInstance(this);
                    if (!instance) {
                        throw errors.Error("E0009", name)
                    }
                    const member = instance[memberName];
                    const memberValue = member.apply(instance, memberArgs);
                    if (void 0 === result) {
                        result = memberValue
                    }
                }))
            } else {
                this.each((function() {
                    const instance = componentClass.getInstance(this);
                    if (instance) {
                        instance.option(options)
                    } else {
                        new componentClass(this, options)
                    }
                }));
                result = this
            }
            return result
        }
    };
    componentRegistratorCallbacks.add(registerJQueryComponent)
}
