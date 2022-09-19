;(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [172],
  {
    2300: function (e, n, t) {
      'use strict'
      t.r(n),
        t.d(n, {
          default: function () {
            return ve
          },
        })
      t(3750)
      var r,
        a = t(61162),
        o = (t(74300), t(39970)),
        i = t(2784),
        c = t(62918),
        s = t(38116),
        l = t(5632),
        u = t(26846),
        d = t.n(u),
        p = t(95235),
        m = t(92467)
      function f(e, n) {
        var t = Object.keys(e)
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(e)
          n &&
            (r = r.filter(function (n) {
              return Object.getOwnPropertyDescriptor(e, n).enumerable
            })),
            t.push.apply(t, r)
        }
        return t
      }
      function h(e) {
        for (var n = 1; n < arguments.length; n++) {
          var t = null != arguments[n] ? arguments[n] : {}
          n % 2
            ? f(Object(t), !0).forEach(function (n) {
                ;(0, p.Z)(e, n, t[n])
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
            : f(Object(t)).forEach(function (n) {
                Object.defineProperty(
                  e,
                  n,
                  Object.getOwnPropertyDescriptor(t, n),
                )
              })
        }
        return e
      }
      !(function (e) {
        ;(e[(e.INITIAL = 0)] = 'INITIAL'),
          (e[(e.PENDING = 1)] = 'PENDING'),
          (e[(e.SUCCESSFUL = 2)] = 'SUCCESSFUL'),
          (e[(e.FAILED = 3)] = 'FAILED')
      })(r || (r = {}))
      var j = (0, m.Z)(function (e, n) {
          return {
            networkStatus: r.INITIAL,
            operations: [],
            error: null,
            keyword: '',
            updateState: function (t) {
              e(h(h({}, n()), t))
            },
          }
        }),
        v = (t(56735), t(80877)),
        y = (t(35850), t(37788)),
        g = (t(59438), t(16124)),
        x = (t(17169), t(10722)),
        b = t(8529),
        w = t(6523),
        N = t(10659),
        O = t(91895),
        k = t(72779),
        I = t.n(k)
      const E = e => {
        const [n, t] = e.description?.includes(':')
          ? e.description.split(/[:]\s*/)
          : ['default', e.description]
        return { groupName: n, operation: { ...e, description: t } }
      }
      const S = e => ' '.repeat(e),
        $ = (e, n, t, r) => {
          const { name: a, args: o, output: i } = e
          let c = `${S(n)}${a}`
          o.length &&
            (c += `(${o
              .map(e => {
                const n = r.filter(n => n.name === e.name).length,
                  t = `${e.name}${n || ''}`
                return r.push({ ...e, name: t }), `${e.name}: $${t}`
              })
              .join(', ')})`)
          const s = (e, n) =>
            `${e.fields.reduce((e, a) => e + $(a, n, t, r), '')}`
          switch (i.kind) {
            case 'Scalar':
            case 'Enum':
              c += '\n'
              break
            case 'Object':
              c += `${S(1)}{\n${s(i, n + t)}${S(n)}}\n`
              break
            case 'Union':
              c += `${S(1)}{${i.types.reduce(
                (e, r) =>
                  e +
                  `${S(n + t)}...${S(1)}on${S(1)}${r.ofName}${S(1)}{\n${s(
                    r,
                    n + 2 * t,
                  )}${S(n + t)}}\n`,
                '\n',
              )}${S(n)}}\n`
          }
          return c
        },
        _ = (e, n = 2) => {
          const t = e.description ? `# ${e.description}\n` : '',
            r = e.operationType,
            a = e.name,
            o = [],
            i = $(e, n, n, o),
            c = o.length
              ? `(${o.map(e => `$${e.name}: ${e.type.name}`).join(', ')})`
              : ''
          return `${t}${r}${S(1)}${a}${c}${S(1)}{\n${i}}`
        },
        C = (e, n) =>
          n.reduce((e, t, r) => {
            const a = r === n.length - 1
            return e + _(t) + (a ? '\n' : '\n\n')
          }, `# ${e} \n\n`)
      t(21658)
      var P = t(99523),
        T = (t(58802), t(45904)),
        D = (t(21166), t(58964)),
        Z = t(52746),
        L = t(82269),
        A = t(23714),
        B = t(57647),
        R = t.n(B),
        M = t(25237),
        F = t.n(M),
        U = t(43606),
        q = t.n(U),
        G = t(4359),
        W = t.n(G),
        X = { host: '' },
        z = t(52322),
        J = ['type'],
        K = ['output']
      function V(e, n) {
        var t = Object.keys(e)
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(e)
          n &&
            (r = r.filter(function (n) {
              return Object.getOwnPropertyDescriptor(e, n).enumerable
            })),
            t.push.apply(t, r)
        }
        return t
      }
      function Q(e) {
        for (var n = 1; n < arguments.length; n++) {
          var t = null != arguments[n] ? arguments[n] : {}
          n % 2
            ? V(Object(t), !0).forEach(function (n) {
                ;(0, p.Z)(e, n, t[n])
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
            : V(Object(t)).forEach(function (n) {
                Object.defineProperty(
                  e,
                  n,
                  Object.getOwnPropertyDescriptor(t, n),
                )
              })
        }
        return e
      }
      var Y = F()(
          function () {
            return Promise.all([t.e(32), t.e(291)])
              .then(t.bind(t, 21291))
              .then(function (e) {
                return Promise.all([
                  t.e(21).then(t.t.bind(t, 50021, 23)),
                  t.e(775).then(t.t.bind(t, 96775, 23)),
                ]).then(function () {
                  return e.default
                })
              })
          },
          {
            ssr: !1,
            loadableGenerated: {
              webpack: function () {
                return [21291, 50021, 96775]
              },
            },
          },
        ),
        H = function e(n) {
          var t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : '',
            r = n.map(function (n) {
              var r = n.type,
                a = (0, L.Z)(n, J),
                o = ''.concat(t).concat(a.name),
                i = []
              switch (r.kind) {
                case 'Scalar':
                  i = null
                  break
                case 'InputObject':
                  i = e(r.fields, o)
                  break
                case 'Enum':
                  i = r.values.map(function (e) {
                    return {
                      key: o + e.value,
                      name: e.name,
                      type: '',
                      defaultValue: e.value,
                      description: e.description,
                      deprecationReason: e.deprecationReason,
                      children: null,
                    }
                  })
              }
              return Q(Q({}, a), {}, { key: o, type: r.name, children: i })
            })
          return r
        },
        ee = function e(n) {
          var t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : '',
            r = n.map(function (n) {
              var r = n.output,
                a = (0, L.Z)(n, K),
                o = ''.concat(t).concat(a.name),
                i = []
              switch (r.kind) {
                case 'Scalar':
                  i = []
                  break
                case 'Object':
                  i = e(r.fields, o)
                  break
                case 'Enum':
                  i = r.values.map(function (e) {
                    return {
                      key: o + e.value,
                      name: e.name,
                      type: '',
                      defaultValue: e.value,
                      description: e.description,
                      deprecationReason: e.deprecationReason,
                      children: null,
                    }
                  })
                  break
                case 'Union':
                  r.types.forEach(function (n) {
                    i = [].concat((0, Z.Z)(i || []), (0, Z.Z)(e(n.fields, o)))
                  })
              }
              return Q(
                Q({}, a),
                {},
                {
                  key: o,
                  defaultValue: null,
                  type: r.name,
                  children: i.length > 0 ? i : null,
                },
              )
            })
          return r
        },
        ne = function (e) {
          return [
            {
              title: 'name',
              dataIndex: 'name',
              width: '35%',
              render: function (e, n) {
                return n.deprecationReason
                  ? (0, z.jsx)('span', {
                      className: W().deprecated,
                      children: e,
                    })
                  : e
              },
            },
            {
              title: 'description',
              dataIndex: 'description',
              width: '25%',
              render: function (e, n) {
                var t = n.deprecationReason
                return t
                  ? (0, z.jsxs)(z.Fragment, {
                      children: [
                        e,
                        (0, z.jsx)('span', {
                          className: W().warning,
                          children: t,
                        }),
                      ],
                    })
                  : e
              },
            },
            {
              title: 'arguments' === e ? 'required' : 'nullable',
              dataIndex: 'type',
              width: '20%',
              render: function (n) {
                var t = !(null !== n && void 0 !== n && n.endsWith('!'))
                return (
                  'arguments' === e &&
                    (t = !(null === n || void 0 === n || !n.endsWith('!'))),
                  !0 === t
                    ? (0, z.jsx)('span', {
                        style: { color: '#f5222d' },
                        children: 'true',
                      })
                    : 'false'
                )
              },
            },
            {
              title: 'type',
              dataIndex: 'type',
              width: '20%',
              render: function (e) {
                return null !== e && void 0 !== e && e.endsWith('!')
                  ? e.slice(0, e.length - 1)
                  : e
              },
            },
          ]
        },
        te = function (e) {
          var n = new (R())(e)
          n.on('success', function () {
            D.default.success('success'), n.destroy()
          }),
            n.on('error', function () {
              D.default.error('failed'), n.destroy()
            })
        },
        re = function (e) {
          var n = e.operation,
            t = (0, s.useToggle)('TABLE', 'EDITOR'),
            r = (0, b.Z)(t, 2),
            a = r[0],
            o = r[1].toggle,
            c = (0, i.useMemo)(
              function () {
                return H(n.args)
              },
              [n.args],
            ),
            l = (0, i.useMemo)(function () {
              return ne('arguments')
            }, []),
            u = (0, i.useMemo)(function () {
              return ee([n])
            }, []),
            d = (0, i.useMemo)(function () {
              return ne('return')
            }, []),
            p = (0, i.useMemo)(
              function () {
                return _(n)
              },
              [n],
            )
          return (0, z.jsxs)(g.default, {
            id: n.name,
            className: W().operationDoc,
            direction: 'vertical',
            children: [
              (0, z.jsx)('div', {
                className: W().name,
                children: (0, z.jsxs)(g.default, {
                  size: 24,
                  children: [
                    (0, z.jsxs)('span', {
                      children: ['Operation name: ', n.name],
                    }),
                    (0, z.jsx)('span', {
                      children: (0, z.jsx)(x.default, {
                        title: 'Copy GQL',
                        children: (0, z.jsx)(w.Z, {
                          id: 'copy',
                          'data-clipboard-text': p,
                          className: W().copyBtn,
                          onClick: function () {
                            te('#copy')
                          },
                        }),
                      }),
                    }),
                    (0, z.jsx)('span', {
                      children: (0, z.jsx)(x.default, {
                        title: 'Debug',
                        children: (0, z.jsx)(A.Z, {
                          className: W().copyBtn,
                          onClick: function () {
                            window.open(
                              ''
                                .concat(X.host, '/playground?operationName=')
                                .concat(
                                  encodeURIComponent(n.name),
                                  '&operationType=',
                                )
                                .concat(encodeURIComponent(n.operationType)),
                              '_blank',
                            )
                          },
                        }),
                      }),
                    }),
                    (0, z.jsx)(T.Z, {
                      size: 'small',
                      checked: 'EDITOR' === a,
                      checkedChildren: 'editor',
                      unCheckedChildren: 'table',
                      onChange: function () {
                        o()
                      },
                    }),
                  ],
                }),
              }),
              (0, z.jsxs)('div', {
                children: ['Operation type: ', n.operationType],
              }),
              !!c.length &&
                (0, z.jsxs)(z.Fragment, {
                  children: [
                    (0, z.jsx)('div', { children: 'Params: ' }),
                    'TABLE' === a
                      ? (0, z.jsx)(P.Z, {
                          columns: l,
                          defaultExpandAllRows: !0,
                          className: W().table,
                          dataSource: c,
                          pagination: !1,
                          bordered: !0,
                        })
                      : (0, z.jsx)(Y, {
                          theme: 'tomorrow',
                          mode: 'javascript',
                          width: '100%',
                          readOnly: !0,
                          maxLines: 1 / 0,
                          value: q()(n.argsExample),
                        }),
                  ],
                }),
              (0, z.jsx)('div', { children: 'Response: ' }),
              'TABLE' === a
                ? (0, z.jsx)(P.Z, {
                    columns: d,
                    defaultExpandAllRows: !0,
                    className: W().table,
                    dataSource: u,
                    pagination: !1,
                    bordered: !0,
                  })
                : (0, z.jsx)(Y, {
                    theme: 'tomorrow',
                    mode: 'javascript',
                    width: '100%',
                    readOnly: !0,
                    maxLines: 1 / 0,
                    value: q()(n.outputExample),
                    editorProps: { $blockScrolling: !1 },
                  }),
            ],
          })
        },
        ae = t(76097),
        oe = t.n(ae),
        ie = function (e) {
          var n = e.keyword,
            t = e.onKeywordChange,
            r = e.operations,
            a = e.onSelect,
            o = e.selectedOperationId,
            c = (0, i.useState)(0),
            l = c[0],
            u = c[1],
            d = (0, s.useThrottleFn)(
              function (e) {
                u(e.nativeEvent.target.scrollTop)
              },
              { wait: 100 },
            ),
            m = (0, i.useMemo)(
              function () {
                return (function (e, n = E) {
                  const t = {}
                  return (
                    e.forEach(e => {
                      const { groupName: r, operation: a } = n(e)
                      t[r] ? t[r].push(a) : (t[r] = [a])
                    }),
                    t
                  )
                })(r)
              },
              [r],
            ),
            f = (0, i.useMemo)(
              function () {
                return Object.entries(m).map(function (e) {
                  var t = (0, b.Z)(e, 2),
                    r = t[0],
                    i = t[1],
                    c = i,
                    s = new RegExp(n, 'i')
                  return (
                    s.test(r) ||
                      (n.trim() &&
                        (c = i.filter(function (e) {
                          return (
                            s.test(e.name) ||
                            s.test(e.description || '') ||
                            e.args.some(function (e) {
                              return s.test(e.type.name)
                            }) ||
                            s.test(e.output.name)
                          )
                        }))),
                    c.length
                      ? (0, z.jsx)(
                          y.Z.Panel,
                          {
                            header: r,
                            children: (0, z.jsxs)('div', {
                              className: oe().operationList,
                              children: [
                                (0, z.jsx)(x.default, {
                                  title: 'Copy GQL',
                                  children: (0, z.jsx)(w.Z, {
                                    id: r,
                                    'data-clipboard-text': C(r, c),
                                    className: oe().copyBtn,
                                    onClick: function () {
                                      te('#'.concat(r))
                                    },
                                  }),
                                }),
                                c.map(function (e, n) {
                                  var t = e.deprecationReason
                                  return (0, z.jsx)(
                                    'div',
                                    {
                                      className: I()(
                                        oe().operationItem,
                                        (0, p.Z)(
                                          {},
                                          oe().active,
                                          e.operationType + e.name === o,
                                        ),
                                      ),
                                      onClick: function () {
                                        a(e)
                                      },
                                      children: (0, z.jsx)('div', {
                                        className: I()(
                                          (0, p.Z)({}, oe().deprecated, !!t),
                                        ),
                                        children: (0, z.jsxs)(g.default, {
                                          direction: 'vertical',
                                          children: [
                                            e.description || e.name,
                                            !!t &&
                                              (0, z.jsx)('span', {
                                                className: oe().warning,
                                                children: t,
                                              }),
                                          ],
                                        }),
                                      }),
                                    },
                                    n,
                                  )
                                }),
                              ],
                            }),
                          },
                          r,
                        )
                      : null
                  )
                })
              },
              [m, n, a, o],
            ),
            h = (0, i.useMemo)(function () {
              var e = []
              return (
                Object.entries(m).some(function (n) {
                  var t = (0, b.Z)(n, 2),
                    r = t[0]
                  t[1].some(function (e) {
                    return e.operationType + e.name === o
                  }) && e.push(r)
                }),
                e
              )
            }, []),
            j = (0, i.useState)(h),
            k = j[0],
            S = j[1]
          return (0, z.jsxs)('div', {
            className: oe().sidebar,
            children: [
              (0, z.jsx)(v.default, {
                size: 'large',
                placeholder: 'Search by group/desc/name/type',
                onChange: function (e) {
                  t(e.target.value)
                },
                value: n,
              }),
              (0, z.jsx)('div', {
                className: oe().main,
                id: 'sideBar',
                onScroll: d.run,
                children: (0, z.jsx)(y.Z, {
                  activeKey: k,
                  onChange: function (e) {
                    Array.isArray(e) && S(e)
                  },
                  children: f,
                }),
              }),
              (0, z.jsx)(x.default, {
                title: 'Collapse all',
                children: (0, z.jsx)(N.Z, {
                  style: { bottom: 100 },
                  className: I()(
                    oe().topBtn,
                    (0, p.Z)({}, oe().show, k.length),
                  ),
                  onClick: function () {
                    S([])
                  },
                }),
              }),
              (0, z.jsx)(x.default, {
                title: 'Back to top',
                children: (0, z.jsx)(O.Z, {
                  className: I()(oe().topBtn, (0, p.Z)({}, oe().show, l > 800)),
                  onClick: function () {
                    var e
                    null === (e = document.getElementById('sideBar')) ||
                      void 0 === e ||
                      e.scrollTo(0, 0)
                  },
                }),
              }),
            ],
          })
        },
        ce = (0, i.memo)(ie),
        se = function (e) {
          var n = e.operation
          return (0, i.useMemo)(
            function () {
              return n ? (0, z.jsx)(re, { operation: n }) : null
            },
            [n],
          )
        },
        le = (0, i.memo)(se),
        ue = t(96577),
        de = t.n(ue),
        pe = t(74895),
        me = t.n(pe),
        fe = {
          src: '/_next/static/media/logo.ad338028.svg',
          height: 100,
          width: 100,
        },
        he = function (e) {
          var n = e.children
          return (0, z.jsxs)('div', {
            className: me().page,
            children: [
              (0, z.jsxs)('div', {
                className: me().header,
                children: [
                  (0, z.jsx)(de(), {
                    className: me().logo,
                    width: 32,
                    height: 32,
                    src: fe,
                  }),
                  (0, z.jsx)('div', {
                    className: me().appName,
                    children: 'graphql-kit',
                  }),
                  (0, z.jsx)('nav', {
                    className: me().nav,
                    children: (0, z.jsx)('a', {
                      className: me().active,
                      children: 'Docs',
                    }),
                  }),
                ],
              }),
              n,
            ],
          })
        },
        je = function () {
          var e = j(),
            n = e.networkStatus,
            t = e.operations,
            u = e.error,
            p = e.keyword,
            m = e.updateState,
            f = (0, l.useRouter)(),
            h = f.query
          ;(0, s.useMount)(function () {
            ;[r.INITIAL, r.FAILED].includes(n) &&
              (m({ networkStatus: r.PENDING }),
              fetch(''.concat(X.host, '/graphql/operations'))
                .then(function (e) {
                  return e.json()
                })
                .then(function (e) {
                  m({
                    networkStatus: r.SUCCESSFUL,
                    operations: e.data,
                    error: null,
                  })
                })
                .catch(function (e) {
                  m({ networkStatus: r.FAILED, operations: [], error: e })
                }))
          })
          var v = (0, i.useCallback)(
              function (e) {
                f.push(
                  '/docs?operationType='
                    .concat(e.operationType, '&operationName=')
                    .concat(e.name),
                )
              },
              [m],
            ),
            y = (0, i.useCallback)(
              function (e) {
                m({ keyword: e })
              },
              [m],
            ),
            g = null
          if ([r.INITIAL, r.PENDING].includes(n))
            g = (0, z.jsx)('div', {
              className: d().placeholderWrapper,
              children: (0, z.jsx)(o.default, {
                indicator: (0, z.jsx)(c.Z, { style: { fontSize: '36px' } }),
              }),
            })
          else if (n === r.FAILED || 0 === t.length)
            g = (0, z.jsx)('div', {
              className: d().placeholderWrapper,
              children: (0, z.jsx)(a.default, {
                image: a.default.PRESENTED_IMAGE_SIMPLE,
                description:
                  (null === u || void 0 === u ? void 0 : u.message) ||
                  'It seems that there is no operations in your schema',
              }),
            })
          else {
            var x = h.operationType,
              b = void 0 === x ? '' : x,
              w = h.operationName,
              N = b + (void 0 === w ? '' : w),
              O =
                t.find(function (e) {
                  return e.operationType + e.name === N
                }) || ((N = t[0].operationType + t[0].name), t[0])
            g = (0, z.jsxs)(z.Fragment, {
              children: [
                (0, z.jsx)(ce, {
                  keyword: p,
                  onKeywordChange: y,
                  operations: t,
                  selectedOperationId: N,
                  onSelect: v,
                }),
                (0, z.jsx)(le, { operation: O }, N),
              ],
            })
          }
          return (0, z.jsx)('div', { className: d().main, children: g })
        }
      je.getLayout = function (e) {
        return (0, z.jsx)(he, { children: e })
      }
      var ve = je
    },
    71082: function (e, n, t) {
      ;(window.__NEXT_P = window.__NEXT_P || []).push([
        '/docs',
        function () {
          return t(2300)
        },
      ])
    },
    74895: function (e) {
      e.exports = {
        page: 'yv_HXrtZ',
        header: 'u_jz5K7Z',
        logo: '__2HdoX1q_',
        appName: 'qzSLGtDB',
        nav: 'MUNLv3Nx',
        active: 'hJ5QSYW8',
      }
    },
    4359: function (e) {
      e.exports = {
        operationDoc: 'DyqA8Bgv',
        name: 'pSIl_fr6',
        argName: 'Y9NT__lk',
        copyBtn: '__7C_TibQ4',
        deprecated: 'y2ngpDxj',
        warning: '__5pJigJSw',
        table: '_sgBjBCu',
      }
    },
    76097: function (e) {
      e.exports = {
        sidebar: 'JS1bNLvD',
        main: 'YDfjPWAo',
        operationItem: 'xueqoeeU',
        active: '__7BEAiLol',
        topBtn: 'pIasM2qY',
        show: 'X8hSc13z',
        operationList: 'swn6I4Fh',
        copyBtn: 'KmCI8wr8',
        deprecated: 'xUnsXBVt',
        warning: 'Iv8AAXIc',
      }
    },
    26846: function (e) {
      e.exports = { main: 'Ro_A4Z_e', placeholderWrapper: 'WMVv7XJZ' }
    },
  },
  function (e) {
    e.O(0, [182, 919, 774, 888, 179], function () {
      return (n = 71082), e((e.s = n))
      var n
    })
    var n = e.O()
    _N_E = n
  },
])
