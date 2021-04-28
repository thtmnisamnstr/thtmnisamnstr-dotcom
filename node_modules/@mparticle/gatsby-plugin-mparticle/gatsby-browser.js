"use strict";

exports.__esModule = true;
exports.onRouteUpdate = void 0;

var onRouteUpdate = function onRouteUpdate(_ref, options) {
  var location = _ref.location;

  if (options.logPageViews) {
    return mParticle.logPageView(location.pathname);
  }
};

exports.onRouteUpdate = onRouteUpdate;