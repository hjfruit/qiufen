;(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [888],
  {
    94645: function (e, t, r) {
      'use strict'
      r.r(t)
      var n = r(95235),
        o = r(52322)
      function u(e, t) {
        var r = Object.keys(e)
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e)
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable
            })),
            r.push.apply(r, n)
        }
        return r
      }
      t.default = function (e) {
        var t,
          r = e.Component,
          c = e.pageProps
        return (
          null !== (t = r.getLayout) && void 0 !== t
            ? t
            : function (e) {
                return e
              }
        )(
          (0, o.jsx)(
            r,
            (function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {}
                t % 2
                  ? u(Object(r), !0).forEach(function (t) {
                      ;(0, n.Z)(e, t, r[t])
                    })
                  : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(
                      e,
                      Object.getOwnPropertyDescriptors(r),
                    )
                  : u(Object(r)).forEach(function (t) {
                      Object.defineProperty(
                        e,
                        t,
                        Object.getOwnPropertyDescriptor(r, t),
                      )
                    })
              }
              return e
            })({}, c),
          ),
        )
      }
    },
    86570: function (e, t, r) {
      ;(window.__NEXT_P = window.__NEXT_P || []).push([
        '/_app',
        function () {
          return r(94645)
        },
      ])
    },
    95235: function (e, t, r) {
      'use strict'
      function n(e, t, r) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = r),
          e
        )
      }
      r.d(t, {
        Z: function () {
          return n
        },
      })
    },
  },
  function (e) {
    var t = function (t) {
      return e((e.s = t))
    }
    e.O(0, [774, 179], function () {
      return t(86570), t(55876)
    })
    var r = e.O()
    _N_E = r
  },
])
