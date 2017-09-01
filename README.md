# taxcloudjs
TaxCloud Integration - Using promises and fetch

Why this module:

* Promises
* Allows to use env for sensitive data without extra coding
* Only one dependency: node-fetch
* Active and open for Pull Requests
* Follows TaxCloud documentation
* Uses TaxCloud JSON faster API, not SOAP

If you think you can contribute, please do. Looking for co-maintainers.


## Setting up
By default, the following environmet variables will be used if present:

* TAXCLOUD_LOGIN_ID
* TAXCLOUD_KEY
* TAXCLOUD_USPS_USER_ID

You can override any of them passing properties to TaxCloud constructor:

* apiLoginId
* apiKey
* USPDUserId

Example:

```javascript
var props = {
  apiLoginId: 'xxxxxxxxxx', // Required
  apiKey: 'xxxxxxxxxxxxxx', // Required
  USPSUserId: 'xxxxxxxxxx'  // Optional - for address validation
}

// using constructor
var TaxCloud = require('taxcloudjs')
var taxcloudjs = new TaxCloud(props);

// intialize factory method
var taxcloudjs = require('taxcloudjs').initialize(props);

```

Those properties are required and Errors will be thrown at construction time.

### Optional Properties

* maxCartSize: int - default 100, carefully read TaxCloud documentation before changing this.

## Ping

```javascript
// I'm using the short initialization here ...
var taxcloudjs = require('taxcloudjs').initialize();

taxcloudjs.ping()
.then((result) => {
  console.log(result ? 'Pong!' : 'Nothing ...');
})
.catch((err) => {
  // Handle it ...
})
```