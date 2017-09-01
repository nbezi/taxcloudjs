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

## Install

```bash
$ npm install taxcloudjs
```

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
  USPSUserId: 'xxxxxxxxxx'  // Optional - for address validation only
}

// using constructor
var TaxCloud = require('taxcloudjs')
var taxcloudjs = new TaxCloud(props);

// intialize factory method
var taxcloudjs = require('taxcloudjs').initialize(props);

```

### Optional Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| maxCartSize | int | 100 | Maximun number of Items in a Cart. read [TaxCloud documentation](https://taxcloud.net/developerguide.pdf) before changing this. |

## Ping

```javascript
var taxcloudjs = require('taxcloudjs').initialize();

taxcloudjs.ping()
.then((result) => {
  console.log(result ? 'Pong!' : 'Nothing ...');
})
.catch((err) => {
  // Handle it ...
})
```

## More methods

Methods will receive and return what TaxCloud is expecting as JSON. Read
[TaxCloud documentation](https://taxcloud.net/developerguide.pdf) to learn more.

All important methods to operate with TaxCloud returns a Promise that will give
you the Object returned by the API or an error to be catched with API
Error code and messages depending on the method called, such as
`[{"ResponseType":0,"Message":"Invalid apiLoginID and/or apiKey"}]`.

This implementation uses TaxCloud API as is, all validation, except some basic
validation done on lookup, are performed on their end and returned as errors.
All methods accepts as params objects just like requested on documentation and
responses are resolved as they come. Its your job to send proper information and
manipulate the response.

| Method | Params | Returns | Description |
| --- | --- | --- | --- |
| getTICs | - | Promise:Array of Ids | Returns all available TICs |
| getTICsGroups | - | Promise:Array of Groups | Returns all available TIC Groups |
| getTICsByGroup | ticId:int | Promise:Array of Ids | Returns all available TICs for a Given group |
| updateTICIdList | - | Promise | Updates the internal TICs cache |
| isTic | ticId:int | boolean | Whether or not a given ID is in the TICs cache |
| verifyAddress | cart:Object | Promise:Object | See TaxCloud docs |
| lookup | cart:Object | Promise:Object | See TaxCloud docs |
| authorized | transaction:Object | Promise:Object | See TaxCloud docs |
| capture | transaction:Object | Promise:Object | See TaxCloud docs |
| authorizedWithCapture | transaction:Object | Promise:Object | See TaxCloud docs |
| returned | transaction:Object | Promise:Object | See TaxCloud docs |
