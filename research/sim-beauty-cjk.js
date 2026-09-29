(function() {
    'use strict';
    var aa = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
        if (a == Array.prototype || a == Object.prototype) return a;
        a[b] = c.value;
        return a
    };

    function ba(a) {
        a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
        for (var b = 0; b < a.length; ++b) {
            var c = a[b];
            if (c && c.Math == Math) return c
        }
        throw Error("Cannot find global object");
    }
    var ca = ba(this);

    function da(a, b) {
        if (b) a: {
            var c = ca;a = a.split(".");
            for (var d = 0; d < a.length - 1; d++) {
                var e = a[d];
                if (!(e in c)) break a;
                c = c[e]
            }
            a = a[a.length - 1];d = c[a];b = b(d);b != d && null != b && aa(c, a, {
                configurable: !0,
                writable: !0,
                value: b
            })
        }
    }

    function ea(a) {
        function b(d) {
            return a.next(d)
        }

        function c(d) {
            return a.throw(d)
        }
        return new Promise(function(d, e) {
            function g(h) {
                h.done ? d(h.value) : Promise.resolve(h.value).then(b, c).then(g, e)
            }
            g(a.next())
        })
    }
    da("Object.entries", function(a) {
        return a ? a : function(b) {
            var c = [],
                d;
            for (d in b) Object.prototype.hasOwnProperty.call(b, d) && c.push([d, b[d]]);
            return c
        }
    });
    da("Object.values", function(a) {
        return a ? a : function(b) {
            var c = [],
                d;
            for (d in b) Object.prototype.hasOwnProperty.call(b, d) && c.push(b[d]);
            return c
        }
    });
    var fa = this || self;

    function ha(a, b) {
        a = a.split(".");
        var c = fa;
        a[0] in c || "undefined" == typeof c.execScript || c.execScript("var " + a[0]);
        for (var d; a.length && (d = a.shift());) a.length || void 0 === b ? c[d] && c[d] !== Object.prototype[d] ? c = c[d] : c = c[d] = {} : c[d] = b
    }

    function ia(a) {
        var b = typeof a;
        if ("object" == b)
            if (a) {
                if (a instanceof Array) return "array";
                if (a instanceof Object) return b;
                var c = Object.prototype.toString.call(a);
                if ("[object Window]" == c) return "object";
                if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array";
                if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function"
            } else return "null";
        else if ("function" == b && "undefined" == typeof a.call) return "object";
        return b
    }

    function ja(a) {
        var b = typeof a;
        return "object" == b && null != a || "function" == b
    }
    var la = "closure_uid_" + (1E9 * Math.random() >>> 0),
        na = 0;

    function oa(a, b, c) {
        return a.call.apply(a.bind, arguments)
    }

    function pa(a, b, c) {
        if (!a) throw Error();
        if (2 < arguments.length) {
            var d = Array.prototype.slice.call(arguments, 2);
            return function() {
                var e = Array.prototype.slice.call(arguments);
                Array.prototype.unshift.apply(e, d);
                return a.apply(b, e)
            }
        }
        return function() {
            return a.apply(b, arguments)
        }
    }

    function qa(a, b, c) {
        Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? qa = oa : qa = pa;
        return qa.apply(null, arguments)
    }

    function ra(a, b) {
        var c = Array.prototype.slice.call(arguments, 1);
        return function() {
            var d = c.slice();
            d.push.apply(d, arguments);
            return a.apply(this, d)
        }
    }
    var f = Date.now || function() {
        return +new Date
    };

    function n(a, b) {
        function c() {}
        c.prototype = b.prototype;
        a.prototype = new c;
        a.prototype.constructor = a
    };
    var sa = Array.prototype.indexOf ? function(a, b) {
            return Array.prototype.indexOf.call(a, b, void 0)
        } : function(a, b) {
            if ("string" === typeof a) return "string" !== typeof b || 1 != b.length ? -1 : a.indexOf(b, 0);
            for (var c = 0; c < a.length; c++)
                if (c in a && a[c] === b) return c;
            return -1
        },
        ta = Array.prototype.forEach ? function(a, b, c) {
            Array.prototype.forEach.call(a, b, c)
        } : function(a, b, c) {
            for (var d = a.length, e = "string" === typeof a ? a.split("") : a, g = 0; g < d; g++) g in e && b.call(c, e[g], g, a)
        },
        ua = Array.prototype.filter ? function(a, b) {
            return Array.prototype.filter.call(a,
                b, void 0)
        } : function(a, b) {
            for (var c = a.length, d = [], e = 0, g = "string" === typeof a ? a.split("") : a, h = 0; h < c; h++)
                if (h in g) {
                    var k = g[h];
                    b.call(void 0, k, h, a) && (d[e++] = k)
                } return d
        },
        va = Array.prototype.map ? function(a, b) {
            return Array.prototype.map.call(a, b, void 0)
        } : function(a, b) {
            for (var c = a.length, d = Array(c), e = "string" === typeof a ? a.split("") : a, g = 0; g < c; g++) g in e && (d[g] = b.call(void 0, e[g], g, a));
            return d
        },
        wa = Array.prototype.some ? function(a, b) {
            return Array.prototype.some.call(a, b, void 0)
        } : function(a, b) {
            for (var c = a.length,
                    d = "string" === typeof a ? a.split("") : a, e = 0; e < c; e++)
                if (e in d && b.call(void 0, d[e], e, a)) return !0;
            return !1
        },
        ya = Array.prototype.every ? function(a, b) {
            return Array.prototype.every.call(a, b, void 0)
        } : function(a, b) {
            for (var c = a.length, d = "string" === typeof a ? a.split("") : a, e = 0; e < c; e++)
                if (e in d && !b.call(void 0, d[e], e, a)) return !1;
            return !0
        };

    function za(a, b) {
        var c = 0;
        ta(a, function(d, e, g) {
            b.call(void 0, d, e, g) && ++c
        }, void 0);
        return c
    }

    function Aa(a, b) {
        b = Ba(a, b);
        return 0 > b ? null : "string" === typeof a ? a.charAt(b) : a[b]
    }

    function Ba(a, b) {
        for (var c = a.length, d = "string" === typeof a ? a.split("") : a, e = 0; e < c; e++)
            if (e in d && b.call(void 0, d[e], e, a)) return e;
        return -1
    }

    function p(a, b) {
        return 0 <= sa(a, b)
    }

    function Fa(a, b) {
        b = sa(a, b);
        0 <= b && Array.prototype.splice.call(a, b, 1)
    }

    function Ga(a, b) {
        b = Ba(a, b);
        return 0 <= b ? (Array.prototype.splice.call(a, b, 1), !0) : !1
    }

    function Ha(a) {
        return Array.prototype.concat.apply([], arguments)
    }

    function Ia(a) {
        var b = a.length;
        if (0 < b) {
            for (var c = Array(b), d = 0; d < b; d++) c[d] = a[d];
            return c
        }
        return []
    }

    function Ja(a, b) {
        for (var c = 1; c < arguments.length; c++) {
            var d = arguments[c],
                e = ia(d);
            if ("array" == e || "object" == e && "number" == typeof d.length) {
                e = a.length || 0;
                var g = d.length || 0;
                a.length = e + g;
                for (var h = 0; h < g; h++) a[e + h] = d[h]
            } else a.push(d)
        }
    }

    function Ka(a, b, c) {
        return 2 >= arguments.length ? Array.prototype.slice.call(a, b) : Array.prototype.slice.call(a, b, c)
    }

    function La(a) {
        for (var b = {}, c = 0, d = 0; d < a.length;) {
            var e = a[d++];
            var g = e;
            g = ja(g) ? "o" + (g[la] || (g[la] = ++na)) : (typeof g).charAt(0) + g;
            Object.prototype.hasOwnProperty.call(b, g) || (b[g] = !0, a[c++] = e)
        }
        a.length = c
    }

    function Ma(a, b) {
        a.sort(b || Na)
    }

    function Na(a, b) {
        return a > b ? 1 : a < b ? -1 : 0
    };

    function Oa(a, b) {
        for (const c in a) b.call(void 0, a[c], c, a)
    }

    function Pa(a, b) {
        const c = {};
        for (const d in a) b.call(void 0, a[d], d, a) && (c[d] = a[d]);
        return c
    }

    function Qa(a, b) {
        const c = {};
        for (const d in a) c[d] = b.call(void 0, a[d], d, a);
        return c
    }

    function Ra(a) {
        const b = [];
        let c = 0;
        for (const d in a) b[c++] = a[d];
        return b
    }

    function Sa(a, b) {
        for (const c in a)
            if (b.call(void 0, a[c], c, a)) return c
    };
    var Ta = {},
        Ua = null;

    function Va(a) {
        var b = 4;
        void 0 === b && (b = 0);
        Wa();
        b = Ta[b];
        for (var c = [], d = 0; d < a.length; d += 3) {
            var e = a[d],
                g = d + 1 < a.length,
                h = g ? a[d + 1] : 0,
                k = d + 2 < a.length,
                l = k ? a[d + 2] : 0,
                m = e >> 2;
            e = (e & 3) << 4 | h >> 4;
            h = (h & 15) << 2 | l >> 6;
            l &= 63;
            k || (l = 64, g || (h = 64));
            c.push(b[m], b[e], b[h] || "", b[l] || "")
        }
        return c.join("")
    }

    function Xa(a) {
        var b = [];
        Ya(a, function(c) {
            b.push(c)
        });
        return b
    }

    function Za(a) {
        var b = a.length,
            c = 3 * b / 4;
        c % 3 ? c = Math.floor(c) : -1 != "=.".indexOf(a[b - 1]) && (c = -1 != "=.".indexOf(a[b - 2]) ? c - 2 : c - 1);
        var d = new Uint8Array(c),
            e = 0;
        Ya(a, function(g) {
            d[e++] = g
        });
        return d.subarray(0, e)
    }

    function Ya(a, b) {
        function c(l) {
            for (; d < a.length;) {
                var m = a.charAt(d++),
                    q = Ua[m];
                if (null != q) return q;
                if (!/^[\s\xa0]*$/.test(m)) throw Error("Unknown base64 encoding at char: " + m);
            }
            return l
        }
        Wa();
        for (var d = 0;;) {
            var e = c(-1),
                g = c(0),
                h = c(64),
                k = c(64);
            if (64 === k && -1 === e) break;
            b(e << 2 | g >> 4);
            64 != h && (b(g << 4 & 240 | h >> 2), 64 != k && b(h << 6 & 192 | k))
        }
    }

    function Wa() {
        if (!Ua) {
            Ua = {};
            for (var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""), b = ["+/=", "+/", "-_=", "-_.", "-_"], c = 0; 5 > c; c++) {
                var d = a.concat(b[c].split(""));
                Ta[c] = d;
                for (var e = 0; e < d.length; e++) {
                    var g = d[e];
                    void 0 === Ua[g] && (Ua[g] = e)
                }
            }
        }
    };

    function $a(a) {
        this.b = null;
        this.a = this.c = this.o = 0;
        this.m = !1;
        a && ab(this, a)
    }
    var bb = [];

    function ab(a, b) {
        b = b.constructor === Uint8Array ? b : b.constructor === ArrayBuffer ? new Uint8Array(b) : "undefined" != typeof Buffer && b.constructor === Buffer ? new Uint8Array(b) : b.constructor === Array ? new Uint8Array(b) : b.constructor === String ? Za(b) : new Uint8Array(0);
        a.b = b;
        a.o = 0;
        a.c = a.b.length;
        a.a = a.o
    }
    $a.prototype.i = function() {
        var a = this.b;
        var b = a[this.a];
        var c = b & 127;
        if (128 > b) return this.a += 1, c;
        b = a[this.a + 1];
        c |= (b & 127) << 7;
        if (128 > b) return this.a += 2, c;
        b = a[this.a + 2];
        c |= (b & 127) << 14;
        if (128 > b) return this.a += 3, c;
        b = a[this.a + 3];
        c |= (b & 127) << 21;
        if (128 > b) return this.a += 4, c;
        b = a[this.a + 4];
        c |= (b & 15) << 28;
        if (128 > b) return this.a += 5, c >>> 0;
        this.a += 5;
        128 <= a[this.a++] && 128 <= a[this.a++] && 128 <= a[this.a++] && 128 <= a[this.a++] && this.a++;
        return c
    };
    $a.prototype.A = $a.prototype.i;

    function cb(a) {
        if (bb.length) {
            var b = bb.pop();
            a && ab(b, a);
            a = b
        } else a = new $a(a);
        this.b = a;
        this.a = this.c = -1;
        this.i = !1
    }

    function t(a) {
        var b = a.b;
        (b = b.a == b.c) || (b = a.i) || (b = a.b, b = b.m || 0 > b.a || b.a > b.c);
        if (b) return !1;
        b = a.b.i();
        var c = b & 7;
        if (0 != c && 5 != c && 1 != c && 2 != c && 3 != c && 4 != c) return a.i = !0, !1;
        a.c = b >>> 3;
        a.a = c;
        return !0
    }

    function u(a) {
        switch (a.a) {
            case 0:
                if (0 != a.a) u(a);
                else {
                    for (a = a.b; a.b[a.a] & 128;) a.a++;
                    a.a++
                }
                break;
            case 1:
                1 != a.a ? u(a) : (a = a.b, a.a += 8);
                break;
            case 2:
                if (2 != a.a) u(a);
                else {
                    var b = a.b.i();
                    a = a.b;
                    a.a += b
                }
                break;
            case 5:
                5 != a.a ? u(a) : (a = a.b, a.a += 4);
                break;
            case 3:
                b = a.c;
                do {
                    if (!t(a)) {
                        a.i = !0;
                        break
                    }
                    if (4 == a.a) {
                        a.c != b && (a.i = !0);
                        break
                    }
                    u(a)
                } while (1)
        }
    }

    function w(a, b, c) {
        var d = a.b.c,
            e = a.b.i();
        e = a.b.a + e;
        a.b.c = e;
        c(b, a);
        a.b.a = e;
        a.b.c = d
    }

    function db(a) {
        return a.b.A()
    }

    function x(a) {
        var b = a.b.i();
        a = a.b;
        var c = a.b,
            d = a.a,
            e = d + b,
            g = [];
        for (b = ""; d < e;) {
            var h = c[d++];
            if (128 > h) g.push(h);
            else if (192 > h) continue;
            else if (224 > h) {
                var k = c[d++];
                g.push((h & 31) << 6 | k & 63)
            } else if (240 > h) {
                k = c[d++];
                var l = c[d++];
                g.push((h & 15) << 12 | (k & 63) << 6 | l & 63)
            } else if (248 > h) {
                k = c[d++];
                l = c[d++];
                var m = c[d++];
                h = (h & 7) << 18 | (k & 63) << 12 | (l & 63) << 6 | m & 63;
                h -= 65536;
                g.push((h >> 10 & 1023) + 55296, (h & 1023) + 56320)
            }
            8192 <= g.length && (b += String.fromCharCode.apply(null, g), g.length = 0)
        }
        if (8192 >= g.length) g = String.fromCharCode.apply(null,
            g);
        else {
            c = "";
            for (e = 0; e < g.length; e += 8192) c += String.fromCharCode.apply(null, Ka(g, e, e + 8192));
            g = c
        }
        a.a = d;
        return b + g
    };

    function eb() {
        this.a = []
    }
    eb.prototype.length = function() {
        return this.a.length
    };

    function fb(a) {
        var b = a.a;
        a.a = [];
        return b
    }

    function gb(a, b) {
        for (; 127 < b;) a.a.push(b & 127 | 128), b >>>= 7;
        a.a.push(b)
    }

    function hb(a, b) {
        if (0 <= b) gb(a, b);
        else {
            for (var c = 0; 9 > c; c++) a.a.push(b & 127 | 128), b >>= 7;
            a.a.push(1)
        }
    };

    function z() {
        this.c = [];
        this.b = 0;
        this.a = new eb
    }

    function ib(a, b) {
        gb(a.a, 8 * b + 2);
        b = fb(a.a);
        a.c.push(b);
        a.b += b.length;
        b.push(a.b);
        return b
    }

    function jb(a, b) {
        var c = b.pop();
        for (c = a.b + a.a.length() - c; 127 < c;) b.push(c & 127 | 128), c >>>= 7, a.b++;
        b.push(c);
        a.b++
    }

    function A(a) {
        for (var b = new Uint8Array(a.b + a.a.length()), c = a.c, d = c.length, e = 0, g = 0; g < d; g++) {
            var h = c[g];
            b.set(h, e);
            e += h.length
        }
        c = fb(a.a);
        b.set(c, e);
        a.c = [b];
        return b
    }

    function kb(a, b, c) {
        null != c && null != c && (gb(a.a, 8 * b), hb(a.a, c))
    }

    function B(a, b, c) {
        if (null != c) {
            b = ib(a, b);
            for (var d = a.a, e = 0; e < c.length; e++) {
                var g = c.charCodeAt(e);
                if (128 > g) d.a.push(g);
                else if (2048 > g) d.a.push(g >> 6 | 192), d.a.push(g & 63 | 128);
                else if (65536 > g)
                    if (55296 <= g && 56319 >= g && e + 1 < c.length) {
                        var h = c.charCodeAt(e + 1);
                        56320 <= h && 57343 >= h && (g = 1024 * (g - 55296) + h - 56320 + 65536, d.a.push(g >> 18 | 240), d.a.push(g >> 12 & 63 | 128), d.a.push(g >> 6 & 63 | 128), d.a.push(g & 63 | 128), e++)
                    } else d.a.push(g >> 12 | 224), d.a.push(g >> 6 & 63 | 128), d.a.push(g & 63 | 128)
            }
            jb(a, b)
        }
    }

    function D(a, b, c, d) {
        null != c && (b = ib(a, b), d(c, a), jb(a, b))
    }

    function lb(a, b, c, d) {
        if (null != c)
            for (var e = 0; e < c.length; e++) {
                var g = ib(a, b);
                d(c[e], a);
                jb(a, g)
            }
    };

    function E() {}
    var mb = "function" == typeof Uint8Array;

    function F(a, b, c, d) {
        a.a = null;
        b || (b = []);
        a.o = void 0;
        a.c = -1;
        a.J = b;
        a: {
            if (b = a.J.length) {
                --b;
                var e = a.J[b];
                if (!(null === e || "object" != typeof e || Array.isArray(e) || mb && e instanceof Uint8Array)) {
                    a.i = b - a.c;
                    a.b = e;
                    break a
                }
            }
            a.i = Number.MAX_VALUE
        }
        a.m = {};
        if (c)
            for (b = 0; b < c.length; b++) e = c[b], e < a.i ? (e += a.c, a.J[e] = a.J[e] || nb) : (ob(a), a.b[e] = a.b[e] || nb);
        if (d && d.length)
            for (b = 0; b < d.length; b++) pb(a, d[b])
    }
    var nb = [];

    function ob(a) {
        var b = a.i + a.c;
        a.J[b] || (a.b = a.J[b] = {})
    }

    function G(a, b) {
        if (b < a.i) {
            b += a.c;
            var c = a.J[b];
            return c === nb ? a.J[b] = [] : c
        }
        if (a.b) return c = a.b[b], c === nb ? a.b[b] = [] : c
    }

    function H(a, b, c) {
        a = G(a, b);
        return null == a ? c : a
    }

    function qb(a, b, c) {
        b < a.i ? a.J[b + a.c] = c : (ob(a), a.b[b] = c)
    }

    function I(a, b, c) {
        rb(a, b, c, 0)
    }

    function J(a, b, c) {
        return rb(a, b, c, "")
    }

    function rb(a, b, c, d) {
        c !== d ? qb(a, b, c) : b < a.i ? a.J[b + a.c] = null : (ob(a), delete a.b[b]);
        return a
    }

    function sb(a, b, c, d) {
        (c = pb(a, c)) && c !== b && void 0 !== d && (a.a && c in a.a && (a.a[c] = void 0), qb(a, c, void 0));
        qb(a, b, d)
    }

    function pb(a, b) {
        for (var c, d, e = 0; e < b.length; e++) {
            var g = b[e],
                h = G(a, g);
            null != h && (c = g, d = h, qb(a, g, void 0))
        }
        return c ? (qb(a, c, d), c) : 0
    }

    function K(a, b, c) {
        a.a || (a.a = {});
        if (!a.a[c]) {
            var d = G(a, c);
            d && (a.a[c] = new b(d))
        }
        return a.a[c]
    }

    function M(a, b, c) {
        tb(a, b, c);
        b = a.a[c];
        b == nb && (b = a.a[c] = []);
        return b
    }

    function tb(a, b, c) {
        a.a || (a.a = {});
        if (!a.a[c]) {
            for (var d = G(a, c), e = [], g = 0; g < d.length; g++) e[g] = new b(d[g]);
            a.a[c] = e
        }
    }

    function N(a, b, c) {
        a.a || (a.a = {});
        var d = c ? c.J : c;
        a.a[b] = c;
        qb(a, b, d)
    }

    function ub(a, b, c) {
        a.a || (a.a = {});
        c = c || [];
        for (var d = [], e = 0; e < c.length; e++) d[e] = c[e].J;
        a.a[b] = c;
        qb(a, b, d)
    }

    function vb(a, b, c, d, e) {
        tb(a, d, b);
        var g = a.a[b];
        g || (g = a.a[b] = []);
        c = c ? c : new d;
        a = G(a, b);
        void 0 != e ? (g.splice(e, 0, c), a.splice(e, 0, c.J)) : (g.push(c), a.push(c.J));
        return c
    }
    E.prototype.toString = function() {
        return this.J.toString()
    };

    function O(a) {
        F(this, a, null, null)
    }
    n(O, E);

    function P(a) {
        F(this, a, null, null)
    }
    n(P, E);

    function R(a) {
        F(this, a, wb, null)
    }
    n(R, E);

    function xb(a) {
        F(this, a, yb, null)
    }
    n(xb, E);

    function zb(a) {
        F(this, a, Ab, Bb)
    }
    n(zb, E);

    function Cb(a) {
        F(this, a, null, null)
    }
    n(Cb, E);

    function Db(a) {
        F(this, a, null, null)
    }
    n(Db, E);

    function Eb(a) {
        F(this, a, Fb, null)
    }
    n(Eb, E);

    function S(a) {
        F(this, a, Gb, null)
    }
    n(S, E);

    function Hb(a) {
        F(this, a, null, null)
    }
    n(Hb, E);

    function Ib(a) {
        F(this, a, null, null)
    }
    n(Ib, E);

    function Jb(a, b) {
        for (; t(b) && 4 != b.a;) switch (b.c) {
            case 1:
                var c = x(b);
                J(a, 1, c);
                break;
            case 2:
                c = db(b);
                I(a, 2, c);
                break;
            default:
                u(b)
        }
        return a
    }
    O.prototype.G = function() {
        var a = new z;
        Kb(this, a);
        return A(a)
    };

    function Kb(a, b) {
        var c = Lb(a);
        0 < c.length && B(b, 1, c);
        c = Mb(a);
        0 !== c && kb(b, 2, c)
    }

    function Lb(a) {
        return H(a, 1, "")
    }

    function Mb(a) {
        return H(a, 2, 0)
    }

    function Nb(a, b) {
        for (; t(b) && 4 != b.a;) switch (b.c) {
            case 1:
                var c = db(b);
                I(a, 1, c);
                break;
            case 2:
                c = db(b);
                I(a, 2, c);
                break;
            case 3:
                c = db(b);
                I(a, 3, c);
                break;
            default:
                u(b)
        }
        return a
    }
    P.prototype.G = function() {
        var a = new z;
        Ob(this, a);
        return A(a)
    };

    function Ob(a, b) {
        var c = H(a, 1, 0);
        0 !== c && kb(b, 1, c);
        c = H(a, 2, 0);
        0 !== c && kb(b, 2, c);
        c = H(a, 3, 0);
        0 !== c && kb(b, 3, c)
    }
    var wb = [1];

    function Pb(a, b) {
        for (; t(b) && 4 != b.a;) switch (b.c) {
            case 1:
                var c = new O;
                w(b, c, Jb);
                Qb(a, c);
                break;
            case 2:
                c = db(b);
                I(a, 2, c);
                break;
            case 3:
                c = new P;
                w(b, c, Nb);
                N(a, 3, c);
                break;
            case 4:
                c = new P;
                w(b, c, Nb);
                N(a, 4, c);
                break;
            default:
                u(b)
        }
        return a
    }
    R.prototype.G = function() {
        var a = new z;
        Rb(this, a);
        return A(a)
    };

    function Rb(a, b) {
        var c = M(a, O, 1);
        0 < c.length && lb(b, 1, c, Kb);
        c = H(a, 2, 0);
        0 !== c && kb(b, 2, c);
        c = K(a, P, 3);
        null != c && D(b, 3, c, Ob);
        c = K(a, P, 4);
        null != c && D(b, 4, c, Ob)
    }

    function Qb(a, b) {
        return vb(a, 1, b, O, void 0)
    }
    var yb = [8];

    function Sb(a, b) {
        for (; t(b) && 4 != b.a;) switch (b.c) {
            case 1:
                var c = db(b);
                I(a, 1, c);
                break;
            case 2:
                c = db(b);
                I(a, 2, c);
                break;
            case 3:
                c = db(b);
                I(a, 3, c);
                break;
            case 4:
                c = db(b);
                I(a, 4, c);
                break;
            case 5:
                c = db(b);
                I(a, 5, c);
                break;
            case 6:
                c = db(b);
                I(a, 6, c);
                break;
            case 7:
                c = new P;
                w(b, c, Nb);
                N(a, 7, c);
                break;
            case 8:
                c = new O;
                w(b, c, Jb);
                vb(a, 8, c, O, void 0);
                break;
            default:
                u(b)
        }
        return a
    }
    xb.prototype.G = function() {
        var a = new z;
        Tb(this, a);
        return A(a)
    };

    function Tb(a, b) {
        var c = H(a, 1, 0);
        0 !== c && kb(b, 1, c);
        c = H(a, 2, 0);
        0 !== c && kb(b, 2, c);
        c = H(a, 3, 0);
        0 !== c && kb(b, 3, c);
        c = H(a, 4, 0);
        0 !== c && kb(b, 4, c);
        c = H(a, 5, 0);
        0 !== c && kb(b, 5, c);
        c = H(a, 6, 0);
        0 !== c && kb(b, 6, c);
        c = K(a, P, 7);
        null != c && D(b, 7, c, Ob);
        c = M(a, O, 8);
        0 < c.length && lb(b, 8, c, Kb)
    }
    var Ab = [16, 9, 10],
        Bb = [
            [6, 7]
        ];

    function Ub(a, b) {
        for (; t(b) && 4 != b.a;) switch (b.c) {
            case 1:
                var c = x(b);
                Vb(a, c);
                break;
            case 11:
                c = new xb;
                w(b, c, Sb);
                N(a, 11, c);
                break;
            case 2:
                c = x(b);
                Wb(a, c);
                break;
            case 12:
                c = new xb;
                w(b, c, Sb);
                N(a, 12, c);
                break;
            case 3:
                c = x(b);
                Xb(a, c);
                break;
            case 13:
                c = new xb;
                w(b, c, Sb);
                N(a, 13, c);
                break;
            case 4:
                c = x(b);
                Yb(a, c);
                break;
            case 14:
                c = new xb;
                w(b, c, Sb);
                N(a, 14, c);
                break;
            case 5:
                c = x(b);
                Zb(a, c);
                break;
            case 15:
                c = new xb;
                w(b, c, Sb);
                N(a, 15, c);
                break;
            case 6:
                c = x(b);
                $b(a, c);
                break;
            case 7:
                c = new R;
                w(b, c, Pb);
                ac(a, c);
                break;
            case 8:
                c = x(b);
                bc(a, c);
                break;
            case 16:
                c = new O;
                w(b, c, Jb);
                vb(a, 16, c, O, void 0);
                break;
            case 9:
                c = new Cb;
                w(b, c, cc);
                vb(a, 9, c, Cb, void 0);
                break;
            case 10:
                c = new Cb;
                w(b, c, cc);
                vb(a, 10, c, Cb, void 0);
                break;
            default:
                u(b)
        }
        return a
    }
    zb.prototype.G = function() {
        var a = new z;
        dc(this, a);
        return A(a)
    };

    function dc(a, b) {
        var c = H(a, 1, "");
        0 < c.length && B(b, 1, c);
        c = K(a, xb, 11);
        null != c && D(b, 11, c, Tb);
        c = H(a, 2, "");
        0 < c.length && B(b, 2, c);
        c = K(a, xb, 12);
        null != c && D(b, 12, c, Tb);
        c = H(a, 3, "");
        0 < c.length && B(b, 3, c);
        c = K(a, xb, 13);
        null != c && D(b, 13, c, Tb);
        c = H(a, 4, "");
        0 < c.length && B(b, 4, c);
        c = K(a, xb, 14);
        null != c && D(b, 14, c, Tb);
        c = H(a, 5, "");
        0 < c.length && B(b, 5, c);
        c = K(a, xb, 15);
        null != c && D(b, 15, c, Tb);
        c = G(a, 6);
        null != c && B(b, 6, c);
        c = K(a, R, 7);
        null != c && D(b, 7, c, Rb);
        c = H(a, 8, "");
        0 < c.length && B(b, 8, c);
        c = M(a, O, 16);
        0 < c.length && lb(b, 16, c, Kb);
        c = M(a, Cb, 9);
        0 < c.length && lb(b, 9, c, ec);
        c = M(a, Cb, 10);
        0 < c.length && lb(b, 10, c, ec)
    }

    function cc(a, b) {
        for (; t(b) && 4 != b.a;) switch (b.c) {
            case 1:
                var c = x(b);
                J(a, 1, c);
                break;
            case 2:
                c = db(b);
                I(a, 2, c);
                break;
            default:
                u(b)
        }
        return a
    }
    Cb.prototype.G = function() {
        var a = new z;
        ec(this, a);
        return A(a)
    };

    function ec(a, b) {
        var c = H(a, 1, "");
        0 < c.length && B(b, 1, c);
        c = H(a, 2, 0);
        0 !== c && kb(b, 2, c)
    }

    function Vb(a, b) {
        J(a, 1, b)
    }

    function Wb(a, b) {
        J(a, 2, b)
    }

    function Xb(a, b) {
        J(a, 3, b)
    }

    function Yb(a, b) {
        J(a, 4, b)
    }

    function Zb(a, b) {
        J(a, 5, b)
    }

    function $b(a, b) {
        sb(a, 6, Bb[0], b)
    }

    function ac(a, b) {
        var c = Bb[0];
        a.a || (a.a = {});
        var d = b ? b.J : b;
        a.a[7] = b;
        sb(a, 7, c, d)
    }

    function bc(a, b) {
        J(a, 8, b)
    }

    function fc(a, b) {
        ub(a, 9, b)
    }

    function gc(a, b) {
        ub(a, 10, b)
    }

    function hc(a, b) {
        for (; t(b) && 4 != b.a;) switch (b.c) {
            case 1:
                var c = x(b);
                J(a, 1, c);
                break;
            case 2:
                c = x(b);
                J(a, 2, c);
                break;
            case 3:
                c = new zb;
                w(b, c, Ub);
                N(a, 3, c);
                break;
            default:
                u(b)
        }
        return a
    }
    Db.prototype.G = function() {
        var a = new z;
        ic(this, a);
        return A(a)
    };

    function ic(a, b) {
        var c = H(a, 1, "");
        0 < c.length && B(b, 1, c);
        c = H(a, 2, "");
        0 < c.length && B(b, 2, c);
        c = K(a, zb, 3);
        null != c && D(b, 3, c, dc)
    }
    var Fb = [1];

    function jc(a) {
        a = new cb(a);
        for (var b = new Eb; t(a) && 4 != a.a;) switch (a.c) {
            case 1:
                var c = new Db;
                w(a, c, hc);
                vb(b, 1, c, Db, void 0);
                break;
            default:
                u(a)
        }
        return b
    }
    Eb.prototype.G = function() {
        var a = new z;
        var b = M(this, Db, 1);
        0 < b.length && lb(a, 1, b, ic);
        return A(a)
    };
    var Gb = [2];

    function kc(a, b) {
        for (; t(b) && 4 != b.a;) switch (b.c) {
            case 1:
                var c = x(b);
                J(a, 1, c);
                break;
            case 2:
                c = x(b);
                G(a, 2).push(c);
                break;
            default:
                u(b)
        }
        return a
    }
    S.prototype.G = function() {
        var a = new z;
        lc(this, a);
        return A(a)
    };

    function lc(a, b) {
        var c = H(a, 1, "");
        0 < c.length && B(b, 1, c);
        c = G(a, 2);
        if (0 < c.length && (a = c, null != a))
            for (c = 0; c < a.length; c++) B(b, 2, a[c])
    }

    function mc(a, b) {
        for (; t(b) && 4 != b.a;) switch (b.c) {
            case 1:
                var c = new S;
                w(b, c, kc);
                N(a, 1, c);
                break;
            case 2:
                c = new S;
                w(b, c, kc);
                N(a, 2, c);
                break;
            case 3:
                c = new S;
                w(b, c, kc);
                N(a, 3, c);
                break;
            case 4:
                c = new S;
                w(b, c, kc);
                N(a, 4, c);
                break;
            case 5:
                c = new S;
                w(b, c, kc);
                N(a, 5, c);
                break;
            case 6:
                c = new S;
                w(b, c, kc);
                N(a, 6, c);
                break;
            default:
                u(b)
        }
        return a
    }
    Hb.prototype.G = function() {
        var a = new z;
        nc(this, a);
        return A(a)
    };

    function nc(a, b) {
        var c = K(a, S, 1);
        null != c && D(b, 1, c, lc);
        c = K(a, S, 2);
        null != c && D(b, 2, c, lc);
        c = K(a, S, 3);
        null != c && D(b, 3, c, lc);
        c = K(a, S, 4);
        null != c && D(b, 4, c, lc);
        c = K(a, S, 5);
        null != c && D(b, 5, c, lc);
        c = K(a, S, 6);
        null != c && D(b, 6, c, lc)
    }

    function oc(a) {
        a = new cb(a);
        for (var b = new Ib; t(a) && 4 != a.a;) switch (a.c) {
            case 1:
                var c;
                for (var d = a.b, e = 128, g = 0, h = c = 0; 4 > h && 128 <= e; h++) e = d.b[d.a++], g |= (e & 127) << 7 * h;
                128 <= e && (e = d.b[d.a++], g |= (e & 127) << 28, c |= (e & 127) >> 4);
                if (128 <= e)
                    for (h = 0; 5 > h && 128 <= e; h++) e = d.b[d.a++], c |= (e & 127) << 7 * h + 3;
                if (128 > e) {
                    d = g >>> 0;
                    e = c >>> 0;
                    if (c = e & 2147483648) d = ~d + 1 >>> 0, e = ~e >>> 0, 0 == d && (e = e + 1 >>> 0);
                    d = 4294967296 * e + (d >>> 0);
                    c = c ? -d : d
                } else d.m = !0, c = void 0;
                rb(b, 1, c, 0);
                break;
            case 2:
                c = new Hb;
                w(a, c, mc);
                N(b, 2, c);
                break;
            default:
                u(a)
        }
        return b
    }
    Ib.prototype.G = function() {
        var a = new z;
        var b = H(this, 1, 0);
        0 !== b && null != b && (gb(a.a, 8), hb(a.a, b));
        b = K(this, Hb, 2);
        null != b && D(a, 2, b, nc);
        return A(a)
    };
    Ib.prototype.Ja = function() {
        return null != G(this, 2)
    };
    var pc = {
        Vb: 0,
        Tb: 1,
        Sb: 2,
        Xb: 3,
        Wb: 4,
        Ub: 5,
        Yb: 6
    };

    function qc(a) {
        F(this, a, rc, null)
    }
    n(qc, E);

    function sc(a) {
        F(this, a, null, null)
    }
    n(sc, E);

    function tc(a) {
        F(this, a, uc, null)
    }
    n(tc, E);
    var rc = [1];
    qc.prototype.G = function() {
        var a = new z;
        var b = M(this, sc, 1);
        0 < b.length && lb(a, 1, b, vc);
        return A(a)
    };

    function wc(a, b) {
        for (; t(b) && 4 != b.a;) switch (b.c) {
            case 1:
                var c = x(b);
                J(a, 1, c);
                break;
            case 2:
                c = db(b);
                I(a, 2, c);
                break;
            default:
                u(b)
        }
        return a
    }
    sc.prototype.G = function() {
        var a = new z;
        vc(this, a);
        return A(a)
    };

    function vc(a, b) {
        var c = H(a, 1, "");
        0 < c.length && B(b, 1, c);
        c = H(a, 2, 0);
        0 !== c && kb(b, 2, c)
    }
    var uc = [1];
    tc.prototype.G = function() {
        var a = new z;
        var b = M(this, R, 1);
        0 < b.length && lb(a, 1, b, Rb);
        return A(a)
    };

    function xc(a, b) {
        ub(a, 1, b)
    };

    function yc(a, b) {
        var c = void 0 === b ? 0 : a;
        a = void 0 === b ? a : b;
        for (b = []; c < a; c += 1) b.push(c);
        return b
    }

    function zc(a, b) {
        const c = arguments;
        return a.replace(/\{(\d+)\}/g, (d, e) => c[parseInt(e, 10) + 1])
    }

    function Ac(a, b) {
        let c = "skills=" + encodeURIComponent(a.join(","));
        Oa(b, (d, e) => {
            c += "&" + e + "=" + encodeURIComponent(d)
        });
        document.location.hash = c
    }

    function Bc(a, b) {
        for (const c in b) a[c] = b[c];
        return a
    }

    function Cc(a, b) {
        return a.a.hasOwnProperty(b) ? a.a[b] : ""
    }

    function T(a, b, c) {
        return a.a.hasOwnProperty(b) ? parseInt(a.a[b], 10) : c
    }
    var Dc = class {
        constructor(a) {
            this.a = a
        }
    };

    function U(...a) {
        const b = {};
        for (const c of a)
            for (const d in c) b[d] = c[d];
        return Object.entries(b).map(([c, d]) => c + ":" + d + ";").join("")
    };
    var Ec, Fc, Gc;
    Gc = [];
    Fc = /LV(\d(?:-\d)?(?:-\d)?)插槽(.+)/;
    Ec = "头 身 腕 腰 脚 护石".split(" ");
    var Hc = null,
        Ic = null;

    function Jc(a, b, c) {
        return c.j == b && c.a[0] == a[0] && c.a[1] == a[1] && c.a[2] == a[2]
    }

    function Kc(a, b, c) {
        return c.j == a && c.type == b && !!Sa(c.f, function(d, e) {
            return p(Gc, e)
        })
    }

    function Lc(a) {
        a = va(a, function(b) {
            return b.A
        });
        return Math.max.apply(Math, a)
    }

    function Mc(a) {
        return va(a, (b, c) => b ? Nc(b, c) : null)
    }

    function Nc(a, b) {
        if (!a) return null;
        var c = null;
        const d = Qc(a, b);
        if (!d) {
            var e = Ec[b],
                g = a.match(void 0);
            if (g && g[3] == e) {
                const h = void 0 == g[1] ? 2 : 1,
                    k = Number(g[2]);
                g = Hc.filter(l => l.j == b && l.b == k && !!(l.type & h)).map(Rc);
                c = Lc(g);
                c = new Sc(b, h, k, null, c, g)
            } else if ((g = a.match(void 0)) && g[3] == e) {
                const h = void 0 == g[1] ? 2 : 1;
                c = Hc.filter(k => Kc(b, h, k)).map(Rc);
                c = Lc(c);
                c = new Tc(g[2], b, h, c)
            } else if ((g = a.match(Fc)) && g[2] == e) {
                const h = g[1].split("-").map(k => parseInt(k, 10));
                for (g = h.length; 3 > h.length;) h.push(0);
                c = Hc.filter(k => Jc(h,
                    b, k)).map(Rc);
                e = Lc(c);
                c = new Sc(b, 3, g, h, e, c)
            }
        }
        c || (c = d ? Rc(d) : new Uc(a, b, 0, Hc[0].a ? [0, 0, 0] : null, {}, 1, [0, 0, 0, 0, 0]));
        return c
    }

    function Vc(a, b) {
        let c = [b];
        for (const d of b)
            if (d instanceof a) {
                b = [];
                for (const e of d.H) Ja(b, c.map(g => {
                    g = Ia(g);
                    g[e.j] = e;
                    return g
                }));
                c = b
            } return c
    }
    var Wc = class {
        constructor(a, b, c, d, e, g, h, k, l, m, q, v, y, r) {
            this.name = a;
            this.O = b;
            this.type = c;
            this.j = d;
            this.A = e;
            this.C = g;
            this.D = h;
            this.o = k;
            this.I = l;
            this.b = m;
            this.a = q;
            this.c = null;
            this.f = v;
            this.i = y;
            this.m = r
        }
    };

    function Qc(a, b) {
        return Aa(Hc, ra(function(c, d, e) {
            return e.j == d && e.name == c
        }, a, b))
    }

    function Rc(a) {
        return new Uc(a.name, a.j, a.b, a.a, a.f, a.i, a.m, a.c)
    }

    function Xc(a) {
        return a.a && 3 == a.a.length ? a.a.join("-") : a.m.toString()
    }

    function Yc(a) {
        return "head body arm waist legs charm".split(" ")[a.j]
    }
    var Uc = class {
            constructor(a, b, c, d, e, g, h = [0, 0, 0, 0, 0], k = null) {
                this.name = a;
                this.j = b;
                this.m = c;
                this.a = d;
                this.b = k;
                this.f = e;
                this.A = g || 0;
                this.D = h;
                this.o = !!Sa(e, function(l, m) {
                    return p(Gc, m)
                });
                this.i = 0;
                this.H = null;
                this.I = this.S = 0;
                this.C = this.c = null
            }
        },
        Zc = !0,
        ad = class extends Uc {
            constructor(a, b, c = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                99: 0
            }) {
                let d = a.name;
                const e = a.b,
                    g = a.a,
                    h = a.f;
                Zc && 5 == a.j && (d = $c(h, e, g));
                super(d, a.j, e, g, h, a.i, a.m, a.c);
                this.i = b;
                this.c = c
            }
        };

    function $c(a, b, c = null, d) {
        let e = "";
        Oa(a, function(g, h) {
            e += h + ":" + g + " "
        });
        if (d) a = c.filter(g => 0 < g), d = d.filter(g => 0 < g).map(g => g + "������️"), d = a.concat(d), d.length && (e += "LV" + d.join("-"));
        else if (c) {
            if (c[0] || c[1] || c[2]) e += "LV" + c.join("-")
        } else 0 < b && (e += zc(void 0, b));
        return e
    }

    function bd(a, b, c) {
        return a.m != b.m || a.j != b.j ? !1 : ya(c, function(d) {
            return a.f[d] == b.f[d]
        })
    }

    function cd(a, b) {
        const c = [];
        for (var d; d = a.shift();) {
            const e = [];
            for (let g = 0; g < a.length && a[g].i == d.i; g++) bd(d, a[g], b) && e.push(a[g]);
            if (0 < e.length) {
                for (const g of e) Fa(a, g);
                e.push(d);
                d = new dd(e, b);
                c.push(d)
            } else c.push(d)
        }
        return c
    }
    var dd = class extends Uc {
        constructor(a, b) {
            const c = a[0],
                d = Pa(c.f, (g, h) => p(b, h)),
                e = Math.max.apply(Math, va(a, g => g.A));
            super("", c.j, c.m, c.a, d, e);
            this.i = c.i;
            this.H = a
        }
    };

    function ed(a) {
        return a.some(b => !!b) ? "LV" + ua(a, b => 0 < b).join("-") : "无"
    }
    var fd = class extends Uc {
            constructor(a, b) {
                const c = b ? ed(b) : a;
                super(zc("武器插槽{0}", a ? c : "无"), 6, a, b || null, {}, 0)
            }
        },
        Tc = class extends Uc {
            constructor(a, b, c, d, e) {
                a: {
                    switch (c) {
                        case 2:
                            break;
                        case 1:
                            c = "";
                            break a;
                        default:
                            c = "";
                            break a
                    }
                    c = void 0
                }
                super(zc(void 0, c, a, Ec[b]), b, 0, null, [], d);this.o = !0;this.C = a;this.H = e || null
            }
        },
        Sc = class extends Uc {
            constructor(a, b, c, d, e, g) {
                b = d ? ed(d) : c.toString();
                b = zc("{0}{1}插槽{2}", "", b, Ec[a]);
                super(b, a, c, d, [], e);
                this.i = c;
                this.c = null;
                if (d) {
                    this.c = {
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        99: 0
                    };
                    for (const h of d) this.c[h]++
                }
                this.C = "スロット別装備" + "頭 胴 腕 腰 足 護石".split(" ")[a];
                this.H = g || null
            }
        };

    function gd(a) {
        return Aa(Ic, function(b) {
            return b.name == a
        }) || Ic[0]
    }

    function hd(a) {
        let b = 0;
        for (const c of a)
            if (c) {
                const d = c.o ? a[1] : c;
                d && (b += d.m)
            } return b
    }

    function id(a, b, c) {
        if (b.m > c.m || b.j != c.j || b.a && c.a && (b.a[0] > c.a[0] || b.a[1] > c.a[1] || b.a[2] > c.a[2])) return !1;
        for (const d of a)
            if ((b.f[d] || 0) > (c.f[d] || 0)) return !1;
        return !0
    };
    var jd = {
            Aa: [],
            ca: [],
            lb: {}
        },
        kd = [],
        ld = {
            kb: [],
            Ea: new Set
        };

    function md(a, b) {
        return new Wc(a.name + "+", a.O, a.type, a.j, a.A, a.C, a.D, a.o, a.I, b.filter(c => 0 < c).length, b, a.f, a.i, a.m)
    };
    var nd;
    {
        const a = [],
            b = function(c) {
                return c.map(([d, e, g, h, k, l, m, q, v, y, r, C, L, ma]) => new Wc(d, e, g, h, k, l, !!m, q, !!v, y, r, C, L, ma))
            }([
                ["希望面具", 3, 3, 0, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "昏厥耐性": 1
                }, 24, [1, 0, 1, 0, 0]],
                ["希望铠甲", 3, 3, 1, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "精灵加护": 1
                }, 24, [1, 0, 1, 0, 0]],
                ["希望腕甲", 3, 3, 2, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "精灵加护": 1
                }, 24, [1, 0, 1, 0, 0]],
                ["希望腰甲", 3, 3, 3, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                        "昏厥耐性": 1
                    }, 24,
                    [1, 0, 1, 0, 0]
                ],
                ["希望护腿", 3, 3, 4, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "精灵加护": 1
                }, 24, [1, 0, 1, 0, 0]],
                ["皮制头饰", 3, 3, 0, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "植生学": 1
                }, 24, [2, 0, 0, 0, 0]],
                ["皮制服饰", 3, 3, 1, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "植生学": 1
                }, 24, [2, 0, 0, 0, 0]],
                ["皮制手套", 3, 3, 2, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "饥饿耐性": 1
                }, 24, [2, 0, 0, 0, 0]],
                ["皮制腰带", 3, 3, 3, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "植生学": 1
                }, 24, [2, 0, 0, 0, 0]],
                ["皮制长裤",
                    3, 3, 4, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                        "植生学": 1
                    },
                    24, [2, 0, 0, 0, 0]
                ],
                ["锁甲头饰", 3, 3, 0, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "地质学": 1
                }, 24, [0, 2, 0, 0, 0]],
                ["锁甲服饰", 3, 3, 1, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "地质学": 1
                }, 24, [0, 2, 0, 0, 0]],
                ["锁甲手套", 3, 3, 2, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "地质学": 1
                }, 24, [0, 2, 0, 0, 0]],
                ["锁甲腰带", 3, 3, 3, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "回复速度": 1
                }, 24, [0, 2, 0, 0, 0]],
                ["锁甲长裤", 3, 3, 4, 0, 0, 0, 1, 0, 0, [0,
                    0, 0
                ], {
                    "回复速度": 1
                }, 24, [0, 2, 0, 0, 0]],
                ["骨制头盔", 3, 3, 0, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "跑者": 1
                }, 26, [2, 0, 2, 0, 2]],
                ["骨制铠甲", 3, 3, 1, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "跑者": 1
                }, 26, [2, 0, 2, 0, 2]],
                ["骨制腕甲", 3, 3, 2, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "昏厥耐性": 1
                }, 26, [2, 0, 2, 0, 2]],
                ["骨制腰甲", 3, 3, 3, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "跑者": 1
                }, 26, [2, 0, 2, 0, 2]],
                ["骨制护腿", 3, 3, 4, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                        "昏厥耐性": 1
                    },
                    26, [2, 0, 2, 0, 2]
                ],
                ["血盗虫眼镜", 3, 3, 0, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "昆虫标本达人": 1,
                    "甲虫之直觉": 1
                }, 26, [-4, 1, 1, 2, 4]],
                ["钳速龙腕甲", 3, 3, 2, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "飞身跃入": 1,
                    "皮革制品之柔韧": 1
                }, 26, [4, -2, -2, -2, 2]],
                ["缠蛙头盔", 3, 3, 0, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "快吃": 1,
                    "皮革制品之柔韧": 1
                }, 28, [1, 2, -3, -1, 1]],
                ["缠蛙铠甲", 3, 3, 1, 0,
                    0, 0, 1, 0, 0, [0, 0, 0], {
                        "快吃": 1,
                        "皮革制品之柔韧": 1
                    },
                    28, [1, 2, -3, -1, 1]
                ],
                ["缠蛙腕甲", 3, 3, 2, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "道具使用强化": 1,
                    "皮革制品之柔韧": 1
                }, 28, [1, 2, -3, -1, 1]],
                ["缠蛙腰甲", 3, 3, 3, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "快吃": 1,
                    "皮革制品之柔韧": 1
                }, 28, [1, 2, -3, -1, 1]],
                ["缠蛙护腿", 3, 3, 4, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                        "道具使用强化": 1,
                        "皮革制品之柔韧": 1
                    },
                    28, [1, 2, -3, -1, 1]
                ],
                ["炎尾龙头盔", 3, 3, 0, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "减轻胆怯": 1,
                    "铺鳞之技法": 1
                }, 28, [2, -3, 0, -1, 0]],
                ["炎尾龙铠甲", 3, 3, 1, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "火耐性": 1,
                    "铺鳞之技法": 1
                }, 28, [2, -3, 0, -1, 0]],
                ["炎尾龙腕甲", 3, 3, 2, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "减轻胆怯": 1,
                    "铺鳞之技法": 1
                }, 28, [2, -3, 0, -1, 0]],
                ["炎尾龙腰甲", 3, 3, 3, 0, 0, 0, 1, 0, 0, [0, 0,
                    0
                ], {
                    "火耐性": 1,
                    "铺鳞之技法": 1
                }, 28, [2, -3, 0, -1, 0]],
                ["炎尾龙护腿", 3, 3, 4, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "减轻胆怯": 1,
                    "铺鳞之技法": 1
                }, 28, [2, -3, 0, -1, 0]],
                ["合金头盔", 3, 3, 0, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "纳刀术": 1
                }, 28, [-2, 1, 1, -2, 1]],
                ["合金铠甲", 3, 3, 1, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "耐震": 1
                }, 28, [-2, 1, 1, -2, 1]],
                ["合金腕甲", 3, 3, 2, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "耐震": 1
                }, 28, [-2, 1, 1, -2, 1]],
                ["合金腰甲", 3, 3, 3, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "耐震": 1
                }, 28, [-2, 1, 1, -2, 1]],
                ["合金护腿", 3, 3, 4, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "纳刀术": 1
                }, 28, [-2, 1, 1, -2, 1]],
                ["锯带龙护腿", 3, 3, 4, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "水耐性": 1,
                    "皮革制品之柔韧": 1
                }, 26, [-3, 4, -3, 1, 1]],
                ["巨蜂头盔", 3, 3, 0, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "环境利用知识": 1,
                    "甲虫之直觉": 1
                }, 26, [-2, 1, 1, 1, 2]],
                ["巨蜂铠甲",
                    3, 3, 1, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                        "环境利用知识": 1,
                        "甲虫之直觉": 1
                    },
                    26, [-2, 1, 1, 1, 2]
                ],
                ["巨蜂腕甲", 3, 3, 2, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "麻痹耐性": 1,
                    "甲虫之直觉": 1
                }, 26, [-2, 1, 1, 1, 2]],
                ["巨蜂腰甲", 3, 3, 3, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "麻痹耐性": 1,
                    "甲虫之直觉": 1
                }, 26, [-2, 1, 1, 1, 2]],
                ["巨蜂护腿", 3, 3, 4, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                        "环境利用知识": 1,
                        "甲虫之直觉": 1
                    },
                    26, [-2, 1, 1, 1, 2]
                ],
                ["咬鱼靴", 3, 3, 4, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "水耐性": 1,
                    "皮革制品之柔韧": 1
                }, 26, [0, 5, 0, 0, 0]],
                ["刺花蜘蛛头盔", 3, 3, 0, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "麻痹耐性": 1,
                    "甲虫之直觉": 1
                }, 30, [-3, 3, 0, 0, 3]],
                ["刺花蜘蛛铠甲", 3, 3, 1, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "麻痹耐性": 1,
                    "甲虫之直觉": 1
                }, 30, [-3, 3, 0, 0, 3]],
                ["刺花蜘蛛腕甲", 3, 3, 2, 0, 0,
                    0, 1, 0, 0, [0, 0, 0], {
                        "体力回复量提升": 1,
                        "甲虫之直觉": 1
                    },
                    30, [-3, 3, 0, 0, 3]
                ],
                ["刺花蜘蛛腰甲", 3, 3, 3, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "体力回复量提升": 1,
                    "甲虫之直觉": 1
                }, 30, [-3, 3, 0, 0, 3]],
                ["刺花蜘蛛护腿", 3, 3, 4, 0, 0, 0, 1, 0, 0, [0, 0, 0], {
                    "体力回复量提升": 1,
                    "甲虫之直觉": 1
                }, 30, [-3, 3, 0, 0, 3]],
                ["桃毛兽王头盔", 3, 3, 0, 0, 0,
                    0, 2, 0, 0, [0, 0, 0], {
                        "最爱蘑菇": 1,
                        "毛皮之昂扬": 1
                    },
                    30, [-3, 1, 1, -1, 2]
                ],
                ["桃毛兽王铠甲", 3, 3, 1, 0, 0, 0, 2, 0, 0, [0, 0, 0], {
                    "最爱蘑菇": 1,
                    "毛皮之昂扬": 1
                }, 30, [-3, 1, 1, -1, 2]],
                ["桃毛兽王腕甲", 3, 3, 2, 0, 0, 0, 2, 0, 0, [0, 0, 0], {
                    "恶臭耐性": 1,
                    "毛皮之昂扬": 1
                }, 30, [-3, 1, 1, -1, 2]],
                ["桃毛兽王腰甲", 3, 3, 3, 0, 0, 0, 2, 0, 0, [0, 0, 0], {
                        "恶臭耐性": 1,
                        "毛皮之昂扬": 1
                    },
                    30, [-3, 1, 1, -1, 2]
                ],
                ["桃毛兽王护腿", 3, 3, 4, 0, 0, 0, 2, 0, 0, [0, 0, 0], {
                    "最爱蘑菇": 1,
                    "毛皮之昂扬": 1
                }, 30, [-3, 1, 1, -1, 2]],
                ["沙海龙头盔", 3, 3, 0, 0, 0, 0, 2, 0, 0, [0, 0, 0], {
                    "饥饿耐性": 1,
                    "铺鳞之技法": 1
                }, 34, [-1, 2, -3, 1, 1]],
                ["沙海龙铠甲", 3, 3, 1, 0, 0, 0, 2, 0, 0, [0, 0, 0], {
                    "纳刀术": 1,
                    "铺鳞之技法": 1
                }, 34, [-1, 2, -3, 1, 1]],
                ["沙海龙腕甲", 3, 3, 2, 0, 0, 0, 2, 0, 0,
                    [0, 0, 0], {
                        "回避距离提升": 1,
                        "铺鳞之技法": 1
                    },
                    34, [-1, 2, -3, 1, 1]
                ],
                ["沙海龙腰甲", 3, 3, 3, 0, 0, 0, 2, 0, 0, [0, 0, 0], {
                    "回避距离提升": 1,
                    "铺鳞之技法": 1
                }, 34, [-1, 2, -3, 1, 1]],
                ["沙海龙护腿", 3, 3, 4, 0, 0, 0, 2, 0, 0, [0, 0, 0], {
                    "回避距离提升": 1,
                    "铺鳞之技法": 1
                }, 34, [-1, 2, -3, 1, 1]],
                ["辟兽头盔", 3, 3, 0, 0, 0, 0, 2, 0, 0, [0, 0, 0], {
                    "满足感": 1,
                    "辟兽之力": 1,
                    "毛皮之昂扬": 1
                }, 38, [-3, 2, -1, -1, 4]],
                ["辟兽铠甲", 3, 3, 1, 0, 0, 0, 2, 0, 0, [0, 0, 0], {
                    "满足感": 1,
                    "辟兽之力": 1,
                    "毛皮之昂扬": 1
                }, 38, [-3, 2, -1, -1, 4]],
                ["辟兽腕甲", 3, 3, 2, 0, 0, 0, 2, 0, 0, [0, 0, 0], {
                    "回复速度": 1,
                    "辟兽之力": 1,
                    "毛皮之昂扬": 1
                }, 38, [-3, 2, -1, -1, 4]],
                ["辟兽腰甲", 3, 3, 3, 0, 0, 0, 2, 0, 0, [0, 0, 0], {
                    "道具使用强化": 1,
                    "辟兽之力": 1,
                    "毛皮之昂扬": 1
                }, 38, [-3, 2, -1, -1, 4]],
                ["辟兽护腿", 3, 3, 4, 0, 0, 0, 2, 0, 0, [0, 0, 0], {
                    "满足感": 1,
                    "辟兽之力": 1,
                    "毛皮之昂扬": 1
                }, 38, [-3, 2, -1, -1, 4]],
                ["铸铁头盔", 3, 3, 0, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "精灵加护": 1
                }, 34, [-2, 0, 3, -1, 0]],
                ["铸铁铠甲", 3, 3, 1, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "风压耐性": 1
                }, 34, [-2, 0, 3, -1, 0]],
                ["铸铁腕甲", 3, 3, 2, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                        "昏厥耐性": 1
                    },
                    34, [-2, 0, 3, -1, 0]
                ],
                ["铸铁腰甲", 3, 3, 3, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "精灵加护": 1
                }, 34, [-2, 0, 3, -1, 0]],
                ["铸铁护腿", 3, 3, 4, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "风压耐性": 1
                }, 34, [-2, 0, 3, -1, 0]],
                ["盔速龙铠甲", 3, 3, 1, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "减轻胆怯": 2,
                    "铺鳞之技法": 1
                }, 34, [4, -2, 0, -2, 0]],
                ["血眠虫头饰", 3, 3, 0, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "睡眠耐性": 1,
                    "甲虫之直觉": 1
                }, 34, [-5,
                    0, 0, 3, 3
                ]],
                ["沼喷龙头盔", 3, 3, 0, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "广域化": 1,
                    "皮革制品之柔韧": 1
                }, 36, [0, -3, 0, 0, 1]],
                ["沼喷龙铠甲", 3, 3, 1, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "广域化": 1,
                    "皮革制品之柔韧": 1
                }, 36, [0, -3, 0, 0, 1]],
                ["沼喷龙腕甲", 3, 3, 2, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "广域化": 1,
                    "皮革制品之柔韧": 1
                }, 36, [0, -3, 0, 0, 1]],
                ["沼喷龙腰甲", 3, 3, 3, 0, 0,
                    0, 3, 0, 0, [0, 0, 0], {
                        "广域化": 1,
                        "毒耐性": 1,
                        "皮革制品之柔韧": 1
                    },
                    36, [0, -3, 0, 0, 1]
                ],
                ["沼喷龙护腿", 3, 3, 4, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "广域化": 1,
                    "皮革制品之柔韧": 1
                }, 36, [0, -3, 0, 0, 1]],
                ["影蜘蛛头盔", 3, 3, 0, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "急袭": 1,
                    "甲虫之直觉": 1
                }, 38, [-2, 2, -2, 1, 2]],
                ["影蜘蛛铠甲", 3, 3, 1, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "束缚耐性": 1,
                    "毒耐性": 1,
                    "甲虫之直觉": 1
                }, 38, [-2, 2, -2, 1, 2]],
                ["影蜘蛛腕甲", 3, 3, 2, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "急袭": 1,
                    "甲虫之直觉": 1
                }, 38, [-2, 2, -2, 1, 2]],
                ["影蜘蛛腰甲", 3, 3, 3, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "束缚耐性": 1,
                    "睡眠耐性": 1,
                    "甲虫之直觉": 1
                }, 38, [-2, 2, -2, 1, 2]],
                ["影蜘蛛护腿", 3, 3, 4, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "急袭": 1,
                    "甲虫之直觉": 1
                }, 38, [-2, 2, -2, 1, 2]],
                ["风铗龙头盔",
                    3, 3, 0, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                        "回避性能": 1,
                        "回复速度": 1,
                        "铺鳞之技法": 1
                    },
                    40, [-3, 2, -2, 3, 0]
                ],
                ["风铗龙铠甲", 3, 3, 1, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "回避性能": 1,
                    "回复速度": 1,
                    "铺鳞之技法": 1
                }, 40, [-3, 2, -2, 3, 0]],
                ["风铗龙腕甲", 3, 3, 2, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "回避性能": 1,
                    "冰耐性": 1,
                    "铺鳞之技法": 1
                }, 40, [-3, 2, -2, 3, 0]],
                ["风铗龙腰甲",
                    3, 3, 3, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                        "回避性能": 1,
                        "冰耐性": 1,
                        "铺鳞之技法": 1
                    },
                    40, [-3, 2, -2, 3, 0]
                ],
                ["风铗龙护腿", 3, 3, 4, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "回避性能": 1,
                    "冰耐性": 1,
                    "铺鳞之技法": 1
                }, 40, [-3, 2, -2, 3, 0]],
                ["赫猿兽头盔", 3, 3, 0, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "破坏王": 1,
                    "炸弹客": 1,
                    "毛皮之昂扬": 1
                }, 42, [3, -3, 1, -2, 0]],
                ["赫猿兽铠甲", 3, 3, 1,
                    0, 0, 0, 3, 0, 0, [0, 0, 0], {
                        "破坏王": 1,
                        "毛皮之昂扬": 1
                    },
                    42, [3, -3, 1, -2, 0]
                ],
                ["赫猿兽腕甲", 3, 3, 2, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "炸弹客": 1,
                    "攀岩者": 1,
                    "毛皮之昂扬": 1
                }, 42, [3, -3, 1, -2, 0]],
                ["赫猿兽腰甲", 3, 3, 3, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "炸弹客": 1,
                    "爆破异常耐性": 1,
                    "毛皮之昂扬": 1
                }, 42, [3, -3, 1, -2, 0]],
                ["赫猿兽护腿", 3, 3, 4, 0, 0, 0, 3, 0, 0, [0, 0, 0], {
                    "破坏王": 1,
                    "爆破异常耐性": 1,
                    "毛皮之昂扬": 1
                }, 42, [3, -3, 1, -2, 0]],
                ["护鹭鹰龙腰甲", 3, 3, 3, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                    "跳跃铁人": 1,
                    "护龙之脉动": 1
                }, 38, [0, 0, 4, 0, -3]],
                ["波衣龙头盔", 3, 3, 0, 0, 0, 0, 4, 0, 0, [0, 0, 0], {
                    "无伤": 1,
                    "整备": 1,
                    "波衣龙之守护": 1,
                    "霸主之骄傲": 1
                }, 42, [-1, 4, -3, 0, 0]],
                ["波衣龙铠甲", 3, 3, 1, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                    "无伤": 1,
                    "波衣龙之守护": 1,
                    "霸主之骄傲": 1
                }, 42, [-1, 4, -3, 0, 0]],
                ["波衣龙腕甲", 3, 3, 2, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                    "整备": 1,
                    "波衣龙之守护": 1,
                    "霸主之骄傲": 1
                }, 42, [-1, 4, -3, 0, 0]],
                ["波衣龙腰甲", 3, 3, 3, 0, 0, 0, 4, 0, 0, [0, 0, 0], {
                    "整备": 1,
                    "适应水域·油泥": 1,
                    "波衣龙之守护": 1,
                    "霸主之骄傲": 1
                }, 42, [-1, 4, -3, 0, 0]],
                ["波衣龙护腿",
                    3, 3, 4, 0, 0, 0, 4, 0, 0, [0, 0, 0], {
                        "无伤": 1,
                        "波衣龙之守护": 1,
                        "霸主之骄傲": 1
                    },
                    42, [-1, 4, -3, 0, 0]
                ],
                ["煌雷龙头盔", 3, 3, 0, 0, 0, 0, 4, 0, 0, [0, 0, 0], {
                    "力量解放": 1,
                    "煌雷龙之力": 1,
                    "霸主之骄傲": 1
                }, 42, [0, -2, 4, -3, 0]],
                ["煌雷龙铠甲", 3, 3, 1, 0, 0, 0, 4, 0, 0, [0, 0, 0], {
                    "体术": 1,
                    "煌雷龙之力": 1,
                    "霸主之骄傲": 1
                }, 42, [0, -2, 4, -3, 0]],
                ["煌雷龙腕甲",
                    3, 3, 2, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                        "力量解放": 1,
                        "煌雷龙之力": 1,
                        "霸主之骄傲": 1
                    },
                    42, [0, -2, 4, -3, 0]
                ],
                ["煌雷龙腰甲", 3, 3, 3, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                    "体术": 1,
                    "煌雷龙之力": 1,
                    "霸主之骄傲": 1
                }, 42, [0, -2, 4, -3, 0]],
                ["煌雷龙护腿", 3, 3, 4, 0, 0, 0, 4, 0, 0, [0, 0, 0], {
                    "力量解放": 1,
                    "体术": 1,
                    "煌雷龙之力": 1,
                    "霸主之骄傲": 1
                }, 42, [0, -2, 4,
                    -3, 0
                ]],
                ["狱焰蛸头盔", 3, 3, 0, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                    "怨恨": 1,
                    "狱焰蛸之反叛": 1,
                    "霸主之骄傲": 1
                }, 42, [5, -4, 0, 1, 0]],
                ["狱焰蛸铠甲", 3, 3, 1, 0, 0, 0, 4, 0, 0, [0, 0, 0], {
                    "怨恨": 1,
                    "快吃": 1,
                    "狱焰蛸之反叛": 1,
                    "霸主之骄傲": 1
                }, 42, [5, -4, 0, 1, 0]],
                ["狱焰蛸腕甲", 3, 3, 2, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                        "快吃": 1,
                        "狱焰蛸之反叛": 1,
                        "霸主之骄傲": 1
                    },
                    42, [5, -4, 0, 1, 0]
                ],
                ["狱焰蛸腰甲", 3, 3, 3, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                    "怨恨": 1,
                    "狱焰蛸之反叛": 1,
                    "霸主之骄傲": 1
                }, 42, [5, -4, 0, 1, 0]],
                ["狱焰蛸护腿", 3, 3, 4, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                    "快吃": 1,
                    "狱焰蛸之反叛": 1,
                    "霸主之骄傲": 1
                }, 42, [5, -4, 0, 1, 0]],
                ["护辟兽头盔", 3, 3, 0, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                        "火场怪力": 1,
                        "辟兽之力": 1,
                        "护龙之脉动": 1
                    },
                    42, [-3, 2, -2, -1, 2]
                ],
                ["护辟兽铠甲", 3, 3, 1, 0, 0, 0, 4, 0, 0, [0, 0, 0], {
                    "火场怪力": 1,
                    "防御力下降耐性": 1,
                    "辟兽之力": 1,
                    "护龙之脉动": 1
                }, 42, [-3, 2, -2, -1, 2]],
                ["护辟兽腕甲", 3, 3, 2, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                    "跑者": 1,
                    "辟兽之力": 1,
                    "护龙之脉动": 1
                }, 42, [-3, 2, -2, -1, 2]],
                ["护辟兽腰甲", 3, 3, 3, 0, 0, 0, 4, 0, 0, [0, 0, 0], {
                    "火场怪力": 1,
                    "跑者": 1,
                    "辟兽之力": 1,
                    "护龙之脉动": 1
                }, 42, [-3, 2, -2, -1, 2]],
                ["护辟兽护腿", 3, 3, 4, 0, 0, 0, 4, 0, 0, [0, 0, 0], {
                    "跑者": 1,
                    "防御力下降耐性": 1,
                    "辟兽之力": 1,
                    "护龙之脉动": 1
                }, 42, [-3, 2, -2, -1, 2]],
                ["护火龙头盔", 3, 3, 0, 0, 0, 0, 4, 0, 0, [0, 0, 0], {
                    "弱点特效": 1,
                    "威吓": 1,
                    "火龙之力": 1,
                    "护龙之脉动": 1
                }, 42, [3, 1, -2, 1, -5]],
                ["护火龙铠甲",
                    3, 3, 1, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                        "威吓": 1,
                        "火龙之力": 1,
                        "护龙之脉动": 1
                    },
                    42, [3, 1, -2, 1, -5]
                ],
                ["护火龙腕甲", 3, 3, 2, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                    "弱点特效": 1,
                    "火龙之力": 1,
                    "护龙之脉动": 1
                }, 42, [3, 1, -2, 1, -5]],
                ["护火龙腰甲", 3, 3, 3, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                    "威吓": 1,
                    "火龙之力": 1,
                    "护龙之脉动": 1
                }, 42, [3, 1, -2, 1, -5]],
                ["护火龙护腿", 3, 3, 4,
                    0, 0, 0, 4, 0, 1, [1, 0, 0], {
                        "弱点特效": 1,
                        "火龙之力": 1,
                        "护龙之脉动": 1
                    },
                    42, [3, 1, -2, 1, -5]
                ],
                ["护凶爪龙头盔", 3, 3, 0, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                    "连击": 1,
                    "凶爪龙之力": 1,
                    "护龙之脉动": 1
                }, 42, [-2, -3, -2, -2, 4]],
                ["护凶爪龙铠甲", 3, 3, 1, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                    "裂伤耐性": 1,
                    "凶爪龙之力": 1,
                    "护龙之脉动": 1
                }, 42, [-2, -3, -2, -2, 4]],
                ["护凶爪龙腕甲",
                    3, 3, 2, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                        "连击": 1,
                        "凶爪龙之力": 1,
                        "护龙之脉动": 1
                    },
                    42, [-2, -3, -2, -2, 4]
                ],
                ["护凶爪龙腰甲", 3, 3, 3, 0, 0, 0, 4, 0, 0, [0, 0, 0], {
                    "连击": 1,
                    "裂伤耐性": 1,
                    "凶爪龙之力": 1,
                    "护龙之脉动": 1
                }, 42, [-2, -3, -2, -2, 4]],
                ["护凶爪龙护腿", 3, 3, 4, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                        "裂伤耐性": 1,
                        "凶爪龙之力": 1,
                        "护龙之脉动": 1
                    },
                    42, [-2, -3, -2, -2, 4]
                ],
                ["暗器蛸头盔", 3, 3, 0, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                    "精神抖擞": 1,
                    "皮革制品之柔韧": 1
                }, 42, [1, 1, 1, -3, 2]],
                ["暗器蛸铠甲", 3, 3, 1, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                    "耐力急速回复": 1,
                    "皮革制品之柔韧": 1
                }, 42, [1, 1, 1, -3, 2]],
                ["暗器蛸腕甲", 3, 3, 2, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                    "精神抖擞": 1,
                    "皮革制品之柔韧": 1
                }, 42, [1, 1, 1, -3, 2]],
                ["暗器蛸腰甲",
                    3, 3, 3, 0, 0, 0, 4, 0, 0, [0, 0, 0], {
                        "精神抖擞": 1,
                        "耐力急速回复": 1,
                        "皮革制品之柔韧": 1
                    },
                    42, [1, 1, 1, -3, 2]
                ],
                ["暗器蛸护腿", 3, 3, 4, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                    "耐力急速回复": 1,
                    "皮革制品之柔韧": 1
                }, 42, [1, 1, 1, -3, 2]],
                ["护锁刃龙头盔", 3, 3, 0, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                        "锁刃刺击": 1,
                        "护锁刃龙之命脉": 1,
                        "护龙之脉动": 1
                    },
                    46, [2, 0, -1, 0, -4]
                ],
                ["护锁刃龙铠甲", 3, 3, 1, 0, 0, 0, 4, 0, 0, [0, 0, 0], {
                    "锁刃刺击": 1,
                    "属性异常耐性": 1,
                    "护锁刃龙之命脉": 1,
                    "护龙之脉动": 1
                }, 46, [2, 0, -1, 0, -4]],
                ["护锁刃龙腕甲", 3, 3, 2, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                    "锁刃刺击": 1,
                    "护锁刃龙之命脉": 1,
                    "护龙之脉动": 1
                }, 46, [2, 0, -1, 0, -4]],
                ["护锁刃龙腰甲", 3, 3, 3, 0,
                    0, 0, 4, 0, 2, [1, 1, 0], {
                        "属性异常耐性": 1,
                        "护锁刃龙之命脉": 1,
                        "护龙之脉动": 1
                    },
                    46, [2, 0, -1, 0, -4]
                ],
                ["护锁刃龙护腿", 3, 3, 4, 0, 0, 0, 4, 0, 1, [1, 0, 0], {
                    "属性异常耐性": 1,
                    "护锁刃龙之命脉": 1,
                    "护龙之脉动": 1
                }, 46, [2, 0, -1, 0, -4]],
                ["希望面具α", 3, 3, 0, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "精灵加护": 2
                }, 52, [1, 0, 1, 0, 0]],
                ["希望铠甲α",
                    3, 3, 1, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                        "毒耐性": 1
                    },
                    52, [1, 0, 1, 0, 0]
                ],
                ["希望腕甲α", 3, 3, 2, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "睡眠耐性": 1
                }, 52, [1, 0, 1, 0, 0]],
                ["希望腰甲α", 3, 3, 3, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "精灵加护": 1,
                    "昏厥耐性": 1
                }, 52, [1, 0, 1, 0, 0]],
                ["希望护腿α", 3, 3, 4, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "昏厥耐性": 2
                }, 52, [1, 0, 1, 0, 0]],
                ["皮制头饰α", 3, 3, 0, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                        "植生学": 2
                    },
                    52, [2, 0, 0, 0, 0]
                ],
                ["皮制服饰α", 3, 3, 1, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "植生学": 1,
                    "道具使用强化": 1
                }, 52, [2, 0, 0, 0, 0]],
                ["皮制手套α", 3, 3, 2, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "植生学": 1,
                    "饥饿耐性": 1
                }, 52, [2, 0, 0, 0, 0]],
                ["皮制腰带α", 3, 3, 3, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "饥饿耐性": 1
                }, 52, [2, 0, 0, 0, 0]],
                ["皮制长裤α", 3, 3, 4, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                        "饥饿耐性": 1,
                        "道具使用强化": 1
                    },
                    52, [2, 0, 0, 0, 0]
                ],
                ["锁甲头饰α", 3, 3, 0, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "地质学": 1
                }, 52, [0, 2, 0, 0, 0]],
                ["锁甲服饰α", 3, 3, 1, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "地质学": 1,
                    "冰耐性": 1
                }, 52, [0, 2, 0, 0, 0]],
                ["锁甲手套α", 3, 3, 2, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "地质学": 1,
                    "回复速度": 1
                }, 52, [0, 2, 0, 0, 0]],
                ["锁甲腰带α", 3, 3, 3, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "回复速度": 1,
                    "冰耐性": 1
                }, 52, [0, 2, 0, 0, 0]],
                ["锁甲长裤α", 3, 3, 4, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "回复速度": 1
                }, 52, [0, 2, 0, 0, 0]],
                ["骨制头盔α", 3, 3, 0, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "昏厥耐性": 1,
                    "快吃": 1
                }, 58, [2, 0, 2, 0, 2]],
                ["骨制铠甲α", 3, 3, 1, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "跑者": 1,
                    "昏厥耐性": 1
                }, 58, [2, 0, 2, 0, 2]],
                ["骨制腕甲α", 3, 3, 2, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "跑者": 1,
                    "快吃": 1
                }, 58, [2, 0, 2, 0, 2]],
                ["骨制腰甲α",
                    3, 3, 3, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                        "跑者": 1
                    },
                    58, [2, 0, 2, 0, 2]
                ],
                ["骨制护腿α", 3, 3, 4, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "昏厥耐性": 1
                }, 58, [2, 0, 2, 0, 2]],
                ["合金头盔α", 3, 3, 0, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "纳刀术": 1
                }, 58, [-2, 1, -2, -2, 1]],
                ["合金铠甲α", 3, 3, 1, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "减轻胆怯": 2
                }, 58, [-2, 1, -2, -2, 1]],
                ["合金腕甲α", 3, 3, 2, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "耐震": 1
                }, 58, [-2, 1, -2, -2, 1]],
                ["合金腰甲α",
                    3, 3, 3, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                        "耐震": 1,
                        "纳刀术": 1
                    },
                    58, [-2, 1, -2, -2, 1]
                ],
                ["合金护腿α", 3, 3, 4, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "纳刀术": 1,
                    "减轻胆怯": 1
                }, 58, [-2, 1, -2, -2, 1]],
                ["血盗虫眼镜α", 3, 3, 0, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "昆虫标本达人": 1,
                    "弱点特效": 1,
                    "甲虫之直觉": 1
                }, 58, [-4, 1, 1, -2, 4]],
                ["血盗虫眼镜β", 3, 3, 0, 0, 0, 0, 5, 0, 2, [2, 1, 0], {
                    "昆虫标本达人": 1,
                    "甲虫之拟态": 1
                }, 58, [-4, 1, 1, -2, 4]],
                ["钳速龙腕甲α", 3, 3, 2, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "飞身跃入": 1,
                    "连击": 1
                }, 58, [-4, -2, -2, -2, 2]],
                ["钳速龙腕甲β", 3, 3, 2, 0, 0, 0, 5, 0, 2, [2, 1, 0], {
                    "飞身跃入": 1
                }, 58, [-4, -2, -2, -2, 2]],
                ["锯带龙护腿α", 3, 3, 4, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "适应水域·油泥": 1,
                    "水耐性": 2
                }, 58, [-3, 4, -3, 1, 1]],
                ["锯带龙护腿β",
                    3, 3, 4, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                        "适应水域·油泥": 1
                    },
                    58, [-3, 4, -3, 1, 1]
                ],
                ["巨蜂头盔α", 3, 3, 0, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "环境利用知识": 1,
                    "急袭": 1,
                    "甲虫之直觉": 1
                }, 58, [-2, 1, 1, 1, 2]],
                ["巨蜂铠甲α", 3, 3, 1, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "环境利用知识": 1,
                    "回避性能": 1,
                    "甲虫之直觉": 1
                }, 58, [-2, 1, 1, 1, 2]],
                ["巨蜂腕甲α", 3, 3, 2, 0, 0, 0, 5, 0, 0,
                    [0, 0, 0], {
                        "麻痹耐性": 1,
                        "急袭": 1,
                        "甲虫之直觉": 1
                    },
                    58, [-2, 1, 1, 1, 2]
                ],
                ["巨蜂腰甲α", 3, 3, 3, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "麻痹耐性": 1,
                    "回避性能": 1,
                    "甲虫之直觉": 1
                }, 58, [-2, 1, 1, 1, 2]],
                ["巨蜂护腿α", 3, 3, 4, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "环境利用知识": 1,
                    "麻痹耐性": 1,
                    "甲虫之直觉": 1
                }, 58, [-2, 1, 1, 1, 2]],
                ["巨蜂头盔β", 3, 3,
                    0, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                        "环境利用知识": 1,
                        "甲虫之拟态": 1
                    },
                    58, [-2, 1, 1, 1, 2]
                ],
                ["巨蜂铠甲β", 3, 3, 1, 0, 0, 0, 5, 0, 3, [1, 1, 1], {
                    "环境利用知识": 1,
                    "甲虫之拟态": 1
                }, 58, [-2, 1, 1, 1, 2]],
                ["巨蜂腕甲β", 3, 3, 2, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "麻痹耐性": 1,
                    "甲虫之拟态": 1
                }, 58, [-2, 1, 1, 1, 2]],
                ["巨蜂腰甲β", 3, 3, 3, 0, 0, 0, 5, 0, 3, [1, 1, 1], {
                    "麻痹耐性": 1,
                    "甲虫之拟态": 1
                }, 58, [-2, 1, 1, 1, 2]],
                ["巨蜂护腿β", 3, 3, 4, 0, 0, 0, 5, 0, 2, [2, 1, 0], {
                    "环境利用知识": 1,
                    "甲虫之拟态": 1
                }, 58, [-2, 1, 1, 1, 2]],
                ["盔速龙铠甲α", 3, 3, 1, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "减轻胆怯": 2,
                    "破坏王": 1,
                    "铺鳞之技法": 1
                }, 58, [4, -2, 0, -2, 0]],
                ["盔速龙铠甲β", 3, 3, 1, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                        "减轻胆怯": 2,
                        "叠鳞之工艺": 1
                    },
                    58, [4, -2, 0, -2, 0]
                ],
                ["血眠虫头饰α", 3, 3, 0, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "睡眠耐性": 2,
                    "攻势": 1,
                    "甲虫之直觉": 1
                }, 58, [-5, 0, 0, 3, 3]],
                ["血眠虫头饰β", 3, 3, 0, 0, 0, 0, 5, 0, 2, [2, 1, 0], {
                    "睡眠耐性": 2,
                    "甲虫之拟态": 1
                }, 58, [-5, 0, 0, 3, 3]],
                ["怪鸟头盔α", 3, 3, 0, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "体术": 2,
                    "火耐性": 2,
                    "铺鳞之技法": 1
                }, 62, [3, 0, -2, -4, 2]],
                ["怪鸟铠甲α",
                    3, 3, 1, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                        "挑战者": 1,
                        "火耐性": 1,
                        "铺鳞之技法": 1
                    },
                    62, [3, 0, -2, -4, 2]
                ],
                ["怪鸟腕甲α", 3, 3, 2, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "体术": 1,
                    "挑战者": 1,
                    "铺鳞之技法": 1
                }, 62, [3, 0, -2, -4, 2]],
                ["怪鸟腰甲α", 3, 3, 3, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "挑战者": 1,
                    "体力回复量提升": 2,
                    "铺鳞之技法": 1
                }, 62, [3, 0, -2, -4, 2]],
                ["怪鸟护腿α",
                    3, 3, 4, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                        "体术": 2,
                        "体力回复量提升": 1,
                        "铺鳞之技法": 1
                    },
                    62, [3, 0, -2, -4, 2]
                ],
                ["怪鸟头盔β", 3, 3, 0, 0, 0, 0, 5, 0, 2, [2, 1, 0], {
                    "体术": 1,
                    "叠鳞之工艺": 1
                }, 62, [3, 0, -2, -4, 2]],
                ["怪鸟铠甲β", 3, 3, 1, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "挑战者": 1,
                    "叠鳞之工艺": 1
                }, 62, [3, 0, -2, -4, 2]],
                ["怪鸟腕甲β", 3, 3, 2, 0, 0, 0, 5, 0, 3, [2, 1, 1], {
                        "体术": 1,
                        "叠鳞之工艺": 1
                    },
                    62, [3, 0, -2, -4, 2]
                ],
                ["怪鸟腰甲β", 3, 3, 3, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "挑战者": 1,
                    "体力回复量提升": 1,
                    "叠鳞之工艺": 1
                }, 62, [3, 0, -2, -4, 2]],
                ["怪鸟护腿β", 3, 3, 4, 0, 0, 0, 5, 0, 2, [2, 1, 0], {
                    "体术": 1,
                    "体力回复量提升": 1,
                    "叠鳞之工艺": 1
                }, 62, [3, 0, -2, -4, 2]],
                ["缠蛙头盔α", 3, 3, 0, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                        "快吃": 1,
                        "广域化": 1,
                        "皮革制品之柔韧": 1
                    },
                    62, [1, 2, -3, -1, 1]
                ],
                ["缠蛙铠甲α", 3, 3, 1, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "快吃": 1,
                    "弱点特效": 1,
                    "皮革制品之柔韧": 1
                }, 62, [1, 2, -3, -1, 1]],
                ["缠蛙腕甲α", 3, 3, 2, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "道具使用强化": 1,
                    "广域化": 1,
                    "皮革制品之柔韧": 1
                }, 62, [1, 2, -3, -1, 1]],
                ["缠蛙腰甲α", 3, 3, 3, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "快吃": 1,
                    "道具使用强化": 1,
                    "皮革制品之柔韧": 1
                }, 62, [1, 2, -3, -1, 1]],
                ["缠蛙护腿α", 3, 3, 4, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "道具使用强化": 1,
                    "弱点特效": 1,
                    "皮革制品之柔韧": 1
                }, 62, [1, 2, -3, -1, 1]],
                ["缠蛙头盔β", 3, 3, 0, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "快吃": 1,
                    "皮革制品之顺滑": 1
                }, 62, [1, 2, -3, -1, 1]],
                ["缠蛙铠甲β", 3, 3, 1, 0, 0, 0, 5, 0, 3, [1, 1, 1], {
                        "快吃": 1,
                        "皮革制品之顺滑": 1
                    },
                    62, [1, 2, -3, -1, 1]
                ],
                ["缠蛙腕甲β", 3, 3, 2, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "道具使用强化": 1,
                    "皮革制品之顺滑": 1
                }, 62, [1, 2, -3, -1, 1]],
                ["缠蛙腰甲β", 3, 3, 3, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "快吃": 1,
                    "皮革制品之顺滑": 1
                }, 62, [1, 2, -3, -1, 1]],
                ["缠蛙护腿β", 3, 3, 4, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "弱点特效": 1,
                    "皮革制品之顺滑": 1
                }, 62, [1, 2, -3, -1, 1]],
                ["炎尾龙头盔α",
                    3, 3, 0, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                        "减轻胆怯": 1,
                        "力量解放": 1,
                        "铺鳞之技法": 1
                    },
                    62, [2, -3, 0, -1, 0]
                ],
                ["炎尾龙铠甲α", 3, 3, 1, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "火耐性": 1,
                    "力量解放": 1,
                    "铺鳞之技法": 1
                }, 62, [2, -3, 0, -1, 0]],
                ["炎尾龙腕甲α", 3, 3, 2, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "减轻胆怯": 1,
                    "火耐性": 1,
                    "铺鳞之技法": 1
                }, 62, [2, -3, 0, -1, 0]],
                ["炎尾龙腰甲α",
                    3, 3, 3, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                        "火耐性": 1,
                        "力量解放": 1,
                        "铺鳞之技法": 1
                    },
                    62, [2, -3, 0, -1, 0]
                ],
                ["炎尾龙护腿α", 3, 3, 4, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "减轻胆怯": 1,
                    "回避距离提升": 1,
                    "铺鳞之技法": 1
                }, 62, [2, -3, 0, -1, 0]],
                ["炎尾龙头盔β", 3, 3, 0, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "力量解放": 1,
                    "叠鳞之工艺": 1
                }, 62, [2, -3, 0, -1, 0]],
                ["炎尾龙铠甲β",
                    3, 3, 1, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                        "力量解放": 1,
                        "叠鳞之工艺": 1
                    },
                    62, [2, -3, 0, -1, 0]
                ],
                ["炎尾龙腕甲β", 3, 3, 2, 0, 0, 0, 5, 0, 2, [2, 1, 0], {
                    "减轻胆怯": 1,
                    "叠鳞之工艺": 1
                }, 62, [2, -3, 0, -1, 0]],
                ["炎尾龙腰甲β", 3, 3, 3, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "火耐性": 1,
                    "叠鳞之工艺": 1
                }, 62, [2, -3, 0, -1, 0]],
                ["炎尾龙护腿β", 3, 3, 4, 0, 0, 0, 5, 0, 3, [1, 1, 1], {
                        "减轻胆怯": 1,
                        "叠鳞之工艺": 1
                    },
                    62, [2, -3, 0, -1, 0]
                ],
                ["刺花蜘蛛头盔α", 3, 3, 0, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "麻痹耐性": 1,
                    "攻势": 1,
                    "甲虫之直觉": 1
                }, 62, [-3, 3, 0, 0, 3]],
                ["刺花蜘蛛铠甲α", 3, 3, 1, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "体力回复量提升": 2,
                    "回避性能": 1,
                    "甲虫之直觉": 1
                }, 62, [-3, 3, 0, 0, 3]],
                ["刺花蜘蛛腕甲α", 3, 3, 2, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "体力回复量提升": 1,
                    "攻势": 1,
                    "甲虫之直觉": 1
                }, 62, [-3, 3, 0, 0, 3]],
                ["刺花蜘蛛腰甲α", 3, 3, 3, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "麻痹耐性": 2,
                    "甲虫之直觉": 1
                }, 62, [-3, 3, 0, 0, 3]],
                ["刺花蜘蛛护腿α", 3, 3, 4, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "回避性能": 1,
                    "攻势": 1,
                    "甲虫之直觉": 1
                }, 62, [-3, 3, 0, 0, 3]],
                ["刺花蜘蛛头盔β", 3, 3, 0, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                        "攻势": 1,
                        "甲虫之拟态": 1
                    },
                    62, [-3, 3, 0, 0, 3]
                ],
                ["刺花蜘蛛铠甲β", 3, 3, 1, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "体力回复量提升": 1,
                    "回避性能": 1,
                    "甲虫之拟态": 1
                }, 62, [-3, 3, 0, 0, 3]],
                ["刺花蜘蛛腕甲β", 3, 3, 2, 0, 0, 0, 5, 0, 2, [2, 1, 0], {
                    "体力回复量提升": 1,
                    "甲虫之拟态": 1
                }, 62, [-3, 3, 0, 0, 3]],
                ["刺花蜘蛛腰甲β", 3, 3, 3, 0, 0, 0, 5, 0, 2, [2, 1, 0], {
                        "麻痹耐性": 1,
                        "甲虫之拟态": 1
                    },
                    62, [-3, 3, 0, 0, 3]
                ],
                ["刺花蜘蛛护腿β", 3, 3, 4, 0, 0, 0, 5, 0, 3, [1, 1, 1], {
                    "回避性能": 1,
                    "甲虫之拟态": 1
                }, 62, [-3, 3, 0, 0, 3]],
                ["桃毛兽王头盔α", 3, 3, 0, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "威吓": 1,
                    "满足感": 1,
                    "毛皮之昂扬": 1
                }, 62, [-3, 1, 1, -1, 2]],
                ["桃毛兽王铠甲α", 3, 3, 1, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "威吓": 2,
                    "连击": 1,
                    "毛皮之昂扬": 1
                }, 62, [-3, 1, 1, -1, 2]],
                ["桃毛兽王腕甲α",
                    3, 3, 2, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                        "最爱蘑菇": 1,
                        "快吃": 1,
                        "毛皮之昂扬": 1
                    },
                    62, [-3, 1, 1, -1, 2]
                ],
                ["桃毛兽王腰甲α", 3, 3, 3, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "最爱蘑菇": 1,
                    "满足感": 1,
                    "毛皮之昂扬": 1
                }, 62, [-3, 1, 1, -1, 2]],
                ["桃毛兽王护腿α", 3, 3, 4, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "最爱蘑菇": 1,
                    "连击": 1,
                    "毛皮之昂扬": 1
                }, 62, [-3, 1, 1, -1, 2]],
                ["桃毛兽王头盔β",
                    3, 3, 0, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                        "威吓": 1,
                        "毛皮之诱惑": 1
                    },
                    62, [-3, 1, 1, -1, 2]
                ],
                ["桃毛兽王铠甲β", 3, 3, 1, 0, 0, 0, 5, 0, 3, [1, 1, 1], {
                    "威吓": 2,
                    "毛皮之诱惑": 1
                }, 62, [-3, 1, 1, -1, 2]],
                ["桃毛兽王腕甲β", 3, 3, 2, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "最爱蘑菇": 1,
                    "毛皮之诱惑": 1
                }, 62, [-3, 1, 1, -1, 2]],
                ["桃毛兽王腰甲β", 3, 3, 3, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                        "最爱蘑菇": 1,
                        "毛皮之诱惑": 1
                    },
                    62, [-3, 1, 1, -1, 2]
                ],
                ["桃毛兽王护腿β", 3, 3, 4, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "连击": 1,
                    "毛皮之诱惑": 1
                }, 62, [-3, 1, 1, -1, 2]],
                ["沼喷龙头盔α", 3, 3, 0, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "广域化": 2,
                    "皮革制品之柔韧": 1
                }, 62, [0, -3, 0, 0, 1]],
                ["沼喷龙铠甲α", 3, 3, 1, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "毒耐性": 2,
                    "广域化": 1,
                    "皮革制品之柔韧": 1
                }, 62, [0, -3, 0, 0, 1]],
                ["沼喷龙腕甲α",
                    3, 3, 2, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                        "毒耐性": 1,
                        "耳塞": 1,
                        "皮革制品之柔韧": 1
                    },
                    62, [0, -3, 0, 0, 1]
                ],
                ["沼喷龙腰甲α", 3, 3, 3, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "广域化": 1,
                    "攻势": 1,
                    "皮革制品之柔韧": 1
                }, 62, [0, -3, 0, 0, 1]],
                ["沼喷龙护腿α", 3, 3, 4, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "广域化": 2,
                    "耳塞": 1,
                    "皮革制品之柔韧": 1
                }, 62, [0, -3, 0, 0, 1]],
                ["沼喷龙头盔β",
                    3, 3, 0, 0, 0, 0, 5, 0, 2, [2, 1, 0], {
                        "广域化": 1,
                        "皮革制品之顺滑": 1
                    },
                    62, [0, -3, 0, 0, 1]
                ],
                ["沼喷龙铠甲β", 3, 3, 1, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "毒耐性": 2,
                    "皮革制品之顺滑": 1
                }, 62, [0, -3, 0, 0, 1]],
                ["沼喷龙腕甲β", 3, 3, 2, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "耳塞": 1,
                    "皮革制品之顺滑": 1
                }, 62, [0, -3, 0, 0, 1]],
                ["沼喷龙腰甲β", 3, 3, 3, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "攻势": 1,
                    "皮革制品之顺滑": 1
                }, 62, [0, -3, 0, 0, 1]],
                ["沼喷龙护腿β", 3, 3, 4, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "广域化": 2,
                    "皮革制品之顺滑": 1
                }, 62, [0, -3, 0, 0, 1]],
                ["毒怪鸟头盔α", 3, 3, 0, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "耐力急速回复": 1,
                    "闪光强化": 1,
                    "皮革制品之柔韧": 1
                }, 62, [-4, 3, 4, -1, 1]],
                ["毒怪鸟铠甲α", 3, 3, 1, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "耐力急速回复": 1,
                    "毒耐性": 1,
                    "皮革制品之柔韧": 1
                }, 62, [-4, 3, 4, -1, 1]],
                ["毒怪鸟腕甲α", 3, 3, 2, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "怨恨": 2,
                    "毒耐性": 1,
                    "皮革制品之柔韧": 1
                }, 62, [-4, 3, 4, -1, 1]],
                ["毒怪鸟腰甲α", 3, 3, 3, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "耐力急速回复": 1,
                    "怨恨": 1,
                    "皮革制品之柔韧": 1
                }, 62, [-4, 3, 4, -1, 1]],
                ["毒怪鸟护腿α", 3, 3, 4, 0,
                    0, 0, 5, 0, 0, [0, 0, 0], {
                        "怨恨": 1,
                        "跑者": 2,
                        "皮革制品之柔韧": 1
                    },
                    62, [-4, 3, 4, -1, 1]
                ],
                ["毒怪鸟头盔β", 3, 3, 0, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "耐力急速回复": 1,
                    "皮革制品之顺滑": 1
                }, 62, [-4, 3, 4, -1, 1]],
                ["毒怪鸟铠甲β", 3, 3, 1, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "耐力急速回复": 1,
                    "皮革制品之顺滑": 1
                }, 62, [-4, 3, 4, -1, 1]],
                ["毒怪鸟腕甲β",
                    3, 3, 2, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                        "怨恨": 2,
                        "皮革制品之顺滑": 1
                    },
                    62, [-4, 3, 4, -1, 1]
                ],
                ["毒怪鸟腰甲β", 3, 3, 3, 0, 0, 0, 5, 0, 2, [2, 1, 0], {
                    "耐力急速回复": 1,
                    "皮革制品之顺滑": 1
                }, 62, [-4, 3, 4, -1, 1]],
                ["毒怪鸟护腿β", 3, 3, 4, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "怨恨": 1,
                    "跑者": 1,
                    "皮革制品之顺滑": 1
                }, 62, [-4, 3, 4, -1, 1]],
                ["影蜘蛛头盔α", 3, 3, 0, 0, 0,
                    0, 5, 0, 0, [0, 0, 0], {
                        "束缚耐性": 1,
                        "毒耐性": 2,
                        "甲虫之直觉": 1
                    },
                    64, [-2, 2, -2, 1, 2]
                ],
                ["影蜘蛛铠甲α", 3, 3, 1, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "急袭": 1,
                    "弱点特效": 1,
                    "甲虫之直觉": 1
                }, 64, [-2, 2, -2, 1, 2]],
                ["影蜘蛛腕甲α", 3, 3, 2, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "急袭": 1,
                    "毒耐性": 1,
                    "甲虫之直觉": 1
                }, 64, [-2, 2, -2, 1, 2]],
                ["影蜘蛛腰甲α", 3, 3, 3, 0, 0,
                    0, 5, 0, 0, [0, 0, 0], {
                        "束缚耐性": 1,
                        "睡眠耐性": 2,
                        "甲虫之直觉": 1
                    },
                    64, [-2, 2, -2, 1, 2]
                ],
                ["影蜘蛛护腿α", 3, 3, 4, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "急袭": 1,
                    "睡眠耐性": 1,
                    "甲虫之直觉": 1
                }, 64, [-2, 2, -2, 1, 2]],
                ["影蜘蛛头盔β", 3, 3, 0, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "束缚耐性": 1,
                    "甲虫之拟态": 1
                }, 64, [-2, 2, -2, 1, 2]],
                ["影蜘蛛铠甲β", 3, 3, 1, 0, 0, 0, 5, 0,
                    3, [1, 1, 1], {
                        "急袭": 1,
                        "甲虫之拟态": 1
                    },
                    64, [-2, 2, -2, 1, 2]
                ],
                ["影蜘蛛腕甲β", 3, 3, 2, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "急袭": 1,
                    "甲虫之拟态": 1
                }, 64, [-2, 2, -2, 1, 2]],
                ["影蜘蛛腰甲β", 3, 3, 3, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "束缚耐性": 1,
                    "甲虫之拟态": 1
                }, 64, [-2, 2, -2, 1, 2]],
                ["影蜘蛛护腿β", 3, 3, 4, 0, 0, 0, 5, 0, 2, [2, 1, 0], {
                        "睡眠耐性": 1,
                        "甲虫之拟态": 1
                    },
                    64, [-2, 2, -2, 1, 2]
                ],
                ["沙海龙头盔α", 3, 3, 0, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "地质学": 1,
                    "回避性能": 1,
                    "铺鳞之技法": 1
                }, 64, [-1, 2, -3, 1, 1]],
                ["沙海龙铠甲α", 3, 3, 1, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "地质学": 1,
                    "耐力急速回复": 1,
                    "铺鳞之技法": 1
                }, 64, [-1, 2, -3, 1, 1]],
                ["沙海龙腕甲α", 3, 3, 2, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "回避距离提升": 1,
                    "耐力急速回复": 1,
                    "铺鳞之技法": 1
                }, 64, [-1, 2, -3, 1, 1]],
                ["沙海龙腰甲α", 3, 3, 3, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "回避距离提升": 1,
                    "回避性能": 1,
                    "铺鳞之技法": 1
                }, 64, [-1, 2, -3, 1, 1]],
                ["沙海龙护腿α", 3, 3, 4, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "回避距离提升": 1,
                    "地质学": 1,
                    "铺鳞之技法": 1
                }, 64, [-1, 2, -3, 1, 1]],
                ["沙海龙头盔β", 3, 3, 0, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "回避性能": 1,
                    "叠鳞之工艺": 1
                }, 64, [-1, 2, -3, 1, 1]],
                ["沙海龙铠甲β", 3, 3, 1, 0, 0, 0, 5, 0, 3, [1, 1, 1], {
                    "地质学": 1,
                    "叠鳞之工艺": 1
                }, 64, [-1, 2, -3, 1, 1]],
                ["沙海龙腕甲β", 3, 3, 2, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "回避距离提升": 1,
                    "叠鳞之工艺": 1
                }, 64, [-1, 2, -3, 1, 1]],
                ["沙海龙腰甲β", 3, 3, 3, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "回避性能": 1,
                    "叠鳞之工艺": 1
                }, 64, [-1, 2,
                    -3, 1, 1
                ]],
                ["沙海龙护腿β", 3, 3, 4, 0, 0, 0, 5, 0, 3, [1, 1, 1], {
                    "回避距离提升": 1,
                    "叠鳞之工艺": 1
                }, 64, [-1, 2, -3, 1, 1]],
                ["风铗龙头盔α", 3, 3, 0, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "回避性能": 1,
                    "回避距离提升": 1,
                    "铺鳞之技法": 1
                }, 64, [-3, 2, -2, 3, 0]],
                ["风铗龙铠甲α", 3, 3, 1, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                        "冰耐性": 2,
                        "回避性能": 1,
                        "铺鳞之技法": 1
                    },
                    64, [-3, 2, -2, 3, 0]
                ],
                ["风铗龙腕甲α", 3, 3, 2, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "回避性能": 1,
                    "无伤": 1,
                    "铺鳞之技法": 1
                }, 64, [-3, 2, -2, 3, 0]],
                ["风铗龙腰甲α", 3, 3, 3, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "回避性能": 2,
                    "铺鳞之技法": 1
                }, 64, [-3, 2, -2, 3, 0]],
                ["风铗龙护腿α", 3, 3, 4, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "冰耐性": 1,
                    "无伤": 1,
                    "铺鳞之技法": 1
                }, 64, [-3, 2, -2, 3, 0]],
                ["风铗龙头盔β",
                    3, 3, 0, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                        "回避性能": 1,
                        "叠鳞之工艺": 1
                    },
                    64, [-3, 2, -2, 3, 0]
                ],
                ["风铗龙铠甲β", 3, 3, 1, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "冰耐性": 1,
                    "回避性能": 1,
                    "叠鳞之工艺": 1
                }, 64, [-3, 2, -2, 3, 0]],
                ["风铗龙腕甲β", 3, 3, 2, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "回避性能": 1,
                    "叠鳞之工艺": 1
                }, 64, [-3, 2, -2, 3, 0]],
                ["风铗龙腰甲β", 3, 3, 3, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "回避性能": 1,
                    "叠鳞之工艺": 1
                }, 64, [-3, 2, -2, 3, 0]],
                ["风铗龙护腿β", 3, 3, 4, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "无伤": 1,
                    "叠鳞之工艺": 1
                }, 64, [-3, 2, -2, 3, 0]],
                ["雌火龙头盔α", 3, 3, 0, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "精灵加护": 1,
                    "回复速度": 1,
                    "铺鳞之技法": 1
                }, 64, [2, 0, -2, 0, -3]],
                ["雌火龙铠甲α", 3, 3, 1, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "攻势": 2,
                    "铺鳞之技法": 1
                }, 64, [2, 0, -2,
                    0, -3
                ]],
                ["雌火龙腕甲α", 3, 3, 2, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "攻势": 1,
                    "精灵加护": 2,
                    "铺鳞之技法": 1
                }, 64, [2, 0, -2, 0, -3]],
                ["雌火龙腰甲α", 3, 3, 3, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "攻势": 1,
                    "整备": 1,
                    "铺鳞之技法": 1
                }, 64, [2, 0, -2, 0, -3]],
                ["雌火龙护腿α", 3, 3, 4, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "攻势": 1,
                    "回复速度": 2,
                    "铺鳞之技法": 1
                }, 64, [2, 0, -2, 0, -3]],
                ["雌火龙头盔β",
                    3, 3, 0, 0, 0, 0, 5, 0, 2, [2, 1, 0], {
                        "精灵加护": 1,
                        "叠鳞之工艺": 1
                    },
                    64, [2, 0, -2, 0, -3]
                ],
                ["雌火龙铠甲β", 3, 3, 1, 0, 0, 0, 5, 0, 3, [1, 1, 1], {
                    "攻势": 1,
                    "叠鳞之工艺": 1
                }, 64, [2, 0, -2, 0, -3]],
                ["雌火龙腕甲β", 3, 3, 2, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "攻势": 1,
                    "精灵加护": 1,
                    "叠鳞之工艺": 1
                }, 64, [2, 0, -2, 0, -3]],
                ["雌火龙腰甲β", 3, 3, 3, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                        "攻势": 1,
                        "叠鳞之工艺": 1
                    },
                    64, [2, 0, -2, 0, -3]
                ],
                ["雌火龙护腿β", 3, 3, 4, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "攻势": 1,
                    "回复速度": 1,
                    "叠鳞之工艺": 1
                }, 64, [2, 0, -2, 0, -3]],
                ["铸铁头盔α", 3, 3, 0, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "精灵加护": 2,
                    "怨恨": 1
                }, 64, [-2, 0, 3, -1, 0]],
                ["铸铁铠甲α", 3, 3, 1, 0, 0, 0, 6, 0, 2, [1, 1, 0], {
                    "风压耐性": 1,
                    "怨恨": 1
                }, 64, [-2, 0, 3, -1, 0]],
                ["铸铁腕甲α", 3, 3, 2, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "昏厥耐性": 1,
                    "怨恨": 1
                }, 64, [-2, 0, 3, -1, 0]],
                ["铸铁腰甲α", 3, 3, 3, 0, 0, 0, 6, 0, 3, [1, 1, 1], {
                    "精灵加护": 1,
                    "怨恨": 1
                }, 64, [-2, 0, 3, -1, 0]],
                ["铸铁护腿α", 3, 3, 4, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "风压耐性": 1,
                    "怨恨": 1
                }, 64, [-2, 0, 3, -1, 0]],
                ["护鹭鹰龙腰甲α", 3, 3, 3, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "跳跃铁人": 1,
                    "耳塞": 2,
                    "护龙之脉动": 1
                }, 64, [0, 0, 4, 0, -3]],
                ["护鹭鹰龙腰甲β",
                    3, 3, 3, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                        "跳跃铁人": 1,
                        "耳塞": 1,
                        "护龙之守护": 1
                    },
                    64, [0, 0, 4, 0, -3]
                ],
                ["咬鱼靴α", 3, 3, 4, 0, 0, 0, 6, 0, 3, [1, 1, 1], {
                    "水耐性": 1,
                    "猎人生活": 1,
                    "皮革制品之柔韧": 1
                }, 64, [0, 5, 0, 0, 0]],
                ["护雷颚龙头盔α", 3, 3, 0, 0, 0, 0, 6, 0, 0, [0, 0, 0], {
                        "挑战者": 2,
                        "因祸得福": 1,
                        "雷颚龙之斗志": 1,
                        "护龙之脉动": 1
                    }, 68,
                    [-1, -1, 2, -3, -2]
                ],
                ["护雷颚龙铠甲α", 3, 3, 1, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "精神抖擞": 1,
                    "因祸得福": 1,
                    "雷颚龙之斗志": 1,
                    "护龙之脉动": 1
                }, 68, [-1, -1, 2, -3, -2]],
                ["护雷颚龙腕甲α", 3, 3, 2, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "精神抖擞": 1,
                    "挑战者": 1,
                    "雷颚龙之斗志": 1,
                    "护龙之脉动": 1
                }, 68, [-1, -1, 2, -3, -2]],
                ["护雷颚龙腰甲α",
                    3, 3, 3, 0, 0, 0, 6, 0, 2, [1, 1, 0], {
                        "耐力急速回复": 1,
                        "精神抖擞": 1,
                        "雷颚龙之斗志": 1,
                        "护龙之脉动": 1
                    },
                    68, [-1, -1, 2, -3, -2]
                ],
                ["护雷颚龙护腿α", 3, 3, 4, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "因祸得福": 1,
                    "耐力急速回复": 2,
                    "雷颚龙之斗志": 1,
                    "护龙之脉动": 1
                }, 68, [-1, -1, 2, -3, -2]],
                ["护雷颚龙头盔β", 3, 3, 0, 0, 0, 0, 6, 0, 1, [2,
                    0, 0
                ], {
                    "挑战者": 2,
                    "雷颚龙之斗志": 1,
                    "护龙之守护": 1
                }, 68, [-1, -1, 2, -3, -2]],
                ["护雷颚龙铠甲β", 3, 3, 1, 0, 0, 0, 6, 0, 3, [2, 1, 1], {
                    "精神抖擞": 1,
                    "雷颚龙之斗志": 1,
                    "护龙之守护": 1
                }, 68, [-1, -1, 2, -3, -2]],
                ["护雷颚龙腕甲β", 3, 3, 2, 0, 0, 0, 6, 0, 2, [2, 2, 0], {
                        "精神抖擞": 1,
                        "雷颚龙之斗志": 1,
                        "护龙之守护": 1
                    },
                    68, [-1, -1, 2, -3, -2]
                ],
                ["护雷颚龙腰甲β", 3, 3, 3, 0, 0, 0, 6, 0, 2, [2, 2, 0], {
                    "耐力急速回复": 1,
                    "雷颚龙之斗志": 1,
                    "护龙之守护": 1
                }, 68, [-1, -1, 2, -3, -2]],
                ["护雷颚龙护腿β", 3, 3, 4, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "因祸得福": 1,
                    "耐力急速回复": 1,
                    "雷颚龙之斗志": 1,
                    "护龙之守护": 1
                }, 68, [-1, -1, 2, -3, -2]],
                ["辟兽头盔α",
                    3, 3, 0, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                        "满足感": 2,
                        "昏厥耐性": 1,
                        "辟兽之力": 1,
                        "毛皮之昂扬": 1
                    },
                    68, [-3, 2, -1, -1, 4]
                ],
                ["辟兽铠甲α", 3, 3, 1, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "力量解放": 1,
                    "耐力急速回复": 1,
                    "辟兽之力": 1,
                    "毛皮之昂扬": 1
                }, 68, [-3, 2, -1, -1, 4]],
                ["辟兽腕甲α", 3, 3, 2, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "昏厥耐性": 2,
                    "耐力急速回复": 1,
                    "辟兽之力": 1,
                    "毛皮之昂扬": 1
                }, 68, [-3, 2, -1, -1, 4]],
                ["辟兽腰甲α", 3, 3, 3, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "力量解放": 2,
                    "辟兽之力": 1,
                    "毛皮之昂扬": 1
                }, 68, [-3, 2, -1, -1, 4]],
                ["辟兽护腿α", 3, 3, 4, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "满足感": 1,
                    "体力回复量提升": 2,
                    "辟兽之力": 1,
                    "毛皮之昂扬": 1
                }, 68, [-3, 2, -1, -1, 4]],
                ["辟兽头盔β",
                    3, 3, 0, 0, 0, 0, 6, 0, 3, [2, 1, 1], {
                        "满足感": 1,
                        "昏厥耐性": 1,
                        "辟兽之力": 1,
                        "毛皮之诱惑": 1
                    },
                    68, [-3, 2, -1, -1, 4]
                ],
                ["辟兽铠甲β", 3, 3, 1, 0, 0, 0, 6, 0, 3, [1, 1, 1], {
                    "力量解放": 1,
                    "辟兽之力": 1,
                    "毛皮之诱惑": 1
                }, 68, [-3, 2, -1, -1, 4]],
                ["辟兽腕甲β", 3, 3, 2, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                        "昏厥耐性": 1,
                        "耐力急速回复": 1,
                        "辟兽之力": 1,
                        "毛皮之诱惑": 1
                    },
                    68, [-3, 2, -1, -1, 4]
                ],
                ["辟兽腰甲β", 3, 3, 3, 0, 0, 0, 6, 0, 2, [2, 2, 0], {
                    "力量解放": 1,
                    "辟兽之力": 1,
                    "毛皮之诱惑": 1
                }, 68, [-3, 2, -1, -1, 4]],
                ["辟兽护腿β", 3, 3, 4, 0, 0, 0, 6, 0, 3, [2, 1, 1], {
                    "满足感": 1,
                    "体力回复量提升": 1,
                    "辟兽之力": 1,
                    "毛皮之诱惑": 1
                }, 68, [-3, 2, -1, -1, 4]],
                ["护辟兽头盔α", 3, 3, 0, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "火场怪力": 1,
                    "饥饿耐性": 2,
                    "辟兽之力": 1,
                    "护龙之脉动": 1
                }, 68, [-3, 2, -1, -2, 2]],
                ["护辟兽铠甲α", 3, 3, 1, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "体术": 2,
                    "防御力下降耐性": 1,
                    "辟兽之力": 1,
                    "护龙之脉动": 1
                }, 68, [-3, 2, -1, -2, 2]],
                ["护辟兽腕甲α", 3, 3, 2, 0, 0, 0, 6, 0, 3, [1, 1, 1], {
                        "火场怪力": 1,
                        "防御力下降耐性": 2,
                        "辟兽之力": 1,
                        "护龙之脉动": 1
                    },
                    68, [-3, 2, -1, -2, 2]
                ],
                ["护辟兽腰甲α", 3, 3, 3, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "火场怪力": 2,
                    "饥饿耐性": 1,
                    "辟兽之力": 1,
                    "护龙之脉动": 1
                }, 68, [-3, 2, -1, -2, 2]],
                ["护辟兽护腿α", 3, 3, 4, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "火场怪力": 1,
                    "体术": 2,
                    "辟兽之力": 1,
                    "护龙之脉动": 1
                }, 68, [-3, 2, -1, -2, 2]],
                ["护辟兽头盔β", 3, 3, 0, 0, 0, 0, 6, 0, 3, [2, 2, 1], {
                    "火场怪力": 1,
                    "辟兽之力": 1,
                    "护龙之守护": 1
                }, 68, [-3, 2, -1, -2, 2]],
                ["护辟兽铠甲β", 3, 3, 1, 0, 0, 0, 6, 0, 2, [2, 2, 0], {
                    "体术": 2,
                    "辟兽之力": 1,
                    "护龙之守护": 1
                }, 68, [-3, 2, -1, -2, 2]],
                ["护辟兽腕甲β", 3, 3, 2, 0, 0, 0, 6, 0, 3, [2, 2, 1], {
                    "火场怪力": 1,
                    "辟兽之力": 1,
                    "护龙之守护": 1
                }, 68, [-3, 2, -1, -2, 2]],
                ["护辟兽腰甲β", 3, 3, 3, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "火场怪力": 2,
                    "辟兽之力": 1,
                    "护龙之守护": 1
                }, 68, [-3, 2, -1, -2, 2]],
                ["护辟兽护腿β", 3, 3, 4, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "火场怪力": 1,
                    "体术": 1,
                    "辟兽之力": 1,
                    "护龙之守护": 1
                }, 68, [-3, 2, -1, -2, 2]],
                ["赫猿兽头盔α", 3, 3, 0, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "怨恨": 2,
                    "炸弹客": 1,
                    "毛皮之昂扬": 1
                }, 68, [3, -3, 1, -2, 0]],
                ["赫猿兽铠甲α", 3, 3, 1, 0, 0, 0, 6, 0, 1, [1,
                    0, 0
                ], {
                    "怨恨": 2,
                    "爆破异常耐性": 1,
                    "毛皮之昂扬": 1
                }, 68, [3, -3, 1, -2, 0]],
                ["赫猿兽腕甲α", 3, 3, 2, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "破坏王": 1,
                    "炸弹客": 2,
                    "毛皮之昂扬": 1
                }, 68, [3, -3, 1, -2, 0]],
                ["赫猿兽腰甲α", 3, 3, 3, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "破坏王": 2,
                    "爆破异常耐性": 2,
                    "毛皮之昂扬": 1
                }, 68, [3, -3, 1, -2, 0]],
                ["赫猿兽护腿α",
                    3, 3, 4, 0, 0, 0, 6, 0, 0, [0, 0, 0], {
                        "破坏王": 2,
                        "怨恨": 1,
                        "毛皮之昂扬": 1
                    },
                    68, [3, -3, 1, -2, 0]
                ],
                ["赫猿兽头盔β", 3, 3, 0, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "怨恨": 1,
                    "炸弹客": 1,
                    "毛皮之诱惑": 1
                }, 68, [3, -3, 1, -2, 0]],
                ["赫猿兽铠甲β", 3, 3, 1, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "怨恨": 2,
                    "毛皮之诱惑": 1
                }, 68, [3, -3, 1, -2, 0]],
                ["赫猿兽腕甲β", 3, 3, 2, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "破坏王": 1,
                    "炸弹客": 1,
                    "毛皮之诱惑": 1
                }, 68, [3, -3, 1, -2, 0]],
                ["赫猿兽腰甲β", 3, 3, 3, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "破坏王": 2,
                    "爆破异常耐性": 1,
                    "毛皮之诱惑": 1
                }, 68, [3, -3, 1, -2, 0]],
                ["赫猿兽护腿β", 3, 3, 4, 0, 0, 0, 6, 0, 2, [1, 1, 0], {
                    "破坏王": 2,
                    "毛皮之诱惑": 1
                }, 68, [3, -3, 1, -2, 0]],
                ["护凶爪龙头盔α", 3, 3, 0, 0, 0, 0, 6, 0, 0, [0, 0, 0], {
                    "连击": 2,
                    "耳塞": 1,
                    "凶爪龙之力": 1,
                    "护龙之脉动": 1
                }, 74, [-2, -3, -2, -2, 4]],
                ["护凶爪龙铠甲α", 3, 3, 1, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "耳塞": 1,
                    "裂伤耐性": 2,
                    "凶爪龙之力": 1,
                    "护龙之脉动": 1
                }, 74, [-2, -3, -2, -2, 4]],
                ["护凶爪龙腕甲α", 3, 3, 2, 0, 0, 0, 6, 0, 0, [0, 0, 0], {
                    "连击": 2,
                    "精灵加护": 1,
                    "凶爪龙之力": 1,
                    "护龙之脉动": 1
                }, 74, [-2, -3,
                    -2, -2, 4
                ]],
                ["护凶爪龙腰甲α", 3, 3, 3, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "连击": 1,
                    "裂伤耐性": 1,
                    "凶爪龙之力": 1,
                    "护龙之脉动": 1
                }, 74, [-2, -3, -2, -2, 4]],
                ["护凶爪龙护腿α", 3, 3, 4, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "耳塞": 1,
                    "精灵加护": 2,
                    "凶爪龙之力": 1,
                    "护龙之脉动": 1
                }, 74, [-2, -3, -2, -2, 4]],
                ["护凶爪龙头盔β", 3, 3, 0, 0, 0, 0, 6, 0, 1, [2, 0, 0],
                    {
                        "连击": 2,
                        "凶爪龙之力": 1,
                        "护龙之守护": 1
                    },
                    74, [-2, -3, -2, -2, 4]
                ],
                ["护凶爪龙铠甲β", 3, 3, 1, 0, 0, 0, 6, 0, 2, [2, 2, 0], {
                    "耳塞": 1,
                    "凶爪龙之力": 1,
                    "护龙之守护": 1
                }, 74, [-2, -3, -2, -2, 4]],
                ["护凶爪龙腕甲β", 3, 3, 2, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "连击": 1,
                    "精灵加护": 1,
                    "凶爪龙之力": 1,
                    "护龙之守护": 1
                }, 74, [-2, -3, -2, -2, 4]],
                ["护凶爪龙腰甲β",
                    3, 3, 3, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                        "连击": 1,
                        "凶爪龙之力": 1,
                        "护龙之守护": 1
                    },
                    74, [-2, -3, -2, -2, 4]
                ],
                ["护凶爪龙护腿β", 3, 3, 4, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "耳塞": 1,
                    "精灵加护": 1,
                    "凶爪龙之力": 1,
                    "护龙之守护": 1
                }, 74, [-2, -3, -2, -2, 4]],
                ["暗器蛸头盔α", 3, 3, 0, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                        "巧击": 2,
                        "急袭": 1,
                        "暗器蛸之力": 1,
                        "皮革制品之柔韧": 1
                    },
                    68, [1, 1, 1, -3, 2]
                ],
                ["暗器蛸铠甲α", 3, 3, 1, 0, 0, 0, 6, 0, 0, [0, 0, 0], {
                    "火场怪力": 3,
                    "急袭": 1,
                    "暗器蛸之力": 1,
                    "皮革制品之柔韧": 1
                }, 68, [1, 1, 1, -3, 2]],
                ["暗器蛸腕甲α", 3, 3, 2, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "耳塞": 2,
                    "暗器蛸之力": 1,
                    "皮革制品之柔韧": 1
                }, 68, [1, 1, 1, -3, 2]],
                ["暗器蛸腰甲α", 3, 3, 3, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "耳塞": 1,
                    "火场怪力": 2,
                    "暗器蛸之力": 1,
                    "皮革制品之柔韧": 1
                }, 68, [1, 1, 1, -3, 2]],
                ["暗器蛸护腿α", 3, 3, 4, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "巧击": 1,
                    "急袭": 1,
                    "暗器蛸之力": 1,
                    "皮革制品之柔韧": 1
                }, 68, [1, 1, 1, -3, 2]],
                ["暗器蛸头盔β", 3, 3, 0, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "巧击": 2,
                    "暗器蛸之力": 1,
                    "皮革制品之顺滑": 1
                }, 68, [1, 1, 1, -3, 2]],
                ["暗器蛸铠甲β",
                    3, 3, 1, 0, 0, 0, 6, 0, 2, [1, 1, 0], {
                        "火场怪力": 3,
                        "暗器蛸之力": 1,
                        "皮革制品之顺滑": 1
                    },
                    68, [1, 1, 1, -3, 2]
                ],
                ["暗器蛸腕甲β", 3, 3, 2, 0, 0, 0, 6, 0, 3, [2, 2, 1], {
                    "耳塞": 1,
                    "暗器蛸之力": 1,
                    "皮革制品之顺滑": 1
                }, 68, [1, 1, 1, -3, 2]],
                ["暗器蛸腰甲β", 3, 3, 3, 0, 0, 0, 6, 0, 3, [2, 1, 1], {
                        "耳塞": 1,
                        "火场怪力": 1,
                        "暗器蛸之力": 1,
                        "皮革制品之顺滑": 1
                    },
                    68, [1, 1, 1, -3, 2]
                ],
                ["暗器蛸护腿β", 3, 3, 4, 0, 0, 0, 6, 0, 3, [2, 2, 1], {
                    "巧击": 1,
                    "暗器蛸之力": 1,
                    "皮革制品之顺滑": 1
                }, 68, [1, 1, 1, -3, 2]],
                ["火龙头盔α", 3, 3, 0, 0, 0, 0, 6, 0, 2, [1, 1, 0], {
                    "回避性能": 2,
                    "体术": 1,
                    "火龙之力": 1,
                    "铺鳞之技法": 1
                }, 68, [3, 1, -2, 1, -3]],
                ["火龙铠甲α", 3, 3, 1, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "巧击": 2,
                    "体术": 1,
                    "火龙之力": 1,
                    "铺鳞之技法": 1
                }, 68, [3, 1, -2, 1, -3]],
                ["火龙腕甲α", 3, 3, 2, 0, 0, 0, 6, 0, 2, [1, 1, 0], {
                    "体术": 2,
                    "回避性能": 1,
                    "火龙之力": 1,
                    "铺鳞之技法": 1
                }, 68, [3, 1, -2, 1, -3]],
                ["火龙腰甲α", 3, 3, 3, 0, 0, 0, 6, 0, 0, [0, 0, 0], {
                    "巧击": 2,
                    "回避性能": 1,
                    "火龙之力": 1,
                    "铺鳞之技法": 1
                }, 68, [3, 1, -2, 1, -3]],
                ["火龙护腿α", 3, 3, 4, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "回避性能": 2,
                    "巧击": 1,
                    "火龙之力": 1,
                    "铺鳞之技法": 1
                }, 68, [3, 1, -2, 1, -3]],
                ["火龙头盔β", 3, 3, 0, 0, 0, 0, 6, 0, 2, [2, 2, 0], {
                    "回避性能": 1,
                    "体术": 1,
                    "火龙之力": 1,
                    "叠鳞之工艺": 1
                }, 68, [3, 1, -2, 1, -3]],
                ["火龙铠甲β", 3, 3, 1, 0, 0, 0, 6, 0, 2, [1, 1, 0], {
                    "巧击": 2,
                    "火龙之力": 1,
                    "叠鳞之工艺": 1
                }, 68, [3, 1, -2, 1, -3]],
                ["火龙腕甲β", 3, 3, 2, 0, 0, 0, 6, 0,
                    3, [2, 1, 1], {
                        "体术": 2,
                        "火龙之力": 1,
                        "叠鳞之工艺": 1
                    },
                    68, [3, 1, -2, 1, -3]
                ],
                ["火龙腰甲β", 3, 3, 3, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "巧击": 2,
                    "火龙之力": 1,
                    "叠鳞之工艺": 1
                }, 68, [3, 1, -2, 1, -3]],
                ["火龙护腿β", 3, 3, 4, 0, 0, 0, 6, 0, 3, [2, 2, 1], {
                    "回避性能": 2,
                    "火龙之力": 1,
                    "叠鳞之工艺": 1
                }, 68, [3, 1, -2, 1, -3]],
                ["护火龙头盔α", 3, 3, 0, 0, 0, 0, 6, 0,
                    2, [1, 1, 0], {
                        "弱点特效": 1,
                        "环境利用知识": 2,
                        "火龙之力": 1,
                        "护龙之脉动": 1
                    },
                    68, [3, 1, -2, 1, -5]
                ],
                ["护火龙铠甲α", 3, 3, 1, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "弱点特效": 1,
                    "威吓": 2,
                    "火龙之力": 1,
                    "护龙之脉动": 1
                }, 68, [3, 1, -2, 1, -5]],
                ["护火龙腕甲α", 3, 3, 2, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "弱点特效": 1,
                    "威吓": 1,
                    "环境利用知识": 1,
                    "火龙之力": 1,
                    "护龙之脉动": 1
                }, 68, [3, 1, -2, 1, -5]],
                ["护火龙腰甲α", 3, 3, 3, 0, 0, 0, 6, 0, 2, [1, 1, 0], {
                    "弱点特效": 1,
                    "风压耐性": 1,
                    "火龙之力": 1,
                    "护龙之脉动": 1
                }, 68, [3, 1, -2, 1, -5]],
                ["护火龙护腿α", 3, 3, 4, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "弱点特效": 1,
                    "风压耐性": 2,
                    "火龙之力": 1,
                    "护龙之脉动": 1
                }, 68, [3, 1, -2, 1, -5]],
                ["护火龙头盔β",
                    3, 3, 0, 0, 0, 0, 6, 0, 2, [2, 2, 0], {
                        "弱点特效": 1,
                        "火龙之力": 1,
                        "护龙之守护": 1
                    },
                    68, [3, 1, -2, 1, -5]
                ],
                ["护火龙铠甲β", 3, 3, 1, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "弱点特效": 1,
                    "威吓": 1,
                    "火龙之力": 1,
                    "护龙之守护": 1
                }, 68, [3, 1, -2, 1, -5]],
                ["护火龙腕甲β", 3, 3, 2, 0, 0, 0, 6, 0, 3, [2, 1, 1], {
                    "弱点特效": 1,
                    "火龙之力": 1,
                    "护龙之守护": 1
                }, 68, [3,
                    1, -2, 1, -5
                ]],
                ["护火龙腰甲β", 3, 3, 3, 0, 0, 0, 6, 0, 3, [2, 2, 1], {
                    "风压耐性": 1,
                    "火龙之力": 1,
                    "护龙之守护": 1
                }, 68, [3, 1, -2, 1, -5]],
                ["护火龙护腿β", 3, 3, 4, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "弱点特效": 1,
                    "风压耐性": 1,
                    "火龙之力": 1,
                    "护龙之守护": 1
                }, 68, [3, 1, -2, 1, -5]],
                ["铠龙头盔α", 3, 3, 0, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "无伤": 1,
                    "耐震": 1,
                    "铠龙之守护": 1,
                    "铺鳞之技法": 1
                }, 72, [4, -3, 1, 0, -2]],
                ["铠龙铠甲α", 3, 3, 1, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "无伤": 1,
                    "回复速度": 2,
                    "铠龙之守护": 1,
                    "铺鳞之技法": 1
                }, 72, [4, -3, 1, 0, -2]],
                ["铠龙腕甲α", 3, 3, 2, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "无伤": 2,
                    "减轻胆怯": 1,
                    "铠龙之守护": 1,
                    "铺鳞之技法": 1
                }, 72, [4, -3, 1, 0, -2]],
                ["铠龙腰甲α", 3, 3, 3, 0, 0, 0, 6, 0, 1, [2,
                    0, 0
                ], {
                    "无伤": 1,
                    "减轻胆怯": 2,
                    "铠龙之守护": 1,
                    "铺鳞之技法": 1
                }, 72, [4, -3, 1, 0, -2]],
                ["铠龙护腿α", 3, 3, 4, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "耐震": 2,
                    "回复速度": 1,
                    "铠龙之守护": 1,
                    "铺鳞之技法": 1
                }, 72, [4, -3, 1, 0, -2]],
                ["铠龙头盔β", 3, 3, 0, 0, 0, 0, 6, 0, 2, [2, 2, 0], {
                    "无伤": 1,
                    "铠龙之守护": 1,
                    "叠鳞之工艺": 1
                }, 72, [4, -3, 1, 0, -2]],
                ["铠龙铠甲β", 3, 3, 1, 0, 0, 0, 6, 0, 2, [2, 2, 0], {
                    "无伤": 1,
                    "回复速度": 1,
                    "铠龙之守护": 1,
                    "叠鳞之工艺": 1
                }, 72, [4, -3, 1, 0, -2]],
                ["铠龙腕甲β", 3, 3, 2, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "无伤": 2,
                    "铠龙之守护": 1,
                    "叠鳞之工艺": 1
                }, 72, [4, -3, 1, 0, -2]],
                ["铠龙腰甲β", 3, 3, 3, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "无伤": 1,
                    "减轻胆怯": 1,
                    "铠龙之守护": 1,
                    "叠鳞之工艺": 1
                }, 72, [4, -3, 1, 0, -2]],
                ["铠龙护腿β", 3, 3, 4, 0, 0, 0, 6, 0, 2, [2, 2, 0], {
                    "耐震": 1,
                    "回复速度": 1,
                    "铠龙之守护": 1,
                    "叠鳞之工艺": 1
                }, 72, [4, -3, 1, 0, -2]],
                ["雪狮子王头盔α", 3, 3, 0, 0, 0, 0, 6, 0, 2, [1, 1, 0], {
                    "广域化": 2,
                    "逆袭": 1,
                    "雪狮子王之斗志": 1,
                    "毛皮之昂扬": 1
                }, 68, [-4, 1, 0, 4, 0]],
                ["雪狮子王铠甲α",
                    3, 3, 1, 0, 0, 0, 6, 0, 0, [0, 0, 0], {
                        "挑战者": 2,
                        "道具使用强化": 2,
                        "雪狮子王之斗志": 1,
                        "毛皮之昂扬": 1
                    },
                    68, [-4, 1, 0, 4, 0]
                ],
                ["雪狮子王腕甲α", 3, 3, 2, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "逆袭": 1,
                    "指示随从": 2,
                    "雪狮子王之斗志": 1,
                    "毛皮之昂扬": 1
                }, 68, [-4, 1, 0, 4, 0]],
                ["雪狮子王腰甲α", 3, 3, 3, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "挑战者": 2,
                    "广域化": 1,
                    "雪狮子王之斗志": 1,
                    "毛皮之昂扬": 1
                }, 68, [-4, 1, 0, 4, 0]],
                ["雪狮子王护腿α", 3, 3, 4, 0, 0, 0, 6, 0, 2, [1, 1, 0], {
                    "挑战者": 1,
                    "逆袭": 1,
                    "雪狮子王之斗志": 1,
                    "毛皮之昂扬": 1
                }, 68, [-4, 1, 0, 4, 0]],
                ["雪狮子王头盔β", 3, 3, 0, 0, 0, 0, 6, 0, 3, [2, 1, 1], {
                        "广域化": 2,
                        "雪狮子王之斗志": 1,
                        "毛皮之诱惑": 1
                    },
                    68, [-4, 1, 0, 4, 0]
                ],
                ["雪狮子王铠甲β", 3, 3, 1, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "挑战者": 2,
                    "雪狮子王之斗志": 1,
                    "毛皮之诱惑": 1
                }, 68, [-4, 1, 0, 4, 0]],
                ["雪狮子王腕甲β", 3, 3, 2, 0, 0, 0, 6, 0, 2, [2, 2, 0], {
                    "逆袭": 1,
                    "雪狮子王之斗志": 1,
                    "毛皮之诱惑": 1
                }, 68, [-4, 1, 0, 4, 0]],
                ["雪狮子王腰甲β", 3, 3, 3, 0, 0, 0, 6, 0, 2, [1, 1, 0], {
                    "挑战者": 2,
                    "雪狮子王之斗志": 1,
                    "毛皮之诱惑": 1
                }, 68, [-4, 1, 0, 4, 0]],
                ["雪狮子王护腿β", 3, 3, 4, 0, 0, 0, 6, 0, 2, [2, 2, 0], {
                    "挑战者": 1,
                    "雪狮子王之斗志": 1,
                    "毛皮之诱惑": 1
                }, 68, [-4, 1, 0, 4, 0]],
                ["调查团头盔α", 3, 3, 0, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "挑战者": 1,
                    "精神抖擞": 1
                }, 64, [2, 2, 0, 0, 0]],
                ["调查团铠甲α", 3, 3, 1, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                        "挑战者": 1,
                        "精灵加护": 2
                    },
                    64, [2, 2, 0, 0, 0]
                ],
                ["调查团腕甲α", 3, 3, 2, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "挑战者": 1,
                    "纳刀术": 2
                }, 64, [2, 2, 0, 0, 0]],
                ["调查团腰甲α", 3, 3, 3, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "挑战者": 1,
                    "整备": 1
                }, 64, [2, 2, 0, 0, 0]],
                ["调查团护腿α", 3, 3, 4, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "挑战者": 1,
                    "耳塞": 1
                }, 64, [2, 2, 0, 0, 0]],
                ["库纳法头饰α", 3, 3, 0, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "广域化": 2,
                    "指示随从": 1,
                    "前辈之指引": 1
                }, 64, [1, 1, 4, 1, 1]],
                ["库纳法披肩α", 3, 3, 1, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "满足感": 2,
                    "指示随从": 1,
                    "前辈之指引": 1
                }, 64, [1, 1, 4, 1, 1]],
                ["库纳法腰带α", 3, 3, 3, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "快吃": 2,
                    "指示随从": 1,
                    "前辈之指引": 1
                }, 64, [1, 1, 4, 1, 1]],
                ["库纳法套裤α", 3, 3, 4, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "广域化": 2,
                    "指示随从": 1,
                    "前辈之指引": 1
                }, 64, [1, 1, 4, 1, 1]],
                ["阿孜兹头饰α", 3, 3, 0, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "精神抖擞": 2,
                    "前辈之指引": 1
                }, 64, [4, 1, 1, 1, 1]],
                ["阿孜兹围裙α", 3, 3, 1, 0, 0, 0, 6, 0, 2, [1, 1, 0], {
                    "火场怪力": 3,
                    "前辈之指引": 1
                }, 64, [4, 1, 1, 1, 1]],
                ["阿孜兹长裤α", 3, 3, 4, 0, 0, 0, 6, 0, 3, [2, 1, 1], {
                    "地质学": 3,
                    "前辈之指引": 1
                }, 64, [4, 1, 1, 1, 1]],
                ["酥加腰带α",
                    3, 3, 3, 0, 0, 0, 6, 0, 3, [2, 1, 1], {
                        "精灵加护": 3,
                        "前辈之指引": 1
                    },
                    64, [1, 1, 1, 4, 1]
                ],
                ["西尔德头巾α", 3, 3, 0, 0, 0, 0, 6, 0, 3, [2, 1, 1], {
                    "植生学": 3,
                    "前辈之指引": 1
                }, 64, [1, 1, 1, 1, 4]],
                ["西尔德大衣α", 3, 3, 1, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "广域化": 4,
                    "前辈之指引": 1
                }, 64, [1, 1, 1, 1, 4]],
                ["死神首脑α", 3, 3, 0, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                        "怨恨": 1,
                        "急袭": 1,
                        "前辈之指引": 1
                    },
                    64, [3, 2, -2, 3, 4]
                ],
                ["死神肌肉α", 3, 3, 1, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "怨恨": 1,
                    "急袭": 1,
                    "前辈之指引": 1
                }, 64, [3, 2, -2, 3, 4]],
                ["死神双手α", 3, 3, 2, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "怨恨": 1,
                    "急袭": 1,
                    "前辈之指引": 1
                }, 64, [3, 2, -2, 3, 4]],
                ["死神脐带α", 3, 3, 3, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "怨恨": 1,
                    "威吓": 2,
                    "前辈之指引": 1
                }, 64, [3, 2, -2, 3, 4]],
                ["死神脚跟α", 3, 3, 4,
                    0, 0, 0, 6, 0, 2, [2, 1, 0], {
                        "怨恨": 1,
                        "昏厥耐性": 2,
                        "前辈之指引": 1
                    },
                    64, [3, 2, -2, 3, 4]
                ],
                ["燕尾蝶护头α", 3, 3, 0, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "体术": 1,
                    "回避性能": 1,
                    "回避距离提升": 1,
                    "前辈之指引": 1
                }, 64, [-1, -1, 2, 0, 2]],
                ["燕尾蝶上身α", 3, 3, 1, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                        "体术": 1,
                        "回避性能": 1,
                        "回避距离提升": 1,
                        "前辈之指引": 1
                    },
                    64, [-1, -1, 2, 0, 2]
                ],
                ["燕尾蝶护袖α", 3, 3, 2, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "体术": 1,
                    "回避性能": 1,
                    "回复速度": 2,
                    "前辈之指引": 1
                }, 64, [-1, -1, 2, 0, 2]],
                ["燕尾蝶护腰具α", 3, 3, 3, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "体术": 1,
                    "回避性能": 1,
                    "回避距离提升": 1,
                    "前辈之指引": 1
                }, 64, [-1, -1, 2, 0, 2]],
                ["燕尾蝶脚α", 3, 3, 4, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "体术": 1,
                    "回避性能": 1,
                    "体力回复量提升": 2,
                    "前辈之指引": 1
                }, 64, [-1, -1, 2, 0, 2]],
                ["独角仙护头α", 3, 3, 0, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "火场怪力": 1,
                    "攻势": 1,
                    "睡眠耐性": 1,
                    "前辈之指引": 1
                }, 64, [-1, -1, 2, 0, 2]],
                ["独角仙上身α", 3, 3, 1, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                        "火场怪力": 1,
                        "攻势": 1,
                        "麻痹耐性": 1,
                        "前辈之指引": 1
                    },
                    64, [-1, -1, 2, 0, 2]
                ],
                ["独角仙护袖α", 3, 3, 2, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "火场怪力": 1,
                    "攻势": 1,
                    "毒耐性": 1,
                    "前辈之指引": 1
                }, 64, [-1, -1, 2, 0, 2]],
                ["独角仙护腰具α", 3, 3, 3, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "火场怪力": 1,
                    "锁刃刺击": 1,
                    "麻痹耐性": 1,
                    "前辈之指引": 1
                }, 64, [-1, -1, 2, 0, 2]],
                ["独角仙脚α", 3, 3, 4, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "火场怪力": 1,
                    "锁刃刺击": 1,
                    "毒耐性": 1,
                    "前辈之指引": 1
                }, 64, [-1, -1, 2, 0, 2]],
                ["矿石头盔α", 3, 3, 0, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "昏厥耐性": 3,
                    "破坏王": 1,
                    "前辈之指引": 1
                }, 64, [0, -1, -2, 3, 0]],
                ["矿石铠甲α", 3, 3, 1, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "防御力下降耐性": 3,
                    "破坏王": 1,
                    "前辈之指引": 1
                }, 64, [0, -1, -2, 3, 0]],
                ["矿石腕甲α", 3, 3, 2, 0, 0,
                    0, 6, 0, 1, [2, 0, 0], {
                        "爆破异常耐性": 3,
                        "破坏王": 1,
                        "前辈之指引": 1
                    },
                    64, [0, -1, -2, 3, 0]
                ],
                ["矿石腰甲α", 3, 3, 3, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "炸弹客": 3,
                    "适应水域·油泥": 2,
                    "前辈之指引": 1
                }, 64, [0, -1, -2, 3, 0]],
                ["矿石护腿α", 3, 3, 4, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "减轻胆怯": 3,
                    "裂伤耐性": 3,
                    "前辈之指引": 1
                }, 64, [0, -1, -2, 3, 0]],
                ["战斗头盔α",
                    3, 3, 0, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                        "耐力急速回复": 2,
                        "前辈之指引": 1
                    },
                    64, [2, -1, -1, 0, 0]
                ],
                ["战斗铠甲α", 3, 3, 1, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "饥饿耐性": 3,
                    "睡眠耐性": 2,
                    "前辈之指引": 1
                }, 64, [2, -1, -1, 0, 0]],
                ["战斗腕甲α", 3, 3, 2, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "满足感": 3,
                    "前辈之指引": 1
                }, 64, [2, -1, -1, 0, 0]],
                ["战斗腰甲α", 3, 3, 3, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "道具使用强化": 3,
                    "束缚耐性": 2,
                    "前辈之指引": 1
                }, 64, [2, -1, -1, 0, 0]],
                ["战斗护腿α", 3, 3, 4, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "跑者": 3,
                    "体术": 2,
                    "前辈之指引": 1
                }, 64, [2, -1, -1, 0, 0]],
                ["花瓣绽放α", 3, 3, 0, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "环境利用知识": 3,
                    "毒耐性": 2,
                    "前辈之指引": 1
                }, 64, [0, 1, 3, 0, 0]],
                ["花瓣枝干α", 3, 3, 1, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                        "整备": 3,
                        "前辈之指引": 1
                    },
                    64, [0, 1, 3, 0, 0]
                ],
                ["花瓣枝叶α", 3, 3, 2, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "回复速度": 3,
                    "麻痹耐性": 2,
                    "前辈之指引": 1
                }, 64, [0, 1, 3, 0, 0]],
                ["花瓣叶片α", 3, 3, 3, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "体力回复量提升": 3,
                    "裂伤耐性": 2,
                    "前辈之指引": 1
                }, 64, [0, 1, 3, 0, 0]],
                ["花瓣扎根α", 3, 3, 4, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                        "最爱蘑菇": 3,
                        "前辈之指引": 1
                    },
                    64, [0, 1, 3, 0, 0]
                ],
                ["机械头盔α", 3, 3, 0, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "锁刃刺击": 1,
                    "耳塞": 1,
                    "护龙之守护": 1
                }, 64, [1, -2, -2, 2, 3]],
                ["机械铠甲α", 3, 3, 1, 0, 0, 0, 6, 0, 3, [2, 1, 1], {
                    "锁刃刺击": 1,
                    "适应环境": 1,
                    "护龙之守护": 1
                }, 64, [1, -2, -2, 2, 3]],
                ["机械腕甲α", 3, 3, 2, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                        "锁刃刺击": 1,
                        "属性异常耐性": 2,
                        "护龙之守护": 1
                    },
                    64, [1, -2, -2, 2, 3]
                ],
                ["机械腰甲α", 3, 3, 3, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "锁刃刺击": 1,
                    "风压耐性": 2,
                    "护龙之守护": 1
                }, 64, [1, -2, -2, 2, 3]],
                ["机械护腿α", 3, 3, 4, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "锁刃刺击": 1,
                    "耐震": 2,
                    "护龙之守护": 1
                }, 64, [1, -2, -2, 2, 3]],
                ["杜宾头盔α", 3, 3, 0, 0, 0, 0, 7, 0, 1, [3, 0, 0], {
                    "体术": 1,
                    "耐力急速回复": 1
                }, 70, [-2, 0, -1, -1, 4]],
                ["杜宾铠甲α",
                    3, 3, 1, 0, 0, 0, 7, 0, 2, [3, 2, 0], {
                        "体术": 1,
                        "跑者": 1
                    },
                    70, [-2, 0, -1, -1, 4]
                ],
                ["杜宾腕甲α", 3, 3, 2, 0, 0, 0, 7, 0, 1, [3, 0, 0], {
                    "体术": 1,
                    "耐力急速回复": 2
                }, 70, [-2, 0, -1, -1, 4]],
                ["杜宾腰甲α", 3, 3, 3, 0, 0, 0, 7, 0, 2, [3, 1, 0], {
                    "体术": 1,
                    "跑者": 2
                }, 70, [-2, 0, -1, -1, 4]],
                ["杜宾护腿α", 3, 3, 4, 0, 0, 0, 7, 0, 2, [2, 2, 0], {
                    "体术": 1,
                    "最爱蘑菇": 2
                }, 70, [-2, 0, -1, -1, 4]],
                ["花纹钢头盔α",
                    3, 3, 0, 0, 0, 0, 7, 0, 2, [3, 1, 0], {
                        "广域化": 1,
                        "精灵加护": 2
                    },
                    70, [4, -2, 0, 0, 0]
                ],
                ["花纹钢铠甲α", 3, 3, 1, 0, 0, 0, 7, 0, 2, [2, 2, 0], {
                    "广域化": 1,
                    "体力回复量提升": 2
                }, 70, [4, -2, 0, 0, 0]],
                ["花纹钢腕甲α", 3, 3, 2, 0, 0, 0, 7, 0, 2, [3, 1, 0], {
                    "广域化": 1,
                    "精灵加护": 1
                }, 70, [4, -2, 0, 0, 0]],
                ["花纹钢腰甲α", 3, 3, 3, 0, 0, 0, 7, 0, 2, [3, 2, 0], {
                        "广域化": 1,
                        "体力回复量提升": 1
                    },
                    70, [4, -2, 0, 0, 0]
                ],
                ["花纹钢护腿α", 3, 3, 4, 0, 0, 0, 7, 0, 1, [3, 0, 0], {
                    "广域化": 1,
                    "道具使用强化": 2
                }, 70, [4, -2, 0, 0, 0]],
                ["冻峰龙头盔α", 3, 3, 0, 0, 0, 0, 7, 0, 1, [1, 0, 0], {
                    "挑战者": 1,
                    "弱点特效": 1,
                    "冻峰龙之反叛": 1,
                    "霸主之骄傲": 1
                }, 74, [-3, 2, -1, 2, -1]],
                ["冻峰龙铠甲α", 3, 3, 1, 0, 0, 0, 7, 0, 2, [3, 1, 0], {
                    "适应环境": 1,
                    "束缚耐性": 2,
                    "冻峰龙之反叛": 1,
                    "霸主之骄傲": 1
                }, 74, [-3, 2, -1, 2, -1]],
                ["冻峰龙腕甲α", 3, 3, 2, 0, 0, 0, 7, 0, 0, [0, 0, 0], {
                    "挑战者": 2,
                    "适应环境": 1,
                    "冻峰龙之反叛": 1,
                    "霸主之骄傲": 1
                }, 74, [-3, 2, -1, 2, -1]],
                ["冻峰龙腰甲α", 3, 3, 3, 0, 0, 0, 7, 0, 2, [1, 1, 0], {
                        "弱点特效": 1,
                        "耐震": 2,
                        "冻峰龙之反叛": 1,
                        "霸主之骄傲": 1
                    },
                    74, [-3, 2, -1, 2, -1]
                ],
                ["冻峰龙护腿α", 3, 3, 4, 0, 0, 0, 7, 0, 1, [1, 0, 0], {
                    "挑战者": 2,
                    "耐震": 1,
                    "冻峰龙之反叛": 1,
                    "霸主之骄傲": 1
                }, 74, [-3, 2, -1, 2, -1]],
                ["冻峰龙头盔β", 3, 3, 0, 0, 0, 0, 7, 0, 2, [2, 2, 0], {
                    "挑战者": 1,
                    "冻峰龙之反叛": 1,
                    "霸主之愤慨": 1
                }, 74, [-3, 2, -1, 2, -1]],
                ["冻峰龙铠甲β", 3, 3, 1, 0, 0, 0, 7, 0, 2, [3, 2, 0], {
                    "适应环境": 1,
                    "束缚耐性": 1,
                    "冻峰龙之反叛": 1,
                    "霸主之愤慨": 1
                }, 74, [-3, 2, -1, 2, -1]],
                ["冻峰龙腕甲β", 3, 3, 2, 0, 0, 0, 7, 0, 1, [3, 0, 0], {
                    "挑战者": 1,
                    "适应环境": 1,
                    "冻峰龙之反叛": 1,
                    "霸主之愤慨": 1
                }, 74, [-3, 2, -1, 2, -1]],
                ["冻峰龙腰甲β", 3, 3, 3, 0, 0, 0, 7, 0, 3, [1, 1, 1], {
                        "弱点特效": 1,
                        "耐震": 1,
                        "冻峰龙之反叛": 1,
                        "霸主之愤慨": 1
                    },
                    74, [-3, 2, -1, 2, -1]
                ],
                ["冻峰龙护腿β", 3, 3, 4, 0, 0, 0, 7, 0, 1, [2, 0, 0], {
                    "挑战者": 2,
                    "冻峰龙之反叛": 1,
                    "霸主之愤慨": 1
                }, 74, [-3, 2, -1, 2, -1]],
                ["波衣龙头盔α", 3, 3, 0, 0, 0, 0, 7, 0, 2, [2, 1, 0], {
                    "整备": 2,
                    "耳塞": 1,
                    "波衣龙之守护": 1,
                    "霸主之骄傲": 1
                }, 74, [-1, 4, -3, 0, 0]],
                ["波衣龙铠甲α", 3, 3, 1, 0, 0, 0, 7, 0, 1, [3, 0, 0], {
                    "整备": 2,
                    "适应水域·油泥": 1,
                    "波衣龙之守护": 1,
                    "霸主之骄傲": 1
                }, 74, [-1, 4, -3, 0, 0]],
                ["波衣龙腕甲α", 3, 3, 2, 0, 0, 0, 7, 0, 2, [2, 1, 0], {
                    "无伤": 2,
                    "纳刀术": 1,
                    "波衣龙之守护": 1,
                    "霸主之骄傲": 1
                }, 74, [-1, 4, -3, 0, 0]],
                ["波衣龙腰甲α", 3, 3, 3, 0, 0, 0, 7, 0, 2, [2, 1, 0], {
                        "无伤": 2,
                        "适应水域·油泥": 1,
                        "波衣龙之守护": 1,
                        "霸主之骄傲": 1
                    },
                    74, [-1, 4, -3, 0, 0]
                ],
                ["波衣龙护腿α", 3, 3, 4, 0, 0, 0, 7, 0, 1, [3, 0, 0], {
                    "无伤": 1,
                    "整备": 1,
                    "波衣龙之守护": 1,
                    "霸主之骄傲": 1
                }, 74, [-1, 4, -3, 0, 0]],
                ["波衣龙头盔β", 3, 3, 0, 0, 0, 0, 7, 0, 2, [3, 2, 0], {
                    "整备": 1,
                    "耳塞": 1,
                    "波衣龙之守护": 1,
                    "霸主之愤慨": 1
                }, 74, [-1, 4, -3, 0, 0]],
                ["波衣龙铠甲β", 3, 3, 1, 0, 0, 0, 7, 0, 2, [3, 1, 0], {
                    "整备": 2,
                    "波衣龙之守护": 1,
                    "霸主之愤慨": 1
                }, 74, [-1, 4, -3, 0, 0]],
                ["波衣龙腕甲β", 3, 3, 2, 0, 0, 0, 7, 0, 3, [3, 1, 1], {
                    "无伤": 1,
                    "纳刀术": 1,
                    "波衣龙之守护": 1,
                    "霸主之愤慨": 1
                }, 74, [-1, 4, -3, 0, 0]],
                ["波衣龙腰甲β", 3, 3, 3, 0, 0, 0, 7, 0, 2, [3, 1, 0], {
                    "无伤": 2,
                    "波衣龙之守护": 1,
                    "霸主之愤慨": 1
                }, 74, [-1, 4, -3, 0, 0]],
                ["波衣龙护腿β", 3, 3, 4, 0, 0, 0, 7, 0, 3, [3, 1, 1],
                    {
                        "无伤": 1,
                        "波衣龙之守护": 1,
                        "霸主之愤慨": 1
                    },
                    74, [-1, 4, -3, 0, 0]
                ],
                ["煌雷龙头盔α", 3, 3, 0, 0, 0, 0, 7, 0, 0, [0, 0, 0], {
                    "力量解放": 2,
                    "回避距离提升": 1,
                    "煌雷龙之力": 1,
                    "霸主之骄傲": 1
                }, 74, [0, -2, 4, -3, 0]],
                ["煌雷龙铠甲α", 3, 3, 1, 0, 0, 0, 7, 0, 2, [1, 1, 0], {
                    "精神抖擞": 2,
                    "耐力急速回复": 1,
                    "煌雷龙之力": 1,
                    "霸主之骄傲": 1
                }, 74, [0, -2, 4, -3, 0]],
                ["煌雷龙腕甲α", 3, 3, 2, 0, 0, 0, 7, 0, 1, [2, 0, 0], {
                    "力量解放": 2,
                    "昏厥耐性": 1,
                    "煌雷龙之力": 1,
                    "霸主之骄傲": 1
                }, 74, [0, -2, 4, -3, 0]],
                ["煌雷龙腰甲α", 3, 3, 3, 0, 0, 0, 7, 0, 1, [2, 0, 0], {
                    "耐力急速回复": 2,
                    "昏厥耐性": 2,
                    "煌雷龙之力": 1,
                    "霸主之骄傲": 1
                }, 74, [0, -2, 4, -3, 0]],
                ["煌雷龙护腿α",
                    3, 3, 4, 0, 0, 0, 7, 0, 1, [3, 0, 0], {
                        "力量解放": 1,
                        "精神抖擞": 1,
                        "煌雷龙之力": 1,
                        "霸主之骄傲": 1
                    },
                    74, [0, -2, 4, -3, 0]
                ],
                ["煌雷龙头盔β", 3, 3, 0, 0, 0, 0, 7, 0, 1, [3, 0, 0], {
                    "力量解放": 1,
                    "回避距离提升": 1,
                    "煌雷龙之力": 1,
                    "霸主之愤慨": 1
                }, 74, [0, -2, 4, -3, 0]],
                ["煌雷龙铠甲β", 3, 3, 1, 0, 0, 0, 7, 0, 3, [2, 1, 1], {
                    "精神抖擞": 1,
                    "耐力急速回复": 1,
                    "煌雷龙之力": 1,
                    "霸主之愤慨": 1
                }, 74, [0, -2, 4, -3, 0]],
                ["煌雷龙腕甲β", 3, 3, 2, 0, 0, 0, 7, 0, 1, [3, 0, 0], {
                    "力量解放": 2,
                    "煌雷龙之力": 1,
                    "霸主之愤慨": 1
                }, 74, [0, -2, 4, -3, 0]],
                ["煌雷龙腰甲β", 3, 3, 3, 0, 0, 0, 7, 0, 2, [3, 1, 0], {
                    "耐力急速回复": 1,
                    "昏厥耐性": 2,
                    "煌雷龙之力": 1,
                    "霸主之愤慨": 1
                }, 74, [0, -2, 4, -3, 0]],
                ["煌雷龙护腿β",
                    3, 3, 4, 0, 0, 0, 7, 0, 3, [3, 1, 1], {
                        "力量解放": 1,
                        "煌雷龙之力": 1,
                        "霸主之愤慨": 1
                    },
                    74, [0, -2, 4, -3, 0]
                ],
                ["狱焰蛸头盔α", 3, 3, 0, 0, 0, 0, 7, 0, 2, [1, 1, 0], {
                    "怨恨": 2,
                    "逆袭": 1,
                    "狱焰蛸之反叛": 1,
                    "霸主之骄傲": 1
                }, 74, [5, -4, 0, 1, 0]],
                ["狱焰蛸铠甲α", 3, 3, 1, 0, 0, 0, 7, 0, 2, [1, 1, 0], {
                        "怨恨": 1,
                        "连击": 1,
                        "狱焰蛸之反叛": 1,
                        "霸主之骄傲": 1
                    },
                    74, [5, -4, 0, 1, 0]
                ],
                ["狱焰蛸腕甲α", 3, 3, 2, 0, 0, 0, 7, 0, 1, [2, 0, 0], {
                    "快吃": 2,
                    "逆袭": 2,
                    "狱焰蛸之反叛": 1,
                    "霸主之骄傲": 1
                }, 74, [5, -4, 0, 1, 0]],
                ["狱焰蛸腰甲α", 3, 3, 3, 0, 0, 0, 7, 0, 1, [2, 0, 0], {
                    "怨恨": 2,
                    "快吃": 1,
                    "狱焰蛸之反叛": 1,
                    "霸主之骄傲": 1
                }, 74, [5, -4, 0, 1, 0]],
                ["狱焰蛸护腿α", 3, 3, 4, 0, 0, 0, 7, 0, 1, [3, 0, 0], {
                    "连击": 1,
                    "风压耐性": 2,
                    "狱焰蛸之反叛": 1,
                    "霸主之骄傲": 1
                }, 74, [5, -4, 0, 1, 0]],
                ["狱焰蛸头盔β", 3, 3, 0, 0, 0, 0, 7, 0, 2, [2, 2, 0], {
                    "怨恨": 1,
                    "逆袭": 1,
                    "狱焰蛸之反叛": 1,
                    "霸主之愤慨": 1
                }, 74, [5, -4, 0, 1, 0]],
                ["狱焰蛸铠甲β", 3, 3, 1, 0, 0, 0, 7, 0, 3, [3, 1, 1], {
                    "怨恨": 1,
                    "狱焰蛸之反叛": 1,
                    "霸主之愤慨": 1
                }, 74, [5, -4, 0, 1, 0]],
                ["狱焰蛸腕甲β",
                    3, 3, 2, 0, 0, 0, 7, 0, 2, [3, 1, 0], {
                        "快吃": 2,
                        "逆袭": 1,
                        "狱焰蛸之反叛": 1,
                        "霸主之愤慨": 1
                    },
                    74, [5, -4, 0, 1, 0]
                ],
                ["狱焰蛸腰甲β", 3, 3, 3, 0, 0, 0, 7, 0, 1, [3, 0, 0], {
                    "怨恨": 2,
                    "狱焰蛸之反叛": 1,
                    "霸主之愤慨": 1
                }, 74, [5, -4, 0, 1, 0]],
                ["狱焰蛸护腿β", 3, 3, 4, 0, 0, 0, 7, 0, 2, [3, 1, 0], {
                        "连击": 1,
                        "风压耐性": 1,
                        "狱焰蛸之反叛": 1,
                        "霸主之愤慨": 1
                    },
                    74, [5, -4, 0, 1, 0]
                ],
                ["黑蚀龙头盔α", 3, 3, 0, 0, 0, 0, 7, 0, 1, [2, 0, 0], {
                    "回避性能": 2,
                    "因祸得福": 1,
                    "黑蚀龙之力": 1,
                    "铺鳞之技法": 1
                }, 74, [-2, 3, -1, 2, -1]],
                ["黑蚀龙铠甲α", 3, 3, 1, 0, 0, 0, 7, 0, 1, [3, 0, 0], {
                    "回避性能": 2,
                    "无我之境": 1,
                    "黑蚀龙之力": 1,
                    "铺鳞之技法": 1
                }, 74, [-2, 3, -1, 2, -1]],
                ["黑蚀龙腕甲α", 3, 3, 2, 0, 0, 0, 7,
                    0, 2, [2, 1, 0], {
                        "回避性能": 1,
                        "体术": 2,
                        "黑蚀龙之力": 1,
                        "铺鳞之技法": 1
                    },
                    74, [-2, 3, -1, 2, -1]
                ],
                ["黑蚀龙腰甲α", 3, 3, 3, 0, 0, 0, 7, 0, 2, [3, 1, 0], {
                    "体术": 2,
                    "无我之境": 1,
                    "黑蚀龙之力": 1,
                    "铺鳞之技法": 1
                }, 74, [-2, 3, -1, 2, -1]],
                ["黑蚀龙护腿α", 3, 3, 4, 0, 0, 0, 7, 0, 2, [3, 1, 0], {
                    "无我之境": 1,
                    "减轻胆怯": 2,
                    "黑蚀龙之力": 1,
                    "铺鳞之技法": 1
                }, 74, [-2, 3, -1, 2, -1]],
                ["黑蚀龙头盔β", 3, 3, 0, 0, 0, 0, 7, 0, 2, [3, 1, 0], {
                    "回避性能": 1,
                    "因祸得福": 1,
                    "黑蚀龙之力": 1,
                    "叠鳞之工艺": 1
                }, 74, [-2, 3, -1, 2, -1]],
                ["黑蚀龙铠甲β", 3, 3, 1, 0, 0, 0, 7, 0, 2, [3, 1, 0], {
                    "回避性能": 2,
                    "黑蚀龙之力": 1,
                    "叠鳞之工艺": 1
                }, 74, [-2, 3, -1, 2, -1]],
                ["黑蚀龙腕甲β", 3, 3, 2,
                    0, 0, 0, 7, 0, 2, [2, 2, 0], {
                        "回避性能": 1,
                        "体术": 1,
                        "黑蚀龙之力": 1,
                        "叠鳞之工艺": 1
                    },
                    74, [-2, 3, -1, 2, -1]
                ],
                ["黑蚀龙腰甲β", 3, 3, 3, 0, 0, 0, 7, 0, 2, [3, 2, 0], {
                    "体术": 2,
                    "黑蚀龙之力": 1,
                    "叠鳞之工艺": 1
                }, 74, [-2, 3, -1, 2, -1]],
                ["黑蚀龙护腿β", 3, 3, 4, 0, 0, 0, 7, 0, 3, [3, 1, 1], {
                        "无我之境": 1,
                        "减轻胆怯": 1,
                        "黑蚀龙之力": 1,
                        "叠鳞之工艺": 1
                    },
                    74, [-2, 3, -1, 2, -1]
                ],
                ["锁刃龙头盔α", 3, 3, 0, 0, 0, 0, 8, 0, 0, [0, 0, 0], {
                    "属性变换": 1,
                    "属性吸收": 2,
                    "锁刃龙之饥饿": 1,
                    "毛皮之昂扬": 1
                }, 80, [2, 0, -1, 0, -3]],
                ["锁刃龙铠甲α", 3, 3, 1, 0, 0, 0, 8, 0, 1, [2, 0, 0], {
                    "弱点特效": 1,
                    "属性吸收": 1,
                    "锁刃龙之饥饿": 1,
                    "毛皮之昂扬": 1
                }, 80, [2, 0, -1, 0, -3]],
                ["锁刃龙腕甲α", 3,
                    3, 2, 0, 0, 0, 8, 0, 2, [2, 2, 0], {
                        "属性变换": 1,
                        "回复速度": 1,
                        "锁刃龙之饥饿": 1,
                        "毛皮之昂扬": 1
                    },
                    80, [2, 0, -1, 0, -3]
                ],
                ["锁刃龙腰甲α", 3, 3, 3, 0, 0, 0, 8, 0, 1, [1, 0, 0], {
                    "弱点特效": 2,
                    "回复速度": 2,
                    "锁刃龙之饥饿": 1,
                    "毛皮之昂扬": 1
                }, 80, [2, 0, -1, 0, -3]],
                ["锁刃龙护腿α", 3, 3, 4, 0, 0, 0, 8, 0, 2, [2, 1, 0], {
                    "属性变换": 1,
                    "纳刀术": 2,
                    "锁刃龙之饥饿": 1,
                    "毛皮之昂扬": 1
                }, 80, [2, 0, -1, 0, -3]],
                ["锁刃龙头盔β", 3, 3, 0, 0, 0, 0, 8, 0, 3, [3, 2, 1], {
                    "属性变换": 1,
                    "锁刃龙之饥饿": 1,
                    "毛皮之诱惑": 1
                }, 80, [2, 0, -1, 0, -3]],
                ["锁刃龙铠甲β", 3, 3, 1, 0, 0, 0, 8, 0, 2, [3, 2, 0], {
                    "弱点特效": 1,
                    "锁刃龙之饥饿": 1,
                    "毛皮之诱惑": 1
                }, 80, [2, 0, -1, 0, -3]],
                ["锁刃龙腕甲β",
                    3, 3, 2, 0, 0, 0, 8, 0, 3, [2, 2, 1], {
                        "属性变换": 1,
                        "锁刃龙之饥饿": 1,
                        "毛皮之诱惑": 1
                    },
                    80, [2, 0, -1, 0, -3]
                ],
                ["锁刃龙腰甲β", 3, 3, 3, 0, 0, 0, 8, 0, 2, [1, 1, 0], {
                    "弱点特效": 2,
                    "回复速度": 1,
                    "锁刃龙之饥饿": 1,
                    "毛皮之诱惑": 1
                }, 80, [2, 0, -1, 0, -3]],
                ["锁刃龙护腿β", 3, 3, 4, 0, 0, 0, 8, 0, 2, [3, 1, 0], {
                    "属性变换": 1,
                    "纳刀术": 1,
                    "锁刃龙之饥饿": 1,
                    "毛皮之诱惑": 1
                }, 80, [2, 0, -1, 0, -3]],
                ["护锁刃龙头盔α", 3, 3, 0, 0, 0, 0, 8, 0, 2, [1, 1, 0], {
                    "锁刃刺击": 1,
                    "破坏王": 2,
                    "护锁刃龙之命脉": 1,
                    "护龙之脉动": 1
                }, 80, [2, 0, -1, 0, -4]],
                ["护锁刃龙铠甲α", 3, 3, 1, 0, 0, 0, 8, 0, 0, [0, 0, 0], {
                        "锁刃刺击": 2,
                        "属性异常耐性": 2,
                        "护锁刃龙之命脉": 1,
                        "护龙之脉动": 1
                    },
                    80, [2, 0, -1, 0, -4]
                ],
                ["护锁刃龙腕甲α", 3, 3, 2, 0, 0, 0, 8, 0, 1, [1, 0, 0], {
                    "弱点特效": 2,
                    "属性异常耐性": 1,
                    "护锁刃龙之命脉": 1,
                    "护龙之脉动": 1
                }, 80, [2, 0, -1, 0, -4]],
                ["护锁刃龙腰甲α", 3, 3, 3, 0, 0, 0, 8, 0, 0, [0, 0, 0], {
                    "锁刃刺击": 2,
                    "属性吸收": 1,
                    "护锁刃龙之命脉": 1,
                    "护龙之脉动": 1
                }, 80, [2, 0, -1, 0, -4]],
                ["护锁刃龙护腿α",
                    3, 3, 4, 0, 0, 0, 8, 0, 0, [0, 0, 0], {
                        "属性吸收": 2,
                        "弱点特效": 1,
                        "护锁刃龙之命脉": 1,
                        "护龙之脉动": 1
                    },
                    80, [2, 0, -1, 0, -4]
                ],
                ["护锁刃龙头盔β", 3, 3, 0, 0, 0, 0, 8, 0, 2, [3, 1, 0], {
                    "锁刃刺击": 1,
                    "破坏王": 1,
                    "护锁刃龙之命脉": 1,
                    "护龙之守护": 1
                }, 80, [2, 0, -1, 0, -4]],
                ["护锁刃龙铠甲β", 3, 3, 1, 0, 0, 0, 8, 0, 1, [3, 0, 0], {
                    "锁刃刺击": 1,
                    "属性异常耐性": 2,
                    "护锁刃龙之命脉": 1,
                    "护龙之守护": 1
                }, 80, [2, 0, -1, 0, -4]],
                ["护锁刃龙腕甲β", 3, 3, 2, 0, 0, 0, 8, 0, 3, [1, 1, 1], {
                    "弱点特效": 2,
                    "护锁刃龙之命脉": 1,
                    "护龙之守护": 1
                }, 80, [2, 0, -1, 0, -4]],
                ["护锁刃龙腰甲β", 3, 3, 3, 0, 0, 0, 8, 0, 2, [2, 1, 0], {
                        "锁刃刺击": 2,
                        "护锁刃龙之命脉": 1,
                        "护龙之守护": 1
                    },
                    80, [2, 0, -1, 0, -4]
                ],
                ["护锁刃龙护腿β", 3, 3, 4, 0, 0, 0, 8, 0, 2, [2, 1, 0], {
                    "属性吸收": 1,
                    "弱点特效": 1,
                    "护锁刃龙之命脉": 1,
                    "护龙之守护": 1
                }, 80, [2, 0, -1, 0, -4]],
                ["公会王牌耳环α", 3, 3, 0, 0, 0, 0, 8, 0, 1, [3, 0, 0], {
                    "无伤": 1,
                    "攻势": 1,
                    "体术": 1
                }, 74, [2, 2, 2, 2, 2]],
                ["公会王牌铠甲α", 3, 3, 1, 0, 0, 0, 8, 0, 1, [3, 0, 0], {
                        "无伤": 1,
                        "攻势": 1,
                        "体术": 1
                    },
                    74, [2, 2, 2, 2, 2]
                ],
                ["公会王牌腕甲α", 3, 3, 2, 0, 0, 0, 8, 0, 1, [3, 0, 0], {
                    "无伤": 1,
                    "攻势": 1,
                    "体术": 1
                }, 74, [2, 2, 2, 2, 2]],
                ["公会王牌腰甲α", 3, 3, 3, 0, 0, 0, 8, 0, 1, [3, 0, 0], {
                    "无伤": 1,
                    "攻势": 1,
                    "体术": 1
                }, 74, [2, 2, 2, 2, 2]],
                ["公会王牌靴α", 3, 3, 4, 0, 0, 0, 8, 0, 1, [3, 0, 0], {
                    "无伤": 1,
                    "攻势": 1,
                    "体术": 1
                }, 74, [2, 2, 2, 2, 2]],
                ["龙王的独眼α", 3, 3, 0, 0, 0, 0, 8, 0, 0, [0, 0, 0], {
                        "逆袭": 3
                    },
                    74, [0, 0, 0, 0, 0]
                ],
                ["公会十字头饰α", 3, 3, 0, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "束缚耐性": 2,
                    "耳塞": 1,
                    "减轻胆怯": 1,
                    "荣光盛赞": 1
                }, 62, [0, 0, 0, 0, 0]],
                ["公会十字战衣α", 3, 3, 1, 0, 0, 0, 5, 0, 2, [2, 1, 0], {
                    "耳塞": 1,
                    "耐震": 1,
                    "荣光盛赞": 1
                }, 62, [0, 0, 0, 0, 0]],
                ["公会十字腕甲α", 3, 3, 2, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "减轻胆怯": 2,
                    "束缚耐性": 1,
                    "耐震": 1,
                    "荣光盛赞": 1
                }, 62, [0, 0, 0, 0, 0]],
                ["公会十字腰甲α", 3, 3, 3, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "风压耐性": 2,
                    "耳塞": 1,
                    "荣光盛赞": 1
                }, 62, [0, 0, 0, 0, 0]],
                ["公会十字靴α", 3, 3, 4, 0, 0, 0, 5, 0, 2, [2, 2, 0], {
                    "风压耐性": 1,
                    "耐震": 1,
                    "荣光盛赞": 1
                }, 62, [0, 0, 0, 0, 0]],
                ["职员遮阳帽α", 3, 3, 0, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "指示随从": 2,
                    "精灵加护": 2,
                    "体力回复量提升": 1,
                    "荣光盛赞": 1
                }, 68, [2, 2, 2, 2, 2]],
                ["职员服装α", 3, 3, 1, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "环境利用知识": 2,
                    "精灵加护": 1,
                    "荣光盛赞": 1
                }, 68, [2, 2, 2, 2, 2]],
                ["职员腕甲α", 3, 3, 2, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "整备": 2,
                    "指示随从": 1,
                    "环境利用知识": 1,
                    "荣光盛赞": 1
                }, 68, [2, 2, 2, 2, 2]],
                ["职员腰带α", 3, 3, 3, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "整备": 2,
                    "体力回复量提升": 2,
                    "荣光盛赞": 1
                }, 68, [2, 2, 2, 2, 2]],
                ["职员鞋α", 3, 3, 4, 0, 0, 0, 6, 0, 2, [2, 2, 0], {
                    "指示随从": 2,
                    "整备": 1,
                    "荣光盛赞": 1
                }, 68, [2, 2, 2, 2, 2]],
                ["大胃王耳饰α", 3, 3, 0, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "快吃": 2,
                    "满足感": 2,
                    "荣光盛赞": 1
                }, 62, [0, 0, 0, 0, 0]],
                ["奉献耳饰α", 3, 3, 0, 0, 0, 0, 6, 0, 1, [2, 0, 0], {
                    "广域化": 4,
                    "荣光盛赞": 1
                }, 68, [0, 0, 0, 0, 0]],
                ["泡狐龙头盔α",
                    3, 3, 0, 0, 0, 0, 6, 0, 1, [3, 0, 0], {
                        "适应水域·油泥": 2,
                        "回避距离提升": 1,
                        "泡狐龙之力": 1,
                        "毛皮之昂扬": 1
                    },
                    68, [0, 2, -3, 1, -1]
                ],
                ["泡狐龙铠甲α", 3, 3, 1, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "连击": 2,
                    "体术": 1,
                    "泡狐龙之力": 1,
                    "毛皮之昂扬": 1
                }, 68, [0, 2, -3, 1, -1]],
                ["泡狐龙腕甲α", 3, 3, 2, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "回避性能": 2,
                    "回避距离提升": 2,
                    "泡狐龙之力": 1,
                    "毛皮之昂扬": 1
                }, 68, [0, 2, -3, 1, -1]],
                ["泡狐龙腰甲α", 3, 3, 3, 0, 0, 0, 6, 0, 2, [2, 1, 0], {
                    "体术": 2,
                    "连击": 1,
                    "泡狐龙之力": 1,
                    "毛皮之昂扬": 1
                }, 68, [0, 2, -3, 1, -1]],
                ["泡狐龙护腿α", 3, 3, 4, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "连击": 2,
                    "无伤": 1,
                    "泡狐龙之力": 1,
                    "毛皮之昂扬": 1
                }, 68, [0, 2, -3, 1, -1]],
                ["泡狐龙头盔β",
                    3, 3, 0, 0, 0, 0, 6, 0, 2, [3, 2, 0], {
                        "适应水域·油泥": 2,
                        "泡狐龙之力": 1,
                        "毛皮之诱惑": 1
                    },
                    68, [0, 2, -3, 1, -1]
                ],
                ["泡狐龙铠甲β", 3, 3, 1, 0, 0, 0, 6, 0, 2, [2, 2, 0], {
                    "连击": 1,
                    "体术": 1,
                    "泡狐龙之力": 1,
                    "毛皮之诱惑": 1
                }, 68, [0, 2, -3, 1, -1]],
                ["泡狐龙腕甲β", 3, 3, 2, 0, 0, 0, 6, 0, 1, [3, 0, 0], {
                    "回避性能": 2,
                    "回避距离提升": 1,
                    "泡狐龙之力": 1,
                    "毛皮之诱惑": 1
                }, 68, [0, 2, -3, 1, -1]],
                ["泡狐龙腰甲β", 3, 3, 3, 0, 0, 0, 6, 0, 3, [3, 2, 1], {
                    "体术": 2,
                    "泡狐龙之力": 1,
                    "毛皮之诱惑": 1
                }, 68, [0, 2, -3, 1, -1]],
                ["泡狐龙护腿β", 3, 3, 4, 0, 0, 0, 6, 0, 1, [3, 0, 0], {
                    "连击": 2,
                    "泡狐龙之力": 1,
                    "毛皮之诱惑": 1
                }, 68, [0, 2, -3, 1, -1]],
                ["纯洁龙冠α", 3, 3, 0, 0, 0, 0, 8, 0, 2, [3, 2, 0], {
                    "回复速度": 2,
                    "挑战者": 1,
                    "白炽龙之脉动": 1,
                    "护龙之脉动": 1
                }, 82, [-2, 2, 2, 0, -4]],
                ["纯洁龙铠α", 3, 3, 1, 0, 0, 0, 8, 0, 1, [1, 0, 0], {
                    "挑战者": 2,
                    "逆袭": 1,
                    "白炽龙之脉动": 1,
                    "护龙之脉动": 1
                }, 82, [-2, 2, 2, 0, -4]],
                ["纯洁龙臂甲α", 3, 3, 2, 0, 0, 0, 8, 0, 1, [2, 0, 0], {
                    "属性吸收": 2,
                    "因祸得福": 1,
                    "白炽龙之脉动": 1,
                    "护龙之脉动": 1
                }, 82, [-2, 2,
                    2, 0, -4
                ]],
                ["纯洁龙腰甲α", 3, 3, 3, 0, 0, 0, 8, 0, 0, [0, 0, 0], {
                    "挑战者": 2,
                    "因祸得福": 2,
                    "白炽龙之脉动": 1,
                    "护龙之脉动": 1
                }, 82, [-2, 2, 2, 0, -4]],
                ["纯洁龙靴α", 3, 3, 4, 0, 0, 0, 8, 0, 2, [2, 1, 0], {
                    "逆袭": 2,
                    "回复速度": 1,
                    "属性吸收": 1,
                    "白炽龙之脉动": 1,
                    "护龙之脉动": 1
                }, 82, [-2, 2, 2, 0, -4]],
                ["纯洁龙冠β", 3, 3, 0, 0, 0, 0, 8,
                    0, 3, [3, 2, 1], {
                        "回复速度": 1,
                        "挑战者": 1,
                        "白炽龙之脉动": 1,
                        "护龙之守护": 1
                    },
                    82, [-2, 2, 2, 0, -4]
                ],
                ["纯洁龙铠β", 3, 3, 1, 0, 0, 0, 8, 0, 1, [3, 0, 0], {
                    "挑战者": 2,
                    "白炽龙之脉动": 1,
                    "护龙之守护": 1
                }, 82, [-2, 2, 2, 0, -4]],
                ["纯洁龙臂甲β", 3, 3, 2, 0, 0, 0, 8, 0, 2, [3, 1, 0], {
                        "属性吸收": 2,
                        "白炽龙之脉动": 1,
                        "护龙之守护": 1
                    },
                    82, [-2, 2, 2, 0, -4]
                ],
                ["纯洁龙腰甲β", 3, 3, 3, 0, 0, 0, 8, 0, 1, [2, 0, 0], {
                    "挑战者": 2,
                    "因祸得福": 1,
                    "白炽龙之脉动": 1,
                    "护龙之守护": 1
                }, 82, [-2, 2, 2, 0, -4]],
                ["纯洁龙靴β", 3, 3, 4, 0, 0, 0, 8, 0, 2, [3, 2, 0], {
                    "逆袭": 1,
                    "回复速度": 1,
                    "属性吸收": 1,
                    "白炽龙之脉动": 1,
                    "护龙之守护": 1
                }, 82, [-2, 2, 2, 0, -4]],
                ["海龙头盔α", 3, 3,
                    0, 0, 0, 0, 7, 0, 2, [2, 1, 0], {
                        "精神抖擞": 2,
                        "力量解放": 1,
                        "海龙的涡雷": 1,
                        "皮革制品之柔韧": 1
                    },
                    78, [-3, 2, 4, -1, -2]
                ],
                ["海龙铠甲α", 3, 3, 1, 0, 0, 0, 7, 0, 2, [2, 1, 0], {
                    "雷耐性": 2,
                    "弱点特效": 1,
                    "耐力急速回复": 1,
                    "海龙的涡雷": 1,
                    "皮革制品之柔韧": 1
                }, 78, [-3, 2, 4, -1, -2]],
                ["海龙腕甲α", 3, 3, 2, 0, 0, 0, 7, 0, 1, [2, 0, 0], {
                    "耐力急速回复": 2,
                    "弱点特效": 1,
                    "适应水域·油泥": 1,
                    "海龙的涡雷": 1,
                    "皮革制品之柔韧": 1
                }, 78, [-3, 2, 4, -1, -2]],
                ["海龙腰甲α", 3, 3, 3, 0, 0, 0, 7, 0, 3, [2, 1, 1], {
                    "弱点特效": 1,
                    "精神抖擞": 1,
                    "适应水域·油泥": 1,
                    "海龙的涡雷": 1,
                    "皮革制品之柔韧": 1
                }, 78, [-3, 2, 4, -1, -2]],
                ["海龙护腿α", 3, 3, 4, 0, 0, 0, 7, 0, 0, [0,
                    0, 0
                ], {
                    "弱点特效": 2,
                    "力量解放": 1,
                    "雷耐性": 1,
                    "海龙的涡雷": 1,
                    "皮革制品之柔韧": 1
                }, 78, [-3, 2, 4, -1, -2]],
                ["海龙头盔β", 3, 3, 0, 0, 0, 0, 7, 0, 3, [3, 2, 1], {
                    "精神抖擞": 2,
                    "海龙的涡雷": 1,
                    "皮革制品之顺滑": 1
                }, 78, [-3, 2, 4, -1, -2]],
                ["海龙铠甲β", 3, 3, 1, 0, 0, 0, 7, 0, 3, [2, 2, 1], {
                    "弱点特效": 1,
                    "耐力急速回复": 1,
                    "海龙的涡雷": 1,
                    "皮革制品之顺滑": 1
                }, 78, [-3, 2, 4, -1, -2]],
                ["海龙腕甲β", 3, 3, 2, 0, 0, 0, 7, 0, 1, [3, 0, 0], {
                    "耐力急速回复": 2,
                    "弱点特效": 1,
                    "海龙的涡雷": 1,
                    "皮革制品之顺滑": 1
                }, 78, [-3, 2, 4, -1, -2]],
                ["海龙腰甲β", 3, 3, 3, 0, 0, 0, 7, 0, 3, [2, 2, 1], {
                        "弱点特效": 1,
                        "精神抖擞": 1,
                        "海龙的涡雷": 1,
                        "皮革制品之顺滑": 1
                    },
                    78, [-3, 2, 4, -1, -2]
                ],
                ["海龙护腿β", 3, 3, 4, 0, 0, 0, 7, 0, 1, [1, 0, 0], {
                    "弱点特效": 2,
                    "力量解放": 1,
                    "海龙的涡雷": 1,
                    "皮革制品之顺滑": 1
                }, 78, [-3, 2, 4, -1, -2]],
                ["千刃龙头盔α", 3, 3, 0, 0, 0, 0, 7, 0, 1, [3, 0, 0], {
                    "巧击": 1,
                    "逆袭": 1,
                    "裂伤耐性": 1,
                    "千刃龙的斗志": 1,
                    "铺鳞之技法": 1
                }, 78, [4, 0, -3, -2, 0]],
                ["千刃龙铠甲α",
                    3, 3, 1, 0, 0, 0, 7, 0, 1, [1, 0, 0], {
                        "回避性能": 2,
                        "挑战者": 1,
                        "逆袭": 1,
                        "千刃龙的斗志": 1,
                        "铺鳞之技法": 1
                    },
                    78, [4, 0, -3, -2, 0]
                ],
                ["千刃龙腕甲α", 3, 3, 2, 0, 0, 0, 7, 0, 1, [2, 0, 0], {
                    "巧击": 2,
                    "回避距离提升": 1,
                    "千刃龙的斗志": 1,
                    "铺鳞之技法": 1
                }, 78, [4, 0, -3, -2, 0]],
                ["千刃龙腰甲α", 3, 3, 3, 0, 0, 0, 7, 0, 1, [2, 0, 0], {
                    "回避性能": 2,
                    "挑战者": 1,
                    "裂伤耐性": 1,
                    "千刃龙的斗志": 1,
                    "铺鳞之技法": 1
                }, 78, [4, 0, -3, -2, 0]],
                ["千刃龙护腿α", 3, 3, 4, 0, 0, 0, 7, 0, 0, [0, 0, 0], {
                    "巧击": 2,
                    "挑战者": 1,
                    "裂伤耐性": 1,
                    "千刃龙的斗志": 1,
                    "铺鳞之技法": 1
                }, 78, [4, 0, -3, -2, 0]],
                ["千刃龙头盔β", 3, 3, 0, 0, 0, 0, 7, 0, 3, [3, 1, 1], {
                    "巧击": 1,
                    "裂伤耐性": 1,
                    "千刃龙的斗志": 1,
                    "叠鳞之工艺": 1
                }, 78, [4, 0, -3, -2, 0]],
                ["千刃龙铠甲β", 3, 3, 1, 0, 0, 0, 7, 0, 2, [2, 1, 0], {
                    "回避性能": 2,
                    "挑战者": 1,
                    "千刃龙的斗志": 1,
                    "叠鳞之工艺": 1
                }, 78, [4, 0, -3, -2, 0]],
                ["千刃龙腕甲β", 3, 3, 2, 0, 0, 0, 7, 0, 2, [3, 1, 0], {
                    "巧击": 2,
                    "千刃龙的斗志": 1,
                    "叠鳞之工艺": 1
                }, 78, [4, 0, -3, -2, 0]],
                ["千刃龙腰甲β", 3, 3, 3, 0, 0, 0, 7,
                    0, 3, [3, 1, 1], {
                        "挑战者": 1,
                        "回避性能": 1,
                        "千刃龙的斗志": 1,
                        "叠鳞之工艺": 1
                    },
                    78, [4, 0, -3, -2, 0]
                ],
                ["千刃龙护腿β", 3, 3, 4, 0, 0, 0, 7, 0, 1, [1, 0, 0], {
                    "巧击": 2,
                    "挑战者": 1,
                    "千刃龙的斗志": 1,
                    "叠鳞之工艺": 1
                }, 78, [4, 0, -3, -2, 0]],
                ["巨戟龙头盔α", 3, 3, 0, 0, 0, 0, 8, 0, 2, [3, 1, 0], {
                    "无伤": 2,
                    "属性吸收": 2,
                    "巨戟龙的默示录": 1,
                    "白炽龙之脉动": 1
                }, 82, [-4, 3, 0, 3, -5]],
                ["巨戟龙铠甲α", 3, 3, 1, 0, 0, 0, 8, 0, 2, [3, 2, 0], {
                    "巧击": 2,
                    "快吃": 2,
                    "适应水域·油泥": 1,
                    "巨戟龙的默示录": 1,
                    "暗器蛸之力": 1
                }, 82, [-4, 3, 0, 3, -5]],
                ["巨戟龙腕甲α", 3, 3, 2, 0, 0, 0, 8, 0, 2, [2, 1, 0], {
                        "精神抖擞": 2,
                        "挑战者": 1,
                        "巨戟龙的默示录": 1,
                        "雷颚龙之斗志": 1
                    },
                    82, [-4, 3, 0, 3, -5]
                ],
                ["巨戟龙腰甲α", 3, 3, 3, 0, 0, 0, 8, 0, 3, [2, 1, 1], {
                    "连击": 2,
                    "无伤": 1,
                    "巨戟龙的默示录": 1,
                    "凶爪龙之力": 1
                }, 82, [-4, 3, 0, 3, -5]],
                ["巨戟龙护腿α", 3, 3, 4, 0, 0, 0, 8, 0, 3, [3, 2, 1], {
                    "无伤": 2,
                    "挑战者": 1,
                    "巨戟龙的默示录": 1,
                    "辟兽之力": 1
                }, 82, [-4, 3, 0, 3, -5]],
                ["巨戟龙头盔β", 3, 3, 0, 0, 0, 0, 8, 0, 2, [3, 1, 0], {
                    "无伤": 2,
                    "属性吸收": 2,
                    "巨戟龙的默示录": 1,
                    "护锁刃龙之命脉": 1
                }, 82, [-4, 3, 0, 3, -5]],
                ["巨戟龙铠甲β", 3, 3, 1, 0, 0, 0, 8, 0, 2, [3, 2, 0], {
                    "巧击": 2,
                    "快吃": 2,
                    "适应水域·油泥": 1,
                    "巨戟龙的默示录": 1,
                    "火龙之力": 1
                }, 82, [-4, 3, 0, 3, -5]],
                ["巨戟龙腕甲β", 3, 3, 2, 0, 0, 0, 8, 0, 2, [2, 1, 0], {
                    "精神抖擞": 2,
                    "挑战者": 1,
                    "巨戟龙的默示录": 1,
                    "雪狮子王之斗志": 1
                }, 82, [-4, 3, 0, 3, -5]],
                ["巨戟龙腰甲β", 3, 3, 3, 0, 0, 0, 8, 0, 3, [2, 1, 1], {
                    "连击": 2,
                    "无伤": 1,
                    "巨戟龙的默示录": 1,
                    "泡狐龙之力": 1
                }, 82, [-4, 3, 0, 3, -5]],
                ["巨戟龙护腿β", 3, 3, 4, 0, 0, 0, 8, 0, 3, [3, 2, 1], {
                        "无伤": 2,
                        "挑战者": 1,
                        "巨戟龙的默示录": 1,
                        "铠龙之守护": 1
                    },
                    82, [-4, 3, 0, 3, -5]
                ],
                ["煌雷龙头盔γ", 3, 3, 0, 0, 0, 0, 8, 0, 1, [3, 0, 0], {
                    "弱点特效": 1,
                    "精神抖擞": 1,
                    "耐力急速回复": 1,
                    "煌雷龙之力": 1,
                    "霸主之魂": 1
                }, 82, [0, -2, 4, -3, 0]],
                ["煌雷龙铠甲γ", 3, 3, 1, 0, 0, 0, 8, 0, 1, [1, 0, 0], {
                    "力量解放": 3,
                    "煌雷龙之力": 1,
                    "霸主之魂": 1
                }, 82, [0, -2, 4, -3, 0]],
                ["煌雷龙腕甲γ", 3, 3, 2, 0, 0, 0, 8, 0,
                    2, [3, 3, 0], {
                        "回避距离提升": 2,
                        "煌雷龙之力": 1,
                        "霸主之魂": 1
                    },
                    82, [0, -2, 4, -3, 0]
                ],
                ["煌雷龙腰甲γ", 3, 3, 3, 0, 0, 0, 8, 0, 0, [0, 0, 0], {
                    "力量解放": 2,
                    "精神抖擞": 2,
                    "煌雷龙之力": 1,
                    "霸主之魂": 1
                }, 82, [0, -2, 4, -3, 0]],
                ["煌雷龙护腿γ", 3, 3, 4, 0, 0, 0, 8, 0, 1, [3, 0, 0], {
                    "耐力急速回复": 2,
                    "昏厥耐性": 3,
                    "煌雷龙之力": 1,
                    "霸主之魂": 1
                }, 82, [0, -2, 4, -3, 0]],
                ["波衣龙头盔γ", 3, 3, 0, 0, 0, 0, 8, 0, 2, [2, 2, 0], {
                    "无伤": 2,
                    "耳塞": 1,
                    "波衣龙之守护": 1,
                    "霸主之魂": 1
                }, 82, [-1, 4, -3, 0, 0]],
                ["波衣龙铠甲γ", 3, 3, 1, 0, 0, 0, 8, 0, 0, [0, 0, 0], {
                    "无伤": 3,
                    "耳塞": 2,
                    "波衣龙之守护": 1,
                    "霸主之魂": 1
                }, 82, [-1, 4, -3, 0, 0]],
                ["波衣龙腕甲γ", 3, 3, 2, 0, 0, 0, 8, 0, 1, [2, 0, 0], {
                    "整备": 3,
                    "挑战者": 1,
                    "波衣龙之守护": 1,
                    "霸主之魂": 1
                }, 82, [-1, 4, -3, 0, 0]],
                ["波衣龙腰甲γ", 3, 3, 3, 0, 0, 0, 8, 0, 2, [3, 3, 0], {
                    "整备": 2,
                    "波衣龙之守护": 1,
                    "霸主之魂": 1
                }, 82, [-1, 4, -3, 0, 0]],
                ["波衣龙护腿γ", 3, 3, 4, 0, 0, 0, 8, 0, 3, [3, 1, 1], {
                    "纳刀术": 3,
                    "挑战者": 1,
                    "波衣龙之守护": 1,
                    "霸主之魂": 1
                }, 82, [-1, 4, -3, 0, 0]],
                ["狱焰蛸头盔γ",
                    3, 3, 0, 0, 0, 0, 8, 0, 3, [1, 1, 1], {
                        "连击": 3,
                        "狱焰蛸之反叛": 1,
                        "霸主之魂": 1
                    },
                    82, [5, -4, 0, 1, 0]
                ],
                ["狱焰蛸铠甲γ", 3, 3, 1, 0, 0, 0, 8, 0, 2, [3, 3, 0], {
                    "逆袭": 2,
                    "狱焰蛸之反叛": 1,
                    "霸主之魂": 1
                }, 82, [5, -4, 0, 1, 0]],
                ["狱焰蛸腕甲γ", 3, 3, 2, 0, 0, 0, 8, 0, 3, [3, 1, 1], {
                    "怨恨": 3,
                    "狱焰蛸之反叛": 1,
                    "霸主之魂": 1
                }, 82, [5, -4, 0, 1, 0]],
                ["狱焰蛸腰甲γ",
                    3, 3, 3, 0, 0, 0, 8, 0, 1, [2, 0, 0], {
                        "连击": 2,
                        "急袭": 1,
                        "狱焰蛸之反叛": 1,
                        "霸主之魂": 1
                    },
                    82, [5, -4, 0, 1, 0]
                ],
                ["狱焰蛸护腿γ", 3, 3, 4, 0, 0, 0, 8, 0, 1, [2, 0, 0], {
                    "快吃": 3,
                    "怨恨": 2,
                    "逆袭": 1,
                    "狱焰蛸之反叛": 1,
                    "霸主之魂": 1
                }, 82, [5, -4, 0, 1, 0]],
                ["冻峰龙头盔γ", 3, 3, 0, 0, 0, 0, 8, 0, 2, [3, 3, 0], {
                        "攻势": 2,
                        "冻峰龙之反叛": 1,
                        "霸主之魂": 1
                    },
                    82, [-3, 2, -1, 2, -1]
                ],
                ["冻峰龙铠甲γ", 3, 3, 1, 0, 0, 0, 8, 0, 2, [2, 2, 0], {
                    "挑战者": 2,
                    "冻峰龙之反叛": 1,
                    "霸主之魂": 1
                }, 82, [-3, 2, -1, 2, -1]],
                ["冻峰龙腕甲γ", 3, 3, 2, 0, 0, 0, 8, 0, 1, [2, 0, 0], {
                    "因祸得福": 3,
                    "弱点特效": 1,
                    "冻峰龙之反叛": 1,
                    "霸主之魂": 1
                }, 82, [-3, 2, -1, 2, -1]],
                ["冻峰龙腰甲γ", 3, 3, 3, 0, 0, 0, 8, 0, 1, [1, 0, 0], {
                    "挑战者": 3,
                    "束缚耐性": 2,
                    "冻峰龙之反叛": 1,
                    "霸主之魂": 1
                }, 82, [-3, 2, -1, 2, -1]],
                ["冻峰龙护腿γ", 3, 3, 4, 0, 0, 0, 8, 0, 1, [2, 0, 0], {
                    "弱点特效": 2,
                    "攻势": 1,
                    "冻峰龙之反叛": 1,
                    "霸主之魂": 1
                }, 82, [-3, 2, -1, 2, -1]],
                ["锁刃龙头盔γ", 3, 3, 0, 0, 0, 0, 8, 0, 2, [2, 1, 0], {
                    "弱点特效": 3,
                    "锁刃龙之饥饿": 1,
                    "霸主之魂": 1
                }, 82, [2, 0, -1, 0,
                    -3
                ]],
                ["锁刃龙铠甲γ", 3, 3, 1, 0, 0, 0, 8, 0, 2, [3, 2, 0], {
                    "属性变换": 3,
                    "属性异常耐性": 1,
                    "锁刃龙之饥饿": 1,
                    "霸主之魂": 1
                }, 82, [2, 0, -1, 0, -3]],
                ["锁刃龙腕甲γ", 3, 3, 2, 0, 0, 0, 8, 0, 2, [1, 1, 0], {
                    "锁刃刺击": 2,
                    "弱点特效": 2,
                    "锁刃龙之饥饿": 1,
                    "霸主之魂": 1
                }, 82, [2, 0, -1, 0, -3]],
                ["锁刃龙腰甲γ", 3, 3, 3, 0, 0, 0, 8, 0,
                    3, [2, 2, 1], {
                        "属性吸收": 3,
                        "锁刃刺击": 1,
                        "锁刃龙之饥饿": 1,
                        "霸主之魂": 1
                    },
                    82, [2, 0, -1, 0, -3]
                ],
                ["锁刃龙护腿γ", 3, 3, 4, 0, 0, 0, 8, 0, 2, [3, 3, 0], {
                    "锁刃刺击": 2,
                    "属性异常耐性": 2,
                    "锁刃龙之饥饿": 1,
                    "霸主之魂": 1
                }, 82, [2, 0, -1, 0, -3]],
                ["落樱缤纷【武士头部】α", 3, 3, 0, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "攻势": 2,
                    "适应环境": 1,
                    "花舞祈祷": 1,
                    "祭典巡礼": 1
                }, 62, [2, 2, -3, 2, 2]],
                ["落樱缤纷【武士礼服】α", 3, 3, 1, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "攻势": 1,
                    "纳刀术": 1,
                    "花舞祈祷": 1,
                    "祭典巡礼": 1
                }, 62, [2, 2, -3, 2, 2]],
                ["落樱缤纷【武士臂甲】α", 3, 3, 2, 0, 0, 0, 5, 0, 2, [2, 1, 0], {
                        "攻势": 1,
                        "道具使用强化": 1,
                        "花舞祈祷": 1,
                        "祭典巡礼": 1
                    },
                    62, [2, 2, -3, 2, 2]
                ],
                ["落樱缤纷【武士腰带】α", 3, 3, 3, 0, 0, 0, 5, 0, 2, [2, 1, 0], {
                    "纳刀术": 2,
                    "适应环境": 1,
                    "花舞祈祷": 1,
                    "祭典巡礼": 1
                }, 62, [2, 2, -3, 2, 2]],
                ["落樱缤纷【武士长袴】α", 3, 3, 4, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "攻势": 1,
                    "道具使用强化": 2,
                    "花舞祈祷": 1,
                    "祭典巡礼": 1
                }, 62, [2, 2, -3, 2, 2]],
                ["盛开头饰α",
                    3, 3, 0, 0, 0, 0, 5, 0, 2, [2, 1, 0], {
                        "麻痹耐性": 2,
                        "祭典巡礼": 1
                    },
                    62, [1, 1, 4, 1, 1]
                ],
                ["盛开服饰α", 3, 3, 1, 0, 0, 0, 5, 0, 3, [2, 1, 1], {
                    "麻痹耐性": 1,
                    "祭典巡礼": 1
                }, 62, [1, 1, 4, 1, 1]],
                ["盛开手套α", 3, 3, 2, 0, 0, 0, 5, 0, 3, [1, 1, 1], {
                    "毒耐性": 2,
                    "祭典巡礼": 1
                }, 62, [1, 1, 4, 1, 1]],
                ["盛开护腰α", 3, 3, 3, 0, 0, 0, 5, 0, 2, [2, 2, 0], {
                        "昆虫标本达人": 1,
                        "回复速度": 1,
                        "祭典巡礼": 1
                    },
                    62, [1, 1, 4, 1, 1]
                ],
                ["盛开靴α", 3, 3, 4, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "毒耐性": 1,
                    "回复速度": 2,
                    "祭典巡礼": 1
                }, 62, [1, 1, 4, 1, 1]],
                ["踊火头饰α", 3, 3, 0, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "炸弹客": 2,
                    "火耐性": 2,
                    "踊火祈祷": 1,
                    "祭典巡礼": 1
                }, 62, [2, -3, 2, 2, 2]],
                ["踊火上衣α", 3, 3, 1, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                        "连击": 1,
                        "火场怪力": 1,
                        "踊火祈祷": 1,
                        "祭典巡礼": 1
                    },
                    62, [2, -3, 2, 2, 2]
                ],
                ["踊火护腕α", 3, 3, 2, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "连击": 2,
                    "踊火祈祷": 1,
                    "祭典巡礼": 1
                }, 62, [2, -3, 2, 2, 2]],
                ["踊火护腰α", 3, 3, 3, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "连击": 1,
                    "爆破异常耐性": 2,
                    "火耐性": 1,
                    "踊火祈祷": 1,
                    "祭典巡礼": 1
                }, 62, [2, -3, 2, 2, 2]],
                ["踊火护腿α", 3, 3, 4, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "连击": 1,
                    "炸弹客": 1,
                    "爆破异常耐性": 1,
                    "踊火祈祷": 1,
                    "祭典巡礼": 1
                }, 62, [2, -3, 2, 2, 2]],
                ["潜水员面罩α", 3, 3, 0, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "急袭": 2,
                    "祭典巡礼": 1
                }, 62, [1, 4, 1, 1, 1]],
                ["潜水员服装α", 3, 3, 1, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "饥饿耐性": 2,
                    "飞身跃入": 1,
                    "祭典巡礼": 1
                }, 62, [1, 4, 1, 1, 1]],
                ["潜水员腕甲α", 3, 3, 2, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                        "急袭": 1,
                        "跑者": 2,
                        "祭典巡礼": 1
                    },
                    62, [1, 4, 1, 1, 1]
                ],
                ["潜水员腰带α", 3, 3, 3, 0, 0, 0, 5, 0, 3, [1, 1, 1], {
                    "适应水域·油泥": 1,
                    "饥饿耐性": 1,
                    "祭典巡礼": 1
                }, 62, [1, 4, 1, 1, 1]],
                ["潜水员靴α", 3, 3, 4, 0, 0, 0, 5, 0, 2, [2, 1, 0], {
                    "适应水域·油泥": 1,
                    "跑者": 1,
                    "祭典巡礼": 1
                }, 62, [1, 4, 1, 1, 1]],
                ["哥特幽魂头盔α", 3, 3, 0, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "广域化": 2,
                    "锁刃刺击": 1,
                    "急袭": 1,
                    "梦灯祈祷": 1,
                    "祭典巡礼": 1
                }, 62, [-3, 2, 2, 2, 2]],
                ["哥特幽魂铠甲α", 3, 3, 1, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "锁刃刺击": 1,
                    "广域化": 1,
                    "睡眠耐性": 1,
                    "梦灯祈祷": 1,
                    "祭典巡礼": 1
                }, 62, [-3, 2, 2, 2, 2]],
                ["哥特幽魂腕甲α", 3, 3, 2, 0, 0, 0, 5, 0, 2, [2, 1, 0], {
                        "锁刃刺击": 1,
                        "睡眠耐性": 1,
                        "梦灯祈祷": 1,
                        "祭典巡礼": 1
                    },
                    62, [-3, 2, 2, 2, 2]
                ],
                ["哥特幽魂腰甲α", 3, 3, 3, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "急袭": 2,
                    "锁刃刺击": 1,
                    "梦灯祈祷": 1,
                    "祭典巡礼": 1
                }, 62, [-3, 2, 2, 2, 2]],
                ["哥特幽魂护腿α", 3, 3, 4, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "广域化": 2,
                    "锁刃刺击": 1,
                    "梦灯祈祷": 1,
                    "祭典巡礼": 1
                }, 62, [-3, 2, 2, 2, 2]],
                ["收获头饰α", 3, 3, 0, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "怨恨": 1,
                    "植生学": 1,
                    "祭典巡礼": 1
                }, 62, [4, 1, 1, 1, 1]],
                ["收获装甲α", 3, 3, 1, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "最爱蘑菇": 2,
                    "怨恨": 1,
                    "祭典巡礼": 1
                }, 62, [4, 1, 1, 1, 1]],
                ["收获手套α", 3, 3, 2, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "满足感": 2,
                    "最爱蘑菇": 1,
                    "体术": 2,
                    "祭典巡礼": 1
                }, 62, [4, 1, 1, 1, 1]],
                ["收获护裙α", 3, 3, 3, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                        "体术": 1,
                        "植生学": 1,
                        "满足感": 1,
                        "祭典巡礼": 1
                    },
                    62, [4, 1, 1, 1, 1]
                ],
                ["收获护腿α", 3, 3, 4, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "体术": 2,
                    "植生学": 2,
                    "祭典巡礼": 1
                }, 62, [4, 1, 1, 1, 1]],
                ["祭典头盔α", 3, 3, 0, 0, 0, 0, 5, 0, 2, [2, 1, 0], {
                    "力量解放": 1,
                    "精灵加护": 1,
                    "祝谣祈祷": 1,
                    "祭典巡礼": 1
                }, 62, [2, 2, 2, -3, 2]],
                ["祭典铠甲α", 3, 3, 1, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "挑战者": 1,
                    "属性变换": 1,
                    "龙耐性": 1,
                    "祝谣祈祷": 1,
                    "祭典巡礼": 1
                }, 62, [2, 2, 2, -3, 2]],
                ["祭典腕甲α", 3, 3, 2, 0, 0, 0, 5, 0, 1, [2, 0, 0], {
                    "力量解放": 1,
                    "整备": 1,
                    "祝谣祈祷": 1,
                    "祭典巡礼": 1
                }, 62, [2, 2, 2, -3, 2]],
                ["祭典腰甲α", 3, 3, 3, 0, 0, 0, 5, 0, 2, [1, 1, 0], {
                    "属性变换": 1,
                    "精灵加护": 1,
                    "龙耐性": 1,
                    "祝谣祈祷": 1,
                    "祭典巡礼": 1
                }, 62, [2, 2, 2, -3, 2]],
                ["祭典护腿α", 3, 3, 4, 0, 0, 0, 5, 0, 1, [2,
                    0, 0
                ], {
                    "挑战者": 1,
                    "整备": 1,
                    "祝谣祈祷": 1,
                    "祭典巡礼": 1
                }, 62, [2, 2, 2, -3, 2]],
                ["猎户星头饰α", 3, 3, 0, 0, 0, 0, 8, 0, 3, [3, 3, 1], {
                    "减轻胆怯": 2,
                    "祭典巡礼": 1
                }, 80, [1, 1, 1, 4, 1]],
                ["猎户星服饰α", 3, 3, 1, 0, 0, 0, 8, 0, 3, [2, 2, 2], {
                    "风压耐性": 2,
                    "体力回复量提升": 1,
                    "祭典巡礼": 1
                }, 80, [1, 1, 1, 4, 1]],
                ["猎户星腕甲α", 3, 3, 2, 0,
                    0, 0, 8, 0, 3, [3, 2, 1], {
                        "体力回复量提升": 2,
                        "风压耐性": 1,
                        "祭典巡礼": 1
                    },
                    80, [1, 1, 1, 4, 1]
                ],
                ["猎户星护腰α", 3, 3, 3, 0, 0, 0, 8, 0, 3, [2, 2, 2], {
                    "耳塞": 1,
                    "攀岩者": 1,
                    "祭典巡礼": 1
                }, 80, [1, 1, 1, 4, 1]],
                ["猎户星靴α", 3, 3, 4, 0, 0, 0, 8, 0, 3, [2, 1, 1], {
                    "耳塞": 2,
                    "减轻胆怯": 1,
                    "祭典巡礼": 1
                }, 80, [1, 1, 1, 4, 1]],
                ["盛装头饰α", 3, 3, 0, 0, 0, 0, 8, 0, 2, [3,
                    2, 0
                ], {
                    "道具使用强化": 3,
                    "精灵加护": 2,
                    "祭典巡礼": 1
                }, 80, [1, 1, 1, 1, 4]],
                ["盛装战衣α", 3, 3, 1, 0, 0, 0, 8, 0, 3, [2, 2, 1], {
                    "因祸得福": 2,
                    "精灵加护": 1,
                    "祭典巡礼": 1
                }, 80, [1, 1, 1, 1, 4]],
                ["盛装手套α", 3, 3, 2, 0, 0, 0, 8, 0, 2, [1, 1, 0], {
                    "无伤": 2,
                    "精神抖擞": 2,
                    "祭典巡礼": 1
                }, 80, [1, 1, 1, 1, 4]],
                ["盛装护腰α", 3, 3, 3, 0, 0, 0, 8, 0, 2, [3, 1, 0], {
                    "无伤": 2,
                    "因祸得福": 1,
                    "祭典巡礼": 1
                }, 80, [1, 1, 1, 1, 4]],
                ["盛装靴α", 3, 3, 4, 0, 0, 0, 8, 0, 3, [3, 2, 1], {
                    "无伤": 1,
                    "精神抖擞": 1,
                    "祭典巡礼": 1
                }, 80, [1, 1, 1, 1, 4]],
                ["凶恶轻盔α", 3, 3, 0, 0, 0, 0, 8, 0, 2, [1, 1, 0], {
                    "怨恨": 2,
                    "精神抖擞": 2,
                    "暗黑骑士之证": 1
                }, 82, [2, 0, -2, 0, 3]],
                ["凶恶胸甲α", 3, 3, 1, 0, 0, 0, 8, 0, 1, [2, 0, 0], {
                    "力量解放": 2,
                    "纳刀术": 2,
                    "暗黑骑士之证": 1
                }, 82, [2, 0, -2, 0, 3]],
                ["凶恶手铠α", 3, 3, 2, 0, 0, 0, 8, 0, 1, [3, 0, 0], {
                    "怨恨": 1,
                    "力量解放": 1,
                    "精神抖擞": 1,
                    "暗黑骑士之证": 1
                }, 82, [2, 0, -2, 0, 3]],
                ["凶恶重足铠α", 3, 3, 3, 0, 0, 0, 8, 0, 3, [3, 2, 1], {
                    "体术": 2,
                    "怨恨": 1,
                    "暗黑骑士之证": 1
                }, 82, [2, 0, -2, 0, 3]],
                ["凶恶锁甲靴α", 3, 3, 4, 0, 0, 0, 8, 0, 1, [2, 0, 0], {
                    "力量解放": 2,
                    "怨恨": 1,
                    "暗黑骑士之证": 1
                }, 82, [2, 0, -2, 0, 3]],
                ["欧米茄耳夹α", 3, 3, 0, 0, 0, 0, 8, 0, 2, [3, 2, 0], {
                    "精灵加护": 1,
                    "弱点特效": 1,
                    "欧米茄共鸣": 1
                }, 82, [3, 0, -3, 2, -2]],
                ["欧米茄服α", 3, 3, 1, 0, 0, 0, 8, 0, 2, [3, 2, 0], {
                    "破坏王": 2,
                    "欧米茄共鸣": 1
                }, 82, [3, 0, -3, 2, -2]],
                ["欧米茄护臂α", 3, 3, 2, 0, 0, 0, 8, 0, 2, [3, 2, 0], {
                    "精灵加护": 1,
                    "挑战者": 1,
                    "欧米茄共鸣": 1
                }, 82, [3, 0, -3, 2, -2]],
                ["欧米茄饰品α", 3, 3, 3, 0, 0, 0, 8, 0, 2, [3, 2, 0], {
                    "精灵加护": 1,
                    "连击": 1,
                    "欧米茄共鸣": 1
                }, 82, [3, 0, -3, 2, -2]],
                ["欧米茄腿α", 3, 3, 4, 0, 0, 0, 8, 0, 2, [3, 2, 0], {
                    "回避性能": 2,
                    "欧米茄共鸣": 1
                }, 82, [3, 0, -3, 2, -2]],
                ["苍世武士【艳发】α", 3, 3, 0, 0, 0, 0, 8, 0, 3, [1, 1, 1], {
                    "力量解放": 1,
                    "巧击": 1,
                    "体术": 2,
                    "海龙的涡雷": 1,
                    "毛皮之昂扬": 1
                }, 80, [2, 4, 0, 0, 3]],
                ["苍世武士【羽织】α", 3, 3, 1, 0, 0, 0, 8, 0, 1, [3, 0, 0], {
                    "力量解放": 1,
                    "巧击": 1,
                    "纳刀术": 1,
                    "海龙的涡雷": 1,
                    "毛皮之昂扬": 1
                }, 80, [2, 4, 0, 0, 3]],
                ["苍世武士【袖】α", 3, 3, 2, 0, 0, 0, 8, 0, 1, [3, 0, 0], {
                    "力量解放": 1,
                    "巧击": 1,
                    "体术": 1,
                    "海龙的涡雷": 1,
                    "毛皮之昂扬": 1
                }, 80, [2, 4, 0, 0, 3]],
                ["苍世武士【带】α", 3, 3, 3, 0, 0, 0, 8, 0, 2, [2, 1, 0], {
                    "力量解放": 1,
                    "巧击": 1,
                    "纳刀术": 2,
                    "海龙的涡雷": 1,
                    "毛皮之昂扬": 1
                }, 80, [2, 4, 0, 0, 3]],
                ["苍世武士【足履】α", 3, 3, 4, 0, 0, 0, 8, 0, 2, [2, 1, 0], {
                        "力量解放": 1,
                        "巧击": 1,
                        "体术": 2,
                        "海龙的涡雷": 1,
                        "毛皮之昂扬": 1
                    },
                    80, [2, 4, 0, 0, 3]
                ],
                ["女王耳饰α", 3, 3, 0, 0, 0, 0, 8, 0, 3, [3, 1, 1], {
                    "连击": 1,
                    "黑蚀龙之力": 1,
                    "荣光盛赞": 1
                }, 80, [4, 1, 1, 1, 3]],
                ["女王外衣α", 3, 3, 1, 0, 0, 0, 8, 0, 0, [0, 0, 0], {
                    "连击": 1,
                    "耐力急速回复": 2,
                    "破坏王": 1,
                    "黑蚀龙之力": 1,
                    "荣光盛赞": 1
                }, 80, [4, 1, 1, 1, 3]],
                ["女王腕甲α", 3, 3, 2, 0, 0, 0, 8, 0, 1, [2, 0, 0], {
                    "连击": 1,
                    "回避距离提升": 1,
                    "破坏王": 1,
                    "黑蚀龙之力": 1,
                    "荣光盛赞": 1
                }, 80, [4, 1, 1, 1, 3]],
                ["女王腰甲α", 3, 3, 3, 0, 0, 0, 8, 0, 0, [0, 0, 0], {
                    "连击": 2,
                    "回避距离提升": 2,
                    "黑蚀龙之力": 1,
                    "荣光盛赞": 1
                }, 80, [4, 1, 1, 1, 3]],
                ["女王长靴α", 3, 3, 4, 0, 0, 0, 8, 0, 2, [3, 2, 0], {
                    "耐力急速回复": 1,
                    "破坏王": 1,
                    "黑蚀龙之力": 1,
                    "荣光盛赞": 1
                }, 80, [4, 1,
                    1, 1, 3
                ]],
                ["花妖猩α", 3, 3, 0, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "急袭": 1,
                    "毛皮之昂扬": 1
                }, 62, [-3, 2, -2, 2, 2]],
                ["调查队耳饰α", 3, 3, 0, 0, 0, 0, 5, 0, 1, [1, 0, 0], {
                    "属性异常耐性": 1,
                    "因祸得福": 1
                }, 66, [1, 1, 1, 1, 1]],
                ["泡歌鸮α", 3, 3, 0, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "广域化": 2,
                    "回避距离提升": 1
                }, 62, [-2, 2, 1, -2, 3]],
                ["封印的龙骸布α", 3, 3, 0, 0, 0, 0, 6, 0, 0, [0, 0, 0], {
                    "怨恨": 2,
                    "龙耐性": 3
                }, 68, [-3, 0, 0, 1, 5]],
                ["知性眼镜α", 3, 3, 0, 0, 0, 0, 6, 0, 3, [2, 1, 1], {
                    "地质学": 3
                }, 68, [2, 2, 2, 2, 2]],
                ["方形眼镜α", 3, 3, 0, 0, 0, 0, 6, 0, 2, [1, 1, 0], {
                    "植生学": 4,
                    "猎人生活": 1
                }, 68, [2, 2, 2, 2, 2]],
                ["封印的眼罩α", 3, 3, 0, 0, 0, 0, 7, 0, 2, [3, 3, 0], {
                    "火耐性": 2
                }, 74, [3, 2, 0, 2, 0]],
                ["墨镜α", 3, 3, 0, 0, 0, 0, 7, 0, 1, [3, 0, 0], {
                    "昏厥耐性": 3,
                    "闪光强化": 1
                }, 74, [4, 0, 4, 2, 0]],
                ["圆框眼镜α", 3, 3, 0, 0, 0, 0, 7, 0, 2, [1, 1, 0], {
                    "属性异常耐性": 3
                }, 74, [0, 4, 2, 0, 4]],
                ["艾露猫头套α", 3, 3, 0, 0, 0, 0, 5, 0, 0, [0, 0, 0], {
                    "指示随从": 5
                }, 62, [2, 2, 2, 2, 2]],
                ["单羽项链α", 3, 3, 1, 0, 0, 0, 7, 0, 0, [0, 0, 0], {
                    "火场怪力": 2,
                    "挑战者": 1
                }, 74, [0, 0, 0, 0, 0]],
                ["启程的鹰之心α", 3, 3, 1, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "体术": 4,
                    "纳刀术": 2
                }, 68, [0, 0, 0, 0, 0]],
                ["下半框眼镜α",
                    3, 3, 0, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                        "广域化": 5
                    },
                    68, [2, 2, 2, 2, 2]
                ],
                ["心形眼镜α", 3, 3, 0, 0, 0, 0, 6, 0, 1, [1, 0, 0], {
                    "最爱蘑菇": 1
                }, 68, [4, 0, 4, 0, 2]],
                ["辟兽头套α", 3, 3, 0, 0, 0, 0, 6, 0, 0, [0, 0, 0], {
                    "力量解放": 2,
                    "体力回复量提升": 1,
                    "耐力急速回复": 1,
                    "辟兽之力": 1,
                    "毛皮之昂扬": 1
                }, 68, [-3, 2, -1, -1, 4]],
                ["肉垫手套α", 3, 3, 2, 0, 0, 0, 7, 0, 1, [1, 0, 0], {
                    "炸弹客": 3,
                    "道具使用强化": 3
                }, 74, [2, 2, 2, 2, 2]],
                ["胶鲵头套α", 3, 3, 0, 0, 0, 0, 8, 0, 3, [3, 1, 1], {
                    "快吃": 2,
                    "饥饿耐性": 1,
                    "满足感": 1,
                    "皮革制品之柔韧": 1
                }, 80, [4, 2, -4, -2, 0]],
                ["胶鲵背包α", 3, 3, 1, 0, 0, 0, 8, 0, 2, [3, 1, 0], {
                    "饥饿耐性": 2,
                    "满足感": 2,
                    "快吃": 1,
                    "皮革制品之柔韧": 1
                }, 80, [4, 2, -4, -2, 0]],
                ["泪滴墨镜α", 3, 3, 0, 0, 0, 0, 8, 0, 3,
                    [1, 1, 1], {
                        "风压耐性": 3,
                        "整备": 2
                    },
                    80, [2, 2, 2, 2, 2]
                ],
                ["猫眼眼镜α", 3, 3, 0, 0, 0, 0, 8, 0, 0, [0, 0, 0], {
                    "急袭": 3,
                    "回避距离提升": 2,
                    "跳跃铁人": 1
                }, 80, [2, 0, 4, 0, 4]],
                ["骷髅面罩α", 3, 3, 0, 0, 0, 0, 8, 0, 1, [2, 0, 0], {
                    "耳塞": 3,
                    "威吓": 3
                }, 80, [-3, -1, -1, -1, 2]],
                ["祝福腰饰α", 3, 3, 3, 0, 0, 0, 8, 0, 1, [3, 0, 0], {
                    "体术": 4,
                    "精灵加护": 3
                }, 80, [2, 2, 0, -2, 3]],
                ["分析之眼α",
                    3, 3, 0, 0, 0, 0, 8, 0, 2, [2, 2, 0], {
                        "弱点特效": 2
                    },
                    80, [4, 2, 4, 0, 0]
                ],
                ["炫光护目镜α", 3, 3, 0, 0, 0, 0, 8, 0, 1, [3, 0, 0], {
                    "回避性能": 4
                }, 80, [0, 0, 2, 4, 4]],
                ["精力充沛森狸人α", 3, 3, 0, 0, 0, 0, 8, 0, 0, [0, 0, 0], {
                    "最爱蘑菇": 3,
                    "耳塞": 2,
                    "环境利用知识": 2,
                    "毛皮之昂扬": 1
                }, 80, [2, 2, 2, 2, 2]],
                ["沼喷龙头套α", 3, 3, 0, 0, 0, 0, 8, 0, 0, [0, 0, 0], {
                    "怨恨": 5,
                    "逆袭": 2,
                    "皮革制品之顺滑": 1
                }, 82, [0, -3, 0, 0, 1]],
                ["强走护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "跑者": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["强走护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "跑者": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["强走护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "跑者": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["体术护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "体术": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["体术护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0],
                    {
                        "体术": 2
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["体术护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "体术": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["体术护石Ⅳ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "体术": 4
                }, 0, [0, 0, 0, 0, 0]],
                ["体术护石Ⅴ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "体术": 5
                }, 0, [0, 0, 0, 0, 0]],
                ["纳刀护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "纳刀术": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["纳刀护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "纳刀术": 2
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["纳刀护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "纳刀术": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["挑战护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "挑战者": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["挑战护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "挑战者": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["挑战护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "挑战者": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["无伤护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "无伤": 1
                }, 0, [0, 0,
                    0, 0, 0
                ]],
                ["无伤护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "无伤": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["无伤护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "无伤": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["暴怒护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "怨恨": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["暴怒护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "怨恨": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["暴怒护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "怨恨": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["痛击护石Ⅰ",
                    3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "弱点特效": 1
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["痛击护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "弱点特效": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["痛击护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "弱点特效": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["全开护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "力量解放": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["全开护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "力量解放": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["全开护石Ⅲ",
                    3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "力量解放": 3
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["浑身护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "精神抖擞": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["浑身护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "精神抖擞": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["浑身护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "精神抖擞": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["早气护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "耐力急速回复": 1
                }, 0, [0, 0, 0,
                    0, 0
                ]],
                ["早气护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "耐力急速回复": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["早气护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "耐力急速回复": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["防御护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "防御": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["防御护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "防御": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["防御护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "防御": 3
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["防御护石Ⅳ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "防御": 4
                }, 0, [0, 0, 0, 0, 0]],
                ["防御护石Ⅴ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "防御": 5
                }, 0, [0, 0, 0, 0, 0]],
                ["加护护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "精灵加护": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["加护护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "精灵加护": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["加护护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "精灵加护": 3
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["治愈护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "体力回复量提升": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["治愈护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "体力回复量提升": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["治愈护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "体力回复量提升": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["早复护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "回复速度": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["早复护石Ⅱ",
                    3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "回复速度": 2
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["早复护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "回复速度": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["快吃护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "快吃": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["快吃护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "快吃": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["快吃护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "快吃": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["耳塞护石Ⅰ", 3, 3, 5, 0,
                    0, 0, 0, 0, 0, [0, 0, 0], {
                        "耳塞": 1
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["耳塞护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "耳塞": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["防风护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "风压耐性": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["防风护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "风压耐性": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["防风护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "风压耐性": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["耐震护石Ⅰ", 3, 3,
                    5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "耐震": 1
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["耐震护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "耐震": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["耐震护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "耐震": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["回避护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "回避性能": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["回避护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "回避性能": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["回避护石Ⅲ", 3, 3, 5, 0, 0, 0,
                    0, 0, 0, [0, 0, 0], {
                        "回避性能": 3
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["回避护石Ⅳ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "回避性能": 4
                }, 0, [0, 0, 0, 0, 0]],
                ["跳跃护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "回避距离提升": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["跳跃护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "回避距离提升": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["跳跃护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "回避距离提升": 3
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["耐火护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "火耐性": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["耐火护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "火耐性": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["耐火护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "火耐性": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["耐水护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "水耐性": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["耐水护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "水耐性": 2
                    }, 0,
                    [0, 0, 0, 0, 0]
                ],
                ["耐水护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "水耐性": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["耐雷护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "雷耐性": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["耐雷护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "雷耐性": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["耐雷护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "雷耐性": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["耐冰护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "冰耐性": 1
                }, 0, [0,
                    0, 0, 0, 0
                ]],
                ["耐冰护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "冰耐性": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["耐冰护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "冰耐性": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["耐龙护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "龙耐性": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["耐龙护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "龙耐性": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["耐龙护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "龙耐性": 3
                }, 0, [0, 0,
                    0, 0, 0
                ]],
                ["耐属护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "属性异常耐性": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["耐属护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "属性异常耐性": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["耐属护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "属性异常耐性": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["耐毒护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "毒耐性": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["耐毒护石Ⅱ", 3, 3, 5,
                    0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "毒耐性": 2
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["耐毒护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "毒耐性": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["耐麻护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "麻痹耐性": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["耐麻护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "麻痹耐性": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["耐麻护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "麻痹耐性": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["耐眠护石Ⅰ",
                    3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "睡眠耐性": 1
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["耐眠护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "睡眠耐性": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["耐眠护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "睡眠耐性": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["耐绝护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "昏厥耐性": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["耐绝护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "昏厥耐性": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["耐绝护石Ⅲ",
                    3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "昏厥耐性": 3
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["耐爆护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "爆破异常耐性": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["耐爆护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "爆破异常耐性": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["耐爆护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "爆破异常耐性": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["植学护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "植生学": 1
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["植学护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "植生学": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["植学护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "植生学": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["植学护石Ⅳ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "植生学": 4
                }, 0, [0, 0, 0, 0, 0]],
                ["地学护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "地质学": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["地学护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "地质学": 2
                    }, 0,
                    [0, 0, 0, 0, 0]
                ],
                ["地学护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "地质学": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["重击护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "破坏王": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["重击护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "破坏王": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["重击护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "破坏王": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["爆师护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "炸弹客": 1
                }, 0, [0,
                    0, 0, 0, 0
                ]],
                ["爆师护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "炸弹客": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["爆师护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "炸弹客": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["嗜菇护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "最爱蘑菇": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["嗜菇护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "最爱蘑菇": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["嗜菇护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "最爱蘑菇": 3
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["持续护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "道具使用强化": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["持续护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "道具使用强化": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["持续护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "道具使用强化": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["友爱护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "广域化": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["友爱护石Ⅱ",
                    3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "广域化": 2
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["友爱护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "广域化": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["友爱护石Ⅳ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "广域化": 4
                }, 0, [0, 0, 0, 0, 0]],
                ["友爱护石Ⅴ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "广域化": 5
                }, 0, [0, 0, 0, 0, 0]],
                ["小胃口护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "满足感": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["小胃口护石Ⅱ",
                    3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "满足感": 2
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["小胃口护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "满足感": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["底力护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "火场怪力": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["底力护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "火场怪力": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["底力护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "火场怪力": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["底力护石Ⅳ",
                    3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "火场怪力": 4
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["耐冲护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "减轻胆怯": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["耐冲护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "减轻胆怯": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["耐冲护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "减轻胆怯": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["断食护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "饥饿耐性": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["断食护石Ⅱ",
                    3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "饥饿耐性": 2
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["断食护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "饥饿耐性": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["逆袭护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "逆袭": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["逆袭护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "逆袭": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["逆袭护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "逆袭": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["攻势护石Ⅰ", 3, 3, 5, 0,
                    0, 0, 0, 0, 0, [0, 0, 0], {
                        "攻势": 1
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["攻势护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "攻势": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["攻势护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "攻势": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["转福护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "因祸得福": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["转福护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "因祸得福": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["转福护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0,
                    0, [0, 0, 0], {
                        "因祸得福": 3
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["连击护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "连击": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["连击护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "连击": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["连击护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "连击": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["反攻护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "巧击": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["反攻护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "巧击": 2
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["反攻护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "巧击": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["急袭护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "急袭": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["急袭护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "急袭": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["急袭护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "急袭": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["耐裂护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "裂伤耐性": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["耐裂护石Ⅱ",
                    3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "裂伤耐性": 2
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["耐裂护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "裂伤耐性": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["耐防护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "防御力下降耐性": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["耐防护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "防御力下降耐性": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["耐防护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "防御力下降耐性": 3
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["环境护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "环境利用知识": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["环境护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "环境利用知识": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["环境护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "环境利用知识": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["整备护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "整备": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["整备护石Ⅱ", 3, 3,
                    5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "整备": 2
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["整备护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "整备": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["整备护石Ⅳ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "整备": 4
                }, 0, [0, 0, 0, 0, 0]],
                ["威吓护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "威吓": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["威吓护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "威吓": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["威吓护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "威吓": 3
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["耐缚护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "束缚耐性": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["耐缚护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "束缚耐性": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["耐缚护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "束缚耐性": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["锁刃护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "锁刃刺击": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["锁刃护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "锁刃刺击": 2
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["锁刃护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "锁刃刺击": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["属吸护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "属性吸收": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["属吸护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "属性吸收": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["属变护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "属性变换": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["属变护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                        "属性变换": 2
                    },
                    0, [0, 0, 0, 0, 0]
                ],
                ["抗狂护石Ⅰ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "无我之境": 1
                }, 0, [0, 0, 0, 0, 0]],
                ["抗狂护石Ⅱ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "无我之境": 2
                }, 0, [0, 0, 0, 0, 0]],
                ["抗狂护石Ⅲ", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "无我之境": 3
                }, 0, [0, 0, 0, 0, 0]],
                ["希望护石", 3, 3, 5, 0, 0, 0, 0, 0, 0, [0, 0, 0], {
                    "钻研": 1,
                    "体力回复量提升": 1
                }, 0, [0, 0, 0, 0, 0]]
            ]);
        for (const c of b)
            if (a.push(c), 0 ===
                c.j || 1 === c.j || 2 === c.j || 3 === c.j || 4 === c.j) 5 == c.o ? a.push(md(c, [Math.min(3, c.a[0] + 1), Math.min(3, c.a[1] + 1), Math.min(3, c.a[2] + 1)])) : 6 == c.o && a.push(md(c, [Math.min(3, c.a[0] + 1), Math.min(3, c.a[1] + 1), c.a[2]]));
        nd = a
    };
    var od = class {
            constructor(a, b) {
                this.Z = a;
                this.f = b
            }
        },
        pd = class {
            constructor(a, b, c, d) {
                this.name = a;
                this.a = b;
                this.b = c;
                this.type = d
            }
        },
        qd = null;

    function rd(a, b) {
        return 0 < b ? (sd[a] || 100) * b : 0
    }

    function td(a) {
        let b = 0;
        for (let c in a) b += rd(c, a[c]);
        return b
    }

    function ud(a, b, c) {
        a[b] = (a[b] || 0) + c
    }
    var vd = null,
        sd = null,
        wd = {};

    function xd(a) {
        for (const b of a)
            for (const c of b.f) wd[c.name] = c
    }
    class yd {
        constructor(a) {
            this.a = a;
            this.b = []
        }
    }
    class zd {
        constructor(a, b) {
            this.Z = a;
            this.f = b
        }
    }

    function Ad() {
        return vd.map(function(a) {
            const b = [];
            for (const c of a.f) {
                let d = b.find(e => e.a == c.a);
                d || (d = new yd(c.a), b.push(d));
                d.b.push(c.name)
            }
            return new zd(a.Z, b)
        })
    }

    function Bd(a) {
        return wd[a] || null
    }

    function Cd() {
        return Ra(wd).filter(a => !!(a.type & 3))
    }

    function Dd(a) {
        var b = vd;
        const c = [];
        for (const d of b) Ja(c, d.f);
        b = {};
        for (const d of a)
            for (const e of c) e.name == d && (a = e.a, b[a] = Math.max(e.b, b[a] || 0));
        return b
    }
    var Ed = class {
        constructor(a, b) {
            this.Z = a;
            this.u = b
        }
    };

    function Fd() {
        return vd.map(a => {
            const b = a.f.map(c => c.a);
            La(b);
            return new Ed(a.Z, b)
        })
    }
    var Gd = class {
        constructor(a, b, c) {
            this.name = a;
            this.b = b;
            this.a = c
        }
    };

    function Hd(a) {
        const b = Object.keys(a).map(c => {
            const d = a[c];
            if (!qd) {
                var e = vd;
                var g = {};
                for (const h of e)
                    for (const k of h.f) k.a in g || (g[k.a] = []), g[k.a].push(k);
                qd = g
            }
            e = qd[c] || [];
            g = null;
            if (0 > d)
                for (const h of e) 0 >= h.b && d <= h.b && (!g || h.b < g.b) && (g = h);
            else
                for (const h of e) 0 <= h.b && d >= h.b && (!g || h.b > g.b) && (g = h);
            return new Gd(c, d, g)
        });
        Ma(b, (c, d) => d.b - c.b);
        return b
    }
    let Id = null;

    function Jd(a) {
        if (!Id) {
            const b = {};
            for (const c of vd)
                for (const d of c.f) b[d.a] = Math.max(d.b, b[d.a] || 0);
            Id = b
        }
        return Id[a]
    };
    class Kd {
        constructor(a, b) {
            this.name = a;
            this.a = b
        }
    }
    var Ld = class {
            constructor(a, b, c) {
                this.name = a;
                this.f = b;
                this.b = c
            }
        },
        Md = class extends Ld {
            constructor(a, b, c, d, e, g) {
                super(a, b, d);
                this.o = e;
                this.m = g;
                this.i = !1;
                for (const h in this.f) a = this.f[h], b = new Kd(h, a), 0 < a ? this.a = b : 0 > a && (this.c = b)
            }
        },
        Nd = [],
        Od = {};

    function Pd(a) {
        Ja(Nd, a);
        Ma(Nd, (b, c) => b.a.name != c.a.name ? b.a.name < c.a.name ? -1 : 1 : b.a.a != c.a.a ? b.a.a > c.a.a ? -1 : 1 : 0);
        Nd[Nd.length - 1].i = !0;
        for (a = 0; a < Nd.length - 1; a++) Nd[a].a.name != Nd[a + 1].a.name && (Nd[a].i = !0);
        for (const b of Nd) {
            if (!b.c) continue;
            a = b.a.name;
            const c = b.c.a / b.a.a;
            if (!Od[a] || c > Od[a].a) Od[a] = new Kd(b.c.name, c)
        }
        for (const b in Od);
        Nd && Nd[0].b && (Qd = new Rd(Nd))
    }
    var Rd = class {
        constructor(a) {
            this.b = {};
            this.a = {};
            for (const b of a) 1 < b.a.a ? (this.a[b.a.name] || (this.a[b.a.name] = []), a = this.a[b.a.name], a.push(b), a.sort((c, d) => d.a.a - c.a.a)) : this.b[b.a.name] = b
        }
    };
    let Qd = null;

    function Sd(a) {
        return Qd.b[a] || null
    }

    function Td(a) {
        return a.map(([b, c, d, e, g, h]) => new Md(b, h, c, d, g, e))
    };
    var Ud = {
        Aa: Td([
            ["逆上珠【2】", 1, 2, 0, 0, {
                "怨恨": 1
            }],
            ["反攻珠【3】", 1, 3, 0, 0, {
                "巧击": 1
            }],
            ["无伤珠【2】", 1, 2, 0, 0, {
                "无伤": 1
            }],
            ["逆袭珠【2】", 1, 2, 0, 0, {
                "逆袭": 1
            }],
            ["痛击珠【3】", 1, 3, 0, 0, {
                "弱点特效": 1
            }],
            ["浑身珠【2】", 1, 2, 0, 0, {
                "精神抖擞": 1
            }],
            ["防御珠【1】", 1, 1, 0, 0, {
                "防御": 1
            }],
            ["加护珠【1】",
                1, 1, 0, 0, {
                    "精灵加护": 1
                }
            ],
            ["耐火珠【1】", 1, 1, 0, 0, {
                "火耐性": 1
            }],
            ["耐水珠【1】", 1, 1, 0, 0, {
                "水耐性": 1
            }],
            ["耐雷珠【1】", 1, 1, 0, 0, {
                "雷耐性": 1
            }],
            ["耐冰珠【1】", 1, 1, 0, 0, {
                "冰耐性": 1
            }],
            ["耐龙珠【1】", 1, 1, 0, 0, {
                "龙耐性": 1
            }],
            ["耐毒珠【1】", 1, 1, 0, 0, {
                "毒耐性": 1
            }],
            ["耐麻珠【1】", 1, 1, 0, 0, {
                "麻痹耐性": 1
            }],
            ["耐眠珠【1】", 1, 1, 0, 0, {
                "睡眠耐性": 1
            }],
            ["耐防珠【1】", 1, 1, 0, 0, {
                "防御力下降耐性": 1
            }],
            ["耐绝珠【1】", 1, 1, 0, 0, {
                "昏厥耐性": 1
            }],
            ["耐裂珠【1】", 1, 1, 0, 0, {
                "裂伤耐性": 1
            }],
            ["耐缚珠【1】", 1, 1, 0, 0, {
                "束缚耐性": 1
            }],
            ["耐爆珠【1】", 1, 1, 0, 0, {
                "爆破异常耐性": 1
            }],
            ["耐臭珠【1】",
                1, 1, 0, 0, {
                    "恶臭耐性": 1
                }
            ],
            ["适应珠【1】", 1, 1, 0, 0, {
                "适应环境": 1
            }],
            ["治愈珠【1】", 1, 1, 0, 0, {
                "体力回复量提升": 1
            }],
            ["早复珠【1】", 1, 1, 0, 0, {
                "回复速度": 1
            }],
            ["环境珠【1】", 1, 1, 0, 0, {
                "环境利用知识": 1
            }],
            ["体术珠【1】", 1, 1, 0, 0, {
                "体术": 1
            }],
            ["早气珠【2】", 1, 2, 0, 0, {
                "耐力急速回复": 1
            }],
            ["强走珠【1】", 1, 1, 0, 0, {
                "跑者": 1
            }],
            ["无食珠【1】", 1, 1, 0, 0, {
                "饥饿耐性": 1
            }],
            ["挑战珠【3】", 1, 3, 0, 0, {
                "挑战者": 1
            }],
            ["全开珠【3】", 1, 3, 0, 0, {
                "力量解放": 1
            }],
            ["底力珠【2】", 1, 2, 0, 0, {
                "火场怪力": 1
            }],
            ["连击珠【3】", 1, 3, 0, 0, {
                "连击": 1
            }],
            ["攻势珠【3】", 1, 3, 0, 0, {
                "攻势": 1
            }],
            ["刺击珠【3】",
                1, 3, 0, 0, {
                    "锁刃刺击": 1
                }
            ],
            ["重击珠【2】", 1, 2, 0, 0, {
                "破坏王": 1
            }],
            ["转福珠【2】", 1, 2, 0, 0, {
                "因祸得福": 1
            }],
            ["急袭珠【2】", 1, 2, 0, 0, {
                "急袭": 1
            }],
            ["抗狂珠【1】", 1, 1, 0, 0, {
                "无我之境": 1
            }],
            ["钻研珠【1】", 1, 1, 0, 0, {
                "钻研": 1
            }],
            ["回避珠【2】", 1, 2, 0, 0, {
                "回避性能": 1
            }],
            ["跳跃珠【2】", 1, 2, 0,
                0, {
                    "回避距离提升": 1
                }
            ],
            ["防音珠【2】", 1, 2, 0, 0, {
                "耳塞": 1
            }],
            ["速纳珠【1】", 1, 1, 0, 0, {
                "纳刀术": 1
            }],
            ["防风珠【1】", 1, 1, 0, 0, {
                "风压耐性": 1
            }],
            ["耐震珠【1】", 1, 1, 0, 0, {
                "耐震": 1
            }],
            ["耐冲珠【1】", 1, 1, 0, 0, {
                "减轻胆怯": 1
            }],
            ["威吓珠【1】", 1, 1, 0, 0, {
                "威吓": 1
            }],
            ["快吃珠【1】", 1, 1, 0, 0, {
                "快吃": 1
            }],
            ["沼渡珠【1】", 1, 1, 0, 0, {
                "适应水域·油泥": 1
            }],
            ["缓冲珠【1】", 1, 1, 0, 0, {
                "缓冲": 1
            }],
            ["飞跃珠【1】", 1, 1, 0, 0, {
                "飞身跃入": 1
            }],
            ["强跳珠【1】", 1, 1, 0, 0, {
                "跳跃铁人": 1
            }],
            ["登壁珠【1】", 1, 1, 0, 0, {
                "攀岩者": 1
            }],
            ["友爱珠【1】", 1, 1, 0, 0, {
                "广域化": 1
            }],
            ["整备珠【2】", 1, 2, 0, 0, {
                "整备": 1
            }],
            ["爆师珠【1】", 1, 1, 0, 0, {
                "炸弹客": 1
            }],
            ["嗜菇珠【2】", 1, 2, 0, 0, {
                "最爱蘑菇": 1
            }],
            ["持续珠【1】", 1, 1, 0, 0, {
                "道具使用强化": 1
            }],
            ["节食珠【1】", 1, 1, 0, 0, {
                "满足感": 1
            }],
            ["闪光珠【1】", 1, 1, 0, 0, {
                "闪光强化": 1
            }],
            ["植学珠【1】", 1, 1, 0, 0, {
                "植生学": 1
            }],
            ["地学珠【1】", 1, 1, 0, 0, {
                "地质学": 1
            }],
            ["标本珠【1】", 1, 1, 0, 0, {
                "昆虫标本达人": 1
            }],
            ["猎手珠【1】", 1, 1, 0, 0, {
                "猎人生活": 1
            }],
            ["装饰品【１】", 1, 1, 0, 0, {
                "Lv1插槽 技能": 1
            }],
            ["装饰品【２】", 1, 2, 0, 0, {
                "Lv2插槽 技能": 1
            }],
            ["装饰品【３】", 1, 3, 0, 0, {
                "Lv3插槽 技能": 1
            }]
        ]),
        ca: Td([
            ["攻击珠【1】", 1, 1, 0, 0, {
                "攻击": 1
            }],
            ["攻击珠Ⅱ【2】",
                1, 2, 0, 0, {
                    "攻击": 2
                }
            ],
            ["攻击珠Ⅲ【3】", 1, 3, 0, 0, {
                "攻击": 3
            }],
            ["守势珠【1】", 1, 1, 0, 0, {
                "攻击守势": 1
            }],
            ["守势珠Ⅱ【2】", 1, 2, 0, 0, {
                "攻击守势": 2
            }],
            ["守势珠Ⅲ【3】", 1, 3, 0, 0, {
                "攻击守势": 3
            }],
            ["守势·火炎珠【3】", 1, 3, 0, 0, {
                "攻击守势": 3,
                "火属性攻击强化": 1
            }],
            ["守势·流水珠【3】",
                1, 3, 0, 0, {
                    "攻击守势": 3,
                    "水属性攻击强化": 1
                }
            ],
            ["守势·冰结珠【3】", 1, 3, 0, 0, {
                "攻击守势": 3,
                "冰属性攻击强化": 1
            }],
            ["守势·雷光珠【3】", 1, 3, 0, 0, {
                "攻击守势": 3,
                "雷属性攻击强化": 1
            }],
            ["守势·破龙珠【3】", 1, 3, 0, 0, {
                "攻击守势": 3,
                "龙属性攻击强化": 1
            }],
            ["守势·匠珠【3】", 1, 3, 0, 0, {
                "攻击守势": 3,
                "匠": 1
            }],
            ["守势·铁壁珠【3】", 1, 3, 0, 0, {
                "攻击守势": 3,
                "格挡性能": 1
            }],
            ["达人珠【1】", 1, 1, 0, 0, {
                "看破": 1
            }],
            ["达人珠Ⅱ【2】", 1, 2, 0, 0, {
                "看破": 2
            }],
            ["达人珠Ⅲ【3】", 1, 3, 0, 0, {
                "看破": 3
            }],
            ["超心珠【1】", 1, 1, 0, 0, {
                "超会心": 1
            }],
            ["超心珠Ⅱ【2】",
                1, 2, 0, 0, {
                    "超会心": 2
                }
            ],
            ["超心珠Ⅲ【3】", 1, 3, 0, 0, {
                "超会心": 3
            }],
            ["拔刀珠【1】", 1, 1, 0, 0, {
                "拔刀术【技】": 1
            }],
            ["拔刀珠Ⅱ【2】", 1, 2, 0, 0, {
                "拔刀术【技】": 2
            }],
            ["拔刀珠Ⅲ【3】", 1, 3, 0, 0, {
                "拔刀术【技】": 3
            }],
            ["火炎珠【1】", 1, 1, 0, 0, {
                "火属性攻击强化": 1
            }],
            ["火炎珠Ⅱ【2】",
                1, 2, 0, 0, {
                    "火属性攻击强化": 2
                }
            ],
            ["火炎珠Ⅲ【3】", 1, 3, 0, 0, {
                "火属性攻击强化": 3
            }],
            ["火炎·守势珠【3】", 1, 3, 0, 0, {
                "火属性攻击强化": 3,
                "攻击守势": 1
            }],
            ["火炎·属会珠【3】", 1, 3, 0, 0, {
                "火属性攻击强化": 3,
                "会心击【属性】": 1
            }],
            ["火炎·匠珠【3】",
                1, 3, 0, 0, {
                    "火属性攻击强化": 3,
                    "匠": 1
                }
            ],
            ["火炎·利刃珠【3】", 1, 3, 0, 0, {
                "火属性攻击强化": 3,
                "利刃": 1
            }],
            ["火炎·射法珠【3】", 1, 3, 0, 0, {
                "火属性攻击强化": 3,
                "弹道强化": 1
            }],
            ["火炎·初弹珠【3】", 1, 3, 0, 0, {
                "火属性攻击强化": 3,
                "首发迅击": 1
            }],
            ["火炎·积弹珠【3】",
                1, 3, 0, 0, {
                    "火属性攻击强化": 3,
                    "强四射击": 1
                }
            ],
            ["火炎·集中珠【3】", 1, 3, 0, 0, {
                "火属性攻击强化": 3,
                "集中": 1
            }],
            ["火炎·昂扬珠【3】", 1, 3, 0, 0, {
                "火属性攻击强化": 3,
                "强化持续": 1
            }],
            ["火炎·击晕珠【3】", 1, 3, 0, 0, {
                "火属性攻击强化": 3,
                "击晕术": 1
            }],
            ["火炎·速变珠【3】",
                1, 3, 0, 0, {
                    "火属性攻击强化": 3,
                    "高速变形": 1
                }
            ],
            ["火炎·铁壁珠【3】", 1, 3, 0, 0, {
                "火属性攻击强化": 3,
                "格挡性能": 1
            }],
            ["火炎·强壁珠【3】", 1, 3, 0, 0, {
                "火属性攻击强化": 3,
                "格挡强化": 1
            }],
            ["流水珠【1】", 1, 1, 0, 0, {
                "水属性攻击强化": 1
            }],
            ["流水珠Ⅱ【2】",
                1, 2, 0, 0, {
                    "水属性攻击强化": 2
                }
            ],
            ["流水珠Ⅲ【3】", 1, 3, 0, 0, {
                "水属性攻击强化": 3
            }],
            ["流水·守势珠【3】", 1, 3, 0, 0, {
                "水属性攻击强化": 3,
                "攻击守势": 1
            }],
            ["流水·属会珠【3】", 1, 3, 0, 0, {
                "水属性攻击强化": 3,
                "会心击【属性】": 1
            }],
            ["流水·匠珠【3】",
                1, 3, 0, 0, {
                    "水属性攻击强化": 3,
                    "匠": 1
                }
            ],
            ["流水·利刃珠【3】", 1, 3, 0, 0, {
                "水属性攻击强化": 3,
                "利刃": 1
            }],
            ["流水·射法珠【3】", 1, 3, 0, 0, {
                "水属性攻击强化": 3,
                "弹道强化": 1
            }],
            ["流水·初弹珠【3】", 1, 3, 0, 0, {
                "水属性攻击强化": 3,
                "首发迅击": 1
            }],
            ["流水·积弹珠【3】",
                1, 3, 0, 0, {
                    "水属性攻击强化": 3,
                    "强四射击": 1
                }
            ],
            ["流水·集中珠【3】", 1, 3, 0, 0, {
                "水属性攻击强化": 3,
                "集中": 1
            }],
            ["流水·昂扬珠【3】", 1, 3, 0, 0, {
                "水属性攻击强化": 3,
                "强化持续": 1
            }],
            ["流水·击晕珠【3】", 1, 3, 0, 0, {
                "水属性攻击强化": 3,
                "击晕术": 1
            }],
            ["流水·速变珠【3】",
                1, 3, 0, 0, {
                    "水属性攻击强化": 3,
                    "高速变形": 1
                }
            ],
            ["流水·铁壁珠【3】", 1, 3, 0, 0, {
                "水属性攻击强化": 3,
                "格挡性能": 1
            }],
            ["流水·强壁珠【3】", 1, 3, 0, 0, {
                "水属性攻击强化": 3,
                "格挡强化": 1
            }],
            ["冰结珠【1】", 1, 1, 0, 0, {
                "冰属性攻击强化": 1
            }],
            ["冰结珠Ⅱ【2】",
                1, 2, 0, 0, {
                    "冰属性攻击强化": 2
                }
            ],
            ["冰结珠Ⅲ【3】", 1, 3, 0, 0, {
                "冰属性攻击强化": 3
            }],
            ["冰结·守势珠【3】", 1, 3, 0, 0, {
                "冰属性攻击强化": 3,
                "攻击守势": 1
            }],
            ["冰结·属会珠【3】", 1, 3, 0, 0, {
                "冰属性攻击强化": 3,
                "会心击【属性】": 1
            }],
            ["冰结·匠珠【3】",
                1, 3, 0, 0, {
                    "冰属性攻击强化": 3,
                    "匠": 1
                }
            ],
            ["冰结·利刃珠【3】", 1, 3, 0, 0, {
                "冰属性攻击强化": 3,
                "利刃": 1
            }],
            ["冰结·射法珠【3】", 1, 3, 0, 0, {
                "冰属性攻击强化": 3,
                "弹道强化": 1
            }],
            ["冰结·初弹珠【3】", 1, 3, 0, 0, {
                "冰属性攻击强化": 3,
                "首发迅击": 1
            }],
            ["冰结·积弹珠【3】",
                1, 3, 0, 0, {
                    "冰属性攻击强化": 3,
                    "强四射击": 1
                }
            ],
            ["冰结·集中珠【3】", 1, 3, 0, 0, {
                "冰属性攻击强化": 3,
                "集中": 1
            }],
            ["冰结·昂扬珠【3】", 1, 3, 0, 0, {
                "冰属性攻击强化": 3,
                "强化持续": 1
            }],
            ["冰结·击晕珠【3】", 1, 3, 0, 0, {
                "冰属性攻击强化": 3,
                "击晕术": 1
            }],
            ["冰结·速变珠【3】",
                1, 3, 0, 0, {
                    "冰属性攻击强化": 3,
                    "高速变形": 1
                }
            ],
            ["冰结·铁壁珠【3】", 1, 3, 0, 0, {
                "冰属性攻击强化": 3,
                "格挡性能": 1
            }],
            ["冰结·强壁珠【3】", 1, 3, 0, 0, {
                "冰属性攻击强化": 3,
                "格挡强化": 1
            }],
            ["雷光珠【1】", 1, 1, 0, 0, {
                "雷属性攻击强化": 1
            }],
            ["雷光珠Ⅱ【2】",
                1, 2, 0, 0, {
                    "雷属性攻击强化": 2
                }
            ],
            ["雷光珠Ⅲ【3】", 1, 3, 0, 0, {
                "雷属性攻击强化": 3
            }],
            ["雷光·守势珠【3】", 1, 3, 0, 0, {
                "雷属性攻击强化": 3,
                "攻击守势": 1
            }],
            ["雷光·属会珠【3】", 1, 3, 0, 0, {
                "雷属性攻击强化": 3,
                "会心击【属性】": 1
            }],
            ["雷光·匠珠【3】",
                1, 3, 0, 0, {
                    "雷属性攻击强化": 3,
                    "匠": 1
                }
            ],
            ["雷光·利刃珠【3】", 1, 3, 0, 0, {
                "雷属性攻击强化": 3,
                "利刃": 1
            }],
            ["雷光·射法珠【3】", 1, 3, 0, 0, {
                "雷属性攻击强化": 3,
                "弹道强化": 1
            }],
            ["雷光·初弹珠【3】", 1, 3, 0, 0, {
                "雷属性攻击强化": 3,
                "首发迅击": 1
            }],
            ["雷光·积弹珠【3】",
                1, 3, 0, 0, {
                    "雷属性攻击强化": 3,
                    "强四射击": 1
                }
            ],
            ["雷光·集中珠【3】", 1, 3, 0, 0, {
                "雷属性攻击强化": 3,
                "集中": 1
            }],
            ["雷光·昂扬珠【3】", 1, 3, 0, 0, {
                "雷属性攻击强化": 3,
                "强化持续": 1
            }],
            ["雷光·击晕珠【3】", 1, 3, 0, 0, {
                "雷属性攻击强化": 3,
                "击晕术": 1
            }],
            ["雷光·速变珠【3】",
                1, 3, 0, 0, {
                    "雷属性攻击强化": 3,
                    "高速变形": 1
                }
            ],
            ["雷光·铁壁珠【3】", 1, 3, 0, 0, {
                "雷属性攻击强化": 3,
                "格挡性能": 1
            }],
            ["雷光·强壁珠【3】", 1, 3, 0, 0, {
                "雷属性攻击强化": 3,
                "格挡强化": 1
            }],
            ["破龙珠【1】", 1, 1, 0, 0, {
                "龙属性攻击强化": 1
            }],
            ["破龙珠Ⅱ【2】",
                1, 2, 0, 0, {
                    "龙属性攻击强化": 2
                }
            ],
            ["破龙珠Ⅲ【3】", 1, 3, 0, 0, {
                "龙属性攻击强化": 3
            }],
            ["破龙·守势珠【3】", 1, 3, 0, 0, {
                "龙属性攻击强化": 3,
                "攻击守势": 1
            }],
            ["破龙·属会珠【3】", 1, 3, 0, 0, {
                "龙属性攻击强化": 3,
                "会心击【属性】": 1
            }],
            ["破龙·匠珠【3】",
                1, 3, 0, 0, {
                    "龙属性攻击强化": 3,
                    "匠": 1
                }
            ],
            ["破龙·利刃珠【3】", 1, 3, 0, 0, {
                "龙属性攻击强化": 3,
                "利刃": 1
            }],
            ["破龙·射法珠【3】", 1, 3, 0, 0, {
                "龙属性攻击强化": 3,
                "弹道强化": 1
            }],
            ["破龙·初弹珠【3】", 1, 3, 0, 0, {
                "龙属性攻击强化": 3,
                "首发迅击": 1
            }],
            ["破龙·积弹珠【3】",
                1, 3, 0, 0, {
                    "龙属性攻击强化": 3,
                    "强四射击": 1
                }
            ],
            ["破龙·集中珠【3】", 1, 3, 0, 0, {
                "龙属性攻击强化": 3,
                "集中": 1
            }],
            ["破龙·昂扬珠【3】", 1, 3, 0, 0, {
                "龙属性攻击强化": 3,
                "强化持续": 1
            }],
            ["破龙·击晕珠【3】", 1, 3, 0, 0, {
                "龙属性攻击强化": 3,
                "击晕术": 1
            }],
            ["破龙·速变珠【3】",
                1, 3, 0, 0, {
                    "龙属性攻击强化": 3,
                    "高速变形": 1
                }
            ],
            ["破龙·铁壁珠【3】", 1, 3, 0, 0, {
                "龙属性攻击强化": 3,
                "格挡性能": 1
            }],
            ["破龙·强壁珠【3】", 1, 3, 0, 0, {
                "龙属性攻击强化": 3,
                "格挡强化": 1
            }],
            ["毒珠【1】", 1, 1, 0, 0, {
                "毒属性强化": 1
            }],
            ["毒珠Ⅱ【2】", 1, 2, 0, 0, {
                "毒属性强化": 2
            }],
            ["毒珠Ⅲ【3】", 1, 3, 0, 0, {
                "毒属性强化": 3
            }],
            ["麻痹珠【1】", 1, 1, 0, 0, {
                "麻痹属性强化": 1
            }],
            ["麻痹珠Ⅱ【2】", 1, 2, 0, 0, {
                "麻痹属性强化": 2
            }],
            ["麻痹珠Ⅲ【3】", 1, 3, 0, 0, {
                "麻痹属性强化": 3
            }],
            ["睡眠珠【1】", 1, 1, 0, 0, {
                "睡眠属性强化": 1
            }],
            ["睡眠珠Ⅱ【2】", 1, 2, 0, 0, {
                "睡眠属性强化": 2
            }],
            ["睡眠珠Ⅲ【3】", 1, 3, 0, 0, {
                "睡眠属性强化": 3
            }],
            ["爆破珠【1】", 1, 1, 0, 0, {
                "爆破属性强化": 1
            }],
            ["爆破珠Ⅱ【2】", 1, 2, 0, 0, {
                "爆破属性强化": 2
            }],
            ["爆破珠Ⅲ【3】", 1, 3, 0, 0, {
                "爆破属性强化": 3
            }],
            ["属会珠【1】", 1, 1, 0, 0, {
                "会心击【属性】": 1
            }],
            ["属会珠Ⅱ【2】", 1,
                2, 0, 0, {
                    "会心击【属性】": 2
                }
            ],
            ["属会珠Ⅲ【3】", 1, 3, 0, 0, {
                "会心击【属性】": 3
            }],
            ["属会·火炎珠【3】", 1, 3, 0, 0, {
                "会心击【属性】": 3,
                "火属性攻击强化": 1
            }],
            ["属会·流水珠【3】", 1, 3, 0, 0, {
                "会心击【属性】": 3,
                "水属性攻击强化": 1
            }],
            ["属会·冰结珠【3】",
                1, 3, 0, 0, {
                    "会心击【属性】": 3,
                    "冰属性攻击强化": 1
                }
            ],
            ["属会·雷光珠【3】", 1, 3, 0, 0, {
                "会心击【属性】": 3,
                "雷属性攻击强化": 1
            }],
            ["属会·破龙珠【3】", 1, 3, 0, 0, {
                "会心击【属性】": 3,
                "龙属性攻击强化": 1
            }],
            ["属会·匠珠【3】", 1, 3, 0, 0, {
                "会心击【属性】": 3,
                "匠": 1
            }],
            ["属会·射法珠【3】", 1, 3, 0, 0, {
                "会心击【属性】": 3,
                "弹道强化": 1
            }],
            ["属会·击晕珠【3】", 1, 3, 0, 0, {
                "会心击【属性】": 3,
                "击晕术": 1
            }],
            ["属会·铁壁珠【3】", 1, 3, 0, 0, {
                "会心击【属性】": 3,
                "格挡性能": 1
            }],
            ["特会珠【1】", 1, 1, 0, 0, {
                "会心击【特殊】": 1
            }],
            ["特会珠Ⅱ【2】", 1, 2, 0, 0, {
                "会心击【特殊】": 2
            }],
            ["特会珠Ⅲ【3】", 1, 3, 0, 0, {
                "会心击【特殊】": 3
            }],
            ["特会·匠珠【3】", 1, 3, 0, 0, {
                "会心击【特殊】": 3,
                "匠": 1
            }],
            ["特会·射法珠【3】", 1, 3, 0, 0, {
                "会心击【特殊】": 3,
                "弹道强化": 1
            }],
            ["特会·击晕珠【3】",
                1, 3, 0, 0, {
                    "会心击【特殊】": 3,
                    "击晕术": 1
                }
            ],
            ["特会·铁壁珠【3】", 1, 3, 0, 0, {
                "会心击【特殊】": 3,
                "格挡性能": 1
            }],
            ["蓄幅珠【1】", 1, 1, 0, 0, {
                "蓄力大师": 1
            }],
            ["蓄幅珠Ⅱ【2】", 1, 2, 0, 0, {
                "蓄力大师": 2
            }],
            ["蓄幅珠Ⅲ【3】", 1, 3, 0, 0, {
                "蓄力大师": 3
            }],
            ["蓄幅·匠珠【3】",
                1, 3, 0, 0, {
                    "蓄力大师": 3,
                    "匠": 1
                }
            ],
            ["蓄幅·击晕珠【3】", 1, 3, 0, 0, {
                "蓄力大师": 3,
                "击晕术": 1
            }],
            ["匠珠【1】", 1, 1, 0, 0, {
                "匠": 1
            }],
            ["匠珠Ⅱ【2】", 1, 2, 0, 0, {
                "匠": 2
            }],
            ["匠珠Ⅲ【3】", 1, 3, 0, 0, {
                "匠": 3
            }],
            ["利刃珠【1】", 1, 1, 0, 0, {
                "利刃": 1
            }],
            ["利刃珠Ⅱ【2】", 1, 2, 0, 0, {
                "利刃": 2
            }],
            ["利刃珠Ⅲ【3】",
                1, 3, 0, 0, {
                    "利刃": 3
                }
            ],
            ["利刃·火炎珠【3】", 1, 3, 0, 0, {
                "利刃": 3,
                "火属性攻击强化": 1
            }],
            ["利刃·流水珠【3】", 1, 3, 0, 0, {
                "利刃": 3,
                "水属性攻击强化": 1
            }],
            ["利刃·冰结珠【3】", 1, 3, 0, 0, {
                "利刃": 3,
                "冰属性攻击强化": 1
            }],
            ["利刃·雷光珠【3】", 1, 3, 0, 0, {
                "利刃": 3,
                "雷属性攻击强化": 1
            }],
            ["利刃·破龙珠【3】", 1, 3, 0, 0, {
                "利刃": 3,
                "龙属性攻击强化": 1
            }],
            ["利刃·匠珠【3】", 1, 3, 0, 0, {
                "利刃": 3,
                "匠": 1
            }],
            ["利刃·击晕珠【3】", 1, 3, 0, 0, {
                "利刃": 3,
                "击晕术": 1
            }],
            ["利刃·铁壁珠【3】", 1, 3, 0, 0, {
                "利刃": 3,
                "格挡性能": 1
            }],
            ["刚刃珠【1】", 1, 1, 0, 0, {
                "刚刃打磨": 1
            }],
            ["刚刃珠Ⅱ【2】", 1, 2, 0, 0, {
                "刚刃打磨": 2
            }],
            ["刚刃珠Ⅲ【3】", 1, 3, 0, 0, {
                "刚刃打磨": 3
            }],
            ["心眼珠【1】", 1, 1, 0, 0, {
                "心眼": 1
            }],
            ["心眼珠Ⅱ【2】", 1, 2, 0, 0, {
                "心眼": 2
            }],
            ["心眼珠Ⅲ【3】", 1, 3, 0, 0, {
                "心眼": 3
            }],
            ["钝器珠【1】", 1, 1, 0, 0, {
                "钝器能手": 1
            }],
            ["钝器珠Ⅱ【2】", 1, 2, 0, 0, {
                "钝器能手": 2
            }],
            ["钝器珠Ⅲ【3】", 1, 3, 0, 0, {
                "钝器能手": 3
            }],
            ["达艺珠【3】", 1, 3, 0, 0, {
                "达人艺": 1
            }],
            ["强弹珠【3】", 1, 3, 0, 0, {
                "通常弹·通常箭强化": 1
            }],
            ["贯穿珠【3】", 1, 3, 0, 0, {
                "贯穿弹·龙之箭强化": 1
            }],
            ["散弹珠【3】", 1, 3, 0, 0, {
                "散弹·刚射强化": 1
            }],
            ["射法珠【1】", 1, 1, 0, 0, {
                "弹道强化": 1
            }],
            ["射法珠Ⅱ【2】", 1, 2, 0, 0, {
                "弹道强化": 2
            }],
            ["射法珠Ⅲ【3】", 1, 3, 0, 0, {
                "弹道强化": 3
            }],
            ["速射珠【3】", 1, 3, 0, 0, {
                "速射强化": 1
            }],
            ["初弹珠【1】", 1, 1, 0, 0, {
                "首发迅击": 1
            }],
            ["初弹珠Ⅱ【2】", 1, 2, 0, 0, {
                "首发迅击": 2
            }],
            ["初弹珠Ⅲ【3】", 1, 3, 0, 0, {
                "首发迅击": 3
            }],
            ["初弹·火炎珠【3】",
                1, 3, 0, 0, {
                    "首发迅击": 3,
                    "火属性攻击强化": 1
                }
            ],
            ["初弹·流水珠【3】", 1, 3, 0, 0, {
                "首发迅击": 3,
                "水属性攻击强化": 1
            }],
            ["初弹·冰结珠【3】", 1, 3, 0, 0, {
                "首发迅击": 3,
                "冰属性攻击强化": 1
            }],
            ["初弹·雷光珠【3】", 1, 3, 0, 0, {
                "首发迅击": 3,
                "雷属性攻击强化": 1
            }],
            ["初弹·破龙珠【3】", 1, 3, 0, 0, {
                "首发迅击": 3,
                "龙属性攻击强化": 1
            }],
            ["初弹·射法珠【3】", 1, 3, 0, 0, {
                "首发迅击": 3,
                "弹道强化": 1
            }],
            ["初弹·铁壁珠【3】", 1, 3, 0, 0, {
                "首发迅击": 3,
                "格挡性能": 1
            }],
            ["积弹珠【1】", 1, 1, 0, 0, {
                "强四射击": 1
            }],
            ["积弹珠Ⅱ【2】", 1,
                2, 0, 0, {
                    "强四射击": 2
                }
            ],
            ["积弹珠Ⅲ【3】", 1, 3, 0, 0, {
                "强四射击": 3
            }],
            ["积弹·火炎珠【3】", 1, 3, 0, 0, {
                "强四射击": 3,
                "火属性攻击强化": 1
            }],
            ["积弹·流水珠【3】", 1, 3, 0, 0, {
                "强四射击": 3,
                "水属性攻击强化": 1
            }],
            ["积弹·冰结珠【3】", 1, 3, 0, 0, {
                "强四射击": 3,
                "冰属性攻击强化": 1
            }],
            ["积弹·雷光珠【3】", 1, 3, 0, 0, {
                "强四射击": 3,
                "雷属性攻击强化": 1
            }],
            ["积弹·破龙珠【3】", 1, 3, 0, 0, {
                "强四射击": 3,
                "龙属性攻击强化": 1
            }],
            ["积弹·射法珠【3】", 1, 3, 0, 0, {
                "强四射击": 3,
                "弹道强化": 1
            }],
            ["积弹·铁壁珠【3】", 1, 3, 0, 0, {
                "强四射击": 3,
                "格挡性能": 1
            }],
            ["特射珠【1】", 1, 1, 0, 0, {
                "特殊射击强化": 1
            }],
            ["特射珠Ⅱ【2】", 1, 2, 0, 0, {
                "特殊射击强化": 2
            }],
            ["毒瓶珠【2】", 1, 2, 0, 0, {
                "毒瓶追加": 1
            }],
            ["痹瓶珠【3】", 1, 3, 0, 0, {
                "麻痹瓶追加": 1
            }],
            ["眠瓶珠【3】", 1, 3, 0, 0, {
                "睡眠瓶追加": 1
            }],
            ["爆瓶珠【2】", 1, 2, 0, 0, {
                "爆破瓶追加": 1
            }],
            ["疲瓶珠【2】",
                1, 2, 0, 0, {
                    "减气瓶追加": 1
                }
            ],
            ["集中珠【1】", 1, 1, 0, 0, {
                "集中": 1
            }],
            ["集中珠Ⅱ【2】", 1, 2, 0, 0, {
                "集中": 2
            }],
            ["集中珠Ⅲ【3】", 1, 3, 0, 0, {
                "集中": 3
            }],
            ["集中·火炎珠【3】", 1, 3, 0, 0, {
                "集中": 3,
                "火属性攻击强化": 1
            }],
            ["集中·流水珠【3】", 1, 3, 0, 0, {
                "集中": 3,
                "水属性攻击强化": 1
            }],
            ["集中·冰结珠【3】", 1, 3, 0, 0, {
                "集中": 3,
                "冰属性攻击强化": 1
            }],
            ["集中·雷光珠【3】", 1, 3, 0, 0, {
                "集中": 3,
                "雷属性攻击强化": 1
            }],
            ["集中·破龙珠【3】", 1, 3, 0, 0, {
                "集中": 3,
                "龙属性攻击强化": 1
            }],
            ["集中·匠珠【3】", 1, 3, 0, 0, {
                "集中": 3,
                "匠": 1
            }],
            ["集中·射法珠【3】",
                1, 3, 0, 0, {
                    "集中": 3,
                    "弹道强化": 1
                }
            ],
            ["集中·击晕珠【3】", 1, 3, 0, 0, {
                "集中": 3,
                "击晕术": 1
            }],
            ["昂扬珠【1】", 1, 1, 0, 0, {
                "强化持续": 1
            }],
            ["昂扬珠Ⅱ【2】", 1, 2, 0, 0, {
                "强化持续": 2
            }],
            ["昂扬珠Ⅲ【3】", 1, 3, 0, 0, {
                "强化持续": 3
            }],
            ["昂扬·火炎珠【3】", 1, 3, 0, 0, {
                "强化持续": 3,
                "火属性攻击强化": 1
            }],
            ["昂扬·流水珠【3】", 1, 3, 0, 0, {
                "强化持续": 3,
                "水属性攻击强化": 1
            }],
            ["昂扬·冰结珠【3】", 1, 3, 0, 0, {
                "强化持续": 3,
                "冰属性攻击强化": 1
            }],
            ["昂扬·雷光珠【3】", 1, 3, 0, 0, {
                "强化持续": 3,
                "雷属性攻击强化": 1
            }],
            ["昂扬·破龙珠【3】", 1, 3, 0, 0, {
                "强化持续": 3,
                "龙属性攻击强化": 1
            }],
            ["昂扬·匠珠【3】", 1, 3, 0, 0, {
                "强化持续": 3,
                "匠": 1
            }],
            ["拔打珠【1】", 1, 1, 0, 0, {
                "拔刀术【力】": 1
            }],
            ["拔打珠Ⅱ【2】", 1, 2, 0, 0, {
                "拔刀术【力】": 2
            }],
            ["拔打珠Ⅲ【3】", 1, 3, 0, 0, {
                "拔刀术【力】": 3
            }],
            ["拔打·匠珠【3】", 1, 3, 0, 0, {
                "拔刀术【力】": 3,
                "匠": 1
            }],
            ["拔打·击晕珠【3】", 1, 3, 0, 0, {
                "拔刀术【力】": 3,
                "击晕术": 1
            }],
            ["拔打·铁壁珠【3】", 1, 3, 0, 0, {
                "拔刀术【力】": 3,
                "格挡性能": 1
            }],
            ["击晕珠【1】", 1, 1, 0, 0, {
                "击晕术": 1
            }],
            ["击晕珠Ⅱ【2】", 1, 2, 0, 0, {
                "击晕术": 2
            }],
            ["击晕珠Ⅲ【3】", 1, 3, 0, 0, {
                "击晕术": 3
            }],
            ["夺气珠【1】",
                1, 1, 0, 0, {
                    "夺取耐力": 1
                }
            ],
            ["夺气珠Ⅱ【2】", 1, 2, 0, 0, {
                "夺取耐力": 2
            }],
            ["夺气珠Ⅲ【3】", 1, 3, 0, 0, {
                "夺取耐力": 3
            }],
            ["炮术珠【1】", 1, 1, 0, 0, {
                "炮术": 1
            }],
            ["炮术珠Ⅱ【2】", 1, 2, 0, 0, {
                "炮术": 2
            }],
            ["炮术珠Ⅲ【3】", 1, 3, 0, 0, {
                "炮术": 3
            }],
            ["速变珠【1】", 1, 1, 0, 0, {
                "高速变形": 1
            }],
            ["速变珠Ⅱ【2】",
                1, 2, 0, 0, {
                    "高速变形": 2
                }
            ],
            ["速变珠Ⅲ【3】", 1, 3, 0, 0, {
                "高速变形": 3
            }],
            ["速变·火炎珠【3】", 1, 3, 0, 0, {
                "高速变形": 3,
                "火属性攻击强化": 1
            }],
            ["速变·流水珠【3】", 1, 3, 0, 0, {
                "高速变形": 3,
                "水属性攻击强化": 1
            }],
            ["速变·冰结珠【3】", 1, 3, 0, 0, {
                "高速变形": 3,
                "冰属性攻击强化": 1
            }],
            ["速变·雷光珠【3】", 1, 3, 0, 0, {
                "高速变形": 3,
                "雷属性攻击强化": 1
            }],
            ["速变·破龙珠【3】", 1, 3, 0, 0, {
                "高速变形": 3,
                "龙属性攻击强化": 1
            }],
            ["速变·匠珠【3】", 1, 3, 0, 0, {
                "高速变形": 3,
                "匠": 1
            }],
            ["速变·击晕珠【3】", 1, 3, 0, 0, {
                "高速变形": 3,
                "击晕术": 1
            }],
            ["速变·铁壁珠【3】",
                1, 3, 0, 0, {
                    "高速变形": 3,
                    "格挡性能": 1
                }
            ],
            ["鼓笛珠【2】", 1, 2, 0, 0, {
                "吹笛名人": 1
            }],
            ["鼓笛·攻击珠【3】", 1, 3, 0, 0, {
                "吹笛名人": 2,
                "攻击": 1
            }],
            ["鼓笛·达人珠【3】", 1, 3, 0, 0, {
                "吹笛名人": 2,
                "看破": 1
            }],
            ["鼓笛·拔刀珠【3】", 1, 3, 0, 0, {
                "吹笛名人": 2,
                "拔刀术【技】": 1
            }],
            ["鼓笛·匠珠【3】",
                1, 3, 0, 0, {
                    "吹笛名人": 2,
                    "匠": 1
                }
            ],
            ["鼓笛·击晕珠【3】", 1, 3, 0, 0, {
                "吹笛名人": 2,
                "击晕术": 1
            }],
            ["蓄击珠【2】", 1, 2, 0, 0, {
                "蓄击强化": 1
            }],
            ["蓄击·攻击珠【3】", 1, 3, 0, 0, {
                "蓄击强化": 1,
                "攻击": 1
            }],
            ["蓄击·达人珠【3】", 1, 3, 0, 0, {
                "蓄击强化": 1,
                "看破": 1
            }],
            ["蓄击·拔刀珠【3】",
                1, 3, 0, 0, {
                    "蓄击强化": 1,
                    "拔刀术【技】": 1
                }
            ],
            ["蓄击·匠珠【3】", 1, 3, 0, 0, {
                "蓄击强化": 1,
                "匠": 1
            }],
            ["蓄击·击晕珠【3】", 1, 3, 0, 0, {
                "蓄击强化": 1,
                "击晕术": 1
            }],
            ["飞燕珠【2】", 1, 2, 0, 0, {
                "飞燕": 1
            }],
            ["飞燕·攻击珠【3】", 1, 3, 0, 0, {
                "飞燕": 1,
                "攻击": 1
            }],
            ["飞燕·达人珠【3】",
                1, 3, 0, 0, {
                    "飞燕": 1,
                    "看破": 1
                }
            ],
            ["飞燕·拔刀珠【3】", 1, 3, 0, 0, {
                "飞燕": 1,
                "拔刀术【技】": 1
            }],
            ["飞燕·匠珠【3】", 1, 3, 0, 0, {
                "飞燕": 1,
                "匠": 1
            }],
            ["强毒珠【2】", 1, 2, 0, 0, {
                "毒伤害强化": 1
            }],
            ["强毒·攻击珠【3】", 1, 3, 0, 0, {
                "毒伤害强化": 1,
                "攻击": 1
            }],
            ["强毒·达人珠【3】",
                1, 3, 0, 0, {
                    "毒伤害强化": 1,
                    "看破": 1
                }
            ],
            ["强毒·拔刀珠【3】", 1, 3, 0, 0, {
                "毒伤害强化": 1,
                "拔刀术【技】": 1
            }],
            ["强毒·匠珠【3】", 1, 3, 0, 0, {
                "毒伤害强化": 1,
                "匠": 1
            }],
            ["强毒·射法珠【3】", 1, 3, 0, 0, {
                "毒伤害强化": 1,
                "弹道强化": 1
            }],
            ["强毒·击晕珠【3】", 1, 3, 0, 0, {
                "毒伤害强化": 1,
                "击晕术": 1
            }],
            ["强毒·铁壁珠【3】", 1, 3, 0, 0, {
                "毒伤害强化": 1,
                "格挡性能": 1
            }],
            ["铁壁珠【1】", 1, 1, 0, 0, {
                "格挡性能": 1
            }],
            ["铁壁珠Ⅱ【2】", 1, 2, 0, 0, {
                "格挡性能": 2
            }],
            ["铁壁珠Ⅲ【3】", 1, 3, 0, 0, {
                "格挡性能": 3
            }],
            ["强壁珠【1】", 1, 1, 0, 0, {
                "格挡强化": 1
            }],
            ["强壁珠Ⅱ【2】",
                1, 2, 0, 0, {
                    "格挡强化": 2
                }
            ],
            ["强壁珠Ⅲ【3】", 1, 3, 0, 0, {
                "格挡强化": 3
            }],
            ["强壁·火炎珠【3】", 1, 3, 0, 0, {
                "格挡强化": 3,
                "火属性攻击强化": 1
            }],
            ["强壁·流水珠【3】", 1, 3, 0, 0, {
                "格挡强化": 3,
                "水属性攻击强化": 1
            }],
            ["强壁·冰结珠【3】", 1, 3, 0, 0, {
                "格挡强化": 3,
                "冰属性攻击强化": 1
            }],
            ["强壁·雷光珠【3】", 1, 3, 0, 0, {
                "格挡强化": 3,
                "雷属性攻击强化": 1
            }],
            ["强壁·破龙珠【3】", 1, 3, 0, 0, {
                "格挡强化": 3,
                "龙属性攻击强化": 1
            }],
            ["强壁·匠珠【3】", 1, 3, 0, 0, {
                "格挡强化": 3,
                "匠": 1
            }],
            ["强壁·铁壁珠【3】", 1, 3, 0, 0, {
                "格挡强化": 3,
                "格挡性能": 1
            }],
            ["增弹珠【1】",
                1, 1, 0, 0, {
                    "炮弹装填": 1
                }
            ],
            ["增弹珠Ⅱ【2】", 1, 2, 0, 0, {
                "炮弹装填": 2
            }],
            ["增弹·攻击珠【3】", 1, 3, 0, 0, {
                "炮弹装填": 2,
                "攻击": 1
            }],
            ["增弹·达人珠【3】", 1, 3, 0, 0, {
                "炮弹装填": 2,
                "看破": 1
            }],
            ["增弹·拔刀珠【3】", 1, 3, 0, 0, {
                "炮弹装填": 2,
                "拔刀术【技】": 1
            }],
            ["增弹·匠珠【3】",
                1, 3, 0, 0, {
                    "炮弹装填": 2,
                    "匠": 1
                }
            ],
            ["增弹·铁壁珠【3】", 1, 3, 0, 0, {
                "炮弹装填": 2,
                "格挡性能": 1
            }],
            ["打磨珠【1】", 1, 1, 0, 0, {
                "砥石使用高速化": 1
            }],
            ["打磨珠Ⅱ【2】", 1, 2, 0, 0, {
                "砥石使用高速化": 2
            }],
            ["打磨·攻击珠【3】", 1, 3, 0, 0, {
                "砥石使用高速化": 2,
                "攻击": 1
            }],
            ["打磨·达人珠【3】",
                1, 3, 0, 0, {
                    "砥石使用高速化": 2,
                    "看破": 1
                }
            ],
            ["打磨·拔刀珠【3】", 1, 3, 0, 0, {
                "砥石使用高速化": 2,
                "拔刀术【技】": 1
            }],
            ["打磨·匠珠【3】", 1, 3, 0, 0, {
                "砥石使用高速化": 2,
                "匠": 1
            }],
            ["打磨·击晕珠【3】", 1, 3, 0, 0, {
                "砥石使用高速化": 2,
                "击晕术": 1
            }],
            ["打磨·铁壁珠【3】",
                1, 3, 0, 0, {
                    "砥石使用高速化": 2,
                    "格挡性能": 1
                }
            ]
        ]),
        lb: {
            "怨恨": 1,
            "巧击": 1,
            "无伤": 1,
            "逆袭": 1,
            "弱点特效": 1,
            "精神抖擞": 1,
            "防御": 1,
            "精灵加护": 1,
            "火耐性": 1,
            "水耐性": 1,
            "雷耐性": 1,
            "冰耐性": 1,
            "龙耐性": 1,
            "毒耐性": 1,
            "麻痹耐性": 1,
            "睡眠耐性": 1,
            "防御力下降耐性": 1,
            "昏厥耐性": 1,
            "裂伤耐性": 1,
            "束缚耐性": 1,
            "爆破异常耐性": 1,
            "恶臭耐性": 1,
            "适应环境": 1,
            "体力回复量提升": 1,
            "回复速度": 1,
            "环境利用知识": 1,
            "体术": 1,
            "耐力急速回复": 1,
            "跑者": 1,
            "饥饿耐性": 1,
            "挑战者": 1,
            "力量解放": 1,
            "火场怪力": 1,
            "连击": 1,
            "攻势": 1,
            "锁刃刺击": 1,
            "破坏王": 1,
            "因祸得福": 1,
            "急袭": 1,
            "无我之境": 1,
            "钻研": 1,
            "回避性能": 1,
            "回避距离提升": 1,
            "耳塞": 1,
            "纳刀术": 1,
            "风压耐性": 1,
            "耐震": 1,
            "减轻胆怯": 1,
            "威吓": 1,
            "快吃": 1,
            "适应水域·油泥": 1,
            "缓冲": 1,
            "飞身跃入": 1,
            "跳跃铁人": 1,
            "攀岩者": 1,
            "广域化": 1,
            "整备": 1,
            "炸弹客": 1,
            "最爱蘑菇": 1,
            "道具使用强化": 1,
            "满足感": 1,
            "闪光强化": 1,
            "植生学": 1,
            "地质学": 1,
            "昆虫标本达人": 1,
            "猎人生活": 1,
            "Lv1插槽 技能": 1,
            "Lv2插槽 技能": 1,
            "Lv3插槽 技能": 1
        }
    };
    var Vd = {};
    Vd.kb = function(a) {
        return a.map(([b, c]) => new od(b, c.map(([d, e, g, h]) => new pd(d, e, g, h))))
    }([
        ["任务", [
            ["环境利用知识Lv1", "环境利用知识", 1, 3],
            ["环境利用知识Lv2", "环境利用知识", 2, 3],
            ["环境利用知识Lv3", "环境利用知识", 3, 3],
            ["体术Lv1", "体术", 1, 3],
            ["体术Lv2", "体术", 2, 3],
            ["体术Lv3", "体术", 3, 3],
            ["体术Lv4", "体术",
                4, 3
            ],
            ["体术Lv5", "体术", 5, 3],
            ["耐力急速回复Lv1", "耐力急速回复", 1, 3],
            ["耐力急速回复Lv2", "耐力急速回复", 2, 3],
            ["耐力急速回复Lv3", "耐力急速回复", 3, 3],
            ["跑者Lv1", "跑者", 1, 3],
            ["跑者Lv2", "跑者", 2, 3],
            ["跑者Lv3", "跑者", 3, 3],
            ["饥饿耐性Lv1", "饥饿耐性", 1, 3],
            ["饥饿耐性Lv2",
                "饥饿耐性", 2, 3
            ],
            ["饥饿耐性Lv3", "饥饿耐性", 3, 3],
            ["威吓Lv1", "威吓", 1, 3],
            ["威吓Lv2", "威吓", 2, 3],
            ["威吓Lv3", "威吓", 3, 3],
            ["飞身跃入Lv1", "飞身跃入", 1, 3],
            ["跳跃铁人Lv1", "跳跃铁人", 1, 3],
            ["攀岩者Lv1", "攀岩者", 1, 3],
            ["植生学Lv1", "植生学", 1, 3],
            ["植生学Lv2", "植生学", 2, 3],
            ["植生学Lv3",
                "植生学", 3, 3
            ],
            ["植生学Lv4", "植生学", 4, 3],
            ["地质学Lv1", "地质学", 1, 3],
            ["地质学Lv2", "地质学", 2, 3],
            ["地质学Lv3", "地质学", 3, 3],
            ["昆虫标本达人Lv1", "昆虫标本达人", 1, 3],
            ["猎人生活Lv1", "猎人生活", 1, 3]
        ]],
        ["道具", [
            ["体力回复量提升Lv1", "体力回复量提升", 1, 3],
            ["体力回复量提升Lv2",
                "体力回复量提升", 2, 3
            ],
            ["体力回复量提升Lv3", "体力回复量提升", 3, 3],
            ["快吃Lv1", "快吃", 1, 3],
            ["快吃Lv2", "快吃", 2, 3],
            ["快吃Lv3", "快吃", 3, 3],
            ["广域化Lv1", "广域化", 1, 3],
            ["广域化Lv2", "广域化", 2, 3],
            ["广域化Lv3", "广域化", 3, 3],
            ["广域化Lv4", "广域化", 4, 3],
            ["广域化Lv5", "广域化",
                5, 3
            ],
            ["整备Lv1", "整备", 1, 3],
            ["整备Lv2", "整备", 2, 3],
            ["整备Lv3", "整备", 3, 3],
            ["整备Lv4", "整备", 4, 3],
            ["整备Lv5", "整备", 5, 3],
            ["炸弹客Lv1", "炸弹客", 1, 3],
            ["炸弹客Lv2", "炸弹客", 2, 3],
            ["炸弹客Lv3", "炸弹客", 3, 3],
            ["最爱蘑菇Lv1", "最爱蘑菇", 1, 3],
            ["最爱蘑菇Lv2", "最爱蘑菇", 2, 3],
            ["最爱蘑菇Lv3",
                "最爱蘑菇", 3, 3
            ],
            ["道具使用强化Lv1", "道具使用强化", 1, 3],
            ["道具使用强化Lv2", "道具使用强化", 2, 3],
            ["道具使用强化Lv3", "道具使用强化", 3, 3],
            ["满足感Lv1", "满足感", 1, 3],
            ["满足感Lv2", "满足感", 2, 3],
            ["满足感Lv3", "满足感", 3, 3],
            ["闪光强化Lv1", "闪光强化",
                1, 3
            ]
        ]],
        ["战斗（生存）", [
            ["精灵加护Lv1", "精灵加护", 1, 3],
            ["精灵加护Lv2", "精灵加护", 2, 3],
            ["精灵加护Lv3", "精灵加护", 3, 3],
            ["回复速度Lv1", "回复速度", 1, 3],
            ["回复速度Lv2", "回复速度", 2, 3],
            ["回复速度Lv3", "回复速度", 3, 3],
            ["回避性能Lv1", "回避性能", 1, 3],
            ["回避性能Lv2",
                "回避性能", 2, 3
            ],
            ["回避性能Lv3", "回避性能", 3, 3],
            ["回避性能Lv4", "回避性能", 4, 3],
            ["回避性能Lv5", "回避性能", 5, 3],
            ["回避距离提升Lv1", "回避距离提升", 1, 3],
            ["回避距离提升Lv2", "回避距离提升", 2, 3],
            ["回避距离提升Lv3", "回避距离提升", 3, 3],
            ["纳刀术Lv1",
                "纳刀术", 1, 3
            ],
            ["纳刀术Lv2", "纳刀术", 2, 3],
            ["纳刀术Lv3", "纳刀术", 3, 3],
            ["减轻胆怯Lv1", "减轻胆怯", 1, 3],
            ["减轻胆怯Lv2", "减轻胆怯", 2, 3],
            ["减轻胆怯Lv3", "减轻胆怯", 3, 3],
            ["缓冲Lv1", "缓冲", 1, 3]
        ]],
        ["特殊攻击耐性", [
            ["毒耐性Lv1", "毒耐性", 1, 3],
            ["毒耐性Lv2", "毒耐性", 2, 3],
            ["毒耐性Lv3", "毒耐性", 3, 3],
            ["麻痹耐性Lv1", "麻痹耐性", 1, 3],
            ["麻痹耐性Lv2", "麻痹耐性", 2, 3],
            ["麻痹耐性Lv3", "麻痹耐性", 3, 3],
            ["睡眠耐性Lv1", "睡眠耐性", 1, 3],
            ["睡眠耐性Lv2", "睡眠耐性", 2, 3],
            ["睡眠耐性Lv3", "睡眠耐性", 3, 3],
            ["防御力下降耐性Lv1", "防御力下降耐性",
                1, 3
            ],
            ["防御力下降耐性Lv2", "防御力下降耐性", 2, 3],
            ["防御力下降耐性Lv3", "防御力下降耐性", 3, 3],
            ["属性异常耐性Lv1", "属性异常耐性", 1, 3],
            ["属性异常耐性Lv2", "属性异常耐性", 2, 3],
            ["属性异常耐性Lv3", "属性异常耐性", 3, 3],
            ["昏厥耐性Lv1", "昏厥耐性",
                1, 3
            ],
            ["昏厥耐性Lv2", "昏厥耐性", 2, 3],
            ["昏厥耐性Lv3", "昏厥耐性", 3, 3],
            ["裂伤耐性Lv1", "裂伤耐性", 1, 3],
            ["裂伤耐性Lv2", "裂伤耐性", 2, 3],
            ["裂伤耐性Lv3", "裂伤耐性", 3, 3],
            ["束缚耐性Lv1", "束缚耐性", 1, 3],
            ["束缚耐性Lv2", "束缚耐性", 2, 3],
            ["束缚耐性Lv3", "束缚耐性",
                3, 3
            ],
            ["爆破异常耐性Lv1", "爆破异常耐性", 1, 3],
            ["爆破异常耐性Lv2", "爆破异常耐性", 2, 3],
            ["爆破异常耐性Lv3", "爆破异常耐性", 3, 3],
            ["恶臭耐性Lv1", "恶臭耐性", 1, 3],
            ["恶臭耐性Lv2", "恶臭耐性", 2, 3],
            ["适应环境Lv1", "适应环境", 1, 3],
            ["适应环境Lv2", "适应环境",
                2, 3
            ],
            ["无我之境Lv1", "无我之境", 1, 3],
            ["无我之境Lv2", "无我之境", 2, 3],
            ["无我之境Lv3", "无我之境", 3, 3],
            ["耳塞Lv1", "耳塞", 1, 3],
            ["耳塞Lv2", "耳塞", 2, 3],
            ["耳塞Lv3", "耳塞", 3, 3],
            ["风压耐性Lv1", "风压耐性", 1, 3],
            ["风压耐性Lv2", "风压耐性", 2, 3],
            ["风压耐性Lv3", "风压耐性", 3, 3],
            ["耐震Lv1",
                "耐震", 1, 3
            ],
            ["耐震Lv2", "耐震", 2, 3],
            ["耐震Lv3", "耐震", 3, 3],
            ["适应水域·油泥Lv1", "适应水域·油泥", 1, 3],
            ["适应水域·油泥Lv2", "适应水域·油泥", 2, 3]
        ]],
        ["属性变化", [
            ["防御Lv1", "防御", 1, 3],
            ["防御Lv2", "防御", 2, 3],
            ["防御Lv3", "防御", 3, 3],
            ["防御Lv4", "防御", 4, 3],
            ["防御Lv5",
                "防御", 5, 3
            ],
            ["防御Lv6", "防御", 6, 3],
            ["防御Lv7", "防御", 7, 3],
            ["火耐性Lv1", "火耐性", 1, 3],
            ["火耐性Lv2", "火耐性", 2, 3],
            ["火耐性Lv3", "火耐性", 3, 3],
            ["水耐性Lv1", "水耐性", 1, 3],
            ["水耐性Lv2", "水耐性", 2, 3],
            ["水耐性Lv3", "水耐性", 3, 3],
            ["雷耐性Lv1", "雷耐性", 1, 3],
            ["雷耐性Lv2", "雷耐性",
                2, 3
            ],
            ["雷耐性Lv3", "雷耐性", 3, 3],
            ["冰耐性Lv1", "冰耐性", 1, 3],
            ["冰耐性Lv2", "冰耐性", 2, 3],
            ["冰耐性Lv3", "冰耐性", 3, 3],
            ["龙耐性Lv1", "龙耐性", 1, 3],
            ["龙耐性Lv2", "龙耐性", 2, 3],
            ["龙耐性Lv3", "龙耐性", 3, 3],
            ["指示随从Lv1", "指示随从", 1, 3],
            ["指示随从Lv2", "指示随从", 2, 3],
            ["指示随从Lv3",
                "指示随从", 3, 3
            ],
            ["指示随从Lv4", "指示随从", 4, 3],
            ["指示随从Lv5", "指示随从", 5, 3],
            ["钻研Lv1", "钻研", 1, 3]
        ]],
        ["战斗（属性/异常状态）", [
            ["属性变换Lv1", "属性变换", 1, 3],
            ["属性变换Lv2", "属性变换", 2, 3],
            ["属性变换Lv3", "属性变换", 3, 3],
            ["锁刃刺击Lv1", "锁刃刺击",
                1, 3
            ],
            ["锁刃刺击Lv2", "锁刃刺击", 2, 3],
            ["锁刃刺击Lv3", "锁刃刺击", 3, 3],
            ["锁刃刺击Lv4", "锁刃刺击", 4, 3],
            ["锁刃刺击Lv5", "锁刃刺击", 5, 3],
            ["破坏王Lv1", "破坏王", 1, 3],
            ["破坏王Lv2", "破坏王", 2, 3],
            ["破坏王Lv3", "破坏王", 3, 3],
            ["因祸得福Lv1", "因祸得福", 1, 3],
            ["因祸得福Lv2",
                "因祸得福", 2, 3
            ],
            ["因祸得福Lv3", "因祸得福", 3, 3],
            ["属性吸收Lv1", "属性吸收", 1, 3],
            ["属性吸收Lv2", "属性吸收", 2, 3],
            ["属性吸收Lv3", "属性吸收", 3, 3]
        ]],
        ["战斗（攻击）", [
            ["怨恨Lv1", "怨恨", 1, 3],
            ["怨恨Lv2", "怨恨", 2, 3],
            ["怨恨Lv3", "怨恨", 3, 3],
            ["怨恨Lv4", "怨恨", 4, 3],
            ["怨恨Lv5",
                "怨恨", 5, 3
            ],
            ["巧击Lv1", "巧击", 1, 3],
            ["巧击Lv2", "巧击", 2, 3],
            ["巧击Lv3", "巧击", 3, 3],
            ["巧击Lv4", "巧击", 4, 3],
            ["巧击Lv5", "巧击", 5, 3],
            ["无伤Lv1", "无伤", 1, 3],
            ["无伤Lv2", "无伤", 2, 3],
            ["无伤Lv3", "无伤", 3, 3],
            ["无伤Lv4", "无伤", 4, 3],
            ["无伤Lv5", "无伤", 5, 3],
            ["逆袭Lv1", "逆袭", 1, 3],
            ["逆袭Lv2", "逆袭", 2, 3],
            ["逆袭Lv3",
                "逆袭", 3, 3
            ],
            ["弱点特效Lv1", "弱点特效", 1, 3],
            ["弱点特效Lv2", "弱点特效", 2, 3],
            ["弱点特效Lv3", "弱点特效", 3, 3],
            ["弱点特效Lv4", "弱点特效", 4, 3],
            ["弱点特效Lv5", "弱点特效", 5, 3],
            ["精神抖擞Lv1", "精神抖擞", 1, 3],
            ["精神抖擞Lv2", "精神抖擞", 2, 3],
            ["精神抖擞Lv3", "精神抖擞",
                3, 3
            ],
            ["挑战者Lv1", "挑战者", 1, 3],
            ["挑战者Lv2", "挑战者", 2, 3],
            ["挑战者Lv3", "挑战者", 3, 3],
            ["挑战者Lv4", "挑战者", 4, 3],
            ["挑战者Lv5", "挑战者", 5, 3],
            ["力量解放Lv1", "力量解放", 1, 3],
            ["力量解放Lv2", "力量解放", 2, 3],
            ["力量解放Lv3", "力量解放", 3, 3],
            ["力量解放Lv4", "力量解放",
                4, 3
            ],
            ["力量解放Lv5", "力量解放", 5, 3],
            ["火场怪力Lv1", "火场怪力", 1, 3],
            ["火场怪力Lv2", "火场怪力", 2, 3],
            ["火场怪力Lv3", "火场怪力", 3, 3],
            ["火场怪力Lv4", "火场怪力", 4, 3],
            ["火场怪力Lv5", "火场怪力", 5, 3],
            ["连击Lv1", "连击", 1, 3],
            ["连击Lv2", "连击", 2, 3],
            ["连击Lv3", "连击", 3, 3],
            ["连击Lv4",
                "连击", 4, 3
            ],
            ["连击Lv5", "连击", 5, 3],
            ["攻势Lv1", "攻势", 1, 3],
            ["攻势Lv2", "攻势", 2, 3],
            ["攻势Lv3", "攻势", 3, 3],
            ["攻势Lv4", "攻势", 4, 3],
            ["攻势Lv5", "攻势", 5, 3],
            ["急袭Lv1", "急袭", 1, 3],
            ["急袭Lv2", "急袭", 2, 3],
            ["急袭Lv3", "急袭", 3, 3]
        ]],
        ["套装技能", [
            ["大力士Ⅰ", "辟兽之力", 2, 3],
            ["大力士Ⅱ", "辟兽之力",
                4, 3
            ],
            ["灼热化Ⅰ", "火龙之力", 2, 3],
            ["灼热化Ⅱ", "火龙之力", 4, 3],
            ["蛮勇的餐桌Ⅰ", "暗器蛸之力", 2, 3],
            ["蛮勇的餐桌Ⅱ", "暗器蛸之力", 4, 3],
            ["无伤重装Ⅰ", "铠龙之守护", 2, 3],
            ["无伤重装Ⅱ", "铠龙之守护", 4, 3],
            ["战嚎Ⅰ", "雪狮子王之斗志", 2, 3],
            ["战嚎Ⅱ",
                "雪狮子王之斗志", 4, 3
            ],
            ["连击强化Ⅰ", "凶爪龙之力", 2, 3],
            ["连击强化Ⅱ", "凶爪龙之力", 4, 3],
            ["无穷尽Ⅰ", "雷颚龙之斗志", 2, 3],
            ["无穷尽Ⅱ", "雷颚龙之斗志", 4, 3],
            ["守护之液纱Ⅰ", "波衣龙之守护", 2, 3],
            ["守护之液纱Ⅱ", "波衣龙之守护",
                4, 3
            ],
            ["万雷轰鸣Ⅰ", "煌雷龙之力", 2, 3],
            ["万雷轰鸣Ⅱ", "煌雷龙之力", 4, 3],
            ["恨击Ⅰ", "狱焰蛸之反叛", 2, 3],
            ["恨击Ⅱ", "狱焰蛸之反叛", 4, 3],
            ["束缚反攻Ⅰ", "冻峰龙之反叛", 2, 3],
            ["束缚反攻Ⅱ", "冻峰龙之反叛", 4, 3],
            ["黑蚀一体Ⅰ", "黑蚀龙之力",
                2, 3
            ],
            ["黑蚀一体Ⅱ", "黑蚀龙之力", 4, 3],
            ["加速再生Ⅰ", "锁刃龙之饥饿", 2, 3],
            ["加速再生Ⅱ", "锁刃龙之饥饿", 4, 3],
            ["破坏冲动Ⅰ", "护锁刃龙之命脉", 2, 3],
            ["破坏冲动Ⅱ", "护锁刃龙之命脉", 4, 3],
            ["泡沫之舞Ⅰ", "泡狐龙之力", 2, 3],
            ["泡沫之舞Ⅱ",
                "泡狐龙之力", 4, 3
            ],
            ["超回复力Ⅰ", "白炽龙之脉动", 2, 3],
            ["超回复力Ⅱ", "白炽龙之脉动", 4, 3],
            ["大地之恩惠【花舞】Ⅰ", "花舞祈祷", 2, 3],
            ["大地之恩惠【花舞】Ⅱ", "花舞祈祷", 4, 3],
            ["苍雷一闪Ⅰ", "海龙的涡雷", 2, 3],
            ["苍雷一闪Ⅱ", "海龙的涡雷",
                4, 3
            ],
            ["千刃闪身Ⅰ", "千刃龙的斗志", 2, 3],
            ["千刃闪身Ⅱ", "千刃龙的斗志", 4, 3],
            ["大地之恩惠【踊火】Ⅰ", "踊火祈祷", 2, 3],
            ["大地之恩惠【踊火】Ⅱ", "踊火祈祷", 4, 3],
            ["共鸣Ⅰ", "欧米茄共鸣", 2, 3],
            ["共鸣Ⅱ", "欧米茄共鸣", 4, 3],
            ["暗技", "暗黑骑士之证",
                2, 3
            ],
            ["至黑之夜", "暗黑骑士之证", 4, 3],
            ["大地之恩惠【梦灯】Ⅰ", "梦灯祈祷", 2, 3],
            ["大地之恩惠【梦灯】Ⅱ", "梦灯祈祷", 4, 3],
            ["宣战呼应Ⅰ", "巨戟龙的默示录", 2, 3],
            ["宣战呼应Ⅱ", "巨戟龙的默示录", 4, 3],
            ["大地之恩惠【祝谣】Ⅰ",
                "祝谣祈祷", 2, 3
            ],
            ["大地之恩惠【祝谣】Ⅱ", "祝谣祈祷", 4, 3]
        ]],
        ["Group Skill", [
            ["蜂蜜猎人", "甲虫之直觉", 3, 3],
            ["隐藏移动", "甲虫之拟态", 3, 3],
            ["骑乘名人", "铺鳞之技法", 3, 3],
            ["振奋", "叠鳞之工艺", 3, 3],
            ["采集达人", "皮革制品之柔韧", 3, 3],
            ["滑行强化",
                "皮革制品之顺滑", 3, 3
            ],
            ["不屈", "毛皮之昂扬", 3, 3],
            ["佯动", "毛皮之诱惑", 3, 3],
            ["激励", "霸主之骄傲", 3, 3],
            ["死里逃生", "霸主之愤慨", 3, 3],
            ["龙乳活性", "护龙之脉动", 3, 3],
            ["龙都的庇护", "护龙之守护", 3, 3],
            ["探索者之幸运", "前辈之指引", 3, 3],
            ["幸运",
                "荣光盛赞", 3, 3
            ],
            ["剥取名人", "祭典巡礼", 3, 3],
            ["毅力【果断】", "霸主之魂", 3, 3]
        ]],
        ["Weapon Skill", [
            ["攻击Lv1", "攻击", 1, 3],
            ["攻击Lv2", "攻击", 2, 3],
            ["攻击Lv3", "攻击", 3, 3],
            ["攻击Lv4", "攻击", 4, 3],
            ["攻击Lv5", "攻击", 5, 3],
            ["攻击守势Lv1", "攻击守势", 1, 3],
            ["攻击守势Lv2", "攻击守势", 2,
                3
            ],
            ["攻击守势Lv3", "攻击守势", 3, 3],
            ["看破Lv1", "看破", 1, 3],
            ["看破Lv2", "看破", 2, 3],
            ["看破Lv3", "看破", 3, 3],
            ["看破Lv4", "看破", 4, 3],
            ["看破Lv5", "看破", 5, 3],
            ["超会心Lv1", "超会心", 1, 3],
            ["超会心Lv2", "超会心", 2, 3],
            ["超会心Lv3", "超会心", 3, 3],
            ["超会心Lv4", "超会心", 4, 3],
            ["超会心Lv5", "超会心",
                5, 3
            ],
            ["拔刀术【技】Lv1", "拔刀术【技】", 1, 3],
            ["拔刀术【技】Lv2", "拔刀术【技】", 2, 3],
            ["拔刀术【技】Lv3", "拔刀术【技】", 3, 3],
            ["火属性攻击强化Lv1", "火属性攻击强化", 1, 3],
            ["火属性攻击强化Lv2", "火属性攻击强化", 2, 3],
            ["火属性攻击强化Lv3",
                "火属性攻击强化", 3, 3
            ],
            ["水属性攻击强化Lv1", "水属性攻击强化", 1, 3],
            ["水属性攻击强化Lv2", "水属性攻击强化", 2, 3],
            ["水属性攻击强化Lv3", "水属性攻击强化", 3, 3],
            ["冰属性攻击强化Lv1", "冰属性攻击强化", 1, 3],
            ["冰属性攻击强化Lv2", "冰属性攻击强化",
                2, 3
            ],
            ["冰属性攻击强化Lv3", "冰属性攻击强化", 3, 3],
            ["雷属性攻击强化Lv1", "雷属性攻击强化", 1, 3],
            ["雷属性攻击强化Lv2", "雷属性攻击强化", 2, 3],
            ["雷属性攻击强化Lv3", "雷属性攻击强化", 3, 3],
            ["龙属性攻击强化Lv1", "龙属性攻击强化", 1, 3],
            ["龙属性攻击强化Lv2",
                "龙属性攻击强化", 2, 3
            ],
            ["龙属性攻击强化Lv3", "龙属性攻击强化", 3, 3],
            ["毒属性强化Lv1", "毒属性强化", 1, 3],
            ["毒属性强化Lv2", "毒属性强化", 2, 3],
            ["毒属性强化Lv3", "毒属性强化", 3, 3],
            ["麻痹属性强化Lv1", "麻痹属性强化", 1, 3],
            ["麻痹属性强化Lv2",
                "麻痹属性强化", 2, 3
            ],
            ["麻痹属性强化Lv3", "麻痹属性强化", 3, 3],
            ["睡眠属性强化Lv1", "睡眠属性强化", 1, 3],
            ["睡眠属性强化Lv2", "睡眠属性强化", 2, 3],
            ["睡眠属性强化Lv3", "睡眠属性强化", 3, 3],
            ["爆破属性强化Lv1", "爆破属性强化", 1, 3],
            ["爆破属性强化Lv2",
                "爆破属性强化", 2, 3
            ],
            ["爆破属性强化Lv3", "爆破属性强化", 3, 3],
            ["会心击【属性】Lv1", "会心击【属性】", 1, 3],
            ["会心击【属性】Lv2", "会心击【属性】", 2, 3],
            ["会心击【属性】Lv3", "会心击【属性】", 3, 3],
            ["会心击【特殊】Lv1", "会心击【特殊】",
                1, 3
            ],
            ["会心击【特殊】Lv2", "会心击【特殊】", 2, 3],
            ["会心击【特殊】Lv3", "会心击【特殊】", 3, 3],
            ["蓄力大师Lv1", "蓄力大师", 1, 3],
            ["蓄力大师Lv2", "蓄力大师", 2, 3],
            ["蓄力大师Lv3", "蓄力大师", 3, 3],
            ["匠Lv1", "匠", 1, 3],
            ["匠Lv2", "匠", 2, 3],
            ["匠Lv3", "匠", 3, 3],
            ["匠Lv4", "匠", 4, 3],
            ["匠Lv5",
                "匠", 5, 3
            ],
            ["利刃Lv1", "利刃", 1, 3],
            ["利刃Lv2", "利刃", 2, 3],
            ["利刃Lv3", "利刃", 3, 3],
            ["刚刃打磨Lv1", "刚刃打磨", 1, 3],
            ["刚刃打磨Lv2", "刚刃打磨", 2, 3],
            ["刚刃打磨Lv3", "刚刃打磨", 3, 3],
            ["心眼Lv1", "心眼", 1, 3],
            ["心眼Lv2", "心眼", 2, 3],
            ["心眼Lv3", "心眼", 3, 3],
            ["钝器能手Lv1", "钝器能手", 1, 3],
            ["钝器能手Lv2",
                "钝器能手", 2, 3
            ],
            ["钝器能手Lv3", "钝器能手", 3, 3],
            ["达人艺Lv1", "达人艺", 1, 3],
            ["通常弹·通常箭强化Lv1", "通常弹·通常箭强化", 1, 3],
            ["贯穿弹·龙之箭强化Lv1", "贯穿弹·龙之箭强化", 1, 3],
            ["散弹·刚射强化Lv1", "散弹·刚射强化", 1, 3],
            ["弹道强化Lv1",
                "弹道强化", 1, 3
            ],
            ["弹道强化Lv2", "弹道强化", 2, 3],
            ["弹道强化Lv3", "弹道强化", 3, 3],
            ["速射强化Lv1", "速射强化", 1, 3],
            ["首发迅击Lv1", "首发迅击", 1, 3],
            ["首发迅击Lv2", "首发迅击", 2, 3],
            ["首发迅击Lv3", "首发迅击", 3, 3],
            ["强四射击Lv1", "强四射击", 1, 3],
            ["强四射击Lv2",
                "强四射击", 2, 3
            ],
            ["强四射击Lv3", "强四射击", 3, 3],
            ["特殊射击强化Lv1", "特殊射击强化", 1, 3],
            ["特殊射击强化Lv2", "特殊射击强化", 2, 3],
            ["毒瓶追加Lv1", "毒瓶追加", 1, 3],
            ["麻痹瓶追加Lv1", "麻痹瓶追加", 1, 3],
            ["睡眠瓶追加Lv1", "睡眠瓶追加", 1, 3],
            ["爆破瓶追加Lv1",
                "爆破瓶追加", 1, 3
            ],
            ["减气瓶追加Lv1", "减气瓶追加", 1, 3],
            ["集中Lv1", "集中", 1, 3],
            ["集中Lv2", "集中", 2, 3],
            ["集中Lv3", "集中", 3, 3],
            ["强化持续Lv1", "强化持续", 1, 3],
            ["强化持续Lv2", "强化持续", 2, 3],
            ["强化持续Lv3", "强化持续", 3, 3],
            ["拔刀术【力】Lv1", "拔刀术【力】",
                1, 3
            ],
            ["拔刀术【力】Lv2", "拔刀术【力】", 2, 3],
            ["拔刀术【力】Lv3", "拔刀术【力】", 3, 3],
            ["击晕术Lv1", "击晕术", 1, 3],
            ["击晕术Lv2", "击晕术", 2, 3],
            ["击晕术Lv3", "击晕术", 3, 3],
            ["夺取耐力Lv1", "夺取耐力", 1, 3],
            ["夺取耐力Lv2", "夺取耐力", 2, 3],
            ["夺取耐力Lv3", "夺取耐力",
                3, 3
            ],
            ["炮术Lv1", "炮术", 1, 3],
            ["炮术Lv2", "炮术", 2, 3],
            ["炮术Lv3", "炮术", 3, 3],
            ["高速变形Lv1", "高速变形", 1, 3],
            ["高速变形Lv2", "高速变形", 2, 3],
            ["高速变形Lv3", "高速变形", 3, 3],
            ["吹笛名人Lv1", "吹笛名人", 1, 3],
            ["吹笛名人Lv2", "吹笛名人", 2, 3],
            ["蓄击强化Lv1", "蓄击强化", 1, 3],
            ["飞燕Lv1",
                "飞燕", 1, 3
            ],
            ["毒伤害强化Lv1", "毒伤害强化", 1, 3],
            ["格挡性能Lv1", "格挡性能", 1, 3],
            ["格挡性能Lv2", "格挡性能", 2, 3],
            ["格挡性能Lv3", "格挡性能", 3, 3],
            ["格挡强化Lv1", "格挡强化", 1, 3],
            ["格挡强化Lv2", "格挡强化", 2, 3],
            ["格挡强化Lv3", "格挡强化", 3, 3],
            ["炮弹装填Lv1",
                "炮弹装填", 1, 3
            ],
            ["炮弹装填Lv2", "炮弹装填", 2, 3],
            ["砥石使用高速化Lv1", "砥石使用高速化", 1, 3],
            ["砥石使用高速化Lv2", "砥石使用高速化", 2, 3]
        ]],
        ["通用插槽（预留插槽）", [
            ["Lv1插槽 技能Lv1", "Lv1插槽 技能", 1, 3],
            ["Lv1插槽 技能Lv2", "Lv1插槽 技能", 2, 3],
            ["Lv1插槽 技能Lv3", "Lv1插槽 技能", 3, 3],
            ["Lv1插槽 技能Lv4", "Lv1插槽 技能", 4, 3],
            ["Lv1插槽 技能Lv5", "Lv1插槽 技能", 5, 3],
            ["Lv1插槽 技能Lv6", "Lv1插槽 技能", 6, 3],
            ["Lv1插槽 技能Lv7", "Lv1插槽 技能", 7, 3],
            ["Lv2插槽 技能Lv1", "Lv2插槽 技能", 1, 3],
            ["Lv2插槽 技能Lv2", "Lv2插槽 技能", 2, 3],
            ["Lv2插槽 技能Lv3",
                "Lv2插槽 技能", 3, 3
            ],
            ["Lv2插槽 技能Lv4", "Lv2插槽 技能", 4, 3],
            ["Lv2插槽 技能Lv5", "Lv2插槽 技能", 5, 3],
            ["Lv2插槽 技能Lv6", "Lv2插槽 技能", 6, 3],
            ["Lv2插槽 技能Lv7", "Lv2插槽 技能", 7, 3],
            ["Lv3插槽 技能Lv1", "Lv3插槽 技能", 1, 3],
            ["Lv3插槽 技能Lv2", "Lv3插槽 技能", 2, 3],
            ["Lv3插槽 技能Lv3", "Lv3插槽 技能",
                3, 3
            ],
            ["Lv3插槽 技能Lv4", "Lv3插槽 技能", 4, 3],
            ["Lv3插槽 技能Lv5", "Lv3插槽 技能", 5, 3],
            ["Lv3插槽 技能Lv6", "Lv3插槽 技能", 6, 3],
            ["Lv3插槽 技能Lv7", "Lv3插槽 技能", 7, 3]
        ]]
    ]);
    Vd.Ea = new Set("攻击 攻击守势 看破 超会心 拔刀术【技】 火属性攻击强化 水属性攻击强化 冰属性攻击强化 雷属性攻击强化 龙属性攻击强化 毒属性强化 麻痹属性强化 睡眠属性强化 爆破属性强化 会心击【属性】 会心击【特殊】 蓄力大师 匠 利刃 刚刃打磨 心眼 钝器能手 达人艺 通常弹·通常箭强化 贯穿弹·龙之箭强化 散弹·刚射强化 弹道强化 速射强化 首发迅击 强四射击 特殊射击强化 毒瓶追加 麻痹瓶追加 睡眠瓶追加 爆破瓶追加 减气瓶追加 集中 强化持续 拔刀术【力】 击晕术 夺取耐力 炮术 高速变形 吹笛名人 蓄击强化 飞燕 毒伤害强化 格挡性能 格挡强化 炮弹装填 砥石使用高速化".split(" "));
    Vd.jb = "辟兽之力 火龙之力 暗器蛸之力 铠龙之守护 雪狮子王之斗志 凶爪龙之力 雷颚龙之斗志 波衣龙之守护 煌雷龙之力 狱焰蛸之反叛 冻峰龙之反叛 黑蚀龙之力 锁刃龙之饥饿 护锁刃龙之命脉 泡狐龙之力 白炽龙之脉动 花舞祈祷 海龙的涡雷 千刃龙的斗志 踊火祈祷 欧米茄共鸣 暗黑骑士之证 梦灯祈祷 巨戟龙的默示录 祝谣祈祷".split(" ");
    Vd.ib = "甲虫之直觉 甲虫之拟态 铺鳞之技法 叠鳞之工艺 皮革制品之柔韧 皮革制品之顺滑 毛皮之昂扬 毛皮之诱惑 霸主之骄傲 霸主之愤慨 护龙之脉动 护龙之守护 前辈之指引 荣光盛赞 祭典巡礼 霸主之魂".split(" ");
    kd = nd;
    jd = Ud;
    ld = Vd;

    function Wd() {};

    function Xd() {}
    n(Xd, Wd);

    function Yd(a) {
        this.a = a
    }
    n(Yd, Xd);
    Yd.prototype.set = function(a, b) {
        try {
            this.a.setItem(a, b)
        } catch (c) {
            if (0 == this.a.length) throw "Storage mechanism: Storage disabled";
            throw "Storage mechanism: Quota exceeded";
        }
    };
    Yd.prototype.get = function(a) {
        a = this.a.getItem(a);
        if ("string" !== typeof a && null !== a) throw "Storage mechanism: Invalid value was encountered";
        return a
    };
    Yd.prototype.key = function(a) {
        return this.a.key(a)
    };

    function Zd() {
        var a = null;
        try {
            a = window.localStorage || null
        } catch (b) {}
        this.a = a
    }
    n(Zd, Yd);
    var $d = fa.JSON.stringify;

    function ae() {
        this.a = new Zd
    }
    ae.prototype.set = function(a, b) {
        void 0 === b ? this.a.a.removeItem(a) : this.a.set(a, $d(b))
    };
    ae.prototype.get = function(a) {
        try {
            var b = this.a.get(a)
        } catch (c) {
            return
        }
        if (null !== b) try {
            return JSON.parse(b)
        } catch (c) {
            throw "Storage: Invalid value was encountered";
        }
    };

    function be(a) {
        return [".zh-hans", a].join(".")
    }
    var ce = be("mysetpb"),
        de = be("search_config"),
        ee = be("mhwilds_deco"),
        fe = be("mhwilds_charms");
    let ge = new ae;

    function he(a) {
        return void 0 != ge.get(a.a)
    }
    class ie {
        constructor(a, b) {
            this.a = a;
            this.b = b
        }
        set(a) {
            ge.set(this.a, a)
        }
        get() {
            try {
                return ge.get(this.a) || this.b
            } catch (a) {
                return this.b
            }
        }
    };
    var je = class {
            constructor(a, b, c, {
                id: d,
                name: e
            } = {}) {
                this.skills = a;
                this.slots = b;
                this.order = c;
                this.id = void 0 === d ? Math.floor(999999 * Math.random()) : d;
                this.part = 5;
                e && (this.name = e)
            }
        },
        ke = new ie("mhwilds-zh-hans-deco", []);

    function le() {
        let a = ke.get();
        if (a) return a.filter(b => !!b.part && null != b.slots);
        a = [];
        for (let b = 1; 3 >= b; b++) a.push(new je({}, b, [], {
            name: b + "スロお守り"
        }));
        return a
    }

    function me(a) {
        var b = 0;
        let c = null;
        var d = {};
        for (var e of M(a, O, 1)) d[Lb(e)] = Mb(e);
        null != G(a, 3) ? (b = K(a, P, 3), c = [H(b, 1, 0), H(b, 2, 0), H(b, 3, 0)], c.sort(), c.reverse(), b = za(c, g => g)) : b = H(a, 2, 0);
        a = (a = K(a, P, 4)) ? [H(a, 1, 0), H(a, 2, 0), H(a, 3, 0)] : null;
        e = $c(d, b, c, a);
        d = new Wc(e, 3, 3, 5, 0, 0, !1, 0, !1, b, c, d, 0, [0, 0, 0, 0, 0]);
        a && (d.c = a);
        return d
    };
    class ne {
        constructor(a, b, c) {
            this.Da = a;
            this.f = b;
            this.F = c;
            this.sa()
        }
        sa() {
            var a = this.i(),
                b = this.c();
            Ic = a;
            Hc = b;
            Pd(this.F);
            a = this.f;
            b = this.Da;
            vd = a;
            xd(a);
            sd = b
        }
        i() {
            const a = [];
            for (let b = 0; 3 >= b; b++) a.push(new fd(b));
            return a
        }
        a() {
            throw TypeError("not implemented");
        }
        ba() {
            throw TypeError("not implemented");
        }
        c() {
            throw TypeError("not implemented");
        }
        C(a) {
            const b = [0, 0, 0, 0, 0],
                c = this.c();
            for (let d = 0; d < c.length; d++) {
                const e = c[d];
                a(e, d, c) && (b[e.j] = Math.max(e.i, b[e.j]))
            }
            return b
        }
        ra() {
            return le().map(a => new Wc(a.name,
                3, 3, 5, 0, 0, !1, 0, !1, a.slots, null, a.skills, 0, [0, 0, 0, 0, 0]))
        }
        D(a, b, c) {
            function d(r) {
                const C = {};
                for (const L of r) r = L.a ? L.a.join("") : "", C[r] || (C[r] = []), C[r].push(L);
                return Ra(C)
            }
            var e = [
                [
                    [],
                    [],
                    [],
                    []
                ],
                [
                    [],
                    [],
                    [],
                    []
                ],
                [
                    [],
                    [],
                    [],
                    []
                ],
                [
                    [],
                    [],
                    [],
                    []
                ],
                [
                    [],
                    [],
                    [],
                    []
                ],
                [
                    [],
                    [],
                    [],
                    []
                ]
            ];
            const g = [
                [],
                [],
                [],
                [],
                []
            ];
            let h = [];
            const k = this.a(),
                l = this.ba();
            var m = this.c().filter((r, C, L) => {
                if (!b(r, C, L)) return !1;
                C = r.j;
                if (p(l[C], r.name)) return !1;
                L = r.f;
                return null !== L && "胴系統倍化" in L ? (C = new ad(r, 0), C.o = !0, g[r.j].push(C),
                    !1) : k[C] ? !1 : !0
            });
            Ja(m, this.ra());
            for (var q of m) {
                m = !1;
                const r = {};
                for (const C in c) 0 < q.f[C] && (r[C] = q.f[C], m = !0);
                if (m || this.I(q)) h.push(this.A(q, r));
                else {
                    m = e[q.j][q.b];
                    if (!m) throw new RangeError("Unknown part/slots:" + q.j + "/" + q.b + " name:" + q.name);
                    m.push(this.A(q, {}))
                }
            }
            for (var v of Object.values(pc))
                if (6 != v)
                    for (c = 1; 3 >= c; c++) {
                        q = d(e[v][c]);
                        for (var y of q)
                            if (1 == y.length) h.push(y[0]);
                            else if (1 < y.length)
                            if (q = Lc(y), q = new Sc(v, a, c, y[0].a, q, y), p(l[v], q.name))
                                for (const r of y) h.push(r);
                            else h.push(q)
                    }
            this.ta ?
                (Ma(h, pe), this.Ba(h)) : Ma(h, qe);
            e = [];
            for (v = 0; v < g.length; v++) g[v].length && (y = Lc(g[v]), y = new Tc("胴系統倍化", v, a, y, g[v]), e.push(y));
            return [h, e]
        }
        I() {
            return !1
        }
        Ba() {
            throw Error("not implemented");
        }
        A(a, b) {
            if (a.a) {
                var c = {
                    0: 0,
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    99: 0
                };
                for (var d of a.a) c[d]++;
                for (const e in b) d = this.ua(e), c[d ? d.b : 99] += b[e];
                b = td(b) + a.b;
                return new ad(a, b, c)
            }
            c = td(b) + a.b;
            return new ad(a, c, null)
        }
        ua(a) {
            return Sd(a)
        }
        m() {
            return Nd
        }
    }
    ne.prototype.ta = !1;
    const re = (a, b) => a == b ? 0 : a > b ? -1 : 1,
        qe = (a, b) => re(a.i, b.i);

    function pe(a, b) {
        let c = re(a.i, b.i);
        if (0 != c) return c;
        c = re(a.c[4], b.c[4]);
        if (0 != c) return c;
        c = re(a.c[3], b.c[3]);
        return 0 != c ? c : c = re(a.c[2], b.c[2])
    };
    var se = preact.render,
        V = preact.h,
        W = preacti18n.Text,
        te = preact.Component;

    function ue(a, b) {
        for (const c of a.a)
            if (a = c.find(b)) return a;
        return null
    }
    class ve {
        constructor() {
            this.a = []
        }
    };

    function we(a) {
        a = ua(a, e => !!e);
        var b = [];
        a.sort(function(e, g) {
            return e.name > g.name ? 1 : e.name < g.name ? -1 : 0
        });
        for (var c = null, d = 0; d < a.length; d++) c && c.F == a[d] ? c.count++ : (c = {
            F: a[d],
            count: 1
        }, b.push(c));
        return b
    }

    function xe(a, b) {
        return a.i == b.i ? a.m == b.m ? 0 : a.m > b.m ? -1 : 1 : a.i < b.i ? -1 : 1
    }

    function ye(a, b, c) {
        for (const d of b)
            for (const e in d.F.f) ud(a, e, d.F.f[e] * c * d.count)
    }

    function ze(a) {
        const b = [],
            c = Ae(a);
        a = Be(a);
        for (const d in a) ud(c, d, a[d]);
        for (const d of Hd(c)) d.a && b.push(d.a.name);
        return b
    }

    function Ae(a) {
        const b = {};
        for (var c of a.a)
            if (c)
                for (const d in c.f) ud(b, d, c.f[d]);
        if (c = a.a[1])
            for (const d in c.f) ud(b, d, c.f[d] * (a.S - 1));
        return b
    }

    function Be(a) {
        const b = {};
        ye(b, a.A, a.S);
        ye(b, a.X, 1);
        return b
    }

    function Ce(a) {
        if (!a.D) {
            const d = Ae(a);
            var b = Be(a),
                c = d;
            for (const e in b) ud(c, e, b[e]);
            a.D = Hd(d)
        }
        return a.D
    }
    var De = class {
        constructor(a, b, c, d, e, g, h) {
            1 < b ? (c = we(c), d = we(d)) : (c = we(Ha(c, d)), d = []);
            this.a = Ia(a);
            this.S = b;
            this.X = c;
            this.A = d;
            this.c = e || null;
            this.m = this.i = 0;
            this.b = [0, 0, 0, 0, 0];
            for (const k of this.a)
                if (k)
                    for (this.m += k.A, this.i <<= 3, this.i += k.j + 1, a = 0; a < this.b.length; a++) this.b[a] += k.D[a];
            this.o = g || "";
            this.ha = !!h;
            this.f = null;
            this.ha && (this.f = ze(this));
            this.D = null;
            this.ba = 5;
            this.name = ""
        }
        I() {
            return 5 >= this.ba
        }
        C() {
            return null
        }
    };

    function Ee(a) {
        const b = a.c.a();
        for (let h = 0; h < b.length; h++) {
            var c = b[h],
                d;
            if (d = c) {
                {
                    d = c;
                    c = h;
                    var e = a.R,
                        g = a.O;
                    const k = Qc(d, c);
                    d = k ? !!(k.type & e) && !!(k.O & g) : !!Nc(d, c)
                }
                d = !d
            }
            if (d) return !1
        }
        return !0
    }

    function Fe(a) {
        const b = a.a.map(d => d ? d.o ? a.a[1] ? a.a[1].f : null : d.f : null).filter(d => !!d),
            c = {};
        for (const d of a.b) {
            let e = a.i[d];
            for (const g of b) e -= g[d] || 0;
            c[d] = e
        }
        return c
    }

    function Ge(a, b) {
        let c = 0;
        for (const d of a.b) c += rd(d, b[d]);
        return c = Math.round(1E3 * c) / 1E3
    }

    function He(a) {
        a.A = a.c.C(qa(a.m, a));
        a.I = 0;
        ta(a.A, function(c) {
            this.I += c
        }, a);
        var b = qa(0 < a.M ? a.Ca : a.m, a);
        b = a.c.D(a.R, b, a.Da);
        a.H = b[0];
        a.C || (a.H = cd(a.H, a.b));
        a.ha = b[1];
        a.ya && (a.H = a.sa(a.H))
    }

    function Ie(a, b) {
        let c = 0;
        for (let d = 0; 5 > d; d++) c += b[d] ? b[d].A : a.A[d];
        return c >= a.M
    }

    function Je(a) {
        if (!a.U) return !1;
        for (let b = 0; 5 > b; b++)
            if (-50 <= a.U[b]) return !0;
        a.U = null;
        return !1
    }

    function Ke(a) {
        a.c.m().filter(b => (b.o <= a.la || b.m <= a.da) && !!a.i[b.a.name]).sort((b, c) => {
            if (b.a.name != c.a.name) {
                const d = rd(b.a.name, 1),
                    e = rd(c.a.name, 1);
                b = d == e ? b.a.name < c.a.name ? -1 : 1 : d < e ? -1 : 1
            } else b = b.a.a == c.a.a ? 0 : b.a.a > c.a.a ? -1 : 1;
            return b
        })
    }

    function Le(a, b) {
        He(a);
        a.D([], b, 200)
    }
    var Ne = class {
        constructor(a, {
            O: b,
            R: c,
            K: d,
            da: e,
            u: g,
            L: h,
            la: k = 100,
            ya: l = !1,
            M: m = 0,
            U: q = null
        }) {
            this.O = 2 == b ? 2 : 1;
            this.la = k;
            this.da = e;
            this.i = Dd(g);
            this.Da = Object.assign({}, this.i);
            var v;
            b = this.i;
            e = [];
            g = 0;
            for (v in b) e[g++] = v;
            this.b = v = e;
            this.c = a;
            this.K = d;
            this.M = m;
            this.U = q;
            this.ya = !!l && !(0 < m || -50 < Math.max.apply(Math, q));
            this.a = this.ua();
            this.L = h;
            this.R = c;
            this.A = this.ha = this.H = null;
            this.I = 0
        }
        ua() {
            const a = Mc(this.c.a());
            return Ha(a, [this.K])
        }
        Ca(a, b, c) {
            return this.m(a, b, c) ? (a = this.I - this.A[a.j] + a.i >= this.M) ? a : !1 : !1
        }
        m(a) {
            return a.type &
                this.R && a.O & this.O ? a.A > this.da && a.C > this.la ? !1 : !0 : !1
        }
        sa(a) {
            return a.filter((b, c) => {
                for (var d = 0; d < c; d++)
                    if (id(this.b, b, a[d])) return !1;
                return !0
            })
        }
        D(a, b, c = 200) {
            function d() {
                let r;
                do r = v.next().done || a.length >= k.L; while (!(r || 0 <= h && f() - q > h));
                r = b(r ? 100 : Math.floor(a.length / k.L * 100), a) || r;
                q = f();
                r || setTimeout(d, 0)
            }

            function* e(r, C, L, ma) {
                let Ca = !1;
                if (!(a.length >= k.L)) {
                    var xa = hd(k.a);
                    if (ma <= xa) {
                        var ka = !1;
                        if (Ge(k, L) <= xa) {
                            ka = k.ta(k.a);
                            var Da = qa(k.Ba, k, a, ka);
                            ka = ka.b(L, Da)
                        }
                        if (ka) {
                            yield !0;
                            return
                        }
                    }
                    if (!(r >= C) && p(k.a,
                            null)) {
                        L = Me(k.a);
                        ka = null;
                        k.C && (ka = k.ra());
                        y.a.unshift([]);
                        for (let Ea = r; Ea < C; Ea++) {
                            const Q = k.H[Ea];
                            if (k.a[Q.j]) continue;
                            if (k.C && !ka(Q)) break;
                            if (Math.round(12 * (Q.i * L + xa)) < Math.round(12 * ma)) break;
                            if (ue(y, ra(id, k.b, Q))) continue;
                            k.a[Q.j] = Q;
                            r = !1;
                            const oe = Fe(k),
                                Oc = Ge(k, oe);
                            if (Oc < ma || 0 < Q.m || Q.b) {
                                Da = function*() {
                                    1 == Q.j && (yield* g(0, Ea + 1, Oc));
                                    yield* e(Ea + 1, k.H.length, oe, Oc)
                                }();
                                let Pc;
                                do Pc = Da.next(), r = r || Pc.value, 0 <= h && f() - q > h && (yield r || Ca); while (!Pc.done)
                            }
                            r || y.a[0].push(Q);
                            k.a[Q.j] = null;
                            Ca = Ca || r
                        }
                        y.a.shift();
                        yield Ca
                    }
                }
            }

            function* g(r, C, L) {
                let ma = !1;
                const Ca = k.ha;
                for (let xa = r; xa < Ca.length; xa++)
                    if (r = Ca[xa], !k.a[r.j]) {
                        k.a[r.j] = r;
                        const ka = Fe(k),
                            Da = Ge(k, ka);
                        if (Da == L && !k.a[1].m) {
                            k.a[r.j] = null;
                            break
                        }
                        const Ea = function*() {
                            yield* e(C, k.H.length, ka, Da);
                            yield* g(xa + 1, C, Da)
                        }();
                        let Q;
                        do Q = Ea.next(), ma = !(!ma && !Q.value), 0 <= h && f() - q > h && (yield ma); while (!Q.done);
                        k.a[r.j] = null
                    } yield ma
            }
            const h = c;
            Ke(this);
            const k = this,
                l = Fe(this),
                m = Ge(this, l);
            let q = f();
            const v = function*() {
                    k.a[1] && (yield* g(0, 0, m));
                    yield* e(0, k.H.length, l, m)
                }(),
                y = new ve;
            d()
        }
        Ba(a, b, c) {
            var d = Vc(dd, this.a).filter(e => Ie(this, e));
            if (Je(this)) ta(d, e => {
                e = Vc(Sc, e).filter(g => Ie(this, g));
                ta(e, g => {
                    g = Vc(Tc, g).filter(h => {
                        a: {
                            if (this.U)
                                for (let k = 0; 5 > k; k++) {
                                    if (-50 > this.U[k]) continue;
                                    let l = 0;
                                    for (let m = 0; 5 > m; m++) l += h[m] ? h[m].D[k] : 0;
                                    if (l < this.U[k]) {
                                        h = !1;
                                        break a
                                    }
                                }
                            h = !0
                        }
                        return h
                    }).filter(h => Ie(this, h));
                    ta(g, h => {
                        h = this.ba(h, c, b.a, 1);
                        a.push(h)
                    })
                })
            });
            else
                for (const e of d) d = this.ba(e, c, b.a, 1), a.push(d)
        }
        ba(a, b, c, d) {
            return new De(a, d, b, c)
        }
        ta() {
            throw "not implemented";
        }
        ra() {
            return () =>
                !0
        }
    };
    Ne.prototype.C = !1;
    var Oe = class {
        constructor() {
            this.a = []
        }
        b() {}
    };

    function Pe(a) {
        const b = [0, 0, 0, 0, 0];
        for (let c = 0; c < a.length; c++) {
            const d = a[c];
            d && (b[d.a[0]]++, b[d.a[1]]++, b[d.a[2]]++)
        }
        b[0] = 0;
        return b
    }

    function Me(a) {
        let b = 0;
        for (let c = 0; 6 > c; c++)(!a[c] || a[c].o && !a[1]) && b++;
        return b
    };

    function Qe() {
        return {
            "app-no-local-storage-alert": "你的浏览器已禁止Local storage，请开启后刷新本页面。",
            "app-tab-charm": "护石",
            "app-tab-excludeinclude": "装备设定",
            "app-tab-myset": "我的套装",
            "app-tab-search": "搜索",
            "app-tab-armor-mod": "Qurious Crafting",
            "app-tab-wilds-talisman": "护石",
            "armorset-add-to-myset": "保存到“我的套装”",
            "armorset-armorset-share-page": "套装分享页面",
            "armorset-def": "防御",
            "armorset-eq-none": "无",
            "armorset-label-name": "名字",
            "armorset-label-part": "部位",
            "armorset-label-pinexclude": "固定/除外",
            "armor-mod-add-button": "添加",
            "armor-mod-armor-select-dialog-input-placeholder": "Filter by name",
            "armor-mod-armor-select-dialog-title": "Select base armor",
            "armor-mod-base-armor": "Base Armor",
            "armor-mod-def-res": "防御・耐性",
            "armor-mod-export": "导出",
            "armor-mod-header": "Qurious Crafting",
            "armor-mod-import": "导入",
            "armor-mod-import-export": "导入/导出",
            "armor-mod-skill": "技能",
            "armor-mod-skill-none": "无",
            "armor-mod-skill-select-dialog-input-placeholder": "Filter by name",
            "armor-mod-skill-select-dialog-title": "Select skill",
            "armor-mod-slot-delta": "Slot changes",
            "armor-mod-th-delete": "删除",
            "armor-mod-th-slot": "插槽",
            "armorset-registering": "注册中",
            "armorset-remove-from-myset": "从“我的套装”中删除",
            "armorset-set-search-skills": "将技能组合设定为搜索条件",
            "armorset-skill-active": "发动技能",
            "armorset-skill-point-total": "合计",
            "armorset-skill-point-value": "技能",
            "armorset-slot-num": "插槽",
            "charm-add-button": "添加",
            "charm-add-title": "添加护石",
            "charm-delete-all": "删除全部护石",
            "charm-export": "导出",
            "charm-export-done-msg": "Export complete",
            "charm-import": "导入",
            "charm-import-export": "导入/导出护石",
            "charm-import-export-google-spreadsheet": "Import from /Export to Google Spreadsheet",
            "charm-link-to-end": "跳到最后",
            "charm-skill-none": "无",
            "charm-sort": "护石排序",
            "charm-table-th-delete": "删除",
            "charm-table-th-points": "等級",
            "charm-table-th-skill": "技能",
            "charm-table-th-slots": "插槽",
            "charm-upload-title": "",
            "deco-import-export-msg": "按下“导出”按钮后会在下方显示装饰品的数据，复制后保存下来。将保存下来的数据输入文本框后，点击“导入”按钮就可以读取装饰品的数据。",
            "deco-maximize-count": "将所有装饰品数量设为最大",
            "deco-minimize-count": "将所有装饰品数量设为0",
            "deco-weapon-multi-skill": "Multi weapon skill decos",
            "deco-weapon-single-skill": "Weapon skill decos",
            edit: "Edit",
            "elem-label-dragon": "龙",
            "elem-label-fire": "火",
            "elem-label-ice": "冰",
            "elem-label-thunder": "雷",
            "elem-label-water": "水",
            "equip-exclude": "除外",
            "equip-no-equipment": "无",
            "equip-pinned": "固定",
            "equip-section-deco": "装饰品所持数",
            "equip-section-deco-exclude": "装饰品",
            "equip-section-deco-export": "导入/导出护石",
            "equip-section-pin-exclude": "装备的固定/除外",
            "export": "导出",
            "import": "导入",
            "inspect-charm-debug": "护石数据（Debug用）",
            "inspect-export-charms": "导出护石",
            "inspect-myset-debug": "“我的套装”数据（Debug用）",
            "inspect-no-charm": "没有已保存的护石",
            "lv4-deco-not-configured": "没有设定Lv4的装饰品，为了能够得到更多的结果，请前往“装备设定”页面进行Lv4装饰品数量的设定",
            "missing-secret-error": "没有选择必须的极意技",
            "part-arms": "腕",
            "part-body": "身",
            "part-charm": "护石",
            "part-deco": "装饰品",
            "part-head": "头",
            "part-legs": "脚",
            "part-waist": "腰",
            "part-weapon": "武器",
            save: "Save",
            "search-button-extra-search": "查询追加技能",
            "search-button-reset": "重置",
            "search-button-search": "搜索",
            "search-eqtype-blademaster": "近战",
            "search-eqtype-gunner": "远程",
            "search-filter-limit": "结果数",
            "search-filter-mindef": "最低防御力",
            "search-filter-no-group-skill": "No group skill",
            "search-filter-no-series-skill": "No series skill",
            "search-filter-no-high-rank": "排除上位装备",
            "search-filter-no-master-rank": "排除大师装备",
            "search-filter-relic-armors": "Include relic armors",
            "search-filter-res-dragon": "龙耐性",
            "search-filter-res-fire": "火耐性",
            "search-filter-res-ice": "冰耐性",
            "search-filter-res-thunder": "雷耐性",
            "search-filter-res-water": "水耐性",
            "search-gathering-g-value": "G{{num}}",
            "search-gathering-released": "HR解禁",
            "search-gathering-special-permit": "Special permit",
            "search-gathering-value": "集会所☆{{num}}",
            "search-label-restrict-progress": "优化中",
            "search-min-def-res-set": "已设定耐性/防御力，移除这些设定以寻找合适的结果",
            "search-no-result": "没有找到合适的装备",
            "search-overlimit": "符合的结果超出了上限，搜索中止。更高防御力的套装可能没有被显示出来，若要查看更多结果，请上调搜索结果数",
            "search-progress-percent": "搜索中: {{progress}}",
            "search-result-query-count": "{{query}}的搜索结果 {{count}}条 ({{sec}}sec)",
            "search-sex-female": "女性",
            "search-sex-male": "男性",
            "search-village-value": "村☆{{num}}",
            "serach-alert-pin": "有装备被固定或除外，移除后或许可以搜索到符合的结果",
            "search-no-weapon-skill": "无武器技能",
            "slot-0": "无插槽",
            "slot-1": "1个插槽",
            "slot-2": "2个插槽",
            "slot-3": "3个插槽"
        }
    }

    function Re(a) {
        return preact.h(preacti18n.IntlProvider, Bc({
            definition: Qe()
        }, a))
    };
    const Se = U({
        height: "16px",
        width: "16px",
        "margin-right": "8px"
    });

    function Te(a) {
        return V("img", {
            src: "/static/mhsim/simicons/" + a.icon + ".png",
            style: Se
        })
    };
    const Ue = U({
            color: "blue"
        }),
        Ve = [V(W, {
            id: "part-head"
        }, "頭"), V(W, {
            id: "part-body"
        }, "胴"), V(W, {
            id: "part-arms"
        }, "腕"), V(W, {
            id: "part-waist"
        }, "腰"), V(W, {
            id: "part-legs"
        }, "脚"), V(W, {
            id: "part-charm"
        }, "護石")];

    function We(a) {
        return a ? [V(Te, {
            icon: Yc(a)
        }), a.name] : V(W, {
            id: "armorset-eq-none"
        }, "なし")
    }

    function Xe() {
        return V(W, {
            id: "part-deco"
        }, "装飾品")
    }

    function Ye(a, b) {
        const c = U({
            "float": "left",
            "margin-right": "10px",
            width: "auto"
        });
        return V("table", {
            class: "table table-striped",
            style: c
        }, V("tbody", null, V("tr", null, V("th", null, V(W, {
            id: "armorset-def"
        }, "防御")), V("th", null, V(W, {
            id: "armorset-label-name"
        }, "名前")), Ze(a) ? V("th", null, V(W, {
            id: "armorset-label-pinexclude"
        }, "固定・除外")) : ""), b.a.slice(0, 6).map(d => {
            {
                let g;
                g = d ? V("a", {
                    href: "/armors/name/" + (d.C || encodeURIComponent(d.name))
                }, V(Te, {
                    icon: Yc(d)
                }), " ", d.name) : V(W, {
                    id: "armorset-eq-none"
                }, "なし");
                var e;
                if (e = !!d) e = d.j, e = Ze(a) && 6 != e ? 5 == e ? !!a.props.W.Gb : !0 : !1;
                d = V("tr", null, V("td", null, d ? d.A : 0), V("td", {
                    colspan: Ze(a) && !e ? 2 : 1
                }, g), e ? $e(a, d) : "")
            }
            return d
        }), af(a, b)))
    }

    function bf(a) {
        const b = Ce(a),
            c = Be(a);
        return [V("table", {
            class: "table table-striped",
            style: "width:auto"
        }, V("tbody", null, V("tr", null, V("th", null, V(W, {
            id: "armorset-skill-point-value"
        }, "ポイント")), a.a[6] ? V("th", null, V(W, {
            id: "part-weapon"
        }, "武器")) : "", V("th", null, V(W, {
            id: "part-head"
        }, "頭")), V("th", null, V(W, {
            id: "part-body"
        }, "胴")), V("th", null, V(W, {
            id: "part-arms"
        }, "腕")), V("th", null, V(W, {
            id: "part-waist"
        }, "腰")), V("th", null, V(W, {
            id: "part-legs"
        }, "脚")), V("th", null,
            V(W, {
                id: "part-charm"
            }, "護石")), V("th", null, Xe()), V("th", null, V(W, {
            id: "armorset-skill-point-total"
        }, "合計")), V("th", null, V(W, {
            id: "armorset-skill-active"
        }, "発動スキル"))), b.map(d => V("tr", null, V("td", null, V("a", {
            href: "/skills/name/" + encodeURIComponent(d.name),
            target: "_blank"
        }, d.name)), a.a[6] ? V("td", null, cf(a, d, a.a[6])) : "", a.a.slice(0, 6).map(e => V("td", null, cf(a, d, e))), V("td", null, c[d.name] || ""), V("td", null, d.b), V("td", null, d.a ? V("a", {
            href: "/skills/name/" + encodeURIComponent(d.name),
            target: "_blank"
        }, d.a.name) : ""))), V("tr", null, V("td", null, V(W, {
            id: "armorset-slot-num"
        }, "スロット数")), a.a[6] ? V("td", null, df(a.a[6])) : "", a.a.slice(0, 5).map(d => V("td", {
            style: d && d.o ? Ue : ""
        }, d ? d.o ? df(a.a[1]) : df(d) : "")), V("td", null, a.a[5] ? df(a.a[5]) : "", " ", ""), V("td", null), V("td", null), V("td", null))))]
    }

    function ef(a, b) {
        const c = b.B,
            d = [];
        b.W.ma && (c.c || c.o ? (d.push(V("button", {
            onclick: () => ff(a)
        }, V(W, {
            id: "armorset-remove-from-myset"
        }, "マイセットから削除"))), c.c && d.push(V("span", null, "   ", V("a", {
            href: `/sim/showpb/${c.c}?hl=${"zh-hans"}`,
            target: "_blank"
        }, V(W, {
            id: "armorset-armorset-share-page"
        }, "マイセット共有ページ")), "   "))) : d.push(V("button", {
            onclick: () => gf(a)
        }, V(W, {
                id: "armorset-add-to-myset"
            },
            "マイセットに追加"))));
        b.W.xa && d.push(V("button", {
            onclick: () => {
                const e = c.a[6];
                b.W.xa(ze(c), e)
            }
        }, V(W, {
            id: "armorset-set-search-skills"
        }, "スキル構成を検索条件に設定")));
        return V("div", {
            style: "clear:both"
        }, d)
    }

    function Ze(a) {
        return !!a.props.W.$ && !!a.props.W.ea
    }

    function af(a, b) {
        const c = Ve[1];
        return V("tr", null, V("td", {
            style: "whitespace:nowrap"
        }, Xe()), V("td", {
            colspan: Ze(a) ? 2 : 1
        }, V("div", null, b.X.map(d => V("span", {
            style: "margin-right:5px"
        }, d.F.name, "*", d.count))), 0 < b.A.length ? V("div", null, c, b.A.map(d => V("span", null, d.F.name, " * ", d.count))) : ""))
    }

    function $e(a, b) {
        return V("td", {
            class: "eq-" + b.name.replace(/[ +]/g, "_")
        }, V("a", {
            style: "color:gray;",
            onclick: () => a.props.W.$(b.name, b.j)
        }, V("span", {
            class: "glyphicon glyphicon-pushpin"
        })), " ", V("a", {
            style: "color:gray;",
            onclick: () => a.props.W.ea(b.name, b.j)
        }, V("span", {
            class: "glyphicon glyphicon-minus-sign"
        })))
    }

    function cf(a, b, c) {
        if (!c) return [];
        if (c.o) return V("span", {
            style: Ue
        }, a.a[1].f[b.name] || "");
        a = b.name;
        return c.f[a] ? c.f[a].toString() : ""
    }

    function df(a) {
        return a.b ? [V(Te, {
            icon: "head"
        }), Xc(a), V("br", null), V(Te, {
            icon: "greatsword"
        }), a.b.join("-")] : Xc(a)
    }

    function ff(a) {
        a.props.W.wa(a.props.B.c, a.props.B.o);
        a.setState((b, c) => {
            c.B.c = "";
            c.B.o = "";
            return b
        })
    }

    function gf(a) {
        const b = a.props.B;
        a.props.W.ma(b).then(c => {
            b.c = c;
            a.forceUpdate()
        })
    }
    class hf extends te {
        constructor(a) {
            super(a);
            this.state = {}
        }
        render(a) {
            return V("div", null, V("div", null, Ye(this, a.B), bf(a.B)), ef(this, a))
        }
    }

    function jf(a) {
        a.setState(b => {
            b.open = !b.open;
            return b
        })
    }
    class kf extends te {
        constructor(a) {
            super(a);
            this.state = {
                open: !1
            }
        }
        render(a, b) {
            function c(k, l) {
                let m = {};
                10 <= k && (m["font-weight"] = "bold");
                10 <= k && (m.color = "#339");
                0 > k && (m.color = "#933");
                return [V(Te, {
                    icon: l + "_lo"
                }), V("span", {
                    style: U({
                        width: "4ex",
                        display: "inline-block"
                    }, m)
                }, k)]
            }
            var d = U({
                cursor: "pointer",
                "font-size": "80%"
            });
            const e = U({
                    "white-space": "nowrap",
                    overflow: "hidden",
                    "text-overflow": "ellipsis",
                    "min-width": "100px",
                    width: "19%"
                }),
                g = a.B.a.slice(0, 6).map(We),
                h = [];
            if (a.Ob) {
                let k = null;
                const l = {
                    type: "text",
                    value: a.B.name,
                    ref: m => {
                        k = m
                    },
                    style: "flex: 1 1"
                };
                a.Ya || (l.disabled = 1);
                h.push(V("tr", null, V("td", {
                    colspan: 6,
                    style: "border:0"
                }, V("div", {
                    style: "display:flex"
                }, V("button", {
                    onclick: () => {
                        a.va.ab(this.props.B.c, this.props.B.o, a.Ya, k.value)
                    },
                    style: "flex 0 0;"
                }, a.Ya ? V(W, {
                    id: "save"
                }, "保存") : V(W, {
                    id: "edit"
                }, "編集")), V("input", l)))))
            }
            h.push(V("tr", {
                style: d,
                onclick: () => jf(this)
            }, V("td", {
                style: e
            }, g[0]), V("td", {
                style: e
            }, g[1]), V("td", {
                style: e
            }, g[2]), V("td", {
                style: e
            }, g[3]), V("td", {
                style: e
            }, g[4]), V("td", {
                style: e
            }, g[5])));
            d = U({
                cursor: "pointer"
            });
            h.push(V("tr", {
                style: d,
                onclick: () => jf(this)
            }, V("td", {
                colspan: 6,
                style: "border:0"
            }, function() {
                if (!a.Qa) return "";
                const k = [V("span", {
                    style: U({
                        display: "inline-block",
                        width: "11em"
                    })
                }, a.B.a[6] ? a.B.a[6].name : "")];
                for (const l of ze(a.B)) k.push(V("span", {
                    style: "margin-left:8px;"
                }, l));
                return V("div", {
                    style: "font-size:80%;margin-bottom:8px"
                }, k)
            }(), [V(Te, {
                icon: "def"
            }), V("span", {
                style: "display:inline-block;width:4ex"
            }, a.B.m)], [c(a.B.b[0], "fire"), c(a.B.b[1], "water"), c(a.B.b[2],
                "thunder"), c(a.B.b[3], "ice"), c(a.B.b[4], "dragon")], function() {
                const k = a.B.C();
                if (!k) return "";
                const l = [];
                for (let m = 3; 1 <= m; m--) l.push(V("div", {
                    style: "display:inline-block;background-image:url(/static/mhsim/simicons/slot.png);width: 24px;height: 24px;background-size: 24px 19px;background-repeat:no-repeat;line-height: 24px;background-position:center;text-align: center;color: white;font-size: 8px;margin-right:8px;" + (k[m] ? "" : "opacity:0.3;")
                }, "Lv", m)), l.push(V("span", {
                        style: "display:inline-block;width:2ex"
                    },
                    k[m] || ""));
                return l
            }(), function() {
                if (!a.Ga) return "";
                const k = [];
                for (const l of Ce(a.B)) {
                    const m = a.Ga[l.name] || 0;
                    l.a && l.a.b > m && k.push(V("span", {
                        style: "font-size:80%; margin-left:8px"
                    }, l.a.name))
                }
                return k
            }(), [])));
            b.open && h.push(V("tr", null, V("td", {
                colspan: "7",
                style: "border:0"
            }, V(hf, {
                B: a.B,
                W: a.va
            }))));
            return V("tbody", null, h)
        }
    }

    function lf(a) {
        return V(mf, null, a.T.map(b => V(kf, {
            Qa: !!a.Qa,
            Ob: !!a.ja,
            Ya: !!a.ja && p(a.ja, b.o),
            Ga: a.Ga,
            B: b,
            va: a.va
        })))
    }
    lf.a = function(a, b) {
        b = V(Re, null, V(hf, {
            B: b,
            W: {}
        }));
        se(b, a)
    };

    function mf(a) {
        return V("div", {
            class: "table-responsive"
        }, V("table", {
            class: "table table-hover",
            id: "results-table"
        }, V("tbody", null, V("tr", null, V("th", null, V(W, {
            id: "part-head"
        }, "頭")), V("th", null, V(W, {
            id: "part-body"
        }, "胴")), V("th", null, V(W, {
            id: "part-arms"
        }, "腕")), V("th", null, V(W, {
            id: "part-waist"
        }, "腰")), V("th", null, V(W, {
            id: "part-legs"
        }, "脚")), V("th", null, V(W, {
            id: "part-charm"
        }, "護石")))), a.children))
    }
    lf.b = hf;
    class nf {
        constructor() {
            this.b = new Promise(a => {
                this.a = a
            })
        }
    };
    var of = class {
        constructor(a, b) {
            this.Z = a;
            this.X = b
        }
    };
    let pf = null;

    function qf(a) {
        if (!pf) {
            var b = vd;
            pf = [];
            for (const c of b) b = va(c.f, d => d.a), La(b), b = ua(va(b, Sd), d => !!d), b = va(b, d => ({
                name: d.name,
                max: Jd(d.a.name)
            })), b.length && pf.push({
                Z: c.Z,
                X: b
            })
        }
        return pf.map(c => {
            const d = c.X.map(({
                name: e,
                max: g
            }) => ({
                name: e,
                max: g,
                count: Math.min(g, void 0 === a[e] ? 7 : a[e])
            }));
            return new of(c.Z, d)
        })
    };

    function rf(a, b, c) {
        return V("option", {
            value: a,
            selected: c
        }, b)
    }

    function sf() {
        return V("div", {
            class: "alert alert-warning"
        }, V(W, {
            id: "search-overlimit"
        }, "一致する結果が上限を越えましたため、検索を打ち切りました。 防御力の高い組み合わせが含まれていないかもしれません。 より多くの結果を見るためには、結果件数の設定を変更してください。"))
    }

    function tf({
        progress: a
    }) {
        return V("div", {
            class: "progress progress-striped active"
        }, V("div", {
            class: "progress-bar",
            role: "progressbar",
            "aria-valuenow": "{progress}",
            "aria-valuemin": "0",
            "aria-valuemax": "100",
            style: "width:" + a + "%;transition:width 0.1s ease;"
        }, V("span", {
            class: "sr-only"
        }, V(W, {
            id: "search-progress-percent",
            fields: {
                progress: a
            }
        }, "検索中: ", {
            progress: a
        }))))
    }

    function uf() {
        return V("div", {
            class: "alert alert-warning"
        }, V(W, {
            id: "serach-alert-pin"
        }, "装備固定/除外の設定がされています。設定を外すことで一致する結果が見つかるかもしれません。"))
    }

    function vf() {
        return V("div", {
            class: "alert alert-warning"
        }, V(W, {
            id: "search-min-def-res-set"
        }, "耐性・防御力の設定がされています。設定を外すことで一致する結果が見つかるかもしれません。"))
    }

    function wf({
        query: a,
        eb: b,
        count: c
    }) {
        return V("div", {
            style: "margin:10px 0"
        }, V(W, {
            id: "search-result-query-count",
            fields: {
                query: a,
                count: c,
                sec: b
            }
        }, {
            query: a
        }, "の検索結果 ", {
            count: c
        }, "件 (", {
            eb: b
        }, "sec)"))
    }

    function xf() {
        return V("div", {
            class: "alert alert-warning"
        }, V(W, {
            id: "search-no-result"
        }, "一致する装備がありませんでした。"))
    }

    function yf() {
        try {
            ge.set("testtesttest", "testtesttest");
            ge.a.a.removeItem("testtesttest");
            var a = !0
        } catch (b) {
            a = !1
        }
        return a ? [] : V("div", {
            class: "alert alert-danger"
        }, V(W, {
            id: "app-no-local-storage-alert"
        }, "ローカルストレージが無効になっています。 有効にしてからページを再読み込みしてください"))
    }

    function zf({
        V: a,
        Y: b
    }) {
        a = a.filter(d => !!d).map(d => ".eq-" + d.replace(/[ +]/g, "_") + " .glyphicon-pushpin").join(", ");
        b = b.map(d => d.filter(e => !!e).map(e => ".eq-" + e.replace(/[ +]/g, "_") + " .glyphicon-minus-sign").join(", ")).filter(d => !!d).join(", ");
        const c = [];
        a && c.push(`${a} { color:green; }`);
        b && c.push(`${b} { color:red; }`);
        return V("style", null, c)
    }

    function Af({
        children: a,
        id: b,
        tb: c,
        Eb: d
    }) {
        return V("li", {
            class: b == c ? "active" : ""
        }, V("a", {
            onclick: () => d(b)
        }, a))
    }

    function Bf({
        wb: a,
        onchange: b
    }) {
        const c = [];
        for (const d of a) {
            c.push(V(Cf, null, d.Z));
            for (const e of d.X) c.push(V(Df, {
                name: e.name,
                count: e.count,
                max: e.max,
                onchange: b
            }))
        }
        return V("div", null, c)
    }

    function Df({
        name: a,
        count: b,
        max: c,
        onchange: d
    }) {
        const e = yc(c + 1).map(h => ({
            value: h,
            label: h.toString()
        }));
        let g = "";
        0 == b ? g = "background-color:#fcc" : b < c && (g = "background-color:#ff6");
        c = U({
            "float": "left",
            margin: "10px 5px"
        });
        return V("div", {
            style: c
        }, a, V(Ef, {
            value: b,
            options: e,
            style: g,
            onchange: h => d(a, h)
        }))
    }

    function Ef({
        value: a,
        onchange: b,
        options: c,
        id: d = "",
        style: e = "",
        gb: g = h => parseInt(h, 10)
    }) {
        return V("select", {
            onchange: h => b(g(h.target.value)),
            style: e,
            id: d
        }, c.map(h => V("option", {
            value: h.value,
            selected: h.value == a
        }, h.label)))
    }

    function Cf({
        children: a
    }) {
        return V("div", {
            class: "panel panel-default",
            style: U({
                clear: "both",
                "margin-bottom": "0",
                background: "#eee"
            })
        }, V("div", {
            class: "panel-body",
            style: "padding:5px;"
        }, a))
    }

    function Ff({
        Ha: a,
        Cb: b
    }) {
        let c = null;
        return V("div", null, V("div", null, V(W, {
                id: "deco-import-export-msg"
            }, "エクスポートボタンを押すと装飾品の所持数のデータを下記テキストエリアに書き出します。コピーしたものをどこかで保存してバックアップを行えます。バックアップしたデータはテキストエリアに貼り付けて、インポートボタンを押すことで装飾品の所持数を読み込めます。")),
            V("button", {
                onclick: () => {
                    c.value = JSON.stringify(a)
                }
            }, V(W, {
                id: "export"
            }, "エクスポート")), V("br", null), V("textarea", {
                ref: d => c = d,
                style: "width:100%"
            }), V("br", null), V("button", {
                onclick: () => {
                    try {
                        if (c.value) {
                            var d = JSON.parse(c.value);
                            ja(d) && (d = Qa(d, e => parseInt(e, 10)), b(d))
                        }
                    } catch (e) {
                        alert(e)
                    }
                }
            }, V(W, {
                id: "import"
            }, "インポート")))
    }
    const Gf = {
            "z-index": 1E4,
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        },
        Hf = U(Gf, {
            opacity: .7,
            background: "#000"
        }),
        If = U(Gf);

    function Jf(a, b) {
        a.state.focused || a.setState(c => {
            setTimeout(() => {
                const d = b.querySelector("[autofocus]");
                d && d.focus()
            }, 0);
            c.focused = !0;
            return c
        })
    }
    var Kf = class extends te {
        constructor(a) {
            super(a);
            this.state = {
                focused: !1
            }
        }
        render({
            children: a,
            Fb: b
        }) {
            return V("div", null, V("div", {
                style: Hf
            }), V("div", {
                style: If,
                onclick: c => {
                    c.target == c.currentTarget && b && b()
                },
                ref: c => Jf(this, c)
            }, a), V("style", null, "body ", "{", "overflow:hidden;", "}", "}"))
        }
    };

    function Lf(a) {
        const b = "width:calc(100% - 20px);" + (a.V ? "background:#ffa;" : ""),
            c = U({
                "max-width": "50%",
                width: "170px",
                display: "inline-block",
                "vertical-align": "top",
                margin: "0 5px",
                "text-align": "left"
            });
        return V("div", {
            style: c
        }, V("div", {
            class: "panel panel-default"
        }, V("div", {
            class: "panel-heading"
        }, a.rb, " ", V(W, {
            id: "equip-pinned"
        }, "固定")), V("div", {
            class: "panel-body"
        }, V("a", {
            onclick: function() {
                a.$(null, a.j)
            }
        }, V("span", {
            class: "glyphicon glyphicon-remove"
        })), V("select", {
            onchange: function(d) {
                a.$(d.target.value,
                    a.j)
            },
            style: b
        }, V("option", {
            value: ""
        }, V(W, {
            id: "equip-no-equipment"
        }, "なし")), a.H.map(d => rf(d.name, d.name, d.name == a.V)))), V("div", {
            class: "panel-heading"
        }, a.rb, " ", V(W, {
            id: "equip-exclude"
        }, "除外")), V("div", {
            class: "panel-body"
        }, a.Y.map(d => V("div", null, V("a", {
            onclick: function() {
                a.ea(d, a.j)
            }
        }, V("span", {
            class: "glyphicon glyphicon-remove"
        })), " ", d)))))
    }
    const Mf = [V(W, {
        id: "part-head"
    }, "頭"), V(W, {
        id: "part-body"
    }, "胴"), V(W, {
        id: "part-arms"
    }, "腕"), V(W, {
        id: "part-waist"
    }, "腰"), V(W, {
        id: "part-legs"
    }, "脚"), V(W, {
        id: "part-charm"
    }, "護石")];
    class Nf extends te {
        constructor(a) {
            super(a);
            var b = Hc.map(Rc);
            {
                var c = a.mb;
                const h = [0, 1, 2, 3, 4];
                a = [];
                if (Hc[0].a)
                    for (var d of h)
                        for (var e = 4; 0 < e; e--)
                            for (var g = e; 0 <= g; g--)
                                for (c = g; 0 <= c; c--) Aa(Hc, ra(Jc, [e, g, c], d)) && a.push(new Sc(d, 3, !!e + !!g + !!c, [e, g, c], 0));
                else
                    for (e of [1, 2])
                        for (g of h) {
                            for (d = 1; 3 >= d; d++) a.push(new Sc(g, e, d, null, 0));
                            1 != g && a.push(new Tc(c, g, e, 0))
                        }
            }
            b = Ha(b, a);
            this.a = [];
            for (const h of b) this.a[h.j] || (this.a[h.j] = []), this.a[h.j].push(h)
        }
        render(a) {
            const b = [];
            for (let c = 0; c < this.a.length; c++) b.push(V(Lf, {
                j: c,
                rb: Mf[c],
                V: a.V[c],
                Y: a.Y[c],
                H: this.a[c],
                $: a.$,
                ea: a.ea
            }));
            return V("div", null, b)
        }
    };

    function Of(a, b) {
        const c = document.getElementById("skill-searchbox");
        c && (c.value = "");
        a.props.onselect(b)
    }

    function Pf(a, b) {
        a.setState(c => {
            c.Za = b.toLowerCase();
            return c
        })
    }
    class Qf extends te {
        constructor(a) {
            super(a);
            this.state = {
                Za: ""
            }
        }
        render(a, b) {
            const c = Fd(),
                d = g => {
                    Pf(this, g.target.value)
                },
                e = g => {
                    const h = g.u.filter(k => !b.Za || 0 <= k.toLowerCase().indexOf(b.Za));
                    return 0 == h.length ? "" : V("div", {
                        class: "list-group"
                    }, V("h4", {
                        class: "list-group-item-heading"
                    }, g.Z), h.map(k => {
                        const l = a.Rb[k] || 0;
                        return V("button", {
                            class: "list-group-item",
                            onclick: () => Of(this, k)
                        }, l ? `${k}+${l}` : k)
                    }))
                };
            return V(Kf, {
                Fb: () => Of(this, "")
            }, V("div", {
                class: "panel panel-default",
                style: Rf
            }, V("div", {
                class: "panel-heading",
                style: "flex: 0 0"
            }, V("h3", {
                class: "panel-title"
            }, V("a", {
                onclick: () => Of(this, ""),
                class: "glyphicon glyphicon-remove"
            }), " ", V(W, {
                id: "armor-mod-skill-select-dialog-title"
            }, "スキル選択"))), V("div", {
                class: "panel-body",
                style: "flex: 1 1; overflow:hidden"
            }, V("div", {
                class: "input-group input-group-lg"
            }, V("span", {
                class: "input-group-addon"
            }, V("span", {
                class: "glyphicon glyphicon-search"
            })), V("input", {
                type: "text",
                class: "form-control",
                id: "skill-searchbox",
                autofocus: !0,
                placeholder: Qe()["armor-mod-skill-select-dialog-input-placeholder"] ||
                    "名前で検索",
                onchange: d,
                oninput: d,
                onkeyup: g => 27 == g.keyCode && Of(this, "")
            })), V("div", {
                style: "overflow-y:scroll;height: calc(100% - 50px);padding-top:20px;"
            }, c.map(g => e(g))))))
        }
    }
    const Rf = U({
        width: "90vw",
        height: "85vh",
        position: "relative",
        top: "50%",
        transform: "translateY(-50%)",
        margin: "auto",
        display: "flex",
        "flex-direction": "column"
    });
    class Sf extends te {
        constructor(a) {
            super(a);
            this.state = {
                fb: !1
            }
        }
        render(a, b) {
            var c = a.f[a.ka] || 0;
            const d = a.ka ? Math.min(Jd(a.ka) - c, 7) : 0;
            c = yc(0 < c ? Math.max(-3, -c) : 0, d + 1);
            return V("div", null, V("button", {
                style: "line-height:initial",
                onclick: () => {
                    this.setState(e => {
                        e.fb = !0;
                        return e
                    })
                }
            }, V(W, {
                id: "armor-mod-skill-select-dialog-title"
            }, "スキル選択")), V("span", {
                style: "display:inline-block;min-width:100px;margin:0 10px;"
            }, a.ka || V(W, {
                id: "armor-mod-skill-none"
            }, "なし")), b.fb ? V(Qf, {
                Rb: a.f,
                onselect: e => {
                    this.setState(g => {
                        g.fb = !1;
                        return g
                    });
                    a.onchange(e, 0)
                }
            }) : "", " ", V(Tf, {
                ub: "スキルポイント",
                selected: a.cb,
                onchange: function(e) {
                    a.onchange(a.ka, e)
                },
                Hb: c
            }))
        }
    }

    function Tf(a) {
        return V("select", {
            "aria-label": a.ub,
            onchange: b => a.onchange(parseInt(b.target.value, 10)),
            style: "width:80px"
        }, a.Hb.map(b => rf(b, "+" + b, b == a.selected)))
    };
    class Uf {
        constructor(a, b, c) {
            this.a = new ie(a, btoa(String.fromCharCode.apply(null, c.G())));
            this.c = b;
            this.b = c
        }
        get() {
            try {
                {
                    var a = this.a.get();
                    const d = atob(a),
                        e = new ArrayBuffer(d.length),
                        g = new Uint8Array(e);
                    a = 0;
                    for (var b = d.length; a < b; a++) g[a] = d.charCodeAt(a);
                    var c = g
                }
                return this.c(c)
            } catch (d) {
                return this.b
            }
        }
        set(a) {
            this.a.set(btoa(String.fromCharCode.apply(null, a.G())))
        }
    };
    const Vf = [
            [0, 0, 0],
            [1, 0, 0],
            [1, 1, 0],
            [1, 1, 1],
            [2, 0, 0],
            [2, 1, 0],
            [3, 0, 0]
        ],
        Wf = [
            [0, 0, 0],
            [1, 0, 0]
        ];

    function Xf(a, b) {
        a.setState(c => {
            Bc(c, b);
            return c
        })
    }

    function Yf(a) {
        Zf(a, a.state.Ra, a.state.Ua, a.state.Sa, a.state.Va, a.state.Ta, a.state.Wa, a.state.Fa, a.state.Xa);
        a.setState(b => {
            b.Ra = "";
            b.Ua = 0;
            b.Sa = "";
            b.Va = 0;
            b.Ta = "";
            b.Wa = 0;
            b.Fa = Vf[0];
            b.Xa = Wf[0];
            return b
        })
    }

    function $f(a) {
        var b = a.a.value;
        if (b) {
            b = b.split("\n").filter(d => !!d);
            var c = a.props.P.get();
            xc(c, b.map(d => {
                d = d.split(",");
                return ag(d[0], parseInt(d[1], 10), d[2], parseInt(d[3], 10), d[4], parseInt(d[5], 10), [parseInt(d[6], 10), parseInt(d[7], 10), parseInt(d[8], 10)], [parseInt(d[9], 10), parseInt(d[10], 10), parseInt(d[11], 10)])
            }));
            a.props.P.set(c);
            bg(a)
        }
    }

    function bg(a) {
        a.setState(b => {
            b.nb = M(a.props.P.get(), R, 1);
            return b
        })
    }

    function Zf(a, b, c, d, e, g, h, k, l) {
        b = ag(b, c, d, e, g, h, k, l);
        c = a.props.P.get();
        vb(c, 1, b, R, 0);
        a.props.P.set(c);
        bg(a)
    }
    class cg extends te {
        constructor(a) {
            super(a);
            this.state = {
                Ra: "",
                Ua: 0,
                Sa: "",
                Va: 0,
                Ta: "",
                Wa: 0,
                Fa: Vf[0],
                Xa: Wf[0],
                nb: M(a.P.get(), R, 1)
            };
            this.a = null
        }
        render(a, b) {
            Fd();
            a = {
                margin: "15px 5px"
            };
            return V("div", null, V(dg, {
                xb: !1
            }), V("h4", null, V(W, {
                id: "charm-add-title"
            }, "お守り追加")), V("div", {
                style: U(a)
            }, V(Sf, {
                ka: b.Ra,
                cb: b.Ua,
                f: {},
                onchange: (c, d) => Xf(this, {
                    Ra: c,
                    Ua: d
                })
            })), V("div", {
                style: U(a)
            }, V(Sf, {
                ka: b.Sa,
                cb: b.Va,
                f: {},
                onchange: (c, d) => Xf(this, {
                    Sa: c,
                    Va: d
                })
            })), V("div", {
                style: U(a)
            }, V(Sf, {
                ka: b.Ta,
                cb: b.Wa,
                f: {},
                onchange: (c, d) => Xf(this, {
                    Ta: c,
                    Wa: d
                })
            })), V("div", {
                style: U(a)
            }, V(Te, {
                icon: "head"
            }), V(W, {
                id: "charm-table-th-slots"
            }, "スロット"), V("select", {
                "aria-label": "スロット",
                onchange: c => Xf(this, {
                    Fa: c.target.value.split("-").map(d => parseInt(d, 10))
                })
            }, Vf.map(c => rf(c.join("-"), "LV" + c.join("-"), this.state.Fa == c)))), V("div", {
                style: U(a)
            }, V(Te, {
                icon: "greatsword"
            }), V(W, {
                id: "charm-table-th-slots"
            }, "スロット"), V("select", {
                "aria-label": "スロット",
                onchange: c =>
                    Xf(this, {
                        Xa: c.target.value.split("-").map(d => parseInt(d, 10))
                    })
            }, Wf.map(c => rf(c.join("-"), "LV" + c.join("-"), this.state.Xa == c)))), V("div", {
                style: U(a)
            }, V("button", {
                onclick: () => Yf(this)
            }, V(W, {
                id: "charm-add-button"
            }, "追加"))), V("hr", {
                style: "clear:both"
            }), V("div", {
                    id: "charm-table"
                }, V("table", {
                    class: "table table-striped",
                    style: "width:auto"
                }, V("tbody", null, V("tr", null, V("th", null, V(W, {
                    id: "charm-table-th-skill"
                }, "スキル")), V("th", null, V(W, {
                    id: "charm-table-th-points"
                }, "値")), V("th", null,
                    V(W, {
                        id: "charm-table-th-skill"
                    }, "スキル")), V("th", null, V(W, {
                    id: "charm-table-th-points"
                }, "値")), V("th", null, V(W, {
                    id: "charm-table-th-skill"
                }, "スキル")), V("th", null, V(W, {
                    id: "charm-table-th-points"
                }, "値")), V("th", null, V(W, {
                    id: "charm-table-th-slots"
                }, "スロット")), V("th", null, V(W, {
                    id: "charm-table-th-delete"
                }, "削除"))), b.nb.map((c, d) => {
                    const e = M(c, O, 1);
                    return V("tr", null, V("td", null, 1 <= e.length ? Lb(e[0]) : ""), V("td", null, 1 <= e.length ? Mb(e[0]) : ""), V("td",
                        null, 2 <= e.length ? Lb(e[1]) : ""), V("td", null, 2 <= e.length ? Mb(e[1]) : ""), V("td", null, 3 <= e.length ? Lb(e[2]) : ""), V("td", null, 3 <= e.length ? Mb(e[2]) : ""), V("td", null, V(Te, {
                        icon: "head"
                    }), "LV", H(K(c, P, 3), 1, 0), "-", H(K(c, P, 3), 2, 0), "-", H(K(c, P, 3), 3, 0), V("br", null), V(Te, {
                        icon: "greatsword"
                    }), "LV", H(K(c, P, 4), 1, 0), "-", H(K(c, P, 4), 2, 0), "-", H(K(c, P, 4), 3, 0)), V("td", null, V("a", {
                        onclick: () => {
                            {
                                const g = this.props.P.get(),
                                    h = M(g, R, 1);
                                h.splice(d, 1);
                                xc(g, h);
                                this.props.P.set(g);
                                bg(this)
                            }
                        }
                    }, V("span", {
                        class: "glyphicon glyphicon-remove"
                    }))))
                }))),
                V("hr", null), V("button", {
                    onclick: () => {
                        if (window.confirm("削除してもよろしいですか？")) {
                            const c = this.props.P.get();
                            xc(c, []);
                            this.props.P.set(c);
                            bg(this)
                        }
                    }
                }, V(W, {
                    id: "charm-delete-all"
                }, "お守りを全て削除"))), V("hr", null), V("div", null, V("h4", null, V(W, {
                id: "charm-import-export"
            }, "お守りコピペ インポート/エクスポート")), V("button", {
                onclick: () => {
                    {
                        const c =
                            M(this.props.P.get(), R, 1);
                        this.a.value = c.map(eg).join("\n")
                    }
                }
            }, V(W, {
                id: "charm-export"
            }, "エクスポート"), "↓"), V("br", null), V("textarea", {
                ref: c => this.a = c,
                style: "width:100%;height:200px"
            }), V("br", null), V("button", {
                onclick: () => $f(this)
            }, V(W, {
                id: "charm-import"
            }, "インポート↑"))))
        }
    }

    function dg(a) {
        return a.xb ? V("div", {
            class: "alert alert-warning"
        }, V("h4", null, "注意!"), V("div", null, "このページがブラウザではなくアプリ内で開かれている可能性があります。"), V("div", null, "追加したお守りは保存されないかもしれません")) : ""
    }

    function ag(a, b, c, d, e, g, h, k) {
        const l = new R;
        if (a) {
            const m = Qb(l);
            J(m, 1, a);
            I(m, 2, b)
        }
        c && (a = Qb(l), J(a, 1, c), I(a, 2, d));
        e && (c = Qb(l), J(c, 1, e), I(c, 2, g));
        e = new P;
        I(e, 1, h[0]);
        I(e, 2, h[1]);
        I(e, 3, h[2]);
        N(l, 3, e);
        h = new P;
        I(h, 1, k[0]);
        I(h, 2, k[1]);
        I(h, 3, k[2]);
        N(l, 4, h);
        return l
    }

    function eg(a) {
        {
            var b = M(a, O, 1);
            var c = 1 <= b.length ? Lb(b[0]) : "";
            const d = 1 <= b.length ? Mb(b[0]) : 0,
                e = 2 <= b.length ? Lb(b[1]) : "",
                g = 2 <= b.length ? Mb(b[1]) : 0,
                h = 3 <= b.length ? Lb(b[2]) : "";
            b = 3 <= b.length ? Mb(b[2]) : 0;
            const k = K(a, P, 3);
            a = K(a, P, 4);
            c = [c, d, e, g, h, b, H(k, 1, 0), H(k, 2, 0), H(k, 3, 0), H(a, 1, 0), H(a, 2, 0), H(a, 3, 0)]
        }
        return c.join(",")
    };

    function fg(a) {
        const b = [];
        0 == a.na.length && (b.push(V(xf, a)), gg(a.aa) && b.push(V(vf, null)), a.Ja && b.push(V(uf, null)));
        a.na.length >= a.aa.L && b.push(V(sf, null));
        const c = Dd(a.aa.u);
        return V("div", null, V(wf, {
            query: a.aa.u.join(", "),
            count: a.na.length,
            eb: a.pa
        }), b, V(lf, {
            T: a.na,
            Qa: !1,
            Ga: c,
            va: a.Jb
        }))
    }

    function hg(a) {
        const b = [];
        0 == a.oa.length && (b.push(V(xf, a)), gg(a.aa) && b.push(V(vf, null)), a.Ja && b.push(V(uf, null)));
        return V("div", null, V(wf, {
            query: a.aa.u.join(", "),
            count: a.oa.length,
            eb: a.pa
        }), b, function() {
            if (!a.oa) return "";
            var c = [],
                d = null;
            for (var e of a.oa) {
                var g = Bd(e);
                d != g.a && c.push([]);
                c[c.length - 1].push(g);
                d = g.a
            }
            d = [];
            for (const h of c) {
                c = [];
                for (const k of h) e = a.qb ? () => a.qb(k.name) : null, g = "Lv" + k.b, p(a.vb, k.name) ? c.push(V("span", {
                    style: U(ig),
                    class: "btn btn-primary btn-sm"
                }, g)) : c.push(V("a", {
                    style: U(ig),
                    class: "btn btn-default btn-sm",
                    onclick: e
                }, g));
                d.push(V("div", {
                    style: jg
                }, h[0].a, V("div", {
                    style: "display:inline-block;white-space:nowrap;"
                }, c)))
            }
            return d
        }())
    }

    function gg(a) {
        return !!a.M && 0 < a.M && !!a.U && wa(a.U, b => -50 < b)
    }
    class kg extends te {
        render(a) {
            return a.qa ? V(tf, {
                progress: a.progress
            }) : a.na ? V(fg, a) : a.oa ? V(hg, a) : ""
        }
    }
    const ig = {
            "margin-left": "8px"
        },
        jg = U({
            "margin-left": "10px",
            "line-height": "48px",
            "font-size": "16px"
        });
    U({
        "margin-left": "10px",
        "line-height": "36px",
        "font-size": "16px"
    });
    const lg = [100, 300, 500, 1E3, 2E3, 3E3, 4E3, 5E3, 6E3, 7E3, 8E3, 9E3, 1E4, 15E3, 2E4, 25E3, 3E4, 35E3, 4E4, 45E3, 5E4, 6E4, 7E4, 8E4, 9E4, 1E5, 2E5, 3E5, 4E5, 5E5, 6E5, 7E5, 8E5, 9E5, 1E6];

    function mg(a, b) {
        const c = window.gtag;
        if (c) {
            var d = 0;
            for (const e of lg)
                if (d = e, b < e) break;
            c("event", a, {
                event_category: "mhwilds.search",
                value: b,
                bucket: d
            })
        }
    };
    const ng = [0, 1, 2, 3, 4, 5];
    var og = new ie("mhwilds-zh-hans-gender", 1),
        pg = new ie("mhwilds-zh-hans-exclude", [
            [],
            [],
            [],
            [],
            [],
            []
        ]),
        qg = new ie("mhwilds-zh-hans-pinned", [null, null, null, null, null, null]),
        rg;
    {
        const a = new Ib;
        rb(a, 1, 1, 0);
        rg = a
    }
    const sg = new Uf("mhwilds-zh-hans-search_config", oc, rg);
    var tg;
    {
        const a = new Ib;
        rb(a, 1, 1, 0);
        tg = a
    }
    const X = new Uf(de, oc, tg);

    function ug(a, b) {
        if (!a.Ja()) {
            var c = new Hb;
            N(a, 2, c)
        }
        a = K(a, Hb, 2);
        switch (b) {
            case 0:
                return null == G(a, 1) && (b = new S, N(a, 1, b)), K(a, S, 1);
            case 1:
                return null == G(a, 2) && (b = new S, N(a, 2, b)), K(a, S, 2);
            case 2:
                return null == G(a, 3) && (b = new S, N(a, 3, b)), K(a, S, 3);
            case 3:
                return null == G(a, 4) && (b = new S, N(a, 4, b)), K(a, S, 4);
            case 4:
                return null == G(a, 5) && (b = new S, N(a, 5, b)), K(a, S, 5);
            case 5:
                return null == G(a, 6) && (b = new S, N(a, 6, b)), K(a, S, 6)
        }
    }

    function vg(a = null) {
        return ng.map(b => H(ug(a || X.get(), b), 1, ""))
    }

    function wg(a = null) {
        return ng.map(b => G(ug(a || X.get(), b), 2))
    }(function() {
        if (he(X.a)) return !1;
        if (he(sg.a)) return X.set(sg.get()), !0;
        const a = X.get();
        if (he(og)) {
            var b = og.get();
            rb(a, 1, b, 0);
            X.set(a)
        }
        if (he(qg)) {
            const d = qg.get();
            for (var c of ng) b = ug(a, c), J(b, 1, d[c] || "");
            X.set(a)
        }
        if (he(pg)) {
            b = pg.get();
            for (const d of ng) c = ug(a, d), qb(c, 2, b[d] || []);
            X.set(a);
            ge.a.a.removeItem(pg.a)
        }
        return !0
    })();
    var xg = class extends Uc {
        constructor(a, b = {}) {
            const c = ed(a),
                d = a.some(e => 0 < e);
            super(zc("武器插槽{0}", d ? c : "无"), 6, 0, [0, 0, 0], b, 0, [0, 0, 0, 0, 0], a)
        }
    };
    var yg = new Uf(fe, function(a) {
            a = new cb(a);
            for (var b = new tc; t(a) && 4 != a.a;) switch (a.c) {
                case 1:
                    var c = new R;
                    w(a, c, Pb);
                    vb(b, 1, c, R, void 0);
                    break;
                default:
                    u(a)
            }
            return b
        }, new tc),
        zg = new Uf(ee, function(a) {
            a = new cb(a);
            for (var b = new qc; t(a) && 4 != a.a;) switch (a.c) {
                case 1:
                    var c = new sc;
                    w(a, c, wc);
                    vb(b, 1, c, sc, void 0);
                    break;
                default:
                    u(a)
            }
            return b
        }, new qc);

    function Ag(a, b) {
        return b in a.b ? a.b[b] : 100
    }
    var Y = class extends ne {
        constructor() {
            super(jd.lb, ld.kb, jd.Aa);
            this.Ca = {};
            for (const a of vd)
                for (const b of a.f) this.Ca[b.a] = Math.max(b.b, this.Ca[b.a] || 0);
            this.S = this.o = null;
            this.b = {};
            this.ha = !1
        }
        D(a, b, c) {
            for (const d in c)
                if (ld.Ea.has(d)) {
                    this.ha = !0;
                    break
                } return super.D(a, b, c)
        }
        a() {
            return vg()
        }
        ba() {
            return wg()
        }
        sa() {
            var a = this.i(),
                b = kd;
            Ic = a;
            Hc = b;
            Pd(this.F);
            a = this.f;
            b = this.Da;
            vd = a;
            xd(a);
            sd = b
        }
        c() {
            this.b = {};
            for (const a of M(zg.get(), sc, 1)) this.b[H(a, 1, "")] = H(a, 2, 0);
            this.S = new Rd(this.m());
            return kd
        }
        ua(a) {
            return this.S.b[a] ||
                null
        }
        m() {
            return super.m().filter(a => 0 < Ag(this, a.name))
        }
        C(a) {
            a = super.C(a);
            a[5] = 0;
            return a
        }
        ra() {
            return M(yg.get(), R, 1).map(a => me(a))
        }
        i() {
            if (!this.o) {
                this.o = [new xg([0, 0, 0])];
                for (let a = 3; 0 < a; a--)
                    for (let b = a; 0 <= b; b--)
                        for (let c = b; 0 <= c; c--) this.o.push(new xg([a, b, c]))
            }
            return this.o
        }
        A(a, b) {
            const c = {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                99: 0
            };
            for (const d of a.a) c[d]++;
            b = td(b) + a.b;
            return new ad(a, b, c)
        }
        Ba(a) {
            let b = 0,
                c = 0;
            for (let d = a.length - 1; 0 <= d; d--) b = a[d].S = Math.max(b, a[d].c[3]), c = a[d].I = Math.max(c, a[d].c[3] + a[d].c[2])
        }
        I(a) {
            return a.c &&
                0 != a.c[0] + a.c[1] + a.c[2] ? this.ha : !1
        }
    };
    Y.prototype.ta = !0;
    Y.b = void 0;
    Y.a = function() {
        return Y.b ? Y.b : Y.b = new Y
    };
    class Bg extends Ld {
        constructor(a, b) {
            super(a, b, 3);
            a = Object.keys(b);
            const [c, d] = a;
            b[c] > b[d] ? (b = c, a = d) : b[c] < b[d] ? (b = d, a = c) : (b = Jd(c), a = Jd(d), b < a ? (b = c, a = d) : (b = d, a = c));
            this.a = b;
            this.c = a
        }
    }

    function Cg(a) {
        if (!Cg.a) {
            Cg.a = new Set;
            for (const b of jd.ca)
                if (b.f && 1 < Object.keys(b.f).length)
                    for (const c in b.f) Cg.a.add(c)
        }
        return Cg.a.has(a)
    }
    var Dg = Cg.a = null;

    function Eg(a) {
        if (!Eg.a) {
            Eg.a = new Set;
            for (const c of jd.ca) {
                var b = Object.keys(c.f);
                c.f && 1 != b.length || (b = b[0], c.b > c.f[b] && 1 < Jd(b) && Eg.a.add(b))
            }
        }
        return Eg.a.has(a)
    }
    Eg.a = null;

    function Fg(a) {
        return 0 < Ag(Y.a(), a.name)
    }

    function Gg(a) {
        const b = Hg().filter(d => Fg(d) && 0 <= a.indexOf(d.a) && 0 <= a.indexOf(d.c)),
            c = {};
        for (const d of b) c[d.a] || (c[d.a] = []), c[d.a].push(d);
        return c
    }

    function Ig(a) {
        const b = Jg(a).filter(Fg),
            c = Hg().filter(Fg).find(d => d.a == a);
        return c ? b.concat(c) : b
    }

    function Kg(a) {
        const b = a.b[2] + (0 > a.b[1] ? a.b[1] : 0);
        return a.b[3] + (0 > b ? b : 0)
    }

    function Lg(a) {
        const b = a.i.pop();
        a.b[b.F.b] += b.count;
        for (const c in b.F.f) {
            const d = 0 >= a.a[c];
            a.a[c] += b.F.f[c] * b.count;
            d && 0 < a.a[c] && a.c++
        }
    }
    class Mg {
        constructor(a, b) {
            this.b = a.concat();
            this.a = Object.assign({}, b);
            this.u = Object.keys(b);
            this.m = this.u.filter(Cg);
            this.o = this.u.filter(Eg);
            this.A = Gg(this.m);
            this.c = this.u.filter(c => 0 < b[c]).length;
            this.i = []
        }
        push(a, b) {
            this.i.push({
                F: a,
                count: b
            });
            this.b[a.b] -= b;
            for (const c in a.f) {
                const d = 0 < this.a[c];
                this.a[c] -= a.f[c] * b;
                d && 0 >= this.a[c] && this.c--
            }
            return 0 > Kg(this) ? (Lg(this), !1) : !0
        }
    }

    function Ng(a, b) {
        a = new Mg(a, b);
        var c = a.u.filter(d => {
            var e;
            if (e = !Cg(d)) {
                if (!Dg) {
                    Dg = new Set;
                    for (const g of jd.ca)
                        if (!g.f || 1 == Object.keys(g.f).length)
                            for (const h in g.f) g.f[h] < g.b && Dg.add(h)
                }
                e = Dg.has(d)
            }
            return e
        });
        for (const d of c)
            if ([c] = Jg(d), Ag(Y.a(), c.name) < b[d] || !a.push(c, b[d])) return null;
        return Og(a, 0) ? a.i : null
    }

    function Og(a, b) {
        a: {
            for (g of a.o) {
                var c = a.a[g];
                if (!(0 >= c)) {
                    var d = Ig(g).filter(Fg);
                    for (var e of d) {
                        d = Ag(Y.a(), e.name);
                        const h = Math.ceil(c / e.f[g]);
                        if (!(d < h) && a.push(e, h)) {
                            if (Pg(a, 0, 0)) {
                                var g = !0;
                                break a
                            }
                            Lg(a)
                        }
                    }
                    g = !1;
                    break a
                }
            }
            g = Pg(a, 0, 0)
        }
        if (g) return !0;
        if (0 >= Kg(a)) return !1;
        for (g = 0; b < a.m.length; b++) {
            e = a.m[b];
            c = a.A[e];
            if (0 < a.a[e] && c)
                for (; g < c.length; g++)
                    if (e = c[g], !(0 >= a.a[e.c])) {
                        a.push(e, 1);
                        if (Og(a, b + 1)) return !0;
                        Lg(a)
                    } g = 0
        }
        return !1
    }

    function Pg(a, b, c) {
        if (0 == a.c) return !0;
        var d = a.b[1] + a.b[2] + a.b[3];
        if (d < a.c) return !1;
        let e = c;
        for (var g = b; g < a.u.length; g++) {
            const h = a.u[g],
                k = a.a[h];
            if (0 < k) {
                if (0 >= d) return !1;
                for (d = Jg(h).filter(Fg); e < d.length; e++) {
                    g = d[e];
                    const l = Ag(Y.a(), g.name);
                    for (let m = 1; g.f[h] * (m - 1) < k && m <= l && a.push(g, m); m++) {
                        if (Pg(a, b, c + 1)) return !0;
                        Lg(a)
                    }
                }
                return !1
            }
            e = 0
        }
        return !0
    }

    function Jg(a) {
        if (!Qg) {
            Qg = {};
            for (const b of jd.ca) {
                const c = Object.keys(b.f);
                1 === c.length && (Qg[c[0]] || (Qg[c[0]] = []), Qg[c[0]].push(b))
            }
        }
        return Qg[a]
    }
    var Qg = null,
        Rg = null;

    function Hg() {
        return jd.ca.filter(a => 1 < Object.keys(a.f).length).map(a => new Bg(a.name, a.f))
    }

    function Sg() {
        return jd.ca.filter(a => 1 == Object.keys(a.f).length)
    };

    function Tg(a) {
        return M(a.a.get(), Db, 1).filter(b => !!K(b, zb, 3)).map(b => {
            const c = K(b, zb, 3),
                d = Va(c.G());
            return a.c(c, d, H(b, 2, ""), H(b, 1, ""))
        })
    }

    function Ug(a, b) {
        b = b(a.a.get());
        a.a.set(b);
        return Tg(a)
    }

    function Vg(a, b) {
        return Ug(a, c => {
            const d = vb(c, 1, void 0, Db, void 0);
            J(d, 2, "__" + Math.random().toString(36));
            var e = a.b(b);
            N(d, 3, e);
            return c
        })
    }

    function Wg(a, b, c) {
        return Ug(a, d => {
            const e = M(d, Db, 1);
            Ga(e, g => H(g, 2, "") == c) || Ga(e, g => Va(K(g, zb, 3).G()) == b);
            ub(d, 1, e);
            return d
        })
    }

    function Xg(a, b, c, d) {
        return Ug(a, e => {
            var g = M(e, Db, 1);
            g = g.find(h => H(h, 2, "") == c) || g.find(h => Va(K(h, zb, 3).G()) == b);
            d(g);
            return e
        })
    }
    class Yg {
        constructor(a) {
            this.i = a;
            this.a = new Uf(ce, jc, new Eb);
            if (!he(this.a.a)) {
                var b = new ie("mhwilds-zh-hans-myset", []);
                a = this.a.get();
                for (const c of b.get()) {
                    const d = vb(a, 1, void 0, Db, void 0);
                    J(d, 2, c.myLocalSetId);
                    b = Zg(c);
                    N(d, 3, b)
                }
                this.a.set(a)
            }
        }
        b(a) {
            return $g(a)
        }
        c(a, b, c, d) {
            return this.i(a, b, c, d)
        }
    }

    function Zg(a) {
        function b(e) {
            const g = new Cb;
            J(g, 1, e.name);
            I(g, 2, e.count);
            return g
        }
        const c = a.equipments,
            d = new zb;
        Vb(d, c[0] || "");
        Wb(d, c[1] || "");
        Xb(d, c[2] || "");
        Yb(d, c[3] || "");
        Zb(d, c[4] || "");
        if (5 < c.length) $b(d, c[5] || "");
        else if (a.charm) {
            const e = new R;
            I(e, 2, a.charm.slots);
            Oa(a.charm.skills, (g, h) => {
                const k = Qb(e);
                J(k, 1, h);
                I(k, 2, g)
            });
            ac(d, e)
        }
        bc(d, a.weapon || "");
        fc(d, (a.decos || []).map(b));
        gc(d, (a.bodyDecos || []).map(b));
        return d
    }

    function $g(a) {
        function b(g) {
            const h = new Cb;
            J(h, 1, g.F.name);
            I(h, 2, g.count);
            return h
        }
        const c = new zb,
            d = g => g ? g.name : "";
        Vb(c, d(a.a[0]));
        Wb(c, d(a.a[1]));
        Xb(c, d(a.a[2]));
        Yb(c, d(a.a[3]));
        Zb(c, d(a.a[4]));
        if (a.I()) {
            const g = a.a[5];
            if (g) {
                const h = new R;
                for (var e in g.f) {
                    const k = Qb(h);
                    J(k, 1, e);
                    I(k, 2, g.f[e])
                }
                g.a ? (e = new P, I(e, 1, g.a[0]), I(e, 2, g.a[1]), I(e, 3, g.a[2]), N(h, 3, e), g.b && (e = new P, I(e, 1, g.b[0]), I(e, 2, g.b[1]), I(e, 3, g.b[2]), N(h, 4, e))) : I(h, 2, g.m);
                ac(c, h)
            }
        } else $b(c, d(a.a[5]));
        bc(c, d(a.a[6]));
        fc(c, (a.X || []).map(b));
        gc(c, (a.A || []).map(b));
        return c
    };
    var ah = class extends De {
        constructor(a, b, c, d, e, g, h) {
            super(a, b, c, d, e, g, h);
            this.ba = 6;
            this.C()
        }
        C() {
            const a = Pe(this.a);
            for (const c of this.X) {
                a: {
                    var b = c.F;
                    for (const d in b.f)
                        if (ld.Ea.has(d)) {
                            b = !0;
                            break a
                        } b = !1
                }
                b || (a[c.F.b] -= c.count)
            }
            0 > a[1] && (a[2] += a[1], a[1] = 0);
            0 > a[2] && (a[3] += a[2], a[2] = 0);
            return a
        }
        I() {
            const a = this.a[5];
            return a ? !Hc.find(b => b.name === a.name) : !1
        }
    };

    function bh(a, b = "", c = "", d = "") {
        const e = Mc([H(a, 1, ""), H(a, 2, ""), H(a, 3, ""), H(a, 4, ""), H(a, 5, "")]);
        var g = K(a, R, 7);
        g ? g = Rc(me(g)) : g = (g = H(a, 6, "")) ? Nc(g, 5) : null;
        e.push(g);
        g = gd(H(a, 8, ""));
        const h = {};
        for (var k of M(a, O, 16)) h[Lb(k)] = Mb(k);
        e.push(new xg(g.b, h));
        k = M(a, Cb, 9);
        a = [];
        for (l of k) {
            k = H(l, 1, "");
            if (!Rg) {
                Rg = {};
                g = jd.ca.concat(jd.Aa);
                for (const m of g) Rg[m.name] = m
            }
            g = Rg[k];
            for (k = 0; k < H(l, 2, 0); k++) a.push(g)
        }
        var l = a;
        b = new ah(e, 1, l, [], b, c, !0);
        d && (b.name = d);
        return b
    }
    var ch = class extends Yg {
        constructor() {
            super(() => {})
        }
        b(a) {
            const b = super.b(a);
            a = a.a[6].f;
            for (const d in a) {
                var c = vb(b, 16, void 0, O, void 0);
                c = J(c, 1, d);
                I(c, 2, a[d])
            }
            return b
        }
        c(a, b, c, d) {
            return bh(a, b, c, d)
        }
    };

    function dh(a = {}) {
        a = new Dc(a);
        const b = T(a, "e", 1);
        return {
            O: T(a, "s", H(X.get(), 1, 0)),
            R: b,
            la: T(a, "v", 10),
            da: T(a, "g", 13),
            K: Cc(a, "w"),
            hb: Cc(a, "ws"),
            fa: Cc(a, "wgs"),
            ga: Cc(a, "wss"),
            M: T(a, "d", 0),
            Ma: T(a, "rf", -100),
            Pa: T(a, "rw", -100),
            Oa: T(a, "rt", -100),
            Na: T(a, "ri", -100),
            La: T(a, "rd", -100),
            L: T(a, "l", 200),
            zb: !!T(a, "nomr", 0),
            Zb: !!T(a, "nohr", 0),
            u: Cc(a, "skills").split(",").map(c => c.trim()).filter(c => eh(c, b)),
            Ia: T(a, "ds", 0),
            Ka: !!T(a, "t", 1)
        }
    }

    function fh(a) {
        const b = {
            s: a.O,
            e: a.R,
            v: a.la,
            g: a.da,
            w: a.K,
            ws: a.hb,
            d: a.M,
            rf: a.Ma,
            rw: a.Pa,
            rt: a.Oa,
            ri: a.Na,
            rd: a.La,
            l: a.L
        };
        a.zb && (b.nomr = 1);
        a.Ia && (b.ds = a.Ia);
        a.fa && (b.wgs = a.fa);
        a.ga && (b.wss = a.ga);
        a.Ka || (b.t = a.Ka);
        {
            var c = a.O;
            const d = X.get();
            rb(d, 1, c, 0);
            X.set(d)
        }
        Ac(a.u, b)
    }

    function eh(a, b) {
        if (!a) return !1;
        const c = Bd(a);
        return c && b & c.type ? !0 : !!a.match(/Lv0$/)
    }

    function gh(a, b) {
        if (a.hb) {
            var c = a.K;
            var d = a.hb;
            c = "武器无插槽" != c && c ? [c, d].join(" ") : d
        } else c = a.K;
        return {
            O: a.O,
            R: a.R,
            la: a.la,
            da: a.da,
            K: gd(c),
            M: a.M,
            U: [a.Ma, a.Pa, a.Oa, a.Na, a.La],
            L: a.L,
            u: a.u,
            ya: b,
            Ia: a.Ia,
            fa: a.fa,
            ga: a.ga,
            Ka: a.Ka
        }
    };

    function hh(a) {
        const b = U({
            "float": "left",
            "margin-right": "10px",
            "line-height": "40px"
        });
        return V("div", {
            style: b
        }, a.children)
    }

    function ih(a) {
        return parseInt(a, 10)
    }

    function jh({
        value: a,
        onchange: b,
        id: c = "",
        gb: d = ih
    }) {
        return V("input", {
            value: a,
            onchange: function(e) {
                b(d(e.target.value))
            },
            id: c
        })
    }

    function kh({
        value: a,
        onchange: b,
        za: c = null
    }) {
        c || (c = Ic);
        c = c.map(d => ({
            value: d.name,
            label: d.name
        }));
        return V(hh, null, V(Ef, {
            id: "weapon",
            onchange: b,
            value: a,
            options: c,
            gb: d => d
        }))
    }

    function lh({
        value: a,
        onchange: b,
        f: c,
        pb: d
    }) {
        c = Ha([{
            value: "",
            label: d
        }], c.map(e => ({
            value: e,
            label: e
        })));
        return V(hh, null, V(Ef, {
            onchange: b,
            value: a,
            options: c,
            gb: e => e
        }))
    }

    function mh({
        value: a,
        onchange: b,
        children: c,
        id: d = ""
    }) {
        return V(hh, null, c, V(jh, {
            value: a,
            onchange: b,
            id: d
        }))
    }

    function nh({
        value: a,
        onchange: b,
        children: c
    }) {
        const d = [{
            value: -100,
            label: "--"
        }];
        for (let e = -25; 25 >= e; e++) {
            const g = e.toString();
            d.push({
                value: g,
                label: g
            })
        }
        return V(hh, null, c, V(Ef, {
            onchange: b,
            value: a,
            options: d
        }))
    }

    function oh({
        Nb: a,
        Bb: b,
        onchange: c,
        ac: d = {},
        bc: e = []
    }) {
        function g(k, l) {
            let m = a.concat();
            k && m.splice(m.indexOf(k), 1);
            l && (m = m.concat([l]));
            c({
                u: m
            })
        }
        const h = [];
        for (const k of Ad()) {
            h.push(V(Cf, null, k.Z));
            for (const l of k.f) {
                const m = l.a + "Lv0",
                    q = Aa(a, y => p(l.b, y) || y == m),
                    v = d[l.a];
                h.push(V(ph, {
                    Qb: l.a,
                    Pb: l.b,
                    Mb: q,
                    Ab: p(b, l.a),
                    onchange: g,
                    Lb: p(e, l.a),
                    $b: v ? v.label : "",
                    Kb: v ? v.a : 100
                }))
            }
        }
        return V("div", null, h)
    }

    function ph({
        Qb: a,
        Pb: b,
        Mb: c,
        Ab: d,
        onchange: e,
        Kb: g,
        Lb: h
    }) {
        const k = a + "Lv0";
        let l = {};
        c && (l = {
            "background-color": "#ffc"
        }, h && Bd(c).b >= g && (l = {
            "background-color": "#fcc"
        }));
        return V("div", {
            style: U({
                display: "inline-block",
                width: "14%",
                "min-width": "110px",
                margin: "10px 10px 10px 0",
                position: "relative",
                color: "#212529"
            }, l)
        }, V("select", {
            id: a,
            onchange: function(m) {
                e(c, m.target.value)
            },
            style: U({
                height: "48px",
                padding: "24px 4px 4px",
                appearance: "none",
                "-webkit-appearance": "none",
                "-moz-appearance": "none",
                width: "100%",
                "background-image": "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e\")",
                "background-repeat": "no-repeat",
                "background-position": "right 4px bottom 4px",
                "background-size": "16px 12px",
                "background-color": "#fff",
                border: "1px solid #ced4da",
                "border-radius": "0.25em"
            }, l)
        }, d ? V("option", {
            value: k,
            selected: c == k
        }, k) : "", V("option", {
            value: "",
            selected: !c
        }, "--"), b.map(m => {
            const q = "Lv" + Bd(m).b;
            return V("option", {
                value: m,
                selected: m == c
            }, m.match(/.*Lv\d/) ? q : `${m}(${q})`)
        })), V("label", {
            style: U({
                padding: "4px 4px",
                position: "absolute",
                width: "100%",
                overflow: "hidden",
                "white-space": "nowrap",
                "pointer-events": "none",
                "font-weight": "normal",
                left: "0",
                top: "0"
            }),
            for: a
        }, a))
    }

    function qh({
        disabled: a,
        bb: b,
        $a: c,
        Db: d
    }) {
        return V("div", {
            style: "margin: 20px 0;clear:both"
        }, V("button", {
            onclick: b,
            disabled: a
        }, V("span", {
            class: "glyphicon glyphicon-search"
        }), V(W, {
            id: "search-button-search"
        }, "検索")), " ", V("button", {
            onclick: c,
            disabled: a
        }, V("span", {
            class: "glyphicon glyphicon-search"
        }), V(W, {
            id: "search-button-extra-search"
        }, "追加スキル検索")), " ", V("button", {
            onclick: d,
            disabled: a
        }, V(W, {
            id: "search-button-reset"
        }, "リセット")))
    };
    var rh = class {
        constructor(a) {
            this.c = a;
            this.i = "";
            this.T = [];
            this.Y = [];
            this.V = [];
            this.b = {
                qa: !1,
                progress: 0,
                pa: 0,
                na: null,
                oa: null,
                aa: null
            };
            if (document.location.hash) {
                var b = document.location.hash.split("#")[1];
                a = {};
                for (c of b.split("&")) {
                    b = c.split("=");
                    try {
                        a[b[0]] = decodeURIComponent(b[1])
                    } catch (d) {}
                }
                var c = a
            } else c = {};
            this.a = dh(c)
        }
    };

    function sh(a, b, {
        T: c = null,
        yb: d = null,
        aa: e = null,
        pa: g = 0
    }) {
        a.setState(h => {
            h.b.qa = 100 > b;
            h.b.progress = b;
            h.b.qa || (h.b.aa = e, c && c.sort(xe), h.b.na = c || null, h.b.oa = d || null, h.b.pa = g);
            return h
        });
        a.forceUpdate()
    }

    function th(a, b, c) {
        return {
            id: a,
            label: b,
            render: c
        }
    }

    function Z(a, b, ...c) {
        return (...d) => new Promise(e => {
            a.setState((g, h) => {
                h = b.apply(a, [g, h].concat(c, d));
                e(h);
                return g
            })
        })
    }
    var uh = class extends te {
        constructor(a, b, c) {
            super(a);
            this.a = this.m(b);
            a = new rh(c);
            a.T = Tg(this.a);
            a.Y = wg();
            a.V = vg();
            a.i = "search";
            this.state = a
        }
        m(a) {
            return new Yg(a)
        }
        N(a, b, c) {
            Bc(a.a, c);
            a.a.u = a.a.u.filter(d => eh(d, a.a.R));
            return a
        }
        $(a, b, c, d) {
            b = X.get();
            d = ug(b, d);
            c = H(d, 1, "") == c ? "" : c;
            J(d, 1, c);
            X.set(b);
            c = vg(b);
            a.V = c
        }
        ea(a, b, c, d) {
            {
                b = X.get();
                d = ug(b, d);
                const e = G(d, 2);
                p(e, c) ? Fa(e, c) : e.push(c);
                qb(d, 2, e || []);
                X.set(b);
                c = wg(b)
            }
            a.Y = c
        }
        xa(a, b, c, d) {
            this.N(a, b, {
                u: c,
                K: d ? d.name : ""
            });
            a.i = "search"
        }
        D(a) {
            a.a.u = []
        }
        o() {
            return []
        }
        render(a,
            b) {
            const c = this.o(),
                d = Z(this, (e, g, h) => {
                    e.i = h
                });
            return V(Re, null, V("div", null, V(yf, null), V("ul", {
                class: "nav nav-tabs"
            }, c.map(e => V(Af, {
                id: e.id,
                tb: b.i,
                Eb: d
            }, e.label))), V("br", null), c.find(e => e.id == b.i).render(a, b), V(zf, {
                V: b.V,
                Y: b.Y
            })))
        }
        ma(a, b, c) {
            a.T = Vg(this.a, c);
            return a.T[a.T.length - 1].c || ""
        }
        wa(a, b, c, d) {
            a.T = Wg(this.a, c, d)
        }
    };

    function vh({
        X: a,
        Ha: b,
        onchange: c
    }) {
        var d = a.map(e => {
            const g = Object.keys(e.f);
            return {
                max: 1 < g.length ? 1 : Jd(g[0]),
                name: e.name
            }
        });
        a = [];
        for (const e of d) d = b[e.name], void 0 == d && (d = e.max), a.push(V(Df, {
            name: e.name,
            count: d,
            max: e.max,
            onchange: c
        }));
        return V("div", null, a)
    };

    function wh(a) {
        return V("div", null, V(kh, {
                value: a.K,
                za: a.za,
                onchange: b => a.N({
                    K: b
                })
            }), V(lh, {
                pb: V(W, {
                    id: "search-filter-no-group-skill"
                }, "グループスキルなし"),
                value: a.fa,
                f: ld.ib,
                onchange: b => a.N({
                    fa: b
                })
            }), V(lh, {
                pb: V(W, {
                    id: "search-filter-no-series-skill"
                }, "シリーズスキルなし"),
                value: a.ga,
                f: ld.jb,
                onchange: b => a.N({
                    ga: b
                })
            }), V(mh, {
                id: "limit",
                value: a.L,
                onchange: b => a.N({
                    L: b
                })
            }, V(W, {
                id: "search-filter-limit"
            }, "結果件数")), V(mh, {
                id: "mindef",
                value: a.M,
                onchange: b => a.N({
                    M: b
                })
            }, V(W, {
                id: "search-filter-mindef"
            }, "最低防御力")), V(nh, {
                value: a.Ma,
                onchange: b => a.N({
                    Ma: b
                })
            }, V(W, {
                id: "search-filter-res-fire"
            }, "火耐性")), V(nh, {
                value: a.Pa,
                onchange: b => a.N({
                    Pa: b
                })
            }, V(W, {
                id: "search-filter-res-water"
            }, "水耐性")), V(nh, {
                value: a.Oa,
                onchange: b => a.N({
                    Oa: b
                })
            }, V(W, {
                id: "search-filter-res-thunder"
            }, "雷耐性")), V(nh, {
                value: a.Na,
                onchange: b => a.N({
                    Na: b
                })
            }, V(W, {
                id: "search-filter-res-ice"
            }, "氷耐性")),
            V(nh, {
                value: a.La,
                onchange: b => a.N({
                    La: b
                })
            }, V(W, {
                id: "search-filter-res-dragon"
            }, "龍耐性")))
    }
    class xh extends uh {
        constructor(a) {
            const b = {},
                c = M(a.ob.get(), sc, 1);
            for (const d of c) b[H(d, 1, "")] = H(d, 2, 0);
            super(a, a.Ib, {
                ja: [],
                ia: b
            });
            this.i = {};
            for (const d of jd.Aa) this.i[d.name] = 0;
            for (const d of jd.ca) this.i[d.name] = 0
        }
        m() {
            return new ch
        }
        I() {
            const a = f();
            fh(this.state.a);
            const b = gh(this.state.a, !1);
            this.setState(c => {
                c.b.qa = !0;
                c.b.progress = 0;
                return c
            });
            this.props.bb(b, (c, d) => {
                sh(this, c, {
                    T: d,
                    aa: b,
                    pa: (f() - a) / 1E3
                });
                100 <= c && mg("search", f() - a)
            })
        }
        A() {
            const a = f();
            fh(this.state.a);
            const b = gh(this.state.a, !0);
            this.setState(c => {
                c.b.qa = !0;
                c.b.progress = 0;
                return c
            });
            this.props.$a(b, (c, d) => {
                sh(this, c, {
                    yb: d,
                    aa: b,
                    pa: (f() - a) / 1E3
                });
                100 <= c && mg("extraSearch", f() - a)
            })
        }
        o() {
            const a = [];
            a.push(th("search", V(W, {
                id: "app-tab-search"
            }, "検索"), (b, c) => {
                const d = Z(this, this.N);
                var e = wa(c.V, h => !!h) || wa(c.Y, h => 0 < h.length);
                const g = {
                    Gb: !0,
                    ma: Z(this, this.ma),
                    wa: Z(this, this.wa),
                    $: Z(this, this.$),
                    ea: Z(this, this.ea)
                };
                b = Bc({
                    N: d,
                    za: b.za
                }, c.a);
                e = Bc({
                    Ja: e,
                    Jb: g,
                    qb: Z(this, this.C),
                    vb: this.state.a.u
                }, c.b);
                return V("div", null, V(wh, b),
                    V(oh, {
                        onchange: d,
                        Bb: [],
                        Nb: c.a.u,
                        R: c.a.R
                    }), V(qh, {
                        disabled: c.b.qa,
                        bb: this.I.bind(this),
                        $a: this.A.bind(this),
                        Db: Z(this, this.D)
                    }), V(kg, e))
            }));
            a.push(th("myset", V(W, {
                id: "app-tab-myset"
            }, "マイセット"), (b, c) => V(lf, {
                T: c.T,
                Qa: !0,
                ja: c.c.ja,
                va: {
                    ma: Z(this, this.ma),
                    wa: Z(this, this.wa),
                    xa: Z(this, this.xa),
                    ab: Z(this, this.ab)
                }
            })));
            a.push(th("charm", V(W, {
                id: "app-tab-wilds-talisman"
            }, "鑑定護石"), () => V(cg, {
                P: this.props.P
            })));
            a.push(th("excludeinclude", V(W, {
                    id: "app-tab-excludeinclude"
                },
                "装備設定"), (b, c) => V("div", null, V("h3", null, V(W, {
                    id: "equip-section-pin-exclude"
                }, "装備の固定・除外")), V(Nf, {
                    V: c.V,
                    Y: c.Y,
                    mb: "",
                    $: Z(this, this.$),
                    ea: Z(this, this.ea)
                }), V("h3", null, V(W, {
                    id: "equip-section-deco"
                }, "装飾品所持数")), V(Cf, null, V(W, {
                    id: "deco-weapon-multi-skill"
                }, "複合武器装飾品")), V(vh, {
                    X: Hg(),
                    Ha: c.c.ia,
                    onchange: Z(this, this.c)
                }), V(Cf, null, V(W, {
                    id: "deco-weapon-single-skill"
                }, "武器装飾品")),
                V(vh, {
                    X: Sg(),
                    Ha: c.c.ia,
                    onchange: Z(this, this.c)
                }), V(Bf, {
                    wb: qf(c.c.ia),
                    onchange: Z(this, this.c)
                }), V("br", {
                    style: "clear:both"
                }), V("button", {
                    id: "lv123decomax",
                    onclick: Z(this, this.b, {})
                }, V(W, {
                    id: "deco-maximize-count"
                }, "全ての装飾品の所持数を最大にする")), V("button", {
                    id: "lv123decomin",
                    onclick: Z(this, this.b, this.i)
                }, V(W, {
                    id: "deco-minimize-count"
                }, "全ての装飾品の所持数を0にする")), V("h3", {
                    style: "clear:both"
                }, V(W, {
                    id: "equip-section-deco-export"
                }, "装飾品のエクスポートとインポート")), V(Ff, {
                    Ha: c.c.ia,
                    Cb: Z(this, this.b)
                }))));
            return a
        }
        c(a, b, c, d) {
            a.c.ia[c] = d;
            this.b(a, b, a.c.ia)
        }
        b(a, b, c) {
            a.c.ia = c;
            a = new qc;
            for (const d in c) {
                const e = c[d],
                    g = new sc;
                J(g, 1, d);
                I(g, 2, e);
                vb(a, 1, g, sc, void 0)
            }
            b.ob.set(a)
        }
        C(a, b, c) {
            const d = Bd(c);
            a.a.u = a.a.u.filter(e => {
                const g = Bd(e);
                return (g ? g.a : e.match(/^(.*)Lv0$/)[1]) != d.a
            });
            a.a.u.push(c)
        }
        ab(a, b, c, d, e, g) {
            e ?
                (Fa(a.c.ja, d), a.T = Xg(this.a, c, d, h => {
                    J(h, 1, g)
                })) : a.c.ja.push(d)
        }
        xa(a, b, c, d) {
            let e = "",
                g = "";
            for (const h in d.f) d.f[h] && (p(ld.ib, h) && (e = h), p(ld.jb, h) && (g = h));
            this.N(a, b, {
                u: c,
                K: d ? d.name : "",
                fa: e,
                ga: g
            });
            a.i = "search"
        }
    };

    function yh(a) {
        return ea(function*() {
            return 0 <= a.b && f() - a.a >= a.b ? (yield new Promise(b => {
                setTimeout(() => {
                    a.a = f();
                    b()
                }, 0)
            }), !0) : !1
        }())
    }
    var zh = class {
        constructor(a) {
            this.b = a;
            this.a = f()
        }
    };
    const Ah = /^(.*)Lv0$/;

    function Bh(a, b, c, d = 200) {
        ea(function*() {
            if (!(0 < Object.keys(a.S).length)) return Object.getPrototypeOf(Object.getPrototypeOf(a)).D.call(a, b, c, d);
            const e = [null].concat(a.H.filter(g => !!g.b));
            for (const g of e) {
                if (g) {
                    if (a.a[g.j]) continue;
                    a.a[g.j] = g
                }
                a.o = Ch(a);
                if (a.o) {
                    const h = new nf;
                    Object.getPrototypeOf(Object.getPrototypeOf(a)).D.call(a, b, (k, l) => {
                        100 <= k ? h.a() : c(k, l)
                    }, d);
                    yield h.b
                }
                a.o = null;
                g && (a.a[g.j] = null);
                if (b.length >= a.L) break
            }
            c(100, b)
        }())
    }

    function Ch(a) {
        const b = [0, 0, 0, 0],
            c = Object.assign({}, a.S);
        for (const d of a.a)
            if (d) {
                if (d.b)
                    for (const e of d.b) b[e]++;
                for (const e in c) d.f[e] && (c[e] = Math.max(c[e] - d.f[e], 0))
            } return Ng(b, c)
    }
    class Dh extends Ne {
        constructor({
            O: a,
            R: b,
            K: c,
            da: d,
            M: e,
            U: g,
            u: h,
            L: k,
            ya: l
        }) {
            super(Y.a(), {
                O: a,
                R: b,
                K: c,
                da: d,
                L: k,
                M: e,
                U: g,
                ya: l,
                u: h
            });
            this.sb = h.map(m => (m = m.match(Ah)) ? m[1] : null).filter(m => !!m);
            this.S = {};
            for (const m in this.i) ld.Ea.has(m) && (this.S[m] = this.i[m], delete this.i[m], this.b.splice(this.b.indexOf(m), 1));
            this.o = null
        }
        ua() {
            const a = Mc(this.c.a());
            return Ha(a, [this.K])
        }
        ba(a, b, c, d) {
            return new ah(a, d, b, c)
        }
        D(a, b, c = 200) {
            Bh(this, a, b, c)
        }
        ta(a) {
            const b = this,
                c = Pe(a);
            return new class extends Oe {
                b(d, e) {
                    const g = [];
                    var h = [0, 0, 0, 0];
                    for (var k in d) {
                        const l = d[k];
                        if (0 >= l) continue;
                        const m = Sd(k);
                        if (!m || l > Ag(b.c, m.name)) return !1;
                        for (let q = 0; q < l; q++) g.push(m);
                        h[m.b] += l
                    }
                    d = c[1] - h[1];
                    k = c[2] - h[2];
                    h = c[3] - h[3];
                    0 > d && (k += d);
                    0 > k && (h += k);
                    if (0 > h) return !1;
                    if (b.o)
                        for (const l of b.o)
                            for (h = 0; h < l.count; h++) g.push(l.F);
                    e(g);
                    return !0
                }
            }
        }
        m(a, b, c) {
            return super.m(a, b, c) ? ya(this.sb, d => {
                var e = a.f;
                return !(null !== e && d in e)
            }) : !1
        }
        ra() {
            return () => !0
        }
        sa(a) {
            const b = (c, d) => {
                if (!id(this.b, c, d)) return !1;
                if (5 != c.j) return !0;
                const e = c.b || [0, 0, 0],
                    g = d.b || [0, 0, 0];
                for (let h = 0; 3 > h; h++)
                    if (e[h] > g[h]) return !1;
                for (const h in this.S)
                    if ((c.f[h] || 0) > (d.f[h] || 0)) return !1;
                return !0
            };
            return a.filter((c, d) => {
                for (var e = 0; e < d; e++)
                    if (b(c, a[e])) return !1;
                return !0
            })
        }
    }
    Dh.prototype.C = !0;

    function Eh(a) {
        const b = Bc({}, a),
            c = {};
        a.ga && (c[a.ga] = 1);
        a.fa && (c[a.fa] = 1);
        b.K = new xg(b.K.b, c);
        return b
    }

    function Fh(a, b) {
        a = Eh(a);
        a = new Dh(a);
        Ee(a) ? Le(a, b) : window.alert("An invalid equipment is pinned")
    }

    function Gh(a, b, c = 100) {
        function d(l) {
            return new Promise(m => {
                const q = Bc({}, e);
                q.L = 1;
                q.u = a.u.concat(l);
                Le(new Dh(q), (v, y) => {
                    100 <= v && m(0 < y.length)
                })
            })
        }
        const e = Eh(a);
        if (Ee(new Dh(e))) {
            var g = new zh(c),
                h = e.u.filter(l => !l.match(Ah)).map(Bd),
                k = Cd().filter(l => !Aa(h, function(m) {
                    return m.a == l.a && m.b > l.b
                }));
            (function() {
                return ea(function*() {
                    const l = {},
                        m = [];
                    for (let q = 0; q < k.length; q++) {
                        (yield yh(g)) && b(q / k.length * 100, m);
                        const v = k[q],
                            y = l[v.a] || 99;
                        v.b >= y || ((yield d(v.name)) ? m.push(v.name) : l[v.a] = Math.min(y, v.b))
                    }
                    b(100,
                        m)
                }())
            })()
        } else window.alert("An invalid equipment is pinned")
    }
    ha("renderPage", function() {
        const a = document.getElementById("ui");
        a.innerHTML = "";
        se(V(xh, {
            Ib: () => {},
            mb: "",
            bb: Fh,
            $a: Gh,
            za: Y.a().i(),
            ob: zg,
            P: yg
        }), a)
    });
    ha("renderSavedResultPagePb", () => {
        Y.a();
        const a = document.getElementById("ui");
        a.innerHTML = "";
        var b = document.location.pathname.split("/").pop();
        b = Xa(b);
        b = new cb(b);
        var c = new zb;
        b = Ub(c, b);
        b = bh(b);
        lf.a(a, b)
    });
    Zc = !1;
}).call(this);