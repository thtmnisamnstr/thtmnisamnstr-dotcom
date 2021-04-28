"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.onRenderBody = void 0;

var _react = _interopRequireDefault(require("react"));

var _jsxFileName = "C:\\projects\\mparticle\\gatsby-plugin-mparticle\\src\\gatsby-ssr.js";

var onRenderBody = function onRenderBody(_ref, pluginOptions) {
  var setHeadComponents = _ref.setHeadComponents;
  var apiKey = pluginOptions.apiKey,
      config = pluginOptions.config;
  return setHeadComponents([_react.default.createElement("script", {
    key: "gatsby-plugin-mparticle",
    dangerouslySetInnerHTML: {
      __html: "(function (apiKey) {\n                    window.mParticle = window.mParticle || {};\n                    window.mParticle.eCommerce = { Cart: {} };\n                \n                    window.mParticle.Identity = {};\n                    window.mParticle.config = window.mParticle.config || " + JSON.stringify(config) + ";\n                    window.mParticle.config.rq = [];\n                    window.mParticle.ready = function (f) {\n                        window.mParticle.config.rq.push(f);\n                    };\n                    function a(o,t){return function(){t&&(o=t+\".\"+o);var e=Array.prototype.slice.call(arguments);e.unshift(o),window.mParticle.config.rq.push(e)}}var x=[\"endSession\",\"logError\",\"logEvent\",\"logForm\",\"logLink\",\"logPageView\",\"setSessionAttribute\",\"setAppName\",\"setAppVersion\",\"setOptOut\",\"setPosition\",\"startNewSession\",\"startTrackingLocation\",\"stopTrackingLocation\"],y=[\"setCurrencyCode\",\"logCheckout\"],z=[\"login\",\"logout\",\"modify\"];x.forEach(function(o){window.mParticle[o]=a(o)}),y.forEach(function(o){window.mParticle.eCommerce[o]=a(o,\"eCommerce\")}),z.forEach(function(o){window.mParticle.Identity[o]=a(o,\"Identity\")});\n                \n                    var mp = document.createElement('script');\n                    mp.type = 'text/javascript';\n                    mp.async = true;\n                    mp.src = ('https:' == document.location.protocol ? 'https://jssdkcdns' : 'http://jssdkcdn') + '.mparticle.com/js/v2/' + apiKey + '/mparticle.js';\n                    var s = document.getElementsByTagName('script')[0];\n                    s.parentNode.insertBefore(mp, s);\n                })('" + apiKey + "')"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  })]);
};

exports.onRenderBody = onRenderBody;