/**
 * DevExtreme (esm/ui/html_editor/converters/markdown.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import TurnDown from "turndown";
import ShowDown from "showdown";
import {
    getWindow
} from "../../../core/utils/window";
import Errors from "../../widget/ui.errors";
import converterController from "../converterController";
class MarkdownConverter {
    constructor() {
        var _this$_html2Markdown;
        const window = getWindow();
        const turndown = window && window.TurndownService || TurnDown;
        const showdown = window && window.showdown || ShowDown;
        if (!turndown) {
            throw Errors.Error("E1041", "Turndown")
        }
        if (!showdown) {
            throw Errors.Error("E1041", "Showdown")
        }
        this._html2Markdown = new turndown;
        if (null !== (_this$_html2Markdown = this._html2Markdown) && void 0 !== _this$_html2Markdown && _this$_html2Markdown.addRule) {
            this._html2Markdown.addRule("emptyLine", {
                filter: element => "p" === element.nodeName.toLowerCase() && "<br>" === element.innerHTML,
                replacement: function() {
                    return "<br>"
                }
            });
            this._html2Markdown.keep(["table"])
        }
        this._markdown2Html = new showdown.Converter({
            simpleLineBreaks: true,
            strikethrough: true,
            tables: true
        })
    }
    toMarkdown(htmlMarkup) {
        return this._html2Markdown.turndown(htmlMarkup || "")
    }
    toHtml(markdownMarkup) {
        let markup = this._markdown2Html.makeHtml(markdownMarkup);
        if (markup) {
            markup = markup.replace(new RegExp("\\r?\\n", "g"), "")
        }
        return markup
    }
}
converterController.addConverter("markdown", MarkdownConverter);
export default MarkdownConverter;
