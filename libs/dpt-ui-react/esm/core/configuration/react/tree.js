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
import { separateProps } from '../../widget-config';
import { ElementType, getElementInfo, } from './element';
import { mergeNameParts } from '../utils';
import { getAnonymousTemplate, getNamedTemplate } from './templates';
export function processChildren(parentElement, parentFullName) {
    const templates = [];
    const configCollections = {};
    const configs = {};
    let hasTranscludedContent = false;
    React.Children.map(parentElement.props.children, (child) => {
        const element = getElementInfo(child, parentElement.descriptor.expectedChildren);
        if (element.type === ElementType.Unknown) {
            if (child !== null && child !== undefined && child !== false) {
                hasTranscludedContent = true;
            }
            return;
        }
        if (element.type === ElementType.Template) {
            const template = getNamedTemplate(element.props);
            if (template) {
                templates.push(template);
            }
            return;
        }
        if (element.descriptor.isCollection) {
            let collection = configCollections[element.descriptor.name];
            if (!collection) {
                collection = [];
                configCollections[element.descriptor.name] = collection;
            }
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            const collectionItem = createConfigNode(element, `${mergeNameParts(parentFullName, element.descriptor.name)}[${collection.length}]`);
            collection.push(collectionItem);
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const configNode = createConfigNode(element, parentFullName);
        configs[element.descriptor.name] = configNode;
    });
    return {
        configs,
        configCollections,
        templates,
        hasTranscludedContent,
    };
}
function createConfigNode(element, path) {
    const fullName = element.descriptor.isCollection
        ? path
        : mergeNameParts(path, element.descriptor.name);
    const separatedValues = separateProps(element.props, element.descriptor.initialValuesProps, element.descriptor.templates);
    const childrenData = processChildren(element, fullName);
    element.descriptor.templates.forEach((templateMeta) => {
        const template = getAnonymousTemplate(element.props, templateMeta, path.length > 0 ? childrenData.hasTranscludedContent : false);
        if (template) {
            childrenData.templates.push(template);
        }
    });
    return {
        fullName,
        predefinedOptions: element.descriptor.predefinedValuesProps,
        initialOptions: separatedValues.defaults,
        options: separatedValues.options,
        templates: childrenData.templates,
        configCollections: childrenData.configCollections,
        configs: childrenData.configs,
    };
}
function buildConfigTree(widgetDescriptor, props) {
    return createConfigNode({
        type: ElementType.Option,
        descriptor: {
            name: '',
            isCollection: false,
            ...widgetDescriptor,
        },
        props,
    }, '');
}
export { buildConfigTree, };
