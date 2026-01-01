"use strict";
exports.__esModule = true;
var HeroBannerOne_1 = require("@/components/hero/HeroBannerOne");
var Testimonials_1 = require("@/components/others/Testimonials");
var RichTextSection_1 = require("../RichTextSection/RichTextSection");
var richTextData_1 = require("@/data/richTextData");
var HomeSections_1 = require("@/components/hero/HomeSections");
function HomePageOne() {
    return (React.createElement("section", { className: "overflow-hidden" },
        React.createElement(HeroBannerOne_1["default"], null),
        React.createElement(HomeSections_1["default"], null),
        React.createElement(Testimonials_1["default"], { textCenter: false }),
        React.createElement(RichTextSection_1["default"], { title: richTextData_1.richTextContent.title, shortText: richTextData_1.richTextContent.shortText, longText: richTextData_1.richTextContent.longText, buttonText: richTextData_1.richTextContent.buttonText, buttonUrl: richTextData_1.richTextContent.buttonUrl })));
}
exports["default"] = HomePageOne;
