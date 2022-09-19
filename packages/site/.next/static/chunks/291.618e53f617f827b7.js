;(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [291],
  {
    57740: function (t, e, n) {
      ;(t = n.nmd(t)),
        ace.define(
          'ace/split',
          [
            'require',
            'exports',
            'module',
            'ace/lib/oop',
            'ace/lib/lang',
            'ace/lib/event_emitter',
            'ace/editor',
            'ace/virtual_renderer',
            'ace/edit_session',
          ],
          function (t, e, n) {
            'use strict'
            var r = t('./lib/oop'),
              i = (t('./lib/lang'), t('./lib/event_emitter').EventEmitter),
              o = t('./editor').Editor,
              s = t('./virtual_renderer').VirtualRenderer,
              a = t('./edit_session').EditSession,
              h = function (t, e, n) {
                ;(this.BELOW = 1),
                  (this.BESIDE = 0),
                  (this.$container = t),
                  (this.$theme = e),
                  (this.$splits = 0),
                  (this.$editorCSS = ''),
                  (this.$editors = []),
                  (this.$orientation = this.BESIDE),
                  this.setSplits(n || 1),
                  (this.$cEditor = this.$editors[0]),
                  this.on(
                    'focus',
                    function (t) {
                      this.$cEditor = t
                    }.bind(this),
                  )
              }
            ;(function () {
              r.implement(this, i),
                (this.$createEditor = function () {
                  var t = document.createElement('div')
                  ;(t.className = this.$editorCSS),
                    (t.style.cssText =
                      'position: absolute; top:0px; bottom:0px'),
                    this.$container.appendChild(t)
                  var e = new o(new s(t, this.$theme))
                  return (
                    e.on(
                      'focus',
                      function () {
                        this._emit('focus', e)
                      }.bind(this),
                    ),
                    this.$editors.push(e),
                    e.setFontSize(this.$fontSize),
                    e
                  )
                }),
                (this.setSplits = function (t) {
                  var e
                  if (t < 1) throw 'The number of splits have to be > 0!'
                  if (t != this.$splits) {
                    if (t > this.$splits) {
                      for (
                        ;
                        this.$splits < this.$editors.length && this.$splits < t;

                      )
                        (e = this.$editors[this.$splits]),
                          this.$container.appendChild(e.container),
                          e.setFontSize(this.$fontSize),
                          this.$splits++
                      for (; this.$splits < t; )
                        this.$createEditor(), this.$splits++
                    } else
                      for (; this.$splits > t; )
                        (e = this.$editors[this.$splits - 1]),
                          this.$container.removeChild(e.container),
                          this.$splits--
                    this.resize()
                  }
                }),
                (this.getSplits = function () {
                  return this.$splits
                }),
                (this.getEditor = function (t) {
                  return this.$editors[t]
                }),
                (this.getCurrentEditor = function () {
                  return this.$cEditor
                }),
                (this.focus = function () {
                  this.$cEditor.focus()
                }),
                (this.blur = function () {
                  this.$cEditor.blur()
                }),
                (this.setTheme = function (t) {
                  this.$editors.forEach(function (e) {
                    e.setTheme(t)
                  })
                }),
                (this.setKeyboardHandler = function (t) {
                  this.$editors.forEach(function (e) {
                    e.setKeyboardHandler(t)
                  })
                }),
                (this.forEach = function (t, e) {
                  this.$editors.forEach(t, e)
                }),
                (this.$fontSize = ''),
                (this.setFontSize = function (t) {
                  ;(this.$fontSize = t),
                    this.forEach(function (e) {
                      e.setFontSize(t)
                    })
                }),
                (this.$cloneSession = function (t) {
                  var e = new a(t.getDocument(), t.getMode()),
                    n = t.getUndoManager()
                  return (
                    e.setUndoManager(n),
                    e.setTabSize(t.getTabSize()),
                    e.setUseSoftTabs(t.getUseSoftTabs()),
                    e.setOverwrite(t.getOverwrite()),
                    e.setBreakpoints(t.getBreakpoints()),
                    e.setUseWrapMode(t.getUseWrapMode()),
                    e.setUseWorker(t.getUseWorker()),
                    e.setWrapLimitRange(
                      t.$wrapLimitRange.min,
                      t.$wrapLimitRange.max,
                    ),
                    (e.$foldData = t.$cloneFoldData()),
                    e
                  )
                }),
                (this.setSession = function (t, e) {
                  var n
                  n = null == e ? this.$cEditor : this.$editors[e]
                  var r = this.$editors.some(function (e) {
                    return e.session === t
                  })
                  return r && (t = this.$cloneSession(t)), n.setSession(t), t
                }),
                (this.getOrientation = function () {
                  return this.$orientation
                }),
                (this.setOrientation = function (t) {
                  this.$orientation != t &&
                    ((this.$orientation = t), this.resize())
                }),
                (this.resize = function () {
                  var t,
                    e = this.$container.clientWidth,
                    n = this.$container.clientHeight
                  if (this.$orientation == this.BESIDE)
                    for (var r = e / this.$splits, i = 0; i < this.$splits; i++)
                      ((t = this.$editors[i]).container.style.width = r + 'px'),
                        (t.container.style.top = '0px'),
                        (t.container.style.left = i * r + 'px'),
                        (t.container.style.height = n + 'px'),
                        t.resize()
                  else {
                    var o = n / this.$splits
                    for (i = 0; i < this.$splits; i++)
                      ((t = this.$editors[i]).container.style.width = e + 'px'),
                        (t.container.style.top = i * o + 'px'),
                        (t.container.style.left = '0px'),
                        (t.container.style.height = o + 'px'),
                        t.resize()
                  }
                })
            }.call(h.prototype),
              (e.Split = h))
          },
        ),
        ace.define(
          'ace/ext/split',
          ['require', 'exports', 'module', 'ace/split'],
          function (t, e, n) {
            'use strict'
            n.exports = t('../split')
          },
        ),
        ace.require(['ace/ext/split'], function (e) {
          t && (t.exports = e)
        })
    },
    11427: function (t) {
      var e = function () {
          ;(this.Diff_Timeout = 1),
            (this.Diff_EditCost = 4),
            (this.Match_Threshold = 0.5),
            (this.Match_Distance = 1e3),
            (this.Patch_DeleteThreshold = 0.5),
            (this.Patch_Margin = 4),
            (this.Match_MaxBits = 32)
        },
        n = -1
      ;(e.Diff = function (t, e) {
        return [t, e]
      }),
        (e.prototype.diff_main = function (t, n, r, i) {
          'undefined' == typeof i &&
            (i =
              this.Diff_Timeout <= 0
                ? Number.MAX_VALUE
                : new Date().getTime() + 1e3 * this.Diff_Timeout)
          var o = i
          if (null == t || null == n) throw new Error('Null input. (diff_main)')
          if (t == n) return t ? [new e.Diff(0, t)] : []
          'undefined' == typeof r && (r = !0)
          var s = r,
            a = this.diff_commonPrefix(t, n),
            h = t.substring(0, a)
          ;(t = t.substring(a)),
            (n = n.substring(a)),
            (a = this.diff_commonSuffix(t, n))
          var l = t.substring(t.length - a)
          ;(t = t.substring(0, t.length - a)),
            (n = n.substring(0, n.length - a))
          var f = this.diff_compute_(t, n, s, o)
          return (
            h && f.unshift(new e.Diff(0, h)),
            l && f.push(new e.Diff(0, l)),
            this.diff_cleanupMerge(f),
            f
          )
        }),
        (e.prototype.diff_compute_ = function (t, r, i, o) {
          var s
          if (!t) return [new e.Diff(1, r)]
          if (!r) return [new e.Diff(n, t)]
          var a = t.length > r.length ? t : r,
            h = t.length > r.length ? r : t,
            l = a.indexOf(h)
          if (-1 != l)
            return (
              (s = [
                new e.Diff(1, a.substring(0, l)),
                new e.Diff(0, h),
                new e.Diff(1, a.substring(l + h.length)),
              ]),
              t.length > r.length && (s[0][0] = s[2][0] = n),
              s
            )
          if (1 == h.length) return [new e.Diff(n, t), new e.Diff(1, r)]
          var f = this.diff_halfMatch_(t, r)
          if (f) {
            var c = f[0],
              u = f[1],
              p = f[2],
              d = f[3],
              g = f[4],
              b = this.diff_main(c, p, i, o),
              v = this.diff_main(u, d, i, o)
            return b.concat([new e.Diff(0, g)], v)
          }
          return i && t.length > 100 && r.length > 100
            ? this.diff_lineMode_(t, r, o)
            : this.diff_bisect_(t, r, o)
        }),
        (e.prototype.diff_lineMode_ = function (t, r, i) {
          var o = this.diff_linesToChars_(t, r)
          ;(t = o.chars1), (r = o.chars2)
          var s = o.lineArray,
            a = this.diff_main(t, r, !1, i)
          this.diff_charsToLines_(a, s),
            this.diff_cleanupSemantic(a),
            a.push(new e.Diff(0, ''))
          for (var h = 0, l = 0, f = 0, c = '', u = ''; h < a.length; ) {
            switch (a[h][0]) {
              case 1:
                f++, (u += a[h][1])
                break
              case n:
                l++, (c += a[h][1])
                break
              case 0:
                if (l >= 1 && f >= 1) {
                  a.splice(h - l - f, l + f), (h = h - l - f)
                  for (
                    var p = this.diff_main(c, u, !1, i), d = p.length - 1;
                    d >= 0;
                    d--
                  )
                    a.splice(h, 0, p[d])
                  h += p.length
                }
                ;(f = 0), (l = 0), (c = ''), (u = '')
            }
            h++
          }
          return a.pop(), a
        }),
        (e.prototype.diff_bisect_ = function (t, r, i) {
          for (
            var o = t.length,
              s = r.length,
              a = Math.ceil((o + s) / 2),
              h = a,
              l = 2 * a,
              f = new Array(l),
              c = new Array(l),
              u = 0;
            u < l;
            u++
          )
            (f[u] = -1), (c[u] = -1)
          ;(f[h + 1] = 0), (c[h + 1] = 0)
          for (
            var p = o - s, d = p % 2 != 0, g = 0, b = 0, v = 0, y = 0, _ = 0;
            _ < a && !(new Date().getTime() > i);
            _++
          ) {
            for (var m = -_ + g; m <= _ - b; m += 2) {
              for (
                var w = h + m,
                  S =
                    (C =
                      m == -_ || (m != _ && f[w - 1] < f[w + 1])
                        ? f[w + 1]
                        : f[w - 1] + 1) - m;
                C < o && S < s && t.charAt(C) == r.charAt(S);

              )
                C++, S++
              if (((f[w] = C), C > o)) b += 2
              else if (S > s) g += 2
              else if (d) {
                if ((x = h + p - m) >= 0 && x < l && -1 != c[x])
                  if (C >= (M = o - c[x]))
                    return this.diff_bisectSplit_(t, r, C, S, i)
              }
            }
            for (var O = -_ + v; O <= _ - y; O += 2) {
              for (
                var M,
                  x = h + O,
                  E =
                    (M =
                      O == -_ || (O != _ && c[x - 1] < c[x + 1])
                        ? c[x + 1]
                        : c[x - 1] + 1) - O;
                M < o && E < s && t.charAt(o - M - 1) == r.charAt(s - E - 1);

              )
                M++, E++
              if (((c[x] = M), M > o)) y += 2
              else if (E > s) v += 2
              else if (!d) {
                if ((w = h + p - O) >= 0 && w < l && -1 != f[w]) {
                  var C
                  S = h + (C = f[w]) - w
                  if (C >= (M = o - M))
                    return this.diff_bisectSplit_(t, r, C, S, i)
                }
              }
            }
          }
          return [new e.Diff(n, t), new e.Diff(1, r)]
        }),
        (e.prototype.diff_bisectSplit_ = function (t, e, n, r, i) {
          var o = t.substring(0, n),
            s = e.substring(0, r),
            a = t.substring(n),
            h = e.substring(r),
            l = this.diff_main(o, s, !1, i),
            f = this.diff_main(a, h, !1, i)
          return l.concat(f)
        }),
        (e.prototype.diff_linesToChars_ = function (t, e) {
          var n = [],
            r = {}
          function i(t) {
            for (var e = '', i = 0, s = -1, a = n.length; s < t.length - 1; ) {
              ;-1 == (s = t.indexOf('\n', i)) && (s = t.length - 1)
              var h = t.substring(i, s + 1)
              ;(r.hasOwnProperty ? r.hasOwnProperty(h) : void 0 !== r[h])
                ? (e += String.fromCharCode(r[h]))
                : (a == o && ((h = t.substring(i)), (s = t.length)),
                  (e += String.fromCharCode(a)),
                  (r[h] = a),
                  (n[a++] = h)),
                (i = s + 1)
            }
            return e
          }
          n[0] = ''
          var o = 4e4,
            s = i(t)
          return (o = 65535), { chars1: s, chars2: i(e), lineArray: n }
        }),
        (e.prototype.diff_charsToLines_ = function (t, e) {
          for (var n = 0; n < t.length; n++) {
            for (var r = t[n][1], i = [], o = 0; o < r.length; o++)
              i[o] = e[r.charCodeAt(o)]
            t[n][1] = i.join('')
          }
        }),
        (e.prototype.diff_commonPrefix = function (t, e) {
          if (!t || !e || t.charAt(0) != e.charAt(0)) return 0
          for (
            var n = 0, r = Math.min(t.length, e.length), i = r, o = 0;
            n < i;

          )
            t.substring(o, i) == e.substring(o, i) ? (o = n = i) : (r = i),
              (i = Math.floor((r - n) / 2 + n))
          return i
        }),
        (e.prototype.diff_commonSuffix = function (t, e) {
          if (!t || !e || t.charAt(t.length - 1) != e.charAt(e.length - 1))
            return 0
          for (
            var n = 0, r = Math.min(t.length, e.length), i = r, o = 0;
            n < i;

          )
            t.substring(t.length - i, t.length - o) ==
            e.substring(e.length - i, e.length - o)
              ? (o = n = i)
              : (r = i),
              (i = Math.floor((r - n) / 2 + n))
          return i
        }),
        (e.prototype.diff_commonOverlap_ = function (t, e) {
          var n = t.length,
            r = e.length
          if (0 == n || 0 == r) return 0
          n > r ? (t = t.substring(n - r)) : n < r && (e = e.substring(0, n))
          var i = Math.min(n, r)
          if (t == e) return i
          for (var o = 0, s = 1; ; ) {
            var a = t.substring(i - s),
              h = e.indexOf(a)
            if (-1 == h) return o
            ;(s += h),
              (0 != h && t.substring(i - s) != e.substring(0, s)) ||
                ((o = s), s++)
          }
        }),
        (e.prototype.diff_halfMatch_ = function (t, e) {
          if (this.Diff_Timeout <= 0) return null
          var n = t.length > e.length ? t : e,
            r = t.length > e.length ? e : t
          if (n.length < 4 || 2 * r.length < n.length) return null
          var i = this
          function o(t, e, n) {
            for (
              var r,
                o,
                s,
                a,
                h = t.substring(n, n + Math.floor(t.length / 4)),
                l = -1,
                f = '';
              -1 != (l = e.indexOf(h, l + 1));

            ) {
              var c = i.diff_commonPrefix(t.substring(n), e.substring(l)),
                u = i.diff_commonSuffix(t.substring(0, n), e.substring(0, l))
              f.length < u + c &&
                ((f = e.substring(l - u, l) + e.substring(l, l + c)),
                (r = t.substring(0, n - u)),
                (o = t.substring(n + c)),
                (s = e.substring(0, l - u)),
                (a = e.substring(l + c)))
            }
            return 2 * f.length >= t.length ? [r, o, s, a, f] : null
          }
          var s,
            a,
            h,
            l,
            f,
            c = o(n, r, Math.ceil(n.length / 4)),
            u = o(n, r, Math.ceil(n.length / 2))
          return c || u
            ? ((s = u ? (c && c[4].length > u[4].length ? c : u) : c),
              t.length > e.length
                ? ((a = s[0]), (h = s[1]), (l = s[2]), (f = s[3]))
                : ((l = s[0]), (f = s[1]), (a = s[2]), (h = s[3])),
              [a, h, l, f, s[4]])
            : null
        }),
        (e.prototype.diff_cleanupSemantic = function (t) {
          for (
            var r = !1,
              i = [],
              o = 0,
              s = null,
              a = 0,
              h = 0,
              l = 0,
              f = 0,
              c = 0;
            a < t.length;

          )
            0 == t[a][0]
              ? ((i[o++] = a),
                (h = f),
                (l = c),
                (f = 0),
                (c = 0),
                (s = t[a][1]))
              : (1 == t[a][0] ? (f += t[a][1].length) : (c += t[a][1].length),
                s &&
                  s.length <= Math.max(h, l) &&
                  s.length <= Math.max(f, c) &&
                  (t.splice(i[o - 1], 0, new e.Diff(n, s)),
                  (t[i[o - 1] + 1][0] = 1),
                  o--,
                  (a = --o > 0 ? i[o - 1] : -1),
                  (h = 0),
                  (l = 0),
                  (f = 0),
                  (c = 0),
                  (s = null),
                  (r = !0))),
              a++
          for (
            r && this.diff_cleanupMerge(t),
              this.diff_cleanupSemanticLossless(t),
              a = 1;
            a < t.length;

          ) {
            if (t[a - 1][0] == n && 1 == t[a][0]) {
              var u = t[a - 1][1],
                p = t[a][1],
                d = this.diff_commonOverlap_(u, p),
                g = this.diff_commonOverlap_(p, u)
              d >= g
                ? (d >= u.length / 2 || d >= p.length / 2) &&
                  (t.splice(a, 0, new e.Diff(0, p.substring(0, d))),
                  (t[a - 1][1] = u.substring(0, u.length - d)),
                  (t[a + 1][1] = p.substring(d)),
                  a++)
                : (g >= u.length / 2 || g >= p.length / 2) &&
                  (t.splice(a, 0, new e.Diff(0, u.substring(0, g))),
                  (t[a - 1][0] = 1),
                  (t[a - 1][1] = p.substring(0, p.length - g)),
                  (t[a + 1][0] = n),
                  (t[a + 1][1] = u.substring(g)),
                  a++),
                a++
            }
            a++
          }
        }),
        (e.prototype.diff_cleanupSemanticLossless = function (t) {
          function n(t, n) {
            if (!t || !n) return 6
            var r = t.charAt(t.length - 1),
              i = n.charAt(0),
              o = r.match(e.nonAlphaNumericRegex_),
              s = i.match(e.nonAlphaNumericRegex_),
              a = o && r.match(e.whitespaceRegex_),
              h = s && i.match(e.whitespaceRegex_),
              l = a && r.match(e.linebreakRegex_),
              f = h && i.match(e.linebreakRegex_),
              c = l && t.match(e.blanklineEndRegex_),
              u = f && n.match(e.blanklineStartRegex_)
            return c || u
              ? 5
              : l || f
              ? 4
              : o && !a && h
              ? 3
              : a || h
              ? 2
              : o || s
              ? 1
              : 0
          }
          for (var r = 1; r < t.length - 1; ) {
            if (0 == t[r - 1][0] && 0 == t[r + 1][0]) {
              var i = t[r - 1][1],
                o = t[r][1],
                s = t[r + 1][1],
                a = this.diff_commonSuffix(i, o)
              if (a) {
                var h = o.substring(o.length - a)
                ;(i = i.substring(0, i.length - a)),
                  (o = h + o.substring(0, o.length - a)),
                  (s = h + s)
              }
              for (
                var l = i, f = o, c = s, u = n(i, o) + n(o, s);
                o.charAt(0) === s.charAt(0);

              ) {
                ;(i += o.charAt(0)),
                  (o = o.substring(1) + s.charAt(0)),
                  (s = s.substring(1))
                var p = n(i, o) + n(o, s)
                p >= u && ((u = p), (l = i), (f = o), (c = s))
              }
              t[r - 1][1] != l &&
                (l ? (t[r - 1][1] = l) : (t.splice(r - 1, 1), r--),
                (t[r][1] = f),
                c ? (t[r + 1][1] = c) : (t.splice(r + 1, 1), r--))
            }
            r++
          }
        }),
        (e.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/),
        (e.whitespaceRegex_ = /\s/),
        (e.linebreakRegex_ = /[\r\n]/),
        (e.blanklineEndRegex_ = /\n\r?\n$/),
        (e.blanklineStartRegex_ = /^\r?\n\r?\n/),
        (e.prototype.diff_cleanupEfficiency = function (t) {
          for (
            var r = !1,
              i = [],
              o = 0,
              s = null,
              a = 0,
              h = !1,
              l = !1,
              f = !1,
              c = !1;
            a < t.length;

          )
            0 == t[a][0]
              ? (t[a][1].length < this.Diff_EditCost && (f || c)
                  ? ((i[o++] = a), (h = f), (l = c), (s = t[a][1]))
                  : ((o = 0), (s = null)),
                (f = c = !1))
              : (t[a][0] == n ? (c = !0) : (f = !0),
                s &&
                  ((h && l && f && c) ||
                    (s.length < this.Diff_EditCost / 2 &&
                      h + l + f + c == 3)) &&
                  (t.splice(i[o - 1], 0, new e.Diff(n, s)),
                  (t[i[o - 1] + 1][0] = 1),
                  o--,
                  (s = null),
                  h && l
                    ? ((f = c = !0), (o = 0))
                    : ((a = --o > 0 ? i[o - 1] : -1), (f = c = !1)),
                  (r = !0))),
              a++
          r && this.diff_cleanupMerge(t)
        }),
        (e.prototype.diff_cleanupMerge = function (t) {
          t.push(new e.Diff(0, ''))
          for (var r, i = 0, o = 0, s = 0, a = '', h = ''; i < t.length; )
            switch (t[i][0]) {
              case 1:
                s++, (h += t[i][1]), i++
                break
              case n:
                o++, (a += t[i][1]), i++
                break
              case 0:
                o + s > 1
                  ? (0 !== o &&
                      0 !== s &&
                      (0 !== (r = this.diff_commonPrefix(h, a)) &&
                        (i - o - s > 0 && 0 == t[i - o - s - 1][0]
                          ? (t[i - o - s - 1][1] += h.substring(0, r))
                          : (t.splice(0, 0, new e.Diff(0, h.substring(0, r))),
                            i++),
                        (h = h.substring(r)),
                        (a = a.substring(r))),
                      0 !== (r = this.diff_commonSuffix(h, a)) &&
                        ((t[i][1] = h.substring(h.length - r) + t[i][1]),
                        (h = h.substring(0, h.length - r)),
                        (a = a.substring(0, a.length - r)))),
                    (i -= o + s),
                    t.splice(i, o + s),
                    a.length && (t.splice(i, 0, new e.Diff(n, a)), i++),
                    h.length && (t.splice(i, 0, new e.Diff(1, h)), i++),
                    i++)
                  : 0 !== i && 0 == t[i - 1][0]
                  ? ((t[i - 1][1] += t[i][1]), t.splice(i, 1))
                  : i++,
                  (s = 0),
                  (o = 0),
                  (a = ''),
                  (h = '')
            }
          '' === t[t.length - 1][1] && t.pop()
          var l = !1
          for (i = 1; i < t.length - 1; )
            0 == t[i - 1][0] &&
              0 == t[i + 1][0] &&
              (t[i][1].substring(t[i][1].length - t[i - 1][1].length) ==
              t[i - 1][1]
                ? ((t[i][1] =
                    t[i - 1][1] +
                    t[i][1].substring(0, t[i][1].length - t[i - 1][1].length)),
                  (t[i + 1][1] = t[i - 1][1] + t[i + 1][1]),
                  t.splice(i - 1, 1),
                  (l = !0))
                : t[i][1].substring(0, t[i + 1][1].length) == t[i + 1][1] &&
                  ((t[i - 1][1] += t[i + 1][1]),
                  (t[i][1] =
                    t[i][1].substring(t[i + 1][1].length) + t[i + 1][1]),
                  t.splice(i + 1, 1),
                  (l = !0))),
              i++
          l && this.diff_cleanupMerge(t)
        }),
        (e.prototype.diff_xIndex = function (t, e) {
          var r,
            i = 0,
            o = 0,
            s = 0,
            a = 0
          for (
            r = 0;
            r < t.length &&
            (1 !== t[r][0] && (i += t[r][1].length),
            t[r][0] !== n && (o += t[r][1].length),
            !(i > e));
            r++
          )
            (s = i), (a = o)
          return t.length != r && t[r][0] === n ? a : a + (e - s)
        }),
        (e.prototype.diff_prettyHtml = function (t) {
          for (
            var e = [], r = /&/g, i = /</g, o = />/g, s = /\n/g, a = 0;
            a < t.length;
            a++
          ) {
            var h = t[a][0],
              l = t[a][1]
                .replace(r, '&amp;')
                .replace(i, '&lt;')
                .replace(o, '&gt;')
                .replace(s, '&para;<br>')
            switch (h) {
              case 1:
                e[a] = '<ins style="background:#e6ffe6;">' + l + '</ins>'
                break
              case n:
                e[a] = '<del style="background:#ffe6e6;">' + l + '</del>'
                break
              case 0:
                e[a] = '<span>' + l + '</span>'
            }
          }
          return e.join('')
        }),
        (e.prototype.diff_text1 = function (t) {
          for (var e = [], n = 0; n < t.length; n++)
            1 !== t[n][0] && (e[n] = t[n][1])
          return e.join('')
        }),
        (e.prototype.diff_text2 = function (t) {
          for (var e = [], r = 0; r < t.length; r++)
            t[r][0] !== n && (e[r] = t[r][1])
          return e.join('')
        }),
        (e.prototype.diff_levenshtein = function (t) {
          for (var e = 0, r = 0, i = 0, o = 0; o < t.length; o++) {
            var s = t[o][0],
              a = t[o][1]
            switch (s) {
              case 1:
                r += a.length
                break
              case n:
                i += a.length
                break
              case 0:
                ;(e += Math.max(r, i)), (r = 0), (i = 0)
            }
          }
          return (e += Math.max(r, i))
        }),
        (e.prototype.diff_toDelta = function (t) {
          for (var e = [], r = 0; r < t.length; r++)
            switch (t[r][0]) {
              case 1:
                e[r] = '+' + encodeURI(t[r][1])
                break
              case n:
                e[r] = '-' + t[r][1].length
                break
              case 0:
                e[r] = '=' + t[r][1].length
            }
          return e.join('\t').replace(/%20/g, ' ')
        }),
        (e.prototype.diff_fromDelta = function (t, r) {
          for (
            var i = [], o = 0, s = 0, a = r.split(/\t/g), h = 0;
            h < a.length;
            h++
          ) {
            var l = a[h].substring(1)
            switch (a[h].charAt(0)) {
              case '+':
                try {
                  i[o++] = new e.Diff(1, decodeURI(l))
                } catch (u) {
                  throw new Error('Illegal escape in diff_fromDelta: ' + l)
                }
                break
              case '-':
              case '=':
                var f = parseInt(l, 10)
                if (isNaN(f) || f < 0)
                  throw new Error('Invalid number in diff_fromDelta: ' + l)
                var c = t.substring(s, (s += f))
                '=' == a[h].charAt(0)
                  ? (i[o++] = new e.Diff(0, c))
                  : (i[o++] = new e.Diff(n, c))
                break
              default:
                if (a[h])
                  throw new Error(
                    'Invalid diff operation in diff_fromDelta: ' + a[h],
                  )
            }
          }
          if (s != t.length)
            throw new Error(
              'Delta length (' +
                s +
                ') does not equal source text length (' +
                t.length +
                ').',
            )
          return i
        }),
        (e.prototype.match_main = function (t, e, n) {
          if (null == t || null == e || null == n)
            throw new Error('Null input. (match_main)')
          return (
            (n = Math.max(0, Math.min(n, t.length))),
            t == e
              ? 0
              : t.length
              ? t.substring(n, n + e.length) == e
                ? n
                : this.match_bitap_(t, e, n)
              : -1
          )
        }),
        (e.prototype.match_bitap_ = function (t, e, n) {
          if (e.length > this.Match_MaxBits)
            throw new Error('Pattern too long for this browser.')
          var r = this.match_alphabet_(e),
            i = this
          function o(t, r) {
            var o = t / e.length,
              s = Math.abs(n - r)
            return i.Match_Distance ? o + s / i.Match_Distance : s ? 1 : o
          }
          var s = this.Match_Threshold,
            a = t.indexOf(e, n)
          ;-1 != a &&
            ((s = Math.min(o(0, a), s)),
            -1 != (a = t.lastIndexOf(e, n + e.length)) &&
              (s = Math.min(o(0, a), s)))
          var h,
            l,
            f = 1 << (e.length - 1)
          a = -1
          for (var c, u = e.length + t.length, p = 0; p < e.length; p++) {
            for (h = 0, l = u; h < l; )
              o(p, n + l) <= s ? (h = l) : (u = l),
                (l = Math.floor((u - h) / 2 + h))
            u = l
            var d = Math.max(1, n - l + 1),
              g = Math.min(n + l, t.length) + e.length,
              b = Array(g + 2)
            b[g + 1] = (1 << p) - 1
            for (var v = g; v >= d; v--) {
              var y = r[t.charAt(v - 1)]
              if (
                ((b[v] =
                  0 === p
                    ? ((b[v + 1] << 1) | 1) & y
                    : (((b[v + 1] << 1) | 1) & y) |
                      ((c[v + 1] | c[v]) << 1) |
                      1 |
                      c[v + 1]),
                b[v] & f)
              ) {
                var _ = o(p, v - 1)
                if (_ <= s) {
                  if (((s = _), !((a = v - 1) > n))) break
                  d = Math.max(1, 2 * n - a)
                }
              }
            }
            if (o(p + 1, n) > s) break
            c = b
          }
          return a
        }),
        (e.prototype.match_alphabet_ = function (t) {
          for (var e = {}, n = 0; n < t.length; n++) e[t.charAt(n)] = 0
          for (n = 0; n < t.length; n++)
            e[t.charAt(n)] |= 1 << (t.length - n - 1)
          return e
        }),
        (e.prototype.patch_addContext_ = function (t, n) {
          if (0 != n.length) {
            if (null === t.start2) throw Error('patch not initialized')
            for (
              var r = n.substring(t.start2, t.start2 + t.length1), i = 0;
              n.indexOf(r) != n.lastIndexOf(r) &&
              r.length <
                this.Match_MaxBits - this.Patch_Margin - this.Patch_Margin;

            )
              (i += this.Patch_Margin),
                (r = n.substring(t.start2 - i, t.start2 + t.length1 + i))
            i += this.Patch_Margin
            var o = n.substring(t.start2 - i, t.start2)
            o && t.diffs.unshift(new e.Diff(0, o))
            var s = n.substring(t.start2 + t.length1, t.start2 + t.length1 + i)
            s && t.diffs.push(new e.Diff(0, s)),
              (t.start1 -= o.length),
              (t.start2 -= o.length),
              (t.length1 += o.length + s.length),
              (t.length2 += o.length + s.length)
          }
        }),
        (e.prototype.patch_make = function (t, r, i) {
          var o, s
          if (
            'string' == typeof t &&
            'string' == typeof r &&
            'undefined' == typeof i
          )
            (o = t),
              (s = this.diff_main(o, r, !0)).length > 2 &&
                (this.diff_cleanupSemantic(s), this.diff_cleanupEfficiency(s))
          else if (
            t &&
            'object' == typeof t &&
            'undefined' == typeof r &&
            'undefined' == typeof i
          )
            (s = t), (o = this.diff_text1(s))
          else if (
            'string' == typeof t &&
            r &&
            'object' == typeof r &&
            'undefined' == typeof i
          )
            (o = t), (s = r)
          else {
            if (
              'string' != typeof t ||
              'string' != typeof r ||
              !i ||
              'object' != typeof i
            )
              throw new Error('Unknown call format to patch_make.')
            ;(o = t), (s = i)
          }
          if (0 === s.length) return []
          for (
            var a = [],
              h = new e.patch_obj(),
              l = 0,
              f = 0,
              c = 0,
              u = o,
              p = o,
              d = 0;
            d < s.length;
            d++
          ) {
            var g = s[d][0],
              b = s[d][1]
            switch ((l || 0 === g || ((h.start1 = f), (h.start2 = c)), g)) {
              case 1:
                ;(h.diffs[l++] = s[d]),
                  (h.length2 += b.length),
                  (p = p.substring(0, c) + b + p.substring(c))
                break
              case n:
                ;(h.length1 += b.length),
                  (h.diffs[l++] = s[d]),
                  (p = p.substring(0, c) + p.substring(c + b.length))
                break
              case 0:
                b.length <= 2 * this.Patch_Margin && l && s.length != d + 1
                  ? ((h.diffs[l++] = s[d]),
                    (h.length1 += b.length),
                    (h.length2 += b.length))
                  : b.length >= 2 * this.Patch_Margin &&
                    l &&
                    (this.patch_addContext_(h, u),
                    a.push(h),
                    (h = new e.patch_obj()),
                    (l = 0),
                    (u = p),
                    (f = c))
            }
            1 !== g && (f += b.length), g !== n && (c += b.length)
          }
          return l && (this.patch_addContext_(h, u), a.push(h)), a
        }),
        (e.prototype.patch_deepCopy = function (t) {
          for (var n = [], r = 0; r < t.length; r++) {
            var i = t[r],
              o = new e.patch_obj()
            o.diffs = []
            for (var s = 0; s < i.diffs.length; s++)
              o.diffs[s] = new e.Diff(i.diffs[s][0], i.diffs[s][1])
            ;(o.start1 = i.start1),
              (o.start2 = i.start2),
              (o.length1 = i.length1),
              (o.length2 = i.length2),
              (n[r] = o)
          }
          return n
        }),
        (e.prototype.patch_apply = function (t, e) {
          if (0 == t.length) return [e, []]
          t = this.patch_deepCopy(t)
          var r = this.patch_addPadding(t)
          ;(e = r + e + r), this.patch_splitMax(t)
          for (var i = 0, o = [], s = 0; s < t.length; s++) {
            var a,
              h,
              l = t[s].start2 + i,
              f = this.diff_text1(t[s].diffs),
              c = -1
            if (
              (f.length > this.Match_MaxBits
                ? -1 !=
                    (a = this.match_main(
                      e,
                      f.substring(0, this.Match_MaxBits),
                      l,
                    )) &&
                  (-1 ==
                    (c = this.match_main(
                      e,
                      f.substring(f.length - this.Match_MaxBits),
                      l + f.length - this.Match_MaxBits,
                    )) ||
                    a >= c) &&
                  (a = -1)
                : (a = this.match_main(e, f, l)),
              -1 == a)
            )
              (o[s] = !1), (i -= t[s].length2 - t[s].length1)
            else if (
              ((o[s] = !0),
              (i = a - l),
              f ==
                (h =
                  -1 == c
                    ? e.substring(a, a + f.length)
                    : e.substring(a, c + this.Match_MaxBits)))
            )
              e =
                e.substring(0, a) +
                this.diff_text2(t[s].diffs) +
                e.substring(a + f.length)
            else {
              var u = this.diff_main(f, h, !1)
              if (
                f.length > this.Match_MaxBits &&
                this.diff_levenshtein(u) / f.length > this.Patch_DeleteThreshold
              )
                o[s] = !1
              else {
                this.diff_cleanupSemanticLossless(u)
                for (var p, d = 0, g = 0; g < t[s].diffs.length; g++) {
                  var b = t[s].diffs[g]
                  0 !== b[0] && (p = this.diff_xIndex(u, d)),
                    1 === b[0]
                      ? (e = e.substring(0, a + p) + b[1] + e.substring(a + p))
                      : b[0] === n &&
                        (e =
                          e.substring(0, a + p) +
                          e.substring(
                            a + this.diff_xIndex(u, d + b[1].length),
                          )),
                    b[0] !== n && (d += b[1].length)
                }
              }
            }
          }
          return [(e = e.substring(r.length, e.length - r.length)), o]
        }),
        (e.prototype.patch_addPadding = function (t) {
          for (var n = this.Patch_Margin, r = '', i = 1; i <= n; i++)
            r += String.fromCharCode(i)
          for (i = 0; i < t.length; i++) (t[i].start1 += n), (t[i].start2 += n)
          var o = t[0],
            s = o.diffs
          if (0 == s.length || 0 != s[0][0])
            s.unshift(new e.Diff(0, r)),
              (o.start1 -= n),
              (o.start2 -= n),
              (o.length1 += n),
              (o.length2 += n)
          else if (n > s[0][1].length) {
            var a = n - s[0][1].length
            ;(s[0][1] = r.substring(s[0][1].length) + s[0][1]),
              (o.start1 -= a),
              (o.start2 -= a),
              (o.length1 += a),
              (o.length2 += a)
          }
          if (
            0 == (s = (o = t[t.length - 1]).diffs).length ||
            0 != s[s.length - 1][0]
          )
            s.push(new e.Diff(0, r)), (o.length1 += n), (o.length2 += n)
          else if (n > s[s.length - 1][1].length) {
            a = n - s[s.length - 1][1].length
            ;(s[s.length - 1][1] += r.substring(0, a)),
              (o.length1 += a),
              (o.length2 += a)
          }
          return r
        }),
        (e.prototype.patch_splitMax = function (t) {
          for (var r = this.Match_MaxBits, i = 0; i < t.length; i++)
            if (!(t[i].length1 <= r)) {
              var o = t[i]
              t.splice(i--, 1)
              for (
                var s = o.start1, a = o.start2, h = '';
                0 !== o.diffs.length;

              ) {
                var l = new e.patch_obj(),
                  f = !0
                for (
                  l.start1 = s - h.length,
                    l.start2 = a - h.length,
                    '' !== h &&
                      ((l.length1 = l.length2 = h.length),
                      l.diffs.push(new e.Diff(0, h)));
                  0 !== o.diffs.length && l.length1 < r - this.Patch_Margin;

                ) {
                  var c = o.diffs[0][0],
                    u = o.diffs[0][1]
                  1 === c
                    ? ((l.length2 += u.length),
                      (a += u.length),
                      l.diffs.push(o.diffs.shift()),
                      (f = !1))
                    : c === n &&
                      1 == l.diffs.length &&
                      0 == l.diffs[0][0] &&
                      u.length > 2 * r
                    ? ((l.length1 += u.length),
                      (s += u.length),
                      (f = !1),
                      l.diffs.push(new e.Diff(c, u)),
                      o.diffs.shift())
                    : ((u = u.substring(0, r - l.length1 - this.Patch_Margin)),
                      (l.length1 += u.length),
                      (s += u.length),
                      0 === c
                        ? ((l.length2 += u.length), (a += u.length))
                        : (f = !1),
                      l.diffs.push(new e.Diff(c, u)),
                      u == o.diffs[0][1]
                        ? o.diffs.shift()
                        : (o.diffs[0][1] = o.diffs[0][1].substring(u.length)))
                }
                h = (h = this.diff_text2(l.diffs)).substring(
                  h.length - this.Patch_Margin,
                )
                var p = this.diff_text1(o.diffs).substring(0, this.Patch_Margin)
                '' !== p &&
                  ((l.length1 += p.length),
                  (l.length2 += p.length),
                  0 !== l.diffs.length && 0 === l.diffs[l.diffs.length - 1][0]
                    ? (l.diffs[l.diffs.length - 1][1] += p)
                    : l.diffs.push(new e.Diff(0, p))),
                  f || t.splice(++i, 0, l)
              }
            }
        }),
        (e.prototype.patch_toText = function (t) {
          for (var e = [], n = 0; n < t.length; n++) e[n] = t[n]
          return e.join('')
        }),
        (e.prototype.patch_fromText = function (t) {
          var r = []
          if (!t) return r
          for (
            var i = t.split('\n'),
              o = 0,
              s = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;
            o < i.length;

          ) {
            var a = i[o].match(s)
            if (!a) throw new Error('Invalid patch string: ' + i[o])
            var h = new e.patch_obj()
            for (
              r.push(h),
                h.start1 = parseInt(a[1], 10),
                '' === a[2]
                  ? (h.start1--, (h.length1 = 1))
                  : '0' == a[2]
                  ? (h.length1 = 0)
                  : (h.start1--, (h.length1 = parseInt(a[2], 10))),
                h.start2 = parseInt(a[3], 10),
                '' === a[4]
                  ? (h.start2--, (h.length2 = 1))
                  : '0' == a[4]
                  ? (h.length2 = 0)
                  : (h.start2--, (h.length2 = parseInt(a[4], 10))),
                o++;
              o < i.length;

            ) {
              var l = i[o].charAt(0)
              try {
                var f = decodeURI(i[o].substring(1))
              } catch (c) {
                throw new Error('Illegal escape in patch_fromText: ' + f)
              }
              if ('-' == l) h.diffs.push(new e.Diff(n, f))
              else if ('+' == l) h.diffs.push(new e.Diff(1, f))
              else if (' ' == l) h.diffs.push(new e.Diff(0, f))
              else {
                if ('@' == l) break
                if ('' !== l)
                  throw new Error('Invalid patch mode "' + l + '" in: ' + f)
              }
              o++
            }
          }
          return r
        }),
        ((e.patch_obj = function () {
          ;(this.diffs = []),
            (this.start1 = null),
            (this.start2 = null),
            (this.length1 = 0),
            (this.length2 = 0)
        }).prototype.toString = function () {
          for (
            var t,
              e = [
                '@@ -' +
                  (0 === this.length1
                    ? this.start1 + ',0'
                    : 1 == this.length1
                    ? this.start1 + 1
                    : this.start1 + 1 + ',' + this.length1) +
                  ' +' +
                  (0 === this.length2
                    ? this.start2 + ',0'
                    : 1 == this.length2
                    ? this.start2 + 1
                    : this.start2 + 1 + ',' + this.length2) +
                  ' @@\n',
              ],
              r = 0;
            r < this.diffs.length;
            r++
          ) {
            switch (this.diffs[r][0]) {
              case 1:
                t = '+'
                break
              case n:
                t = '-'
                break
              case 0:
                t = ' '
            }
            e[r + 1] = t + encodeURI(this.diffs[r][1]) + '\n'
          }
          return e.join('').replace(/%20/g, ' ')
        }),
        (t.exports = e),
        (t.exports.diff_match_patch = e),
        (t.exports.DIFF_DELETE = n),
        (t.exports.DIFF_INSERT = 1),
        (t.exports.DIFF_EQUAL = 0)
    },
    77485: function (t, e, n) {
      var r = '__lodash_hash_undefined__',
        i = '[object Function]',
        o = '[object GeneratorFunction]',
        s = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
        a = /^\w*$/,
        h = /^\./,
        l =
          /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
        f = /\\(\\)?/g,
        c = /^\[object .+?Constructor\]$/,
        u = 'object' == typeof n.g && n.g && n.g.Object === Object && n.g,
        p = 'object' == typeof self && self && self.Object === Object && self,
        d = u || p || Function('return this')()
      var g = Array.prototype,
        b = Function.prototype,
        v = Object.prototype,
        y = d['__core-js_shared__'],
        _ = (function () {
          var t = /[^.]+$/.exec((y && y.keys && y.keys.IE_PROTO) || '')
          return t ? 'Symbol(src)_1.' + t : ''
        })(),
        m = b.toString,
        w = v.hasOwnProperty,
        S = v.toString,
        O = RegExp(
          '^' +
            m
              .call(w)
              .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
              .replace(
                /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                '$1.*?',
              ) +
            '$',
        ),
        M = d.Symbol,
        x = g.splice,
        E = I(d, 'Map'),
        C = I(Object, 'create'),
        P = M ? M.prototype : void 0,
        j = P ? P.toString : void 0
      function A(t) {
        var e = -1,
          n = t ? t.length : 0
        for (this.clear(); ++e < n; ) {
          var r = t[e]
          this.set(r[0], r[1])
        }
      }
      function k(t) {
        var e = -1,
          n = t ? t.length : 0
        for (this.clear(); ++e < n; ) {
          var r = t[e]
          this.set(r[0], r[1])
        }
      }
      function D(t) {
        var e = -1,
          n = t ? t.length : 0
        for (this.clear(); ++e < n; ) {
          var r = t[e]
          this.set(r[0], r[1])
        }
      }
      function L(t, e) {
        for (var n, r, i = t.length; i--; )
          if ((n = t[i][0]) === (r = e) || (n !== n && r !== r)) return i
        return -1
      }
      function $(t, e) {
        var n
        e = (function (t, e) {
          if (F(t)) return !1
          var n = typeof t
          if (
            'number' == n ||
            'symbol' == n ||
            'boolean' == n ||
            null == t ||
            G(t)
          )
            return !0
          return a.test(t) || !s.test(t) || (null != e && t in Object(e))
        })(e, t)
          ? [e]
          : F((n = e))
          ? n
          : N(n)
        for (var r = 0, i = e.length; null != t && r < i; ) t = t[R(e[r++])]
        return r && r == i ? t : void 0
      }
      function z(t) {
        if (!U(t) || ((e = t), _ && _ in e)) return !1
        var e,
          n =
            (function (t) {
              var e = U(t) ? S.call(t) : ''
              return e == i || e == o
            })(t) ||
            (function (t) {
              var e = !1
              if (null != t && 'function' != typeof t.toString)
                try {
                  e = !!(t + '')
                } catch (n) {}
              return e
            })(t)
              ? O
              : c
        return n.test(
          (function (t) {
            if (null != t) {
              try {
                return m.call(t)
              } catch (e) {}
              try {
                return t + ''
              } catch (e) {}
            }
            return ''
          })(t),
        )
      }
      function T(t, e) {
        var n = t.__data__
        return (function (t) {
          var e = typeof t
          return 'string' == e ||
            'number' == e ||
            'symbol' == e ||
            'boolean' == e
            ? '__proto__' !== t
            : null === t
        })(e)
          ? n['string' == typeof e ? 'string' : 'hash']
          : n.map
      }
      function I(t, e) {
        var n = (function (t, e) {
          return null == t ? void 0 : t[e]
        })(t, e)
        return z(n) ? n : void 0
      }
      ;(A.prototype.clear = function () {
        this.__data__ = C ? C(null) : {}
      }),
        (A.prototype.delete = function (t) {
          return this.has(t) && delete this.__data__[t]
        }),
        (A.prototype.get = function (t) {
          var e = this.__data__
          if (C) {
            var n = e[t]
            return n === r ? void 0 : n
          }
          return w.call(e, t) ? e[t] : void 0
        }),
        (A.prototype.has = function (t) {
          var e = this.__data__
          return C ? void 0 !== e[t] : w.call(e, t)
        }),
        (A.prototype.set = function (t, e) {
          return (this.__data__[t] = C && void 0 === e ? r : e), this
        }),
        (k.prototype.clear = function () {
          this.__data__ = []
        }),
        (k.prototype.delete = function (t) {
          var e = this.__data__,
            n = L(e, t)
          return !(n < 0) && (n == e.length - 1 ? e.pop() : x.call(e, n, 1), !0)
        }),
        (k.prototype.get = function (t) {
          var e = this.__data__,
            n = L(e, t)
          return n < 0 ? void 0 : e[n][1]
        }),
        (k.prototype.has = function (t) {
          return L(this.__data__, t) > -1
        }),
        (k.prototype.set = function (t, e) {
          var n = this.__data__,
            r = L(n, t)
          return r < 0 ? n.push([t, e]) : (n[r][1] = e), this
        }),
        (D.prototype.clear = function () {
          this.__data__ = {
            hash: new A(),
            map: new (E || k)(),
            string: new A(),
          }
        }),
        (D.prototype.delete = function (t) {
          return T(this, t).delete(t)
        }),
        (D.prototype.get = function (t) {
          return T(this, t).get(t)
        }),
        (D.prototype.has = function (t) {
          return T(this, t).has(t)
        }),
        (D.prototype.set = function (t, e) {
          return T(this, t).set(t, e), this
        })
      var N = B(function (t) {
        var e
        t =
          null == (e = t)
            ? ''
            : (function (t) {
                if ('string' == typeof t) return t
                if (G(t)) return j ? j.call(t) : ''
                var e = t + ''
                return '0' == e && 1 / t == -1 / 0 ? '-0' : e
              })(e)
        var n = []
        return (
          h.test(t) && n.push(''),
          t.replace(l, function (t, e, r, i) {
            n.push(r ? i.replace(f, '$1') : e || t)
          }),
          n
        )
      })
      function R(t) {
        if ('string' == typeof t || G(t)) return t
        var e = t + ''
        return '0' == e && 1 / t == -1 / 0 ? '-0' : e
      }
      function B(t, e) {
        if ('function' != typeof t || (e && 'function' != typeof e))
          throw new TypeError('Expected a function')
        var n = function () {
          var r = arguments,
            i = e ? e.apply(this, r) : r[0],
            o = n.cache
          if (o.has(i)) return o.get(i)
          var s = t.apply(this, r)
          return (n.cache = o.set(i, s)), s
        }
        return (n.cache = new (B.Cache || D)()), n
      }
      B.Cache = D
      var F = Array.isArray
      function U(t) {
        var e = typeof t
        return !!t && ('object' == e || 'function' == e)
      }
      function G(t) {
        return (
          'symbol' == typeof t ||
          ((function (t) {
            return !!t && 'object' == typeof t
          })(t) &&
            '[object Symbol]' == S.call(t))
        )
      }
      t.exports = function (t, e, n) {
        var r = null == t ? void 0 : $(t, e)
        return void 0 === r ? n : r
      }
    },
    33958: function (t, e, n) {
      t = n.nmd(t)
      var r = '__lodash_hash_undefined__',
        i = 9007199254740991,
        o = '[object Arguments]',
        s = '[object Array]',
        a = '[object Boolean]',
        h = '[object Date]',
        l = '[object Error]',
        f = '[object Function]',
        c = '[object Map]',
        u = '[object Number]',
        p = '[object Object]',
        d = '[object Promise]',
        g = '[object RegExp]',
        b = '[object Set]',
        v = '[object String]',
        y = '[object Symbol]',
        _ = '[object WeakMap]',
        m = '[object ArrayBuffer]',
        w = '[object DataView]',
        S = /^\[object .+?Constructor\]$/,
        O = /^(?:0|[1-9]\d*)$/,
        M = {}
      ;(M['[object Float32Array]'] =
        M['[object Float64Array]'] =
        M['[object Int8Array]'] =
        M['[object Int16Array]'] =
        M['[object Int32Array]'] =
        M['[object Uint8Array]'] =
        M['[object Uint8ClampedArray]'] =
        M['[object Uint16Array]'] =
        M['[object Uint32Array]'] =
          !0),
        (M[o] =
          M[s] =
          M[m] =
          M[a] =
          M[w] =
          M[h] =
          M[l] =
          M[f] =
          M[c] =
          M[u] =
          M[p] =
          M[g] =
          M[b] =
          M[v] =
          M[_] =
            !1)
      var x = 'object' == typeof n.g && n.g && n.g.Object === Object && n.g,
        E = 'object' == typeof self && self && self.Object === Object && self,
        C = x || E || Function('return this')(),
        P = e && !e.nodeType && e,
        j = P && t && !t.nodeType && t,
        A = j && j.exports === P,
        k = A && x.process,
        D = (function () {
          try {
            return k && k.binding && k.binding('util')
          } catch (t) {}
        })(),
        L = D && D.isTypedArray
      function $(t, e) {
        for (var n = -1, r = null == t ? 0 : t.length; ++n < r; )
          if (e(t[n], n, t)) return !0
        return !1
      }
      function z(t) {
        var e = -1,
          n = Array(t.size)
        return (
          t.forEach(function (t, r) {
            n[++e] = [r, t]
          }),
          n
        )
      }
      function T(t) {
        var e = -1,
          n = Array(t.size)
        return (
          t.forEach(function (t) {
            n[++e] = t
          }),
          n
        )
      }
      var I,
        N,
        R = Array.prototype,
        B = Function.prototype,
        F = Object.prototype,
        U = C['__core-js_shared__'],
        G = B.toString,
        H = F.hasOwnProperty,
        V = (function () {
          var t = /[^.]+$/.exec((U && U.keys && U.keys.IE_PROTO) || '')
          return t ? 'Symbol(src)_1.' + t : ''
        })(),
        W = F.toString,
        K = RegExp(
          '^' +
            G.call(H)
              .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
              .replace(
                /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                '$1.*?',
              ) +
            '$',
        ),
        q = A ? C.Buffer : void 0,
        J = C.Symbol,
        Q = C.Uint8Array,
        X = F.propertyIsEnumerable,
        Y = R.splice,
        Z = J ? J.toStringTag : void 0,
        tt = Object.getOwnPropertySymbols,
        et = q ? q.isBuffer : void 0,
        nt =
          ((I = Object.keys),
          (N = Object),
          function (t) {
            return I(N(t))
          }),
        rt = kt(C, 'DataView'),
        it = kt(C, 'Map'),
        ot = kt(C, 'Promise'),
        st = kt(C, 'Set'),
        at = kt(C, 'WeakMap'),
        ht = kt(Object, 'create'),
        lt = zt(rt),
        ft = zt(it),
        ct = zt(ot),
        ut = zt(st),
        pt = zt(at),
        dt = J ? J.prototype : void 0,
        gt = dt ? dt.valueOf : void 0
      function bt(t) {
        var e = -1,
          n = null == t ? 0 : t.length
        for (this.clear(); ++e < n; ) {
          var r = t[e]
          this.set(r[0], r[1])
        }
      }
      function vt(t) {
        var e = -1,
          n = null == t ? 0 : t.length
        for (this.clear(); ++e < n; ) {
          var r = t[e]
          this.set(r[0], r[1])
        }
      }
      function yt(t) {
        var e = -1,
          n = null == t ? 0 : t.length
        for (this.clear(); ++e < n; ) {
          var r = t[e]
          this.set(r[0], r[1])
        }
      }
      function _t(t) {
        var e = -1,
          n = null == t ? 0 : t.length
        for (this.__data__ = new yt(); ++e < n; ) this.add(t[e])
      }
      function mt(t) {
        var e = (this.__data__ = new vt(t))
        this.size = e.size
      }
      function wt(t, e) {
        var n = Nt(t),
          r = !n && It(t),
          i = !n && !r && Rt(t),
          o = !n && !r && !i && Ht(t),
          s = n || r || i || o,
          a = s
            ? (function (t, e) {
                for (var n = -1, r = Array(t); ++n < t; ) r[n] = e(n)
                return r
              })(t.length, String)
            : [],
          h = a.length
        for (var l in t)
          (!e && !H.call(t, l)) ||
            (s &&
              ('length' == l ||
                (i && ('offset' == l || 'parent' == l)) ||
                (o &&
                  ('buffer' == l || 'byteLength' == l || 'byteOffset' == l)) ||
                $t(l, h))) ||
            a.push(l)
        return a
      }
      function St(t, e) {
        for (var n = t.length; n--; ) if (Tt(t[n][0], e)) return n
        return -1
      }
      function Ot(t) {
        return null == t
          ? void 0 === t
            ? '[object Undefined]'
            : '[object Null]'
          : Z && Z in Object(t)
          ? (function (t) {
              var e = H.call(t, Z),
                n = t[Z]
              try {
                t[Z] = void 0
                var r = !0
              } catch (o) {}
              var i = W.call(t)
              r && (e ? (t[Z] = n) : delete t[Z])
              return i
            })(t)
          : (function (t) {
              return W.call(t)
            })(t)
      }
      function Mt(t) {
        return Gt(t) && Ot(t) == o
      }
      function xt(t, e, n, r, i) {
        return (
          t === e ||
          (null == t || null == e || (!Gt(t) && !Gt(e))
            ? t !== t && e !== e
            : (function (t, e, n, r, i, f) {
                var d = Nt(t),
                  _ = Nt(e),
                  S = d ? s : Lt(t),
                  O = _ ? s : Lt(e),
                  M = (S = S == o ? p : S) == p,
                  x = (O = O == o ? p : O) == p,
                  E = S == O
                if (E && Rt(t)) {
                  if (!Rt(e)) return !1
                  ;(d = !0), (M = !1)
                }
                if (E && !M)
                  return (
                    f || (f = new mt()),
                    d || Ht(t)
                      ? Pt(t, e, n, r, i, f)
                      : (function (t, e, n, r, i, o, s) {
                          switch (n) {
                            case w:
                              if (
                                t.byteLength != e.byteLength ||
                                t.byteOffset != e.byteOffset
                              )
                                return !1
                              ;(t = t.buffer), (e = e.buffer)
                            case m:
                              return !(
                                t.byteLength != e.byteLength ||
                                !o(new Q(t), new Q(e))
                              )
                            case a:
                            case h:
                            case u:
                              return Tt(+t, +e)
                            case l:
                              return t.name == e.name && t.message == e.message
                            case g:
                            case v:
                              return t == e + ''
                            case c:
                              var f = z
                            case b:
                              var p = 1 & r
                              if ((f || (f = T), t.size != e.size && !p))
                                return !1
                              var d = s.get(t)
                              if (d) return d == e
                              ;(r |= 2), s.set(t, e)
                              var _ = Pt(f(t), f(e), r, i, o, s)
                              return s.delete(t), _
                            case y:
                              if (gt) return gt.call(t) == gt.call(e)
                          }
                          return !1
                        })(t, e, S, n, r, i, f)
                  )
                if (!(1 & n)) {
                  var C = M && H.call(t, '__wrapped__'),
                    P = x && H.call(e, '__wrapped__')
                  if (C || P) {
                    var j = C ? t.value() : t,
                      A = P ? e.value() : e
                    return f || (f = new mt()), i(j, A, n, r, f)
                  }
                }
                if (!E) return !1
                return (
                  f || (f = new mt()),
                  (function (t, e, n, r, i, o) {
                    var s = 1 & n,
                      a = jt(t),
                      h = a.length,
                      l = jt(e).length
                    if (h != l && !s) return !1
                    var f = h
                    for (; f--; ) {
                      var c = a[f]
                      if (!(s ? c in e : H.call(e, c))) return !1
                    }
                    var u = o.get(t)
                    if (u && o.get(e)) return u == e
                    var p = !0
                    o.set(t, e), o.set(e, t)
                    var d = s
                    for (; ++f < h; ) {
                      var g = t[(c = a[f])],
                        b = e[c]
                      if (r)
                        var v = s ? r(b, g, c, e, t, o) : r(g, b, c, t, e, o)
                      if (!(void 0 === v ? g === b || i(g, b, n, r, o) : v)) {
                        p = !1
                        break
                      }
                      d || (d = 'constructor' == c)
                    }
                    if (p && !d) {
                      var y = t.constructor,
                        _ = e.constructor
                      y == _ ||
                        !('constructor' in t) ||
                        !('constructor' in e) ||
                        ('function' == typeof y &&
                          y instanceof y &&
                          'function' == typeof _ &&
                          _ instanceof _) ||
                        (p = !1)
                    }
                    return o.delete(t), o.delete(e), p
                  })(t, e, n, r, i, f)
                )
              })(t, e, n, r, xt, i))
        )
      }
      function Et(t) {
        return (
          !(
            !Ut(t) ||
            (function (t) {
              return !!V && V in t
            })(t)
          ) && (Bt(t) ? K : S).test(zt(t))
        )
      }
      function Ct(t) {
        if (
          !(function (t) {
            var e = t && t.constructor,
              n = ('function' == typeof e && e.prototype) || F
            return t === n
          })(t)
        )
          return nt(t)
        var e = []
        for (var n in Object(t)) H.call(t, n) && 'constructor' != n && e.push(n)
        return e
      }
      function Pt(t, e, n, r, i, o) {
        var s = 1 & n,
          a = t.length,
          h = e.length
        if (a != h && !(s && h > a)) return !1
        var l = o.get(t)
        if (l && o.get(e)) return l == e
        var f = -1,
          c = !0,
          u = 2 & n ? new _t() : void 0
        for (o.set(t, e), o.set(e, t); ++f < a; ) {
          var p = t[f],
            d = e[f]
          if (r) var g = s ? r(d, p, f, e, t, o) : r(p, d, f, t, e, o)
          if (void 0 !== g) {
            if (g) continue
            c = !1
            break
          }
          if (u) {
            if (
              !$(e, function (t, e) {
                if (((s = e), !u.has(s) && (p === t || i(p, t, n, r, o))))
                  return u.push(e)
                var s
              })
            ) {
              c = !1
              break
            }
          } else if (p !== d && !i(p, d, n, r, o)) {
            c = !1
            break
          }
        }
        return o.delete(t), o.delete(e), c
      }
      function jt(t) {
        return (function (t, e, n) {
          var r = e(t)
          return Nt(t)
            ? r
            : (function (t, e) {
                for (var n = -1, r = e.length, i = t.length; ++n < r; )
                  t[i + n] = e[n]
                return t
              })(r, n(t))
        })(t, Vt, Dt)
      }
      function At(t, e) {
        var n = t.__data__
        return (function (t) {
          var e = typeof t
          return 'string' == e ||
            'number' == e ||
            'symbol' == e ||
            'boolean' == e
            ? '__proto__' !== t
            : null === t
        })(e)
          ? n['string' == typeof e ? 'string' : 'hash']
          : n.map
      }
      function kt(t, e) {
        var n = (function (t, e) {
          return null == t ? void 0 : t[e]
        })(t, e)
        return Et(n) ? n : void 0
      }
      ;(bt.prototype.clear = function () {
        ;(this.__data__ = ht ? ht(null) : {}), (this.size = 0)
      }),
        (bt.prototype.delete = function (t) {
          var e = this.has(t) && delete this.__data__[t]
          return (this.size -= e ? 1 : 0), e
        }),
        (bt.prototype.get = function (t) {
          var e = this.__data__
          if (ht) {
            var n = e[t]
            return n === r ? void 0 : n
          }
          return H.call(e, t) ? e[t] : void 0
        }),
        (bt.prototype.has = function (t) {
          var e = this.__data__
          return ht ? void 0 !== e[t] : H.call(e, t)
        }),
        (bt.prototype.set = function (t, e) {
          var n = this.__data__
          return (
            (this.size += this.has(t) ? 0 : 1),
            (n[t] = ht && void 0 === e ? r : e),
            this
          )
        }),
        (vt.prototype.clear = function () {
          ;(this.__data__ = []), (this.size = 0)
        }),
        (vt.prototype.delete = function (t) {
          var e = this.__data__,
            n = St(e, t)
          return (
            !(n < 0) &&
            (n == e.length - 1 ? e.pop() : Y.call(e, n, 1), --this.size, !0)
          )
        }),
        (vt.prototype.get = function (t) {
          var e = this.__data__,
            n = St(e, t)
          return n < 0 ? void 0 : e[n][1]
        }),
        (vt.prototype.has = function (t) {
          return St(this.__data__, t) > -1
        }),
        (vt.prototype.set = function (t, e) {
          var n = this.__data__,
            r = St(n, t)
          return r < 0 ? (++this.size, n.push([t, e])) : (n[r][1] = e), this
        }),
        (yt.prototype.clear = function () {
          ;(this.size = 0),
            (this.__data__ = {
              hash: new bt(),
              map: new (it || vt)(),
              string: new bt(),
            })
        }),
        (yt.prototype.delete = function (t) {
          var e = At(this, t).delete(t)
          return (this.size -= e ? 1 : 0), e
        }),
        (yt.prototype.get = function (t) {
          return At(this, t).get(t)
        }),
        (yt.prototype.has = function (t) {
          return At(this, t).has(t)
        }),
        (yt.prototype.set = function (t, e) {
          var n = At(this, t),
            r = n.size
          return n.set(t, e), (this.size += n.size == r ? 0 : 1), this
        }),
        (_t.prototype.add = _t.prototype.push =
          function (t) {
            return this.__data__.set(t, r), this
          }),
        (_t.prototype.has = function (t) {
          return this.__data__.has(t)
        }),
        (mt.prototype.clear = function () {
          ;(this.__data__ = new vt()), (this.size = 0)
        }),
        (mt.prototype.delete = function (t) {
          var e = this.__data__,
            n = e.delete(t)
          return (this.size = e.size), n
        }),
        (mt.prototype.get = function (t) {
          return this.__data__.get(t)
        }),
        (mt.prototype.has = function (t) {
          return this.__data__.has(t)
        }),
        (mt.prototype.set = function (t, e) {
          var n = this.__data__
          if (n instanceof vt) {
            var r = n.__data__
            if (!it || r.length < 199)
              return r.push([t, e]), (this.size = ++n.size), this
            n = this.__data__ = new yt(r)
          }
          return n.set(t, e), (this.size = n.size), this
        })
      var Dt = tt
          ? function (t) {
              return null == t
                ? []
                : ((t = Object(t)),
                  (function (t, e) {
                    for (
                      var n = -1, r = null == t ? 0 : t.length, i = 0, o = [];
                      ++n < r;

                    ) {
                      var s = t[n]
                      e(s, n, t) && (o[i++] = s)
                    }
                    return o
                  })(tt(t), function (e) {
                    return X.call(t, e)
                  }))
            }
          : function () {
              return []
            },
        Lt = Ot
      function $t(t, e) {
        return (
          !!(e = null == e ? i : e) &&
          ('number' == typeof t || O.test(t)) &&
          t > -1 &&
          t % 1 == 0 &&
          t < e
        )
      }
      function zt(t) {
        if (null != t) {
          try {
            return G.call(t)
          } catch (e) {}
          try {
            return t + ''
          } catch (e) {}
        }
        return ''
      }
      function Tt(t, e) {
        return t === e || (t !== t && e !== e)
      }
      ;((rt && Lt(new rt(new ArrayBuffer(1))) != w) ||
        (it && Lt(new it()) != c) ||
        (ot && Lt(ot.resolve()) != d) ||
        (st && Lt(new st()) != b) ||
        (at && Lt(new at()) != _)) &&
        (Lt = function (t) {
          var e = Ot(t),
            n = e == p ? t.constructor : void 0,
            r = n ? zt(n) : ''
          if (r)
            switch (r) {
              case lt:
                return w
              case ft:
                return c
              case ct:
                return d
              case ut:
                return b
              case pt:
                return _
            }
          return e
        })
      var It = Mt(
          (function () {
            return arguments
          })(),
        )
          ? Mt
          : function (t) {
              return Gt(t) && H.call(t, 'callee') && !X.call(t, 'callee')
            },
        Nt = Array.isArray
      var Rt =
        et ||
        function () {
          return !1
        }
      function Bt(t) {
        if (!Ut(t)) return !1
        var e = Ot(t)
        return (
          e == f ||
          '[object GeneratorFunction]' == e ||
          '[object AsyncFunction]' == e ||
          '[object Proxy]' == e
        )
      }
      function Ft(t) {
        return 'number' == typeof t && t > -1 && t % 1 == 0 && t <= i
      }
      function Ut(t) {
        var e = typeof t
        return null != t && ('object' == e || 'function' == e)
      }
      function Gt(t) {
        return null != t && 'object' == typeof t
      }
      var Ht = L
        ? (function (t) {
            return function (e) {
              return t(e)
            }
          })(L)
        : function (t) {
            return Gt(t) && Ft(t.length) && !!M[Ot(t)]
          }
      function Vt(t) {
        return null != (e = t) && Ft(e.length) && !Bt(e) ? wt(t) : Ct(t)
        var e
      }
      t.exports = function (t, e) {
        return xt(t, e)
      }
    },
    6012: function (t, e, n) {
      'use strict'
      var r = n(23586)
      function i() {}
      function o() {}
      ;(o.resetWarningCache = i),
        (t.exports = function () {
          function t(t, e, n, i, o, s) {
            if (s !== r) {
              var a = new Error(
                'Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types',
              )
              throw ((a.name = 'Invariant Violation'), a)
            }
          }
          function e() {
            return t
          }
          t.isRequired = t
          var n = {
            array: t,
            bigint: t,
            bool: t,
            func: t,
            number: t,
            object: t,
            string: t,
            symbol: t,
            any: t,
            arrayOf: e,
            element: t,
            elementType: t,
            instanceOf: e,
            node: t,
            objectOf: e,
            oneOf: e,
            oneOfType: e,
            shape: e,
            exact: e,
            checkPropTypes: o,
            resetWarningCache: i,
          }
          return (n.PropTypes = n), n
        })
    },
    13980: function (t, e, n) {
      t.exports = n(6012)()
    },
    23586: function (t) {
      'use strict'
      t.exports = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'
    },
    48709: function (t, e, n) {
      'use strict'
      var r =
          (this && this.__extends) ||
          (function () {
            var t = function (e, n) {
              return (
                (t =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (t, e) {
                      t.__proto__ = e
                    }) ||
                  function (t, e) {
                    for (var n in e)
                      Object.prototype.hasOwnProperty.call(e, n) &&
                        (t[n] = e[n])
                  }),
                t(e, n)
              )
            }
            return function (e, n) {
              if ('function' !== typeof n && null !== n)
                throw new TypeError(
                  'Class extends value ' +
                    String(n) +
                    ' is not a constructor or null',
                )
              function r() {
                this.constructor = e
              }
              t(e, n),
                (e.prototype =
                  null === n
                    ? Object.create(n)
                    : ((r.prototype = n.prototype), new r()))
            }
          })(),
        i =
          (this && this.__assign) ||
          function () {
            return (
              (i =
                Object.assign ||
                function (t) {
                  for (var e, n = 1, r = arguments.length; n < r; n++)
                    for (var i in (e = arguments[n]))
                      Object.prototype.hasOwnProperty.call(e, i) &&
                        (t[i] = e[i])
                  return t
                }),
              i.apply(this, arguments)
            )
          }
      Object.defineProperty(e, '__esModule', { value: !0 })
      var o = n(95095),
        s = n(13980),
        a = n(2784),
        h = n(33958),
        l = n(47662),
        f = (0, l.getAceInstance)(),
        c = (function (t) {
          function e(e) {
            var n = t.call(this, e) || this
            return (
              l.editorEvents.forEach(function (t) {
                n[t] = n[t].bind(n)
              }),
              (n.debounce = l.debounce),
              n
            )
          }
          return (
            r(e, t),
            (e.prototype.isInShadow = function (t) {
              for (var e = t && t.parentNode; e; ) {
                if ('[object ShadowRoot]' === e.toString()) return !0
                e = e.parentNode
              }
              return !1
            }),
            (e.prototype.componentDidMount = function () {
              var t = this,
                e = this.props,
                n = e.className,
                r = e.onBeforeLoad,
                i = e.onValidate,
                o = e.mode,
                s = e.focus,
                a = e.theme,
                h = e.fontSize,
                c = e.value,
                u = e.defaultValue,
                p = e.showGutter,
                d = e.wrapEnabled,
                g = e.showPrintMargin,
                b = e.scrollMargin,
                v = void 0 === b ? [0, 0, 0, 0] : b,
                y = e.keyboardHandler,
                _ = e.onLoad,
                m = e.commands,
                w = e.annotations,
                S = e.markers,
                O = e.placeholder
              ;(this.editor = f.edit(this.refEditor)), r && r(f)
              for (
                var M = Object.keys(this.props.editorProps), x = 0;
                x < M.length;
                x++
              )
                this.editor[M[x]] = this.props.editorProps[M[x]]
              this.props.debounceChangePeriod &&
                (this.onChange = this.debounce(
                  this.onChange,
                  this.props.debounceChangePeriod,
                )),
                this.editor.renderer.setScrollMargin(v[0], v[1], v[2], v[3]),
                this.isInShadow(this.refEditor) &&
                  this.editor.renderer.attachToShadowRoot(),
                this.editor
                  .getSession()
                  .setMode('string' === typeof o ? 'ace/mode/' + o : o),
                a && '' !== a && this.editor.setTheme('ace/theme/' + a),
                this.editor.setFontSize('number' === typeof h ? h + 'px' : h),
                this.editor.getSession().setValue(u || c || ''),
                this.props.navigateToFileEnd && this.editor.navigateFileEnd(),
                this.editor.renderer.setShowGutter(p),
                this.editor.getSession().setUseWrapMode(d),
                this.editor.setShowPrintMargin(g),
                this.editor.on('focus', this.onFocus),
                this.editor.on('blur', this.onBlur),
                this.editor.on('copy', this.onCopy),
                this.editor.on('paste', this.onPaste),
                this.editor.on('change', this.onChange),
                this.editor.on('input', this.onInput),
                O && this.updatePlaceholder(),
                this.editor
                  .getSession()
                  .selection.on('changeSelection', this.onSelectionChange),
                this.editor
                  .getSession()
                  .selection.on('changeCursor', this.onCursorChange),
                i &&
                  this.editor.getSession().on('changeAnnotation', function () {
                    var e = t.editor.getSession().getAnnotations()
                    t.props.onValidate(e)
                  }),
                this.editor.session.on('changeScrollTop', this.onScroll),
                this.editor.getSession().setAnnotations(w || []),
                S && S.length > 0 && this.handleMarkers(S)
              var E = this.editor.$options
              l.editorOptions.forEach(function (e) {
                E.hasOwnProperty(e)
                  ? t.editor.setOption(e, t.props[e])
                  : t.props[e] &&
                    console.warn(
                      'ReactAce: editor option ' +
                        e +
                        ' was activated but not found. Did you need to import a related tool or did you possibly mispell the option?',
                    )
              }),
                this.handleOptions(this.props),
                Array.isArray(m) &&
                  m.forEach(function (e) {
                    'string' === typeof e.exec
                      ? t.editor.commands.bindKey(e.bindKey, e.exec)
                      : t.editor.commands.addCommand(e)
                  }),
                y && this.editor.setKeyboardHandler('ace/keyboard/' + y),
                n && (this.refEditor.className += ' ' + n),
                _ && _(this.editor),
                this.editor.resize(),
                s && this.editor.focus()
            }),
            (e.prototype.componentDidUpdate = function (t) {
              for (
                var e = t, n = this.props, r = 0;
                r < l.editorOptions.length;
                r++
              ) {
                var i = l.editorOptions[r]
                n[i] !== e[i] && this.editor.setOption(i, n[i])
              }
              if (n.className !== e.className) {
                var o = this.refEditor.className.trim().split(' ')
                e.className
                  .trim()
                  .split(' ')
                  .forEach(function (t) {
                    var e = o.indexOf(t)
                    o.splice(e, 1)
                  }),
                  (this.refEditor.className =
                    ' ' + n.className + ' ' + o.join(' '))
              }
              if (
                this.editor &&
                null != n.value &&
                this.editor.getValue() !== n.value
              ) {
                this.silent = !0
                var s = this.editor.session.selection.toJSON()
                this.editor.setValue(n.value, n.cursorStart),
                  this.editor.session.selection.fromJSON(s),
                  (this.silent = !1)
              }
              n.placeholder !== e.placeholder && this.updatePlaceholder(),
                n.mode !== e.mode &&
                  this.editor
                    .getSession()
                    .setMode(
                      'string' === typeof n.mode
                        ? 'ace/mode/' + n.mode
                        : n.mode,
                    ),
                n.theme !== e.theme &&
                  this.editor.setTheme('ace/theme/' + n.theme),
                n.keyboardHandler !== e.keyboardHandler &&
                  (n.keyboardHandler
                    ? this.editor.setKeyboardHandler(
                        'ace/keyboard/' + n.keyboardHandler,
                      )
                    : this.editor.setKeyboardHandler(null)),
                n.fontSize !== e.fontSize &&
                  this.editor.setFontSize(
                    'number' === typeof n.fontSize
                      ? n.fontSize + 'px'
                      : n.fontSize,
                  ),
                n.wrapEnabled !== e.wrapEnabled &&
                  this.editor.getSession().setUseWrapMode(n.wrapEnabled),
                n.showPrintMargin !== e.showPrintMargin &&
                  this.editor.setShowPrintMargin(n.showPrintMargin),
                n.showGutter !== e.showGutter &&
                  this.editor.renderer.setShowGutter(n.showGutter),
                h(n.setOptions, e.setOptions) || this.handleOptions(n),
                h(n.annotations, e.annotations) ||
                  this.editor.getSession().setAnnotations(n.annotations || []),
                !h(n.markers, e.markers) &&
                  Array.isArray(n.markers) &&
                  this.handleMarkers(n.markers),
                h(n.scrollMargin, e.scrollMargin) ||
                  this.handleScrollMargins(n.scrollMargin),
                (t.height === this.props.height &&
                  t.width === this.props.width) ||
                  this.editor.resize(),
                this.props.focus && !t.focus && this.editor.focus()
            }),
            (e.prototype.handleScrollMargins = function (t) {
              void 0 === t && (t = [0, 0, 0, 0]),
                this.editor.renderer.setScrollMargin(t[0], t[1], t[2], t[3])
            }),
            (e.prototype.componentWillUnmount = function () {
              this.editor.destroy(), (this.editor = null)
            }),
            (e.prototype.onChange = function (t) {
              if (this.props.onChange && !this.silent) {
                var e = this.editor.getValue()
                this.props.onChange(e, t)
              }
            }),
            (e.prototype.onSelectionChange = function (t) {
              if (this.props.onSelectionChange) {
                var e = this.editor.getSelection()
                this.props.onSelectionChange(e, t)
              }
            }),
            (e.prototype.onCursorChange = function (t) {
              if (this.props.onCursorChange) {
                var e = this.editor.getSelection()
                this.props.onCursorChange(e, t)
              }
            }),
            (e.prototype.onInput = function (t) {
              this.props.onInput && this.props.onInput(t),
                this.props.placeholder && this.updatePlaceholder()
            }),
            (e.prototype.onFocus = function (t) {
              this.props.onFocus && this.props.onFocus(t, this.editor)
            }),
            (e.prototype.onBlur = function (t) {
              this.props.onBlur && this.props.onBlur(t, this.editor)
            }),
            (e.prototype.onCopy = function (t) {
              var e = t.text
              this.props.onCopy && this.props.onCopy(e)
            }),
            (e.prototype.onPaste = function (t) {
              var e = t.text
              this.props.onPaste && this.props.onPaste(e)
            }),
            (e.prototype.onScroll = function () {
              this.props.onScroll && this.props.onScroll(this.editor)
            }),
            (e.prototype.handleOptions = function (t) {
              for (var e = Object.keys(t.setOptions), n = 0; n < e.length; n++)
                this.editor.setOption(e[n], t.setOptions[e[n]])
            }),
            (e.prototype.handleMarkers = function (t) {
              var e = this,
                n = this.editor.getSession().getMarkers(!0)
              for (var r in n)
                n.hasOwnProperty(r) &&
                  this.editor.getSession().removeMarker(n[r].id)
              for (var r in (n = this.editor.getSession().getMarkers(!1)))
                n.hasOwnProperty(r) &&
                  'ace_active-line' !== n[r].clazz &&
                  'ace_selected-word' !== n[r].clazz &&
                  this.editor.getSession().removeMarker(n[r].id)
              t.forEach(function (t) {
                var n = t.startRow,
                  r = t.startCol,
                  i = t.endRow,
                  s = t.endCol,
                  a = t.className,
                  h = t.type,
                  l = t.inFront,
                  f = void 0 !== l && l,
                  c = new o.Range(n, r, i, s)
                e.editor.getSession().addMarker(c, a, h, f)
              })
            }),
            (e.prototype.updatePlaceholder = function () {
              var t = this.editor,
                e = this.props.placeholder,
                n = !t.session.getValue().length,
                r = t.renderer.placeholderNode
              !n && r
                ? (t.renderer.scroller.removeChild(t.renderer.placeholderNode),
                  (t.renderer.placeholderNode = null))
                : n && !r
                ? (((r = t.renderer.placeholderNode =
                    document.createElement('div')).textContent = e || ''),
                  (r.className = 'ace_comment ace_placeholder'),
                  (r.style.padding = '0 9px'),
                  (r.style.position = 'absolute'),
                  (r.style.zIndex = '3'),
                  t.renderer.scroller.appendChild(r))
                : n && r && (r.textContent = e)
            }),
            (e.prototype.updateRef = function (t) {
              this.refEditor = t
            }),
            (e.prototype.render = function () {
              var t = this.props,
                e = t.name,
                n = t.width,
                r = t.height,
                o = t.style,
                s = i({ width: n, height: r }, o)
              return a.createElement('div', {
                ref: this.updateRef,
                id: e,
                style: s,
              })
            }),
            (e.propTypes = {
              mode: s.oneOfType([s.string, s.object]),
              focus: s.bool,
              theme: s.string,
              name: s.string,
              className: s.string,
              height: s.string,
              width: s.string,
              fontSize: s.oneOfType([s.number, s.string]),
              showGutter: s.bool,
              onChange: s.func,
              onCopy: s.func,
              onPaste: s.func,
              onFocus: s.func,
              onInput: s.func,
              onBlur: s.func,
              onScroll: s.func,
              value: s.string,
              defaultValue: s.string,
              onLoad: s.func,
              onSelectionChange: s.func,
              onCursorChange: s.func,
              onBeforeLoad: s.func,
              onValidate: s.func,
              minLines: s.number,
              maxLines: s.number,
              readOnly: s.bool,
              highlightActiveLine: s.bool,
              tabSize: s.number,
              showPrintMargin: s.bool,
              cursorStart: s.number,
              debounceChangePeriod: s.number,
              editorProps: s.object,
              setOptions: s.object,
              style: s.object,
              scrollMargin: s.array,
              annotations: s.array,
              markers: s.array,
              keyboardHandler: s.string,
              wrapEnabled: s.bool,
              enableSnippets: s.bool,
              enableBasicAutocompletion: s.oneOfType([s.bool, s.array]),
              enableLiveAutocompletion: s.oneOfType([s.bool, s.array]),
              navigateToFileEnd: s.bool,
              commands: s.array,
              placeholder: s.string,
            }),
            (e.defaultProps = {
              name: 'ace-editor',
              focus: !1,
              mode: '',
              theme: '',
              height: '500px',
              width: '500px',
              fontSize: 12,
              enableSnippets: !1,
              showGutter: !0,
              onChange: null,
              onPaste: null,
              onLoad: null,
              onScroll: null,
              minLines: null,
              maxLines: null,
              readOnly: !1,
              highlightActiveLine: !0,
              showPrintMargin: !0,
              tabSize: 4,
              cursorStart: 1,
              editorProps: {},
              style: {},
              scrollMargin: [0, 0, 0, 0],
              setOptions: {},
              wrapEnabled: !1,
              enableBasicAutocompletion: !1,
              enableLiveAutocompletion: !1,
              placeholder: null,
              navigateToFileEnd: !0,
            }),
            e
          )
        })(a.Component)
      e.default = c
    },
    56546: function (t, e, n) {
      'use strict'
      var r =
        (this && this.__extends) ||
        (function () {
          var t = function (e, n) {
            return (
              (t =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (t, e) {
                    t.__proto__ = e
                  }) ||
                function (t, e) {
                  for (var n in e)
                    Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n])
                }),
              t(e, n)
            )
          }
          return function (e, n) {
            if ('function' !== typeof n && null !== n)
              throw new TypeError(
                'Class extends value ' +
                  String(n) +
                  ' is not a constructor or null',
              )
            function r() {
              this.constructor = e
            }
            t(e, n),
              (e.prototype =
                null === n
                  ? Object.create(n)
                  : ((r.prototype = n.prototype), new r()))
          }
        })()
      Object.defineProperty(e, '__esModule', { value: !0 })
      var i = n(13980),
        o = n(2784),
        s = n(82537),
        a = n(11427),
        h = (function (t) {
          function e(e) {
            var n = t.call(this, e) || this
            return (
              (n.state = { value: n.props.value }),
              (n.onChange = n.onChange.bind(n)),
              (n.diff = n.diff.bind(n)),
              n
            )
          }
          return (
            r(e, t),
            (e.prototype.componentDidUpdate = function () {
              var t = this.props.value
              t !== this.state.value && this.setState({ value: t })
            }),
            (e.prototype.onChange = function (t) {
              this.setState({ value: t }),
                this.props.onChange && this.props.onChange(t)
            }),
            (e.prototype.diff = function () {
              var t = new a(),
                e = this.state.value[0],
                n = this.state.value[1]
              if (0 === e.length && 0 === n.length) return []
              var r = t.diff_main(e, n)
              t.diff_cleanupSemantic(r)
              var i = this.generateDiffedLines(r)
              return this.setCodeMarkers(i)
            }),
            (e.prototype.generateDiffedLines = function (t) {
              var e = 0,
                n = -1,
                r = 1,
                i = { left: [], right: [] },
                o = { left: 1, right: 1 }
              return (
                t.forEach(function (t) {
                  var s = t[0],
                    a = t[1],
                    h = a.split('\n').length - 1
                  if (0 !== a.length) {
                    var l = a[0],
                      f = a[a.length - 1],
                      c = 0
                    switch (s) {
                      case e:
                        ;(o.left += h), (o.right += h)
                        break
                      case n:
                        '\n' === l && (o.left++, h--),
                          0 === (c = h) &&
                            i.right.push({
                              startLine: o.right,
                              endLine: o.right,
                            }),
                          '\n' === f && (c -= 1),
                          i.left.push({
                            startLine: o.left,
                            endLine: o.left + c,
                          }),
                          (o.left += h)
                        break
                      case r:
                        '\n' === l && (o.right++, h--),
                          0 === (c = h) &&
                            i.left.push({ startLine: o.left, endLine: o.left }),
                          '\n' === f && (c -= 1),
                          i.right.push({
                            startLine: o.right,
                            endLine: o.right + c,
                          }),
                          (o.right += h)
                        break
                      default:
                        throw new Error('Diff type was not defined.')
                    }
                  }
                }),
                i
              )
            }),
            (e.prototype.setCodeMarkers = function (t) {
              void 0 === t && (t = { left: [], right: [] })
              for (
                var e = [], n = { left: [], right: [] }, r = 0;
                r < t.left.length;
                r++
              ) {
                var i = {
                  startRow: t.left[r].startLine - 1,
                  endRow: t.left[r].endLine,
                  type: 'text',
                  className: 'codeMarker',
                }
                n.left.push(i)
              }
              for (r = 0; r < t.right.length; r++) {
                i = {
                  startRow: t.right[r].startLine - 1,
                  endRow: t.right[r].endLine,
                  type: 'text',
                  className: 'codeMarker',
                }
                n.right.push(i)
              }
              return (e[0] = n.left), (e[1] = n.right), e
            }),
            (e.prototype.render = function () {
              var t = this.diff()
              return o.createElement(s.default, {
                name: this.props.name,
                className: this.props.className,
                focus: this.props.focus,
                orientation: this.props.orientation,
                splits: this.props.splits,
                mode: this.props.mode,
                theme: this.props.theme,
                height: this.props.height,
                width: this.props.width,
                fontSize: this.props.fontSize,
                showGutter: this.props.showGutter,
                onChange: this.onChange,
                onPaste: this.props.onPaste,
                onLoad: this.props.onLoad,
                onScroll: this.props.onScroll,
                minLines: this.props.minLines,
                maxLines: this.props.maxLines,
                readOnly: this.props.readOnly,
                highlightActiveLine: this.props.highlightActiveLine,
                showPrintMargin: this.props.showPrintMargin,
                tabSize: this.props.tabSize,
                cursorStart: this.props.cursorStart,
                editorProps: this.props.editorProps,
                style: this.props.style,
                scrollMargin: this.props.scrollMargin,
                setOptions: this.props.setOptions,
                wrapEnabled: this.props.wrapEnabled,
                enableBasicAutocompletion: this.props.enableBasicAutocompletion,
                enableLiveAutocompletion: this.props.enableLiveAutocompletion,
                value: this.state.value,
                markers: t,
              })
            }),
            (e.propTypes = {
              cursorStart: i.number,
              editorProps: i.object,
              enableBasicAutocompletion: i.bool,
              enableLiveAutocompletion: i.bool,
              focus: i.bool,
              fontSize: i.number,
              height: i.string,
              highlightActiveLine: i.bool,
              maxLines: i.number,
              minLines: i.number,
              mode: i.string,
              name: i.string,
              className: i.string,
              onLoad: i.func,
              onPaste: i.func,
              onScroll: i.func,
              onChange: i.func,
              orientation: i.string,
              readOnly: i.bool,
              scrollMargin: i.array,
              setOptions: i.object,
              showGutter: i.bool,
              showPrintMargin: i.bool,
              splits: i.number,
              style: i.object,
              tabSize: i.number,
              theme: i.string,
              value: i.array,
              width: i.string,
              wrapEnabled: i.bool,
            }),
            (e.defaultProps = {
              cursorStart: 1,
              editorProps: {},
              enableBasicAutocompletion: !1,
              enableLiveAutocompletion: !1,
              focus: !1,
              fontSize: 12,
              height: '500px',
              highlightActiveLine: !0,
              maxLines: null,
              minLines: null,
              mode: '',
              name: 'ace-editor',
              onLoad: null,
              onScroll: null,
              onPaste: null,
              onChange: null,
              orientation: 'beside',
              readOnly: !1,
              scrollMargin: [0, 0, 0, 0],
              setOptions: {},
              showGutter: !0,
              showPrintMargin: !0,
              splits: 2,
              style: {},
              tabSize: 4,
              theme: 'github',
              value: ['', ''],
              width: '500px',
              wrapEnabled: !0,
            }),
            e
          )
        })(o.Component)
      e.default = h
    },
    47662: function (t, e, n) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 }),
        (e.getAceInstance =
          e.debounce =
          e.editorEvents =
          e.editorOptions =
            void 0)
      e.editorOptions = [
        'minLines',
        'maxLines',
        'readOnly',
        'highlightActiveLine',
        'tabSize',
        'enableBasicAutocompletion',
        'enableLiveAutocompletion',
        'enableSnippets',
      ]
      e.editorEvents = [
        'onChange',
        'onFocus',
        'onInput',
        'onBlur',
        'onCopy',
        'onPaste',
        'onSelectionChange',
        'onCursorChange',
        'onScroll',
        'handleOptions',
        'updateRef',
      ]
      e.getAceInstance = function () {
        var t
        return (
          'undefined' === typeof window
            ? ((n.g.window = {}), (t = n(95095)), delete n.g.window)
            : window.ace
            ? ((t = window.ace).acequire =
                window.ace.require || window.ace.acequire)
            : (t = n(95095)),
          t
        )
      }
      e.debounce = function (t, e) {
        var n = null
        return function () {
          var r = this,
            i = arguments
          clearTimeout(n),
            (n = setTimeout(function () {
              t.apply(r, i)
            }, e))
        }
      }
    },
    21291: function (t, e, n) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 }),
        (e.diff = e.split = void 0)
      var r = n(48709),
        i = n(56546)
      e.diff = i.default
      var o = n(82537)
      ;(e.split = o.default), (e.default = r.default)
    },
    82537: function (t, e, n) {
      'use strict'
      var r =
          (this && this.__extends) ||
          (function () {
            var t = function (e, n) {
              return (
                (t =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (t, e) {
                      t.__proto__ = e
                    }) ||
                  function (t, e) {
                    for (var n in e)
                      Object.prototype.hasOwnProperty.call(e, n) &&
                        (t[n] = e[n])
                  }),
                t(e, n)
              )
            }
            return function (e, n) {
              if ('function' !== typeof n && null !== n)
                throw new TypeError(
                  'Class extends value ' +
                    String(n) +
                    ' is not a constructor or null',
                )
              function r() {
                this.constructor = e
              }
              t(e, n),
                (e.prototype =
                  null === n
                    ? Object.create(n)
                    : ((r.prototype = n.prototype), new r()))
            }
          })(),
        i =
          (this && this.__assign) ||
          function () {
            return (
              (i =
                Object.assign ||
                function (t) {
                  for (var e, n = 1, r = arguments.length; n < r; n++)
                    for (var i in (e = arguments[n]))
                      Object.prototype.hasOwnProperty.call(e, i) &&
                        (t[i] = e[i])
                  return t
                }),
              i.apply(this, arguments)
            )
          }
      Object.defineProperty(e, '__esModule', { value: !0 })
      var o = n(47662),
        s = (0, o.getAceInstance)(),
        a = n(95095),
        h = n(57740),
        l = n(13980),
        f = n(2784),
        c = n(33958),
        u = n(77485),
        p = (function (t) {
          function e(e) {
            var n = t.call(this, e) || this
            return (
              o.editorEvents.forEach(function (t) {
                n[t] = n[t].bind(n)
              }),
              (n.debounce = o.debounce),
              n
            )
          }
          return (
            r(e, t),
            (e.prototype.isInShadow = function (t) {
              for (var e = t && t.parentNode; e; ) {
                if ('[object ShadowRoot]' === e.toString()) return !0
                e = e.parentNode
              }
              return !1
            }),
            (e.prototype.componentDidMount = function () {
              var t = this,
                e = this.props,
                n = e.className,
                r = e.onBeforeLoad,
                i = e.mode,
                a = e.focus,
                l = e.theme,
                f = e.fontSize,
                c = e.value,
                p = e.defaultValue,
                d = e.cursorStart,
                g = e.showGutter,
                b = e.wrapEnabled,
                v = e.showPrintMargin,
                y = e.scrollMargin,
                _ = void 0 === y ? [0, 0, 0, 0] : y,
                m = e.keyboardHandler,
                w = e.onLoad,
                S = e.commands,
                O = e.annotations,
                M = e.markers,
                x = e.splits
              ;(this.editor = s.edit(this.refEditor)),
                this.isInShadow(this.refEditor) &&
                  this.editor.renderer.attachToShadowRoot(),
                this.editor.setTheme('ace/theme/' + l),
                r && r(s)
              var E = Object.keys(this.props.editorProps),
                C = new h.Split(this.editor.container, 'ace/theme/' + l, x)
              ;(this.editor.env.split = C),
                (this.splitEditor = C.getEditor(0)),
                (this.split = C),
                this.editor.setShowPrintMargin(!1),
                this.editor.renderer.setShowGutter(!1)
              var P = this.splitEditor.$options
              this.props.debounceChangePeriod &&
                (this.onChange = this.debounce(
                  this.onChange,
                  this.props.debounceChangePeriod,
                )),
                C.forEach(function (e, n) {
                  for (var r = 0; r < E.length; r++)
                    e[E[r]] = t.props.editorProps[E[r]]
                  var a = u(p, n),
                    h = u(c, n, '')
                  e.session.setUndoManager(new s.UndoManager()),
                    e.setTheme('ace/theme/' + l),
                    e.renderer.setScrollMargin(_[0], _[1], _[2], _[3]),
                    e.getSession().setMode('ace/mode/' + i),
                    e.setFontSize(f),
                    e.renderer.setShowGutter(g),
                    e.getSession().setUseWrapMode(b),
                    e.setShowPrintMargin(v),
                    e.on('focus', t.onFocus),
                    e.on('blur', t.onBlur),
                    e.on('input', t.onInput),
                    e.on('copy', t.onCopy),
                    e.on('paste', t.onPaste),
                    e.on('change', t.onChange),
                    e
                      .getSession()
                      .selection.on('changeSelection', t.onSelectionChange),
                    e
                      .getSession()
                      .selection.on('changeCursor', t.onCursorChange),
                    e.session.on('changeScrollTop', t.onScroll),
                    e.setValue(void 0 === a ? h : a, d)
                  var y = u(O, n, []),
                    w = u(M, n, [])
                  e.getSession().setAnnotations(y),
                    w && w.length > 0 && t.handleMarkers(w, e)
                  for (r = 0; r < o.editorOptions.length; r++) {
                    var x = o.editorOptions[r]
                    P.hasOwnProperty(x)
                      ? e.setOption(x, t.props[x])
                      : t.props[x] &&
                        console.warn(
                          'ReaceAce: editor option ' +
                            x +
                            ' was activated but not found. Did you need to import a related tool or did you possibly mispell the option?',
                        )
                  }
                  t.handleOptions(t.props, e),
                    Array.isArray(S) &&
                      S.forEach(function (t) {
                        'string' === typeof t.exec
                          ? e.commands.bindKey(t.bindKey, t.exec)
                          : e.commands.addCommand(t)
                      }),
                    m && e.setKeyboardHandler('ace/keyboard/' + m)
                }),
                n && (this.refEditor.className += ' ' + n),
                a && this.splitEditor.focus()
              var j = this.editor.env.split
              j.setOrientation(
                'below' === this.props.orientation ? j.BELOW : j.BESIDE,
              ),
                j.resize(!0),
                w && w(j)
            }),
            (e.prototype.componentDidUpdate = function (t) {
              var e = this,
                n = t,
                r = this.props,
                i = this.editor.env.split
              if (
                (r.splits !== n.splits && i.setSplits(r.splits),
                r.orientation !== n.orientation &&
                  i.setOrientation(
                    'below' === r.orientation ? i.BELOW : i.BESIDE,
                  ),
                i.forEach(function (t, i) {
                  r.mode !== n.mode &&
                    t.getSession().setMode('ace/mode/' + r.mode),
                    r.keyboardHandler !== n.keyboardHandler &&
                      (r.keyboardHandler
                        ? t.setKeyboardHandler(
                            'ace/keyboard/' + r.keyboardHandler,
                          )
                        : t.setKeyboardHandler(null)),
                    r.fontSize !== n.fontSize && t.setFontSize(r.fontSize),
                    r.wrapEnabled !== n.wrapEnabled &&
                      t.getSession().setUseWrapMode(r.wrapEnabled),
                    r.showPrintMargin !== n.showPrintMargin &&
                      t.setShowPrintMargin(r.showPrintMargin),
                    r.showGutter !== n.showGutter &&
                      t.renderer.setShowGutter(r.showGutter)
                  for (var s = 0; s < o.editorOptions.length; s++) {
                    var a = o.editorOptions[s]
                    r[a] !== n[a] && t.setOption(a, r[a])
                  }
                  c(r.setOptions, n.setOptions) || e.handleOptions(r, t)
                  var h = u(r.value, i, '')
                  if (t.getValue() !== h) {
                    e.silent = !0
                    var l = t.session.selection.toJSON()
                    t.setValue(h, r.cursorStart),
                      t.session.selection.fromJSON(l),
                      (e.silent = !1)
                  }
                  var f = u(r.annotations, i, []),
                    p = u(n.annotations, i, [])
                  c(f, p) || t.getSession().setAnnotations(f)
                  var d = u(r.markers, i, []),
                    g = u(n.markers, i, [])
                  !c(d, g) && Array.isArray(d) && e.handleMarkers(d, t)
                }),
                r.className !== n.className)
              ) {
                var s = this.refEditor.className.trim().split(' ')
                n.className
                  .trim()
                  .split(' ')
                  .forEach(function (t) {
                    var e = s.indexOf(t)
                    s.splice(e, 1)
                  }),
                  (this.refEditor.className =
                    ' ' + r.className + ' ' + s.join(' '))
              }
              r.theme !== n.theme && i.setTheme('ace/theme/' + r.theme),
                r.focus && !n.focus && this.splitEditor.focus(),
                (r.height === this.props.height &&
                  r.width === this.props.width) ||
                  this.editor.resize()
            }),
            (e.prototype.componentWillUnmount = function () {
              this.editor.destroy(), (this.editor = null)
            }),
            (e.prototype.onChange = function (t) {
              if (this.props.onChange && !this.silent) {
                var e = []
                this.editor.env.split.forEach(function (t) {
                  e.push(t.getValue())
                }),
                  this.props.onChange(e, t)
              }
            }),
            (e.prototype.onSelectionChange = function (t) {
              if (this.props.onSelectionChange) {
                var e = []
                this.editor.env.split.forEach(function (t) {
                  e.push(t.getSelection())
                }),
                  this.props.onSelectionChange(e, t)
              }
            }),
            (e.prototype.onCursorChange = function (t) {
              if (this.props.onCursorChange) {
                var e = []
                this.editor.env.split.forEach(function (t) {
                  e.push(t.getSelection())
                }),
                  this.props.onCursorChange(e, t)
              }
            }),
            (e.prototype.onFocus = function (t) {
              this.props.onFocus && this.props.onFocus(t)
            }),
            (e.prototype.onInput = function (t) {
              this.props.onInput && this.props.onInput(t)
            }),
            (e.prototype.onBlur = function (t) {
              this.props.onBlur && this.props.onBlur(t)
            }),
            (e.prototype.onCopy = function (t) {
              this.props.onCopy && this.props.onCopy(t)
            }),
            (e.prototype.onPaste = function (t) {
              this.props.onPaste && this.props.onPaste(t)
            }),
            (e.prototype.onScroll = function () {
              this.props.onScroll && this.props.onScroll(this.editor)
            }),
            (e.prototype.handleOptions = function (t, e) {
              for (var n = Object.keys(t.setOptions), r = 0; r < n.length; r++)
                e.setOption(n[r], t.setOptions[n[r]])
            }),
            (e.prototype.handleMarkers = function (t, e) {
              var n = e.getSession().getMarkers(!0)
              for (var r in n)
                n.hasOwnProperty(r) && e.getSession().removeMarker(n[r].id)
              for (var r in (n = e.getSession().getMarkers(!1)))
                n.hasOwnProperty(r) && e.getSession().removeMarker(n[r].id)
              t.forEach(function (t) {
                var n = t.startRow,
                  r = t.startCol,
                  i = t.endRow,
                  o = t.endCol,
                  s = t.className,
                  h = t.type,
                  l = t.inFront,
                  f = void 0 !== l && l,
                  c = new a.Range(n, r, i, o)
                e.getSession().addMarker(c, s, h, f)
              })
            }),
            (e.prototype.updateRef = function (t) {
              this.refEditor = t
            }),
            (e.prototype.render = function () {
              var t = this.props,
                e = t.name,
                n = t.width,
                r = t.height,
                o = t.style,
                s = i({ width: n, height: r }, o)
              return f.createElement('div', {
                ref: this.updateRef,
                id: e,
                style: s,
              })
            }),
            (e.propTypes = {
              className: l.string,
              debounceChangePeriod: l.number,
              defaultValue: l.arrayOf(l.string),
              focus: l.bool,
              fontSize: l.oneOfType([l.number, l.string]),
              height: l.string,
              mode: l.string,
              name: l.string,
              onBlur: l.func,
              onChange: l.func,
              onCopy: l.func,
              onFocus: l.func,
              onInput: l.func,
              onLoad: l.func,
              onPaste: l.func,
              onScroll: l.func,
              orientation: l.string,
              showGutter: l.bool,
              splits: l.number,
              theme: l.string,
              value: l.arrayOf(l.string),
              width: l.string,
              onSelectionChange: l.func,
              onCursorChange: l.func,
              onBeforeLoad: l.func,
              minLines: l.number,
              maxLines: l.number,
              readOnly: l.bool,
              highlightActiveLine: l.bool,
              tabSize: l.number,
              showPrintMargin: l.bool,
              cursorStart: l.number,
              editorProps: l.object,
              setOptions: l.object,
              style: l.object,
              scrollMargin: l.array,
              annotations: l.array,
              markers: l.array,
              keyboardHandler: l.string,
              wrapEnabled: l.bool,
              enableBasicAutocompletion: l.oneOfType([l.bool, l.array]),
              enableLiveAutocompletion: l.oneOfType([l.bool, l.array]),
              commands: l.array,
            }),
            (e.defaultProps = {
              name: 'ace-editor',
              focus: !1,
              orientation: 'beside',
              splits: 2,
              mode: '',
              theme: '',
              height: '500px',
              width: '500px',
              value: [],
              fontSize: 12,
              showGutter: !0,
              onChange: null,
              onPaste: null,
              onLoad: null,
              onScroll: null,
              minLines: null,
              maxLines: null,
              readOnly: !1,
              highlightActiveLine: !0,
              showPrintMargin: !0,
              tabSize: 4,
              cursorStart: 1,
              editorProps: {},
              style: {},
              scrollMargin: [0, 0, 0, 0],
              setOptions: {},
              wrapEnabled: !1,
              enableBasicAutocompletion: !1,
              enableLiveAutocompletion: !1,
            }),
            e
          )
        })(f.Component)
      e.default = p
    },
  },
])
