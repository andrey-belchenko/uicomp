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

import { memo } from 'react';
const Template = memo(() => null);
function findProps(child) {
    if (child.type !== Template) {
        return undefined;
    }
    return {
        name: child.props.name,
        render: child.props.render,
        component: child.props.component,
        children: child.props.children,
    };
}
export { Template, findProps, };
