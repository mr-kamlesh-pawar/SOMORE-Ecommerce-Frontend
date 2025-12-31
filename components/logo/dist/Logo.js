"use strict";
exports.__esModule = true;
var image_1 = require("next/image");
var link_1 = require("next/link");
var Logo = function () {
    return (React.createElement(link_1["default"], { href: "/", className: "flex items-center justify-center" },
        React.createElement(image_1["default"], { src: "/logo.png", alt: "brand", width: 250, height: 180, priority: true, className: "\r\n          w-[90px] h-auto\r\n          sm:w-[120px] \r\n          md:w-[170px]\r\n          lg:w-[120px]\r\n          xl:w-[120px]\r\n        ", style: {
                height: 'auto',
                maxWidth: '100%'
            } })));
};
exports["default"] = Logo;
