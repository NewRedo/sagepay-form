# Sage Pay Form Integration for Node.js

This module provides integration for Node.js applications wishing to utilise Sage Pay Form Integration.

## Overview

Knowledge of the [Form Integration](https://www.sagepay.co.uk/support/form-integration) is essential.

This module provides utility functions for correctly building the hidden form fields and for decoding the response `crypt` field. The user needs to provide the web server, rendering for the hidden fields and routing for the response.

## Quick Start

```
const SagePayFormClient = require("sagepay-form");
var client = new SagePayFormClient({
    password: "guess",
    vendor: "acme"
});
```

## Documentation

### SagePayFormClient

A class that provides utilities for formatting and decoding messages used in form integration.

### SagePayFormClient.constructor

```
var foo = new SagePayFormClient(options);
```

Creates a new instance.

#### Parameters

* `options` Required, connection options.
* `options.password` Required. See Sage Pay Form Integration and Protocol Guidelines 3.00.
* `options.vendor` Required. See Sage Pay Form Integration and Protocol Guidelines 3.00, A1. Form Fields, "Vendor".

### SagePayFormClient.createHiddenFields

```
var foo = client.createHiddenFields(transaction);
```

Returns an object containing the hidden fields required to post the transaction to the gateway.

#### Parameters

* `transaction` Required. See Sage Pay Form Integration and Protocol Guidelines 3.00, A1.3 Request Crypt Fields for properties.

### SagePayFormClient.decodeResponse

Returns an Object containing the decrypted data, one property for each field.

#### Parameters

* `crypt` Required. See Sage Pay Form Integration and Protocol Guidelines 3.00, Appendix B.

## Licence

MIT
