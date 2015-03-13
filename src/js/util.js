define(function(require) {
  'use strict';

  var $ = require('jquery');

  var re = /([^&=]+)=?([^&]*)/g;

  function decode(str) {
    return decodeURIComponent(str.replace(/\+/g, ' '));
  }

  return {
    // Returns a function, that, as long as it continues to be invoked, will
    // not be triggered. The function will be called after it stops being
    // called for N milliseconds. If `immediate` is passed, trigger the
    // function on the leading edge, instead of the trailing.
    // http://davidwalsh.name/javascript-debounce-function
    debounce: function debounce(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this,
          args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },

    // Parse query params
    parseParams: function(query) {
      var params = {};
      var e;

      if (query) {
        if (query.substr(0, 1) === '?') {
          query = query.substr(1);
        }

        while (e = re.exec(query)) {
          var k = decode(e[1]);
          var v = decode(e[2]);
          if (params[k] !== undefined) {
            if (!$.isArray(params[k])) {
              params[k] = [params[k]];
            }
            params[k].push(v);
          } else {
            params[k] = v;
          }
        }
      }
      return params;
    }
  };
});
