/**
 * DevExtreme (esm/events/utils/event_nodes_disposing.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import eventsEngine from "../core/events_engine";
import {
    removeEvent
} from "../remove";

function nodesByEvent(event) {
    return event && [event.target, event.delegateTarget, event.relatedTarget, event.currentTarget].filter((node => !!node))
}
export const subscribeNodesDisposing = (event, callback) => {
    eventsEngine.one(nodesByEvent(event), removeEvent, callback)
};
export const unsubscribeNodesDisposing = (event, callback) => {
    eventsEngine.off(nodesByEvent(event), removeEvent, callback)
};
