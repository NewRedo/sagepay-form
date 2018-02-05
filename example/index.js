var express = require("express");
var path = require("path");
var uuid = require("uuid/v1")
var nconf = require("nconf");
var app = express();

var SagepayFormClient = require("../index.js");

nconf.env().required(['VENDOR_NAME', 'VENDOR_PASSWORD']);
var options = {
    vendor: nconf.get('VENDOR_NAME'),
    password: nconf.get('VENDOR_PASSWORD')
}
var client = new SagepayFormClient(options);

app.set("view engine", "pug");

app.get("/", function(req, res) {
    res.locals.transaction = {
        VendorTxCode: uuid(),
        Amount: '5.10',
        Currency: 'GBP',
        Description: 'Test Payment',
        SuccessURL: 'http://localhost:5000/success',
        FailureURL: 'http://localhost:5000/failed',
        BillingSurname: 'BSurname1',
        BillingFirstnames: "BPerson1",
        BillingAddress1: "88",
        BillingCity: "London",
        BillingPostCode: "412",
        BillingCountry: "GB",
        DeliverySurname: "DSurname1",
        DeliveryFirstnames: "DPerson1",
        DeliveryAddress1: "10 Downing Street",
        DeliveryCity: "London",
        DeliveryPostCode: "LS1 2RT",
        DeliveryCountry: "GB"
    };
    res.locals.hiddenFields = client.createHiddenFields(res.locals.transaction);
    res.locals.sagepayGatewayUrl = 'https://test.sagepay.com/gateway/service/vspform-register.vsp';
    res.render(path.join(__dirname, "index"));
});

app.get("/:result", function(req, res) {})

app.param("result", function(req, res, next, value) {
    res.locals.decodedResponse = client.decodeResponse(req.query.crypt);
    res.render(path.join(__dirname, 'result'), {
        pageTitle: value
    });
    next();
})

app.listen(5000, function() {
    console.log("Server has started.")
});
