# taxcloudjs
TaxCloud Wrapper - Using promises and fetch

## Setting up
By default, the following environmet variables will be used if set:

* TAXCLOUD_LOGIN_ID
* TAXCLOUD_KEY
* TAXCLOUD_USPS_USER_ID

You can override any of them passing properties to TaxCloud constructor:

* loginId
* key
* USPDUserId

Example:

```javascript
var TaxCloud = require('taxcloudjs')

var props = {
  loginId: 'xxxxxxxxxx',
  key: 'xxxxxxxxxxxxxx',
  USPSUserId: 'xxxxxxx'
}

taxcloudjs = new TaxCloud(props);

```

Those properties are required and Errors will be thrown at construction time.

### Optional Properties

* maxCartSize: int - default 100

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