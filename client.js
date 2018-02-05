"use strict";

const assert = require("assert");
const crypto = require("crypto");
const extend = require("extend");
const querystring = require("querystring");

class SagepayForm {
    /*
    Form(options)
    @options Required. Contains connetion options.
    @options.password
        Required. See Sage Pay Form Integration and Protocol Guidelines 3.00.
    @options.vendor
        Required. See Sage Pay Form Integration and Protocol Guidelines 3.00,
        A1. Form Fields, "Vendor".
    */
    constructor(options) {
        assert(options, "options is required");
        assert(options.password, "options.password is required");
        assert(options.vendor, "options.vendor is required");

        this._options = options;
    }

    /*
    Form.createHiddenFields(transaction)
    @transaction
        Required. See Sage Pay Form Integration and Protocol Guidelines 3.00,
        A1.3 Request Crypt Fields for properties.

    Returns an object containing the hidden fields required to post the
    transaction to the gateway.
    */
    createHiddenFields(transaction) {
        // NOTE: Sage Pay does not accept URL encoding, it needs this nasty
        // hacky encoding instead...
        transaction = Object.keys(transaction).map(key => [key, transaction[key]].join("=")).join("&");
        var cipher = crypto.createCipheriv(
            'aes-128-cbc',
            this._options.password,
            this._options.password
        );
        var crypt = "@";
        crypt += cipher.update(transaction, "utf8", "hex");
        crypt += cipher.final("hex");
        var ret = {
            "VPSProtocol": "3.00",
            "TxType": "PAYMENT",
            "Vendor": this._options.vendor,
            "Crypt": crypt
        };
        return ret;
    }

    /*
    Form.decodeResponse
    @crypt
        Required. See Sage Pay Form Integration and Protocol Guidelines 3.00,
        Appendix B.

    Returns an Object containing the decrypted data, one property for each
    field.
    */
    decodeResponse(crypt) {
        if (crypt[0] != '@') {
            throw new Error("Encrypted response must begin with the @ symbol.");
        }
        crypt = crypt.substr(1);
        var decipher = crypto.createDecipheriv('aes-128-cbc', this._options.password, this._options.password);
        var decrypted = decipher.update(crypt, "hex", "utf8");
        decrypted += decipher.final("utf8");
        var response = querystring.parse(decrypted);
        return response;
    }
}
module.exports = SagepayForm;
