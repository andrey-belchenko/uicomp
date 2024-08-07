/*!
 * dpt-ui-react
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file in the root of the project for details.
 *
 * https://github.com/DevExpress/dpt-ui-react
 */

import * as React from 'react';
import { useImperativeHandle, forwardRef, useRef, useLayoutEffect, useCallback, } from 'react';
import { ComponentBase } from './component-base';
function elementIsExtension(el) {
    return !!el.type?.isExtensionComponent;
}
const ExtensionComponent = forwardRef((props, ref) => {
    const componentBaseRef = useRef(null);
    const createWidget = useCallback((el) => {
        componentBaseRef.current?.createWidget(el);
    }, [componentBaseRef.current]);
    useLayoutEffect(() => {
        const { onMounted } = props;
        if (onMounted) {
            onMounted(createWidget);
        }
        else {
            createWidget();
        }
    }, []);
    useImperativeHandle(ref, () => ({
        getInstance() {
            return componentBaseRef.current?.getInstance();
        },
        getElement() {
            return componentBaseRef.current?.getElement();
        },
        createWidget(el) {
            createWidget(el);
        },
    }), [componentBaseRef.current, createWidget]);
    return (React.createElement(ComponentBase, { ref: componentBaseRef, ...props }));
});
export { ExtensionComponent, elementIsExtension, };
