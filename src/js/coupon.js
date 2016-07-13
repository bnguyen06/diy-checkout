define(function(require) {
  var celeryClient = require('celery_client');

  return {
    // Coupon adds a discount
    validate: function(code, lineItems, cb) {
      if (!code) {
        return cb(true);
      }

      code = code.toLowerCase();

      // Code not found, fetch and try again
      this.fetch(code, lineItems, function(err, data) {
        if (this.data[code]) {
          return cb(true);
        }
        return cb(false);
      });
    },

    fetch: function(code, lineItems, cb) {
      return celeryClient.fetchCoupon({
        code: code,
        line_items: lineItems,
      }, $.proxy(function(err, data) {
        // Cache result
        if (err || !data || !data.data || data.data.code === undefined) {
          this.data[code] = false;
        } else {
          this.data[code] = data.data;
        }

        if (typeof cb === 'function') {
          cb.apply(this, arguments);
        }
      }, this));
    },

    data: {}
  };
});
