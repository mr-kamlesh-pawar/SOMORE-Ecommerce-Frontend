"use client";
"use strict";
exports.__esModule = true;
var HerbalSection_1 = require("../home/HerbalSection");
var NewLaunchesSection_1 = require("../home/NewLaunchesSection");
var OrganicSection_1 = require("../home/OrganicSection");
function HomeSections() {
    return (React.createElement(React.Fragment, null,
        React.createElement(NewLaunchesSection_1["default"], null),
        React.createElement(HerbalSection_1["default"], null),
        React.createElement(OrganicSection_1["default"], null)));
}
exports["default"] = HomeSections;
