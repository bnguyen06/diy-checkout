define(function(require) {
  var celeryClient = require('celery_client');

  return {
    // Coupon adds a discount
    validate: function(code, lineItems, cb) {
      if (!code) {
        return cb(true);
      }

      code = code.toLowerCase();

      // Cache hit
      if (this.data[code] !== undefined) {
        var coupon = this.data[code];

        // Invalid
        if (coupon === false) {
          return cb(false);
        }

        // Valid
        return cb(true);
      }

      // Code not found, fetch and try again
      this.fetch(code, lineItems, function(err, data) {
        this.validate(code, lineItems, cb);
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
