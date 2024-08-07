/**
 * DevExtreme (esm/__internal/scheduler/workspaces/m_timeline_work_week.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import registerComponent from "../../../core/component_registrator";
import {
    getWeekendsCount
} from "../../scheduler/r1/utils/index";
import {
    VIEWS
} from "../m_constants";
import SchedulerTimelineWeek from "./m_timeline_week";
const TIMELINE_CLASS = "dx-scheduler-timeline-work-week";
const LAST_DAY_WEEK_INDEX = 5;
class SchedulerTimelineWorkWeek extends SchedulerTimelineWeek {
    get type() {
        return VIEWS.TIMELINE_WORK_WEEK
    }
    constructor() {
        super(...arguments);
        this._getWeekendsCount = getWeekendsCount
    }
    _getElementClass() {
        return TIMELINE_CLASS
    }
    _incrementDate(date) {
        const day = date.getDay();
        if (5 === day) {
            date.setDate(date.getDate() + 2)
        }
        super._incrementDate(date)
    }
}
registerComponent("dxSchedulerTimelineWorkWeek", SchedulerTimelineWorkWeek);
export default SchedulerTimelineWorkWeek;
