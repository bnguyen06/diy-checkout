define(function(require) {
  'use strict';

  var $ = require('jquery');

  return {
    trackGaEcommerce: function(order) {
      this._addGaTransaction(order);
      this._addGaLineItems(order);

      ga('ecommerce:send');
    },

    // Add transaction to GA
    _addGaTransaction: function(order) {
      var gaTransaction = {
        id: order.number, // Transaction ID. Required.
        affiliation: order.user_id, // Affiliation or store name.
        revenue: order.total / 100, // Grand Total.
        shipping: order.shipping / 100, // Shipping.
        tax: order.taxes / 100, // Tax.
        currency: order.currency // local currency code.
      };

      ga('ecommerce:addTransaction', gaTransaction);
    },

    // Add line items to GA
    _addGaLineItems: function(order) {
      var gaLineItems = this._extractGaLineItems(order);

      $.each(gaLineItems, function(index, gaLineItem) {
        ga('ecommerce:addItem', gaLineItem);
      });
    },

    // Extract Celery line items into GA format
    _extractGaLineItems: function(order) {
      var lineItems = order.line_items || [];
      var gaLineItems = [];

      gaLineItems = $.map(lineItems, function(lineItem) {
        return {
          id: order.number, // Transaction ID. Required.
          name: lineItem.product_name, // Product name. Required.
          sku: lineItem.sku || lineItem.celery_sku, // SKU/code.
          price: lineItem.price / 100, // Unit price.
          quantity: lineItem.quantity // Quantity.
        };
      });

      return gaLineItems;
    }

  }
});
