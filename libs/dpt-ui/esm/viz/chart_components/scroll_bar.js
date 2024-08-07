/**
 * DevExtreme (esm/viz/chart_components/scroll_bar.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import eventsEngine from "../../events/core/events_engine";
import {
    fireEvent
} from "../../events/utils/index";
import {
    extend
} from "../../core/utils/extend";
import {
    Translator2D
} from "../translators/translator2d";
import {
    isDefined
} from "../../core/utils/type";
import {
    noop
} from "../../core/utils/common";
import {
    start as dragEventStart,
    move as dragEventMove,
    end as dragEventEnd
} from "../../events/drag";
const _min = Math.min;
const _max = Math.max;
const MIN_SCROLL_BAR_SIZE = 2;
export const ScrollBar = function(renderer, group) {
    this._translator = new Translator2D({}, {}, {});
    this._scroll = renderer.rect().append(group);
    this._addEvents()
};

function _getXCoord(canvas, pos, offset, width) {
    let x = 0;
    if ("right" === pos) {
        x = canvas.width - canvas.right + offset
    } else if ("left" === pos) {
        x = canvas.left - offset - width
    }
    return x
}

function _getYCoord(canvas, pos, offset, width) {
    let y = 0;
    if ("top" === pos) {
        y = canvas.top - offset
    } else if ("bottom" === pos) {
        y = canvas.height - canvas.bottom + width + offset
    }
    return y
}
ScrollBar.prototype = {
    _addEvents: function() {
        const scrollElement = this._scroll.element;
        eventsEngine.on(scrollElement, dragEventStart, (e => {
            fireEvent({
                type: "dxc-scroll-start",
                originalEvent: e,
                target: scrollElement
            })
        }));
        eventsEngine.on(scrollElement, dragEventMove, (e => {
            const dX = -e.offset.x * this._scale;
            const dY = -e.offset.y * this._scale;
            const lx = this._offset - (this._layoutOptions.vertical ? dY : dX) / this._scale;
            this._applyPosition(lx, lx + this._translator.canvasLength / this._scale);
            fireEvent({
                type: "dxc-scroll-move",
                originalEvent: e,
                target: scrollElement,
                offset: {
                    x: dX,
                    y: dY
                }
            })
        }));
        eventsEngine.on(scrollElement, dragEventEnd, (e => {
            fireEvent({
                type: "dxc-scroll-end",
                originalEvent: e,
                target: scrollElement,
                offset: {
                    x: -e.offset.x * this._scale,
                    y: -e.offset.y * this._scale
                }
            })
        }))
    },
    update: function(options) {
        let position = options.position;
        const isVertical = options.rotated;
        const defaultPosition = isVertical ? "right" : "top";
        const secondaryPosition = isVertical ? "left" : "bottom";
        if (position !== defaultPosition && position !== secondaryPosition) {
            position = defaultPosition
        }
        this._scroll.attr({
            rotate: !options.rotated ? -90 : 0,
            rotateX: 0,
            rotateY: 0,
            fill: options.color,
            width: options.width,
            opacity: options.opacity
        });
        this._layoutOptions = {
            width: options.width,
            offset: options.offset,
            vertical: isVertical,
            position: position
        };
        return this
    },
    init: function(range, stick) {
        const isDiscrete = "discrete" === range.axisType;
        this._translateWithOffset = isDiscrete && !stick ? 1 : 0;
        this._translator.update(extend({}, range, {
            minVisible: null,
            maxVisible: null,
            visibleCategories: null
        }, isDiscrete && {
            min: null,
            max: null
        } || {}), this._canvas, {
            isHorizontal: !this._layoutOptions.vertical,
            stick: stick
        });
        return this
    },
    getOptions: function() {
        return this._layoutOptions
    },
    setPane: function(panes) {
        const position = this._layoutOptions.position;
        let pane;
        if ("left" === position || "top" === position) {
            pane = panes[0]
        } else {
            pane = panes[panes.length - 1]
        }
        this.pane = pane.name;
        return this
    },
    updateSize: function(canvas) {
        this._canvas = extend({}, canvas);
        const options = this._layoutOptions;
        const pos = options.position;
        const offset = options.offset;
        const width = options.width;
        this._scroll.attr({
            translateX: _getXCoord(canvas, pos, offset, width),
            translateY: _getYCoord(canvas, pos, offset, width)
        })
    },
    getMultipleAxesSpacing: function() {
        return 0
    },
    estimateMargins: function() {
        return this.getMargins()
    },
    getMargins: function() {
        const options = this._layoutOptions;
        const margins = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        margins[options.position] = options.width + options.offset;
        return margins
    },
    shift: function(margins) {
        const options = this._layoutOptions;
        const side = options.position;
        const isVertical = options.vertical;
        const attr = {
            translateX: this._scroll.attr("translateX") ?? 0,
            translateY: this._scroll.attr("translateY") ?? 0
        };
        const shift = margins[side];
        attr[isVertical ? "translateX" : "translateY"] += ("left" === side || "top" === side ? -1 : 1) * shift;
        this._scroll.attr(attr)
    },
    hideTitle: noop,
    hideOuterElements: noop,
    setPosition: function(min, max) {
        const translator = this._translator;
        const minPoint = isDefined(min) ? translator.translate(min, -this._translateWithOffset) : translator.translate("canvas_position_start");
        const maxPoint = isDefined(max) ? translator.translate(max, this._translateWithOffset) : translator.translate("canvas_position_end");
        this._offset = _min(minPoint, maxPoint);
        this._scale = translator.getScale(min, max);
        this._applyPosition(_min(minPoint, maxPoint), _max(minPoint, maxPoint))
    },
    customPositionIsAvailable: () => false,
    dispose: function() {
        this._scroll.dispose();
        this._scroll = this._translator = null
    },
    _applyPosition: function(x1, x2) {
        const visibleArea = this._translator.getCanvasVisibleArea();
        x1 = _max(x1, visibleArea.min);
        x1 = _min(x1, visibleArea.max);
        x2 = _min(x2, visibleArea.max);
        x2 = _max(x2, visibleArea.min);
        const height = Math.abs(x2 - x1);
        this._scroll.attr({
            y: x1,
            height: height < 2 ? 2 : height
        })
    }
};
