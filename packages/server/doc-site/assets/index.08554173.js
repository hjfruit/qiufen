var e = Object.defineProperty,
  r = Object.defineProperties,
  t = Object.getOwnPropertyDescriptors,
  n = Object.getOwnPropertySymbols,
  o = Object.prototype.hasOwnProperty,
  a = Object.prototype.propertyIsEnumerable,
  c = (r, t, n) =>
    t in r
      ? e(r, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (r[t] = n),
  i = (e, r) => {
    for (var t in r || (r = {})) o.call(r, t) && c(e, t, r[t])
    if (n) for (var t of n(r)) a.call(r, t) && c(e, t, r[t])
    return e
  }
'undefined' != typeof require && require
import {
  l,
  c as s,
  R as d,
  a as u,
  b as p,
  B as m,
  S as f,
  C as y,
  z as E,
  r as h,
} from './vendor.5aa942b8.js'
!(function () {
  const e = document.createElement('link').relList
  if (!(e && e.supports && e.supports('modulepreload'))) {
    for (const e of document.querySelectorAll('link[rel="modulepreload"]')) r(e)
    new MutationObserver(e => {
      for (const t of e)
        if ('childList' === t.type)
          for (const e of t.addedNodes)
            'LINK' === e.tagName && 'modulepreload' === e.rel && r(e)
    }).observe(document, { childList: !0, subtree: !0 })
  }
  function r(e) {
    if (e.ep) return
    e.ep = !0
    const r = (function (e) {
      const r = {}
      return (
        e.integrity && (r.integrity = e.integrity),
        e.referrerpolicy && (r.referrerPolicy = e.referrerpolicy),
        'use-credentials' === e.crossorigin
          ? (r.credentials = 'include')
          : 'anonymous' === e.crossorigin
          ? (r.credentials = 'omit')
          : (r.credentials = 'same-origin'),
        r
      )
    })(e)
    fetch(e.href, r)
  }
})()
const b = {},
  O = function (e, r) {
    return r && 0 !== r.length
      ? Promise.all(
          r.map(e => {
            if ((e = `/${e}`) in b) return
            b[e] = !0
            const r = e.endsWith('.css'),
              t = r ? '[rel="stylesheet"]' : ''
            if (document.querySelector(`link[href="${e}"]${t}`)) return
            const n = document.createElement('link')
            return (
              (n.rel = r ? 'stylesheet' : 'modulepreload'),
              r || ((n.as = 'script'), (n.crossOrigin = '')),
              (n.href = e),
              document.head.appendChild(n),
              r
                ? new Promise((e, r) => {
                    n.addEventListener('load', e),
                      n.addEventListener('error', r)
                  })
                : void 0
            )
          }),
        ).then(() => e())
      : e()
  },
  v = [
    {
      path: '/',
      component: l(() =>
        O(
          () => import('./index.aaf09261.js'),
          [
            'assets/index.aaf09261.js',
            'assets/index.9faf352f.css',
            'assets/vendor.5aa942b8.js',
            'assets/vendor.4a5fa02d.css',
          ],
        ),
      ),
      routes: [
        { path: '/', exact: !0, redirect: '/doc' },
        {
          path: '/doc',
          exact: !0,
          component: l(() =>
            O(
              () => import('./index.b31d3a28.js'),
              [
                'assets/index.b31d3a28.js',
                'assets/index.af4c64f0.css',
                'assets/vendor.5aa942b8.js',
                'assets/vendor.4a5fa02d.css',
              ],
            ),
          ),
        },
      ],
    },
    {
      path: '*',
      component: l(() =>
        O(
          () => import('./index.18299202.js'),
          [
            'assets/index.18299202.js',
            'assets/index.134aa62f.css',
            'assets/vendor.5aa942b8.js',
            'assets/vendor.4a5fa02d.css',
          ],
        ),
      ),
    },
  ]
function _(e) {
  if (e.redirect) {
    const r = e,
      { path: t, redirect: c } = r,
      l = ((e, r) => {
        var t = {}
        for (var c in e) o.call(e, c) && r.indexOf(c) < 0 && (t[c] = e[c])
        if (null != e && n)
          for (var c of n(e)) r.indexOf(c) < 0 && a.call(e, c) && (t[c] = e[c])
        return t
      })(r, ['path', 'redirect'])
    return d.createElement(u, i({ from: t, to: c }, l))
  }
  return d.createElement(p, {
    path: e.path,
    render: n => {
      return d.createElement(
        e.component,
        ((o = i({}, n)), (a = { routes: e.routes }), r(o, t(a))),
      )
      var o, a
    },
  })
}
s({ basename: '' })
const g = () =>
  d.createElement(
    m,
    null,
    d.createElement(
      f,
      null,
      v.map((e, r) => d.createElement(_, i({ key: r }, e))),
    ),
  )
function P() {
  return d.createElement(
    'div',
    { className: 'App' },
    d.createElement(y, { locale: E }, d.createElement(g, null)),
  )
}
h.exports.render(
  d.createElement(d.StrictMode, null, d.createElement(P, null)),
  document.getElementById('root'),
)
export { _ as R }
