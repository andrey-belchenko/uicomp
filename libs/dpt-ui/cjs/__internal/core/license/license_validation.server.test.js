/**
 * DevExtreme (cjs/__internal/core/license/license_validation.server.test.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
var _license_validation = require("./license_validation");
describe("license token", (() => {
    beforeEach((() => {
        (0, _license_validation.setLicenseCheckSkipCondition)(false)
    }));
    afterEach((() => {
        jest.restoreAllMocks()
    }));
    test("API inside trial_panel should not be triggered on the server", (() => {
        expect((() => (0, _license_validation.validateLicense)("", "1.0.4"))).not.toThrow()
    }))
}));
