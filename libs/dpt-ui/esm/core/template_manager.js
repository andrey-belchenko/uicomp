/**
 * DevExtreme (esm/core/template_manager.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import $ from "./renderer";
import {
    isDefined,
    isFunction,
    isRenderer
} from "./utils/type";
import {
    noop
} from "./utils/common";
import {
    extend
} from "./utils/extend";
import {
    FunctionTemplate
} from "./templates/function_template";
import {
    EmptyTemplate
} from "./templates/empty_template";
import {
    findTemplates,
    suitableTemplatesByName,
    templateKey,
    getNormalizedTemplateArgs,
    validateTemplateSource,
    defaultCreateElement,
    acquireTemplate
} from "./utils/template_manager";
const TEXT_NODE = 3;
const ANONYMOUS_TEMPLATE_NAME = "template";
const TEMPLATE_OPTIONS_NAME = "dxTemplate";
const TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";
const DX_POLYMORPH_WIDGET_TEMPLATE = new FunctionTemplate((_ref => {
    let {
        model: model,
        parent: parent
    } = _ref;
    const widgetName = model.widget;
    if (!widgetName) {
        return $()
    }
    const widgetElement = $("<div>");
    const widgetOptions = model.options || {};
    if (parent) {
        parent._createComponent(widgetElement, widgetName, widgetOptions)
    } else {
        widgetElement[widgetName](widgetOptions)
    }
    return widgetElement
}));
export class TemplateManager {
    constructor(createElement, anonymousTemplateName) {
        this._tempTemplates = [];
        this._defaultTemplates = {};
        this._anonymousTemplateName = anonymousTemplateName || "template";
        this._createElement = createElement || defaultCreateElement;
        this._createTemplateIfNeeded = this._createTemplateIfNeeded.bind(this)
    }
    static createDefaultOptions() {
        return {
            integrationOptions: {
                watchMethod: function(fn, callback) {
                    let options = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                    if (!options.skipImmediate) {
                        callback(fn())
                    }
                    return noop
                },
                templates: {
                    "dx-polymorph-widget": DX_POLYMORPH_WIDGET_TEMPLATE
                },
                useDeferUpdateForTemplates: true
            }
        }
    }
    get anonymousTemplateName() {
        return this._anonymousTemplateName
    }
    addDefaultTemplates(templates) {
        this._defaultTemplates = extend({}, this._defaultTemplates, templates)
    }
    dispose() {
        this._tempTemplates.forEach((tempTemplate => {
            tempTemplate.template.dispose && tempTemplate.template.dispose()
        }));
        this._tempTemplates = []
    }
    extractTemplates($el) {
        const templates = this._extractTemplates($el);
        const anonymousTemplateMeta = this._extractAnonymousTemplate($el);
        return {
            templates: templates,
            anonymousTemplateMeta: anonymousTemplateMeta
        }
    }
    _extractTemplates($el) {
        const templates = findTemplates($el, "dxTemplate");
        const suitableTemplates = suitableTemplatesByName(templates);
        templates.forEach((_ref2 => {
            let {
                element: element,
                options: {
                    name: name
                }
            } = _ref2;
            if (element === suitableTemplates[name]) {
                $(element).addClass("dx-template-wrapper").detach()
            } else {
                $(element).remove()
            }
        }));
        return Object.keys(suitableTemplates).map((name => ({
            name: name,
            template: this._createTemplate(suitableTemplates[name])
        })))
    }
    _extractAnonymousTemplate($el) {
        const $anonymousTemplate = $el.contents().detach();
        const $notJunkTemplateContent = $anonymousTemplate.filter(((_, element) => {
            const isTextNode = 3 === element.nodeType;
            const isEmptyText = $(element).text().trim().length < 1;
            return !(isTextNode && isEmptyText)
        }));
        return $notJunkTemplateContent.length > 0 ? {
            template: this._createTemplate($anonymousTemplate),
            name: this._anonymousTemplateName
        } : {}
    }
    _createTemplateIfNeeded(templateSource) {
        const cachedTemplate = this._tempTemplates.filter((tempTemplate => tempTemplate.source === templateKey(templateSource)))[0];
        if (cachedTemplate) {
            return cachedTemplate.template
        }
        const template = this._createTemplate(templateSource);
        this._tempTemplates.push({
            template: template,
            source: templateKey(templateSource)
        });
        return template
    }
    _createTemplate(templateSource) {
        return this._createElement(validateTemplateSource(templateSource))
    }
    getTemplate(templateSource, templates, _ref3, context) {
        let {
            isAsyncTemplate: isAsyncTemplate,
            skipTemplates: skipTemplates
        } = _ref3;
        if (!isFunction(templateSource)) {
            return acquireTemplate(templateSource, this._createTemplateIfNeeded, templates, isAsyncTemplate, skipTemplates, this._defaultTemplates)
        }
        return new FunctionTemplate((options => {
            const templateSourceResult = templateSource.apply(context, getNormalizedTemplateArgs(options));
            if (!isDefined(templateSourceResult)) {
                return new EmptyTemplate
            }
            let dispose = false;
            const template = acquireTemplate(templateSourceResult, (templateSource => {
                if (templateSource.nodeType || isRenderer(templateSource) && !$(templateSource).is("script")) {
                    return new FunctionTemplate((() => templateSource))
                }
                dispose = true;
                return this._createTemplate(templateSource)
            }), templates, isAsyncTemplate, skipTemplates, this._defaultTemplates);
            const result = template.render(options);
            dispose && template.dispose && template.dispose();
            return result
        }))
    }
}
