var express = require("express");
var path = require("path");
var uuid = require("uuid/v1")
var app = express();

var SagepayFormClient = require("../index.js");

var options = {
    vendor: process.env.VENDOR_NAME,
    password: process.env.VENDOR_PASSWORD
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
        BillingSurname: "BSurname1",
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
    }
    res.locals.hiddenFields = client.createHiddenFields(res.locals.transaction);

    res.locals.sagepayGatewayUrl = 'https://test.sagepay.com/gateway/service/vspform-register.vsp';

    res.render(path.join(__dirname, "index"));
});

app.get("/success", function(req, res) {
    res.render(path.join(__dirname, 'success'));
})

app.get("/failed", function(req, res) {
    res.render(path.join(__dirname, 'failed'));
})

app.listen(5000, function() {
    console.log("Server has started.")
});
