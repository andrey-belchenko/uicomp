/**
 * DevExtreme (esm/__internal/ui/date_box/m_date_utils.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import $ from "../../../core/renderer";
import dateSerialization from "../../../core/utils/date_serialization";
import {
    each
} from "../../../core/utils/iterator";
import {
    isDate
} from "../../../core/utils/type";
import dateLocalization from "../../../localization/date";
const DATE_COMPONENTS = ["year", "day", "month", "day"];
const TIME_COMPONENTS = ["hours", "minutes", "seconds", "milliseconds"];
const ONE_MINUTE = 6e4;
const ONE_DAY = 864e5;
const ONE_YEAR = 31536e6;
const getStringFormat = function(format) {
    const formatType = typeof format;
    if ("string" === formatType) {
        return "format"
    }
    if ("object" === formatType && void 0 !== format.type) {
        return format.type
    }
    return null
};
const dateUtils = {
    SUPPORTED_FORMATS: ["date", "time", "datetime"],
    ONE_MINUTE: 6e4,
    ONE_DAY: ONE_DAY,
    ONE_YEAR: ONE_YEAR,
    MIN_DATEVIEW_DEFAULT_DATE: new Date(1900, 0, 1),
    MAX_DATEVIEW_DEFAULT_DATE: function() {
        const newDate = new Date;
        return new Date(newDate.getFullYear() + 50, newDate.getMonth(), newDate.getDate(), 23, 59, 59)
    }(),
    FORMATS_INFO: {
        date: {
            getStandardPattern: () => "yyyy-MM-dd",
            components: DATE_COMPONENTS
        },
        time: {
            getStandardPattern: () => "HH:mm",
            components: TIME_COMPONENTS
        },
        datetime: {
            getStandardPattern() {
                let standardPattern;
                ! function() {
                    const $input = $("<input>").attr("type", "datetime");
                    $input.val("2000-01-01T01:01Z");
                    if ($input.val()) {
                        standardPattern = "yyyy-MM-ddTHH:mmZ"
                    }
                }();
                if (!standardPattern) {
                    standardPattern = "yyyy-MM-ddTHH:mm:ssZ"
                }
                dateUtils.FORMATS_INFO.datetime.getStandardPattern = function() {
                    return standardPattern
                };
                return standardPattern
            },
            components: [...DATE_COMPONENTS, ...TIME_COMPONENTS]
        },
        "datetime-local": {
            getStandardPattern: () => "yyyy-MM-ddTHH:mm:ss",
            components: [...DATE_COMPONENTS, "hours", "minutes", "seconds"]
        }
    },
    FORMATS_MAP: {
        date: "shortdate",
        time: "shorttime",
        datetime: "shortdateshorttime"
    },
    SUBMIT_FORMATS_MAP: {
        date: "date",
        time: "time",
        datetime: "datetime-local"
    },
    toStandardDateFormat(date, type) {
        const pattern = dateUtils.FORMATS_INFO[type].getStandardPattern();
        return dateSerialization.serializeDate(date, pattern)
    },
    fromStandardDateFormat(text) {
        const date = dateSerialization.dateParser(text);
        return isDate(date) ? date : void 0
    },
    getMaxMonthDay: (year, month) => new Date(year, month + 1, 0).getDate(),
    mergeDates(oldValue, newValue, format) {
        if (!newValue) {
            return newValue || null
        }
        if (!oldValue || isNaN(oldValue.getTime())) {
            const now = new Date(null);
            oldValue = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        }
        const result = new Date(oldValue.valueOf());
        const formatInfo = dateUtils.FORMATS_INFO[format];
        each(formatInfo.components, (function() {
            const componentInfo = dateUtils.DATE_COMPONENTS_INFO[this];
            result[componentInfo.setter](newValue[componentInfo.getter]())
        }));
        return result
    },
    getLongestCaptionIndex(captionArray) {
        let longestIndex = 0;
        let longestCaptionLength = 0;
        let i;
        for (i = 0; i < captionArray.length; ++i) {
            if (captionArray[i].length > longestCaptionLength) {
                longestIndex = i;
                longestCaptionLength = captionArray[i].length
            }
        }
        return longestIndex
    },
    formatUsesMonthName: format => dateLocalization.formatUsesMonthName(format),
    formatUsesDayName: format => dateLocalization.formatUsesDayName(format),
    getLongestDate(format, monthNames, dayNames) {
        const stringFormat = getStringFormat(format);
        let month = 9;
        if (!stringFormat || dateUtils.formatUsesMonthName(stringFormat)) {
            month = dateUtils.getLongestCaptionIndex(monthNames)
        }
        const longestDate = new Date(1888, month, 21, 23, 59, 59, 999);
        if (!stringFormat || dateUtils.formatUsesDayName(stringFormat)) {
            const date = longestDate.getDate() - longestDate.getDay() + dateUtils.getLongestCaptionIndex(dayNames);
            longestDate.setDate(date)
        }
        return longestDate
    },
    normalizeTime(date) {
        date.setSeconds(0);
        date.setMilliseconds(0)
    }
};
dateUtils.DATE_COMPONENTS_INFO = {
    year: {
        getter: "getFullYear",
        setter: "setFullYear",
        formatter(value, date) {
            const formatDate = new Date(date.getTime());
            formatDate.setFullYear(value);
            return dateLocalization.format(formatDate, "yyyy")
        },
        startValue: void 0,
        endValue: void 0
    },
    day: {
        getter: "getDate",
        setter: "setDate",
        formatter(value, date) {
            const formatDate = new Date(date.getTime());
            formatDate.setDate(value);
            return dateLocalization.format(formatDate, "d")
        },
        startValue: 1,
        endValue: void 0
    },
    month: {
        getter: "getMonth",
        setter: "setMonth",
        formatter: value => dateLocalization.getMonthNames()[value],
        startValue: 0,
        endValue: 11
    },
    hours: {
        getter: "getHours",
        setter: "setHours",
        formatter: value => dateLocalization.format(new Date(0, 0, 0, value), "hour"),
        startValue: 0,
        endValue: 23
    },
    minutes: {
        getter: "getMinutes",
        setter: "setMinutes",
        formatter: value => dateLocalization.format(new Date(0, 0, 0, 0, value), "minute"),
        startValue: 0,
        endValue: 59
    },
    seconds: {
        getter: "getSeconds",
        setter: "setSeconds",
        formatter: value => dateLocalization.format(new Date(0, 0, 0, 0, 0, value), "second"),
        startValue: 0,
        endValue: 59
    },
    milliseconds: {
        getter: "getMilliseconds",
        setter: "setMilliseconds",
        formatter: value => dateLocalization.format(new Date(0, 0, 0, 0, 0, 0, value), "millisecond"),
        startValue: 0,
        endValue: 999
    }
};
export default dateUtils;