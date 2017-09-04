const fetch = require('node-fetch');

const apiUrl = 'https://api.taxcloud.net/1.0/TaxCloud/';

class TaxCloud {

  constructor(props = {}) {
    this.apiLoginId = props.apiLoginId || process.env.TAXCLOUD_LOGIN_ID;
    this.apiKey = props.apiKey || process.env.TAXCLOUD_KEY;
    this.USPSUserId = props.USPSUserId || process.env.TAXCLOUD_USPS_USER_ID;
    this.maxCartSize = props.maxCartSize || 100;

    if (!this.apiLoginId) {
      throw new Error('TaxCloud: missing apiLoginId')
    }
    if (!this.apiKey) {
      throw new Error('TaxCloud: missing apiKey')
    }

    // Initial potentially outdated list - call this.updateTICIdList()
    this._tics = require('./tics.json');
  }

  static initialize(props) {
    return new TaxCloud(props);
  }

  ping(callback) {
    return this._post('Ping', {apiLoginID: this.apiLoginId, apiKey: this.apiKey})
    .then((ping) => ping.ResponseType)
  }

  getTICs() {
    return this._post('GetTICs', {apiLoginID: this.apiLoginId, apiKey: this.apiKey});
  }

  updateTICIdList() {
    return this.getTICs().then((res) => {
      this._tics = res.TICs.map((tic) => tic.TICID)
      .sort((a, b) => a - b);
    });
  }

  getTICsGroups() {
    return this._post('GetTICGroups', {apiLoginID: this.apiLoginId, apiKey: this.apiKey});
  }

  getTICsByGroup(ticGroup) {
    return this._post('GetTICsByGroup', {apiLoginID: this.apiLoginId, apiKey: this.apiKey, ticGroup: ticGroup});
  }

  isTic(tic) {
    return this._tics.indexOf(tic) !== -1;
  }

  verifyAddress(data) {
    if (!this.USPSUserId) {
      return new Promise((rs, rj) => rj('USPSUserId required to varifyAddress'));
    }
    data.apiLoginID = this.apiLoginId;
    data.apiKey = this.apiKey;
    return this._post('VerifyAddress', data);
  }

  lookup(cart) {
    return new Promise((resolve, reject) => {
      if (!this._isString(cart.cartID)) cart.cartID = null;
      if (!this._isString(cart.customerID)) cart.customerID = null;

      /* Very basic validation, the endpoint will validate, please check TaxCloud Docs */
      if (!(cart.cartItems instanceof Array)) {
        reject('cart.cartItems not an array')
      } else if (cart.cartItems.length == 0) {
        reject('cart.cartItems is empty')
      } else if (cart.cartItems.length > this.maxCartSize) {
        reject(`cart.cartItems is greater than ${this.maxCartSize}`)
      } else if (!(cart.origin instanceof Object) || !this._isAddress(cart.origin)) {
        reject('cart.origin not an address object')
      } else if (!(cart.destination instanceof Object) || !this._isAddress(cart.destination)) {
        reject('cart.destination not an address object')
      } else if (cart.cartItems.every((item) => {
        if (!this._isString(item.TIC) || !this.isTic(item.TIC)) return false;
        item.Price = parseFloat(item.Price);
        item.Qty = parseInt(item.Qty);
        if (item.Qty < 1) return false;
        return true;
      })) {
        reject('Invalid cart.item[] TIC or Qty')
      } else {
        resolve()
      }
    })
    .then(() => {
      cart.apiLoginID = this.apiLoginId;
      cart.apiKey = this.apiKey;

      return this._post('Lookup', cart);
    });
  }

  authorized(data) {
    data.apiLoginID = this.apiLoginId;
    data.apiKey = this.apiKey;
    return this._post('Authorized', data);
  }

  capture(data) {
    data.apiLoginID = this.apiLoginId;
    data.apiKey = this.apiKey;
    return this._post('Capture', data);
  }

  authorizedWithCapture(data) {
    data.apiLoginID = this.apiLoginId;
    data.apiKey = this.apiKey;
    return this._post('AuthorizedWithCapture', data);
  }

  returned(data) {
    data.apiLoginID = this.apiLoginId;
    data.apiKey = this.apiKey;
    return this._post('Returned', data);
  }

  _post(method, data) {
    var body = JSON.stringify(data);
    return fetch(apiUrl + method, {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Content-Length': Buffer.byteLength(body)
      }
    })
    .then((res) => res.json())
    .then((res) => {
      if (res.ResponseType == 0) throw res.Messages;
      return res;
    });
  }

  _isString(str) {
    return str && typeof str === 'string';
  }

  _isAddress(address) {
    var valid = this._isString(address.Address1) &&
      this._isString(address.City) &&
      this._isString(address.State) &&
      address.State.length == 2 &&
      address.Zip5.match(/^\d{5}$/) &&
      (!address.Zip4 || address.Zip4.match(/^\d{4}$/));
    if (valid) {
      address.State = address.State.toUpperCase();
    }
    return valid;
  }
}

module.exports = TaxCloud;
