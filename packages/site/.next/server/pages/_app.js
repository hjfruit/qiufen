"use strict";
(() => {
var exports = {};
exports.id = 888;
exports.ids = [888];
exports.modules = {

/***/ 53586:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ _app)
});

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(16689);
// EXTERNAL MODULE: ../../node_modules/antd/lib/menu/style/index.js
var style = __webpack_require__(9473);
;// CONCATENATED MODULE: external "antd/lib/menu"
const menu_namespaceObject = require("antd/lib/menu");
var menu_default = /*#__PURE__*/__webpack_require__.n(menu_namespaceObject);
// EXTERNAL MODULE: ../../node_modules/@ant-design/icons/lib/index.js
var lib = __webpack_require__(10532);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(71853);
// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(20997);
;// CONCATENATED MODULE: ./src/components/common/layouts/menu/index.tsx







const MenuLayout = () => {
  const router = (0,router_.useRouter)();
  const {
    0: activeKey,
    1: setActiveKey
  } = (0,external_react_.useState)(['home']);
  return /*#__PURE__*/jsx_runtime_.jsx((menu_default()), {
    style: {
      position: 'fixed',
      height: '100%',
      left: 0
    },
    defaultSelectedKeys: activeKey,
    onClick: ({
      key
    }) => {
      setActiveKey([key]);
    },
    children: /*#__PURE__*/jsx_runtime_.jsx((menu_default()).Item, {
      onClick: () => {
        router.push('/docs');
      },
      icon: /*#__PURE__*/jsx_runtime_.jsx(lib.HomeOutlined, {})
    }, "home")
  });
};

/* harmony default export */ const menu = (MenuLayout);
;// CONCATENATED MODULE: ./src/pages/_app.tsx
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







function MyApp({
  Component,
  pageProps
}) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? (page => page);

  return getLayout( /*#__PURE__*/(0,jsx_runtime_.jsxs)("div", {
    style: {
      display: 'flex'
    },
    children: [/*#__PURE__*/jsx_runtime_.jsx(menu, {}), /*#__PURE__*/jsx_runtime_.jsx("div", {
      style: {
        flex: 1,
        marginLeft: 62
      },
      children: /*#__PURE__*/jsx_runtime_.jsx(Component, _objectSpread({}, pageProps))
    })]
  }));
}

/* harmony default export */ const _app = (MyApp);

/***/ }),

/***/ 70566:
/***/ ((module) => {

module.exports = require("@ctrl/tinycolor");

/***/ }),

/***/ 59003:
/***/ ((module) => {

module.exports = require("classnames");

/***/ }),

/***/ 71853:
/***/ ((module) => {

module.exports = require("next/router");

/***/ }),

/***/ 82266:
/***/ ((module) => {

module.exports = require("rc-util/lib/Dom/dynamicCSS");

/***/ }),

/***/ 21978:
/***/ ((module) => {

module.exports = require("rc-util/lib/warning");

/***/ }),

/***/ 16689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 20997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [780,473], () => (__webpack_exec__(53586)));
module.exports = __webpack_exports__;

})();