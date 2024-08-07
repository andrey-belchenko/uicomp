/**
 * DevExtreme (esm/__internal/scheduler/options_validator/validator_rules.test.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import * as validationFunctions from "./common/validation_functions";
import {
    cellDurationMustBeLessThanVisibleInterval,
    endDayHourMustBeGreaterThanStartDayHour,
    visibleIntervalMustBeDivisibleByCellDuration
} from "./validator_rules";
describe("endDayHourMustBeGreaterThanStartDayHour", (() => {
    const options = {
        startDayHour: 0,
        endDayHour: 24
    };
    let mock = null;
    beforeEach((() => {
        mock = jest.spyOn(validationFunctions, "greaterThan")
    }));
    afterEach((() => {
        var _mock;
        null === (_mock = mock) || void 0 === _mock || _mock.mockReset()
    }));
    it("should call greaterThan function", (() => {
        endDayHourMustBeGreaterThanStartDayHour(options);
        expect(mock).toHaveBeenCalledWith(options.endDayHour, options.startDayHour)
    }));
    it("should return true if valid", (() => {
        var _mock2;
        null === (_mock2 = mock) || void 0 === _mock2 || _mock2.mockImplementation((() => true));
        const result = endDayHourMustBeGreaterThanStartDayHour(options);
        expect(result).toBe(true)
    }));
    it("should return error (string) if invalid", (() => {
        var _mock3;
        null === (_mock3 = mock) || void 0 === _mock3 || _mock3.mockImplementation((() => false));
        const result = endDayHourMustBeGreaterThanStartDayHour({
            startDayHour: 10,
            endDayHour: 9
        });
        expect(result).toBe("endDayHour: 9 must be greater that startDayHour: 10.")
    }));
    it("should be the function with the correct name", (() => {
        const func = endDayHourMustBeGreaterThanStartDayHour;
        expect(func.name).toBe("endDayHourGreaterThanStartDayHour")
    }))
}));
describe("visibleIntervalMustBeDivisibleByCellDuration", (() => {
    const options = {
        cellDuration: 30,
        startDayHour: 0,
        endDayHour: 24
    };
    let mock = null;
    beforeEach((() => {
        mock = jest.spyOn(validationFunctions, "divisibleBy")
    }));
    afterEach((() => {
        var _mock4;
        null === (_mock4 = mock) || void 0 === _mock4 || _mock4.mockReset()
    }));
    it("should call divisibleBy function with correct values", (() => {
        visibleIntervalMustBeDivisibleByCellDuration(options);
        expect(mock).toHaveBeenCalledWith(1440, options.cellDuration)
    }));
    it("should return true if valid", (() => {
        var _mock5;
        null === (_mock5 = mock) || void 0 === _mock5 || _mock5.mockImplementation((() => true));
        const result = visibleIntervalMustBeDivisibleByCellDuration(options);
        expect(result).toBe(true)
    }));
    it("should return error (string) if invalid", (() => {
        var _mock6;
        null === (_mock6 = mock) || void 0 === _mock6 || _mock6.mockImplementation((() => false));
        const result = visibleIntervalMustBeDivisibleByCellDuration({
            cellDuration: 31,
            startDayHour: 9,
            endDayHour: 10
        });
        expect(result).toBe("endDayHour - startDayHour: 60 (minutes), must be divisible by cellDuration: 31 (minutes).")
    }));
    it("should be the function with the correct name", (() => {
        const func = visibleIntervalMustBeDivisibleByCellDuration;
        expect(func.name).toBe("visibleIntervalMustBeDivisibleByCellDuration")
    }))
}));
describe("cellDurationMustBeLessThanVisibleInterval", (() => {
    const options = {
        cellDuration: 30,
        startDayHour: 0,
        endDayHour: 24
    };
    let mock = null;
    beforeEach((() => {
        mock = jest.spyOn(validationFunctions, "lessThan")
    }));
    afterEach((() => {
        var _mock7;
        null === (_mock7 = mock) || void 0 === _mock7 || _mock7.mockReset()
    }));
    it("should call divisibleBy function with correct values", (() => {
        cellDurationMustBeLessThanVisibleInterval(options);
        expect(mock).toHaveBeenCalledWith(options.cellDuration, 1440, false)
    }));
    it("should return true if valid", (() => {
        var _mock8;
        null === (_mock8 = mock) || void 0 === _mock8 || _mock8.mockImplementation((() => true));
        const result = cellDurationMustBeLessThanVisibleInterval(options);
        expect(result).toBe(true)
    }));
    it("should return error (string) if invalid", (() => {
        var _mock9;
        null === (_mock9 = mock) || void 0 === _mock9 || _mock9.mockImplementation((() => false));
        const result = cellDurationMustBeLessThanVisibleInterval({
            cellDuration: 120,
            startDayHour: 9,
            endDayHour: 10
        });
        expect(result).toBe("endDayHour - startDayHour: 60 (minutes), must be greater or equal the cellDuration: 120 (minutes).")
    }));
    it("should be the function with the correct name", (() => {
        const func = cellDurationMustBeLessThanVisibleInterval;
        expect(func.name).toBe("cellDurationMustBeLessThanVisibleInterval")
    }))
}));
