/**
 * DevExtreme (cjs/__internal/core/license/license_validation.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
exports.parseLicenseKey = parseLicenseKey;
exports.peekValidationPerformed = peekValidationPerformed;
exports.registerTrialPanelComponents = registerTrialPanelComponents;
exports.setLicenseCheckSkipCondition = setLicenseCheckSkipCondition;
exports.showTrialPanel = showTrialPanel;
exports.validateLicense = validateLicense;
var _config = _interopRequireDefault(require("../../../core/config"));
var _errors = _interopRequireDefault(require("../../../core/errors"));
var _version = require("../../../core/version");
var _version2 = require("../../utils/version");
var _byte_utils = require("./byte_utils");
var _key = require("./key");
var _pkcs = require("./pkcs1");
var _rsa_bigint = require("./rsa_bigint");
var _sha = require("./sha1");
var _trial_panel = require("./trial_panel");
var _types = require("./types");
const _excluded = ["customerId", "maxVersionAllowed", "format", "internalUsageId"];

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}

function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key]
                }
            }
        }
        return target
    };
    return _extends.apply(this, arguments)
}

function _objectWithoutPropertiesLoose(source, excluded) {
    if (null == source) {
        return {}
    }
    var target = {};
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (excluded.indexOf(key) >= 0) {
                continue
            }
            target[key] = source[key]
        }
    }
    return target
}
const FORMAT = 1;
const RTM_MIN_PATCH_VERSION = 3;
const KEY_SPLITTER = ".";
const BUY_NOW_LINK = "https://go.dpt-ext-ui.com/Licensing_Installer_Watermark_DevExtremeJQuery.aspx";
const GENERAL_ERROR = {
    kind: _types.TokenKind.corrupted,
    error: "general"
};
const VERIFICATION_ERROR = {
    kind: _types.TokenKind.corrupted,
    error: "verification"
};
const DECODING_ERROR = {
    kind: _types.TokenKind.corrupted,
    error: "decoding"
};
const DESERIALIZATION_ERROR = {
    kind: _types.TokenKind.corrupted,
    error: "deserialization"
};
const PAYLOAD_ERROR = {
    kind: _types.TokenKind.corrupted,
    error: "payload"
};
const VERSION_ERROR = {
    kind: _types.TokenKind.corrupted,
    error: "version"
};
let validationPerformed = false;

function verifySignature(_ref) {
    let {
        text: text,
        signature: encodedSignature
    } = _ref;
    return (0, _rsa_bigint.compareSignatures)({
        key: _key.PUBLIC_KEY,
        signature: (0, _byte_utils.base64ToBytes)(encodedSignature),
        actual: (0, _pkcs.pad)((0, _sha.sha1)(text))
    })
}

function parseLicenseKey(encodedKey) {
    if (void 0 === encodedKey) {
        return GENERAL_ERROR
    }
    const parts = encodedKey.split(KEY_SPLITTER);
    if (2 !== parts.length || 0 === parts[0].length || 0 === parts[1].length) {
        return GENERAL_ERROR
    }
    if (!verifySignature({
            text: parts[0],
            signature: parts[1]
        })) {
        return VERIFICATION_ERROR
    }
    let decodedPayload = "";
    try {
        decodedPayload = atob(parts[0])
    } catch {
        return DECODING_ERROR
    }
    let payload = {};
    try {
        payload = JSON.parse(decodedPayload)
    } catch {
        return DESERIALIZATION_ERROR
    }
    const {
        customerId: customerId,
        maxVersionAllowed: maxVersionAllowed,
        format: format,
        internalUsageId: internalUsageId
    } = payload, rest = _objectWithoutPropertiesLoose(payload, _excluded);
    if (void 0 !== internalUsageId) {
        return {
            kind: _types.TokenKind.internal,
            internalUsageId: internalUsageId
        }
    }
    if (void 0 === customerId || void 0 === maxVersionAllowed || void 0 === format) {
        return PAYLOAD_ERROR
    }
    if (format !== FORMAT) {
        return VERSION_ERROR
    }
    return {
        kind: _types.TokenKind.verified,
        payload: _extends({
            customerId: customerId,
            maxVersionAllowed: maxVersionAllowed
        }, rest)
    }
}

function isPreview(patch) {
    return isNaN(patch) || patch < RTM_MIN_PATCH_VERSION
}

function getLicenseCheckParams(_ref2) {
    let {
        licenseKey: licenseKey,
        version: version
    } = _ref2;
    let preview = false;
    try {
        preview = isPreview(version.patch);
        const {
            major: major,
            minor: minor
        } = preview ? (0, _version2.getPreviousMajorVersion)(version) : version;
        if (!licenseKey) {
            return {
                preview: preview,
                error: "W0019"
            }
        }
        const license = parseLicenseKey(licenseKey);
        if (license.kind === _types.TokenKind.corrupted) {
            return {
                preview: preview,
                error: "W0021"
            }
        }
        if (license.kind === _types.TokenKind.internal) {
            return {
                preview: preview,
                internal: true,
                error: license.internalUsageId === _key.INTERNAL_USAGE_ID ? void 0 : "W0020"
            }
        }
        if (!(major && minor)) {
            return {
                preview: preview,
                error: "W0021"
            }
        }
        if (10 * major + minor > license.payload.maxVersionAllowed) {
            return {
                preview: preview,
                error: "W0020"
            }
        }
        return {
            preview: preview,
            error: void 0
        }
    } catch {
        return {
            preview: preview,
            error: "W0021"
        }
    }
}

function showTrialPanel(buyNowUrl, version, customStyles) {
    if ("undefined" !== typeof customElements) {
        (0, _trial_panel.renderTrialPanel)(buyNowUrl, version, customStyles)
    }
}

function registerTrialPanelComponents(customStyles) {
    if ("undefined" !== typeof customElements) {
        (0, _trial_panel.registerCustomComponents)(customStyles)
    }
}

function validateLicense(licenseKey) {
    let versionStr = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : _version.fullVersion;
    if (validationPerformed) {
        return
    }
    validationPerformed = true;
    const version = (0, _version2.parseVersion)(versionStr);
    const versionsCompatible = (0, _version2.assertedVersionsCompatible)(version);
    const {
        internal: internal,
        error: error
    } = getLicenseCheckParams({
        licenseKey: licenseKey,
        version: version
    });
    if (!versionsCompatible && internal) {
        return
    }
    if (error && !internal) {
        showTrialPanel((0, _config.default)().buyNowLink ?? BUY_NOW_LINK, _version.fullVersion)
    }
    const preview = isPreview(version.patch);
    if (error) {
        _errors.default.log(preview ? "W0022" : error);
        return
    }
    if (preview && !internal) {
        _errors.default.log("W0022")
    }
}

function peekValidationPerformed() {
    return validationPerformed
}

function setLicenseCheckSkipCondition() {}
var _default = exports.default = {
    validateLicense: validateLicense
};
