Raphael.el.dragable = function(m, B, s) {
    this.drag_v = this.drag_v || {};
    this.drag_v.onMove = m || function() {
    };
    this.drag_v.onStart = B || function() {
    };
    this.drag_v.onUp = s || function() {
    };
    return this.drag(function(n, j, i, p) {
        var x = this.matrix, u = this.drag_v, y = i - u.lastX, z = p - u.lastY;
        u.lastX = i;
        u.lastY = p;
        x.e += y;
        x.f += z;
        this.transform(x.toTransformString());
        u.onMove.call(this, n, j, i, p, y, z, x.e, x.f);
        this.paper.safari()
    }, function(n, j, i) {
        var p = this.drag_v;
        p.lastX = n;
        p.lastY = j;
        p.onStart.call(this, n, j, i)
    }, function(n) {
        this.drag_v.onUp.call(this, 
        n)
    })
};
(function(m) {
    m = m || window;
    var B = function(n) {
        if (!(this instanceof B))
            return new B(n);
        this.opts = n;
        this.sets = {stsTitl: {},stsBgs: {},stsTags: {},stsValv: {},stsPoly: {},stsCirc: {},stsText: {},stsHove: {},stsLayer: {}};
        this.paper = Raphael(n.divID);
        n.topN = n.topN || 4;
        n.padds = m.sCopy(n.padds || {}, this.OPTS.padds);
        this.paper.gsid = m.gsid();
        m.evts.care(this.paper.gsid + "tagHover", this.drawHover);
        m.evts.care(this.paper.gsid + "tagClick", this.hidePoly)
    }, s = B.prototype;
    s.OPTS = {padds: {title: 56,left: 20,right: 20,bottom: 20,maxR: 9,
            bgLbar: 38,bgCright: 15,tagHig: 20}};
    s.drawBg = function() {
        function n(h) {
            var o = l.slice();
            o[13] = o[9] += h;
            o[11] += h;
            return o
        }
        var j = this.paper, i = T("#" + this.opts.divID);
        j = j.setSize(i.width(), i.height());
        i = this.opts.padds;
        var p = i.width = j.width, x = i.height = j.height, u = i.bgTop = i.title + i.tagHig, y = i.bgWidth = p - i.left - i.right, z = i.bgHeight = x - u - i.bottom, C = i.bgRight = p - i.right;
        y = i.bgCwidth = y - i.bgCright - i.bgLbar;
        var c = i.bgBottom = x - i.bottom, a = i.bgMiddle = u + z / 2, d = this.sets, b = d.stsBgs;
        d = d.stsLayer;
        for (var e = b.bgCircs || (b.bgCircs = 
        []), g = ["#dbdfeb", "#e4e7f2", "#eaecf5", "#f0f2f8", "#f3f5f9", "#f7f8fa"], f = g.length; f--; )
            (e[f] || (e[f] = j.circle(i.left + i.bgLbar, a, 0).attr({stroke: "#ffffff","stroke-weight": 1}))).attr({r: y * (f + 1) / 6,fill: g[f]});
        (b.axisX || (b.axisX = j.path().attr({stroke: "#ffffff","stroke-width": 1}))).attr({path: ["M", 0, a, p, a]});
        p = ["M", -5, -5, "L", -5, 5 + x, 5 + p, 5 + x, 5 + p, c, i.left, c, i.left, u, 5 + p, u, 5 + p, -5, -5, -5];
        (b.bgMask || (b.bgMask = j.path().attr({fill: "#ffffff",stroke: "none"}))).attr({path: p});
        (b.lBar || (b.lBar = j.rect().attr({fill: "#f7f8fa",
            stroke: "#dbdfeb","stroke-width": "0.9"}))).attr({x: i.left,y: u + 1,width: i.bgLbar - 5,height: z - 2});
        var l = ["M", 17, 0, "L", 34, 13, 29, 13, 29, 23, 17, 13, 5, 23, 5, 13, 0, 13, 17, 0];
        (b.arrUp || (b.arrUp = j.path(n(40)).attr({stroke: "none",fill: "#ffb049"}))).transform("t" + (i.left - 1) + "," + (u + 2));
        (b.arrUp_ex || (b.arrUp_ex = j.path(["M", 0, 0, "L", 24, 0, 24, 24, 0, 24, 0, 0]).attr({stroke: "none",fill: "90-#ffffff-#ffb049"}))).transform("t" + (i.left + 4) + "," + (u + 45));
        (b.arrDown || (b.arrDown = j.path(n(40)).attr({stroke: "none",fill: "#606e82"}))).transform("t" + 
        (i.left + (Raphael.svg ? -1 : -1)) + "," + (c - 40 - 26) + "r180");
        (b.arrDown_ex || (b.arrDown_ex = j.path(["M", 0, 0, "L", 24, 0, 24, 24, 0, 24, 0, 0]).attr({stroke: "none",fill: "90-#606e82-#ffffff"}))).transform("t" + (i.left + 4) + "," + (c - 40 - 30));
        (b.arrRight || (b.arrRight = j.path(n(66)).attr({stroke: "none",fill: "#999999"}))).transform("t" + (C - 66 - 13) + "," + (a - 33 - 12) + "r90");
        (b.arrRight_ex || (b.arrRight_ex = j.path(["M", 0, 0, "L", 24, 0, 24, 24, 0, 24, 0, 0]).attr({stroke: "none",fill: "0-#ffffff-#999999"}))).transform("t" + (C - 66 - 45) + "," + (a - 12.5));
        (b.txtUp || 
        (b.txtUp = j.text(0, 0, "上升".split("").join("\n")).attr({"text-anchor": "start",fill: "#ffffff"}))).attr({x: i.left + 10,y: u + 32});
        (b.txtUp2 || (b.txtUp2 = j.text(0, 0, "环比需求".split("").join("\n")).attr({"text-anchor": "start",fill: "#999999"}))).attr({x: i.left + 10,y: u + 84});
        (b.txtDown2 || (b.txtDown2 = j.text(0, 0, "环比需求".split("").join("\n")).attr({"text-anchor": "start",fill: "#999999"}))).attr({x: i.left + 10,y: c - 84});
        (b.txtDown || (b.txtDown = j.text(0, 0, "下降".split("").join("\n")).attr({"text-anchor": "start",fill: "#ffffff"}))).attr({x: i.left + 
            10,y: c - 32});
        (b.txtRight || (b.txtRight = j.text(0, 0, "箭头文本").attr({"text-anchor": "start",fill: "#ffffff"}))).attr({x: C - 66 - 26,y: a - 1});
        (b.circWord || (b.circWord = j.circle(i.left + i.bgLbar + 10, a, 22))).attr({fill: m.getColor(0),stroke: "#ffffff","stroke-width": 2});
        (b.textWord || (b.textWord = j.text(i.left + i.bgLbar + 10, a, ""))).attr({fill: "#ffffff","font-size": "14px"});
        (b.textNodata || (b.textNodata = j.text(0, 0, m.sTips.noData).hide())).attr(m.sCopy({x: y / 2,y: a}, m.sTips.noDataAttr));
        if (!d.bg)
            d.bg = j.path();
        return this
    };
    s.setData = 
    function(n) {
        maxX = maxY = 0;
        n.items = [];
        m.each(n.features, function(j, i) {
            n.items.push({text: i.feature,value_r: i.value_r / 1E3,xy: [i.value / 1E3, i.ratio / 1E3]})
        });
        this.datas = n;
        return this
    };
    s.drawCircle = function(n) {
        var j = this.opts.padds, i = j.bgHeight / 2, p = Math.sqrt(j.bgCwidth * j.bgCwidth - i * i), x = j.bgCwidth / 6, u = this.paper, y = this.sets, z = y.stsCirc, C = z[""] || (z[""] = []);
        z = y.stsText;
        var c = z[""] || (z[""] = []);
        z = y.stsLayer;
        if (n) {
            y.stsBgs.circWord.attr({fill: n});
            y.stsBgs.textWord.attr({text: this.text_n(this.datas.key)})
        }
        if (!this.datas)
            return this;
        m.each(this.datas.items, function(a, d) {
            var b = d.xy.slice(), e = 0, g = Math.floor((1 - d.value_r) * 5);
            g = Math.floor(d.xy[0] * 5);
            if (g > 4)
                g = 4;
            e = j.maxR - g * 1.5;
            b[0] *= p - j.maxR;
            b[1] *= i - j.maxR;
            if (g == 4)
                b[1] = d.xy[1] * (i - j.maxR - 20) + (d.xy[1] >= 0 ? 20 : -20);
            var f = Math.sqrt(x * (g + 2) * x * (g + 2) - b[1] * b[1]);
            f -= e;
            var l = Math.abs(b[1]) < x * (g + 1) ? Math.sqrt(x * (g + 1) * x * (g + 1) - b[1] * b[1]) : 0;
            l += e;
            b[0] = (f - l) * (d.xy[0] - 0.2 * g) / 0.2 + l;
            b[0] += j.left + j.bgLbar;
            b[1] = j.bgMiddle - b[1];
            (C[a] || (C[a] = u.circle().attr({stroke: "#ffffff"}).hover(function() {
                this.attr("r", 
                this.data("cr") * 1.5)
            }, function() {
                this.attr("r", this.data("cr"))
            }))).attr({cx: b[0],cy: b[1],r: e,fill: d.xy[1] >= 0 ? "#ffb049" : "#606e82","stroke-width": 2,title: d.text}).data("cr", e).show();
            f = b[0] + e + 3;
            b = b[1];
            if (b + 8 > j.bgBottom)
                b = j.bgBottom - 8;
            else if (b - 8 < j.bgTop)
                b = j.bgTop + 8;
            (c[a] || (c[a] = u.text().attr({"text-anchor": "start"}))).attr({x: f,y: b,text: d.text,fill: g > 2 ? "#999999" : "#333333",title: d.text}).show();
            if (g > 3) {
                d = c[a].getBBox().width;
                if (f + d > j.bgRight - j.bgCright) {
                    f -= d + e * 2 + 6;
                    c[a].attr({x: f})
                }
            }
        });
        for (n = this.datas.items.length; n < 
        C.length; n++) {
            C[n].hide();
            c[n].hide()
        }
        y.stsBgs.textNodata[this.datas.items.length ? "hide" : "show"]();
        if (!z.circ)
            z.circ = u.path();
        return this
    };
    s.text_n = function(n) {
        for (var j = [], i = n.length, p = 0; p < i - 1; p++)
            if (n.charCodeAt(p) < 256 && n.charCodeAt(p + 1) < 256) {
                j.push(n.slice(p, p + 2));
                p++
            } else
                j.push(n.slice(p, p + 1));
        p < i && j.push(n.slice(-1));
        if (j.length > 12) {
            j.length = 11;
            j.push("…")
        }
        i = j.length;
        i > 6 && j.splice(Math.floor(i / 2), 0, "\n");
        return j.join("")
    };
    return m.Demand = B
})(BID);
(function(m) {
    m = m || window;
    var B = function(c) {
        if (!(this instanceof B))
            return new B(c);
        this.opts = c;
        this.sets = {stsTitl: {},stsBgs: {},stsTags: {},stsValv: {},stsPoly: {},stsCirc: {},stsText: {},stsHove: {},stsLayer: {}};
        this.paper = Raphael(c.divID);
        c.topN = c.topN || 4;
        c.padds = m.sCopy(c.padds || {}, this.OPTS.padds);
        this.paper.gsid = m.gsid();
        m.evts.care(this.paper.gsid + "tagHover", this.drawHover);
        m.evts.care(this.paper.gsid + "tagClick", this.hidePoly)
    }, s = B.prototype;
    s.OPTS = {padds: {title: 56,left: 20,right: 20,bottom: 20,tagHig: 50}};
    s.drawBg = function() {
        var c = this.paper, a = T("#" + this.opts.divID);
        c = c.setSize(a.width(), a.height());
        a = this.opts.padds;
        var d = a.width = c.width, b = a.height = c.height, e = a.bgTop = a.title + a.tagHig, g = a.bgWidth = d - a.left - a.right, f = a.bgHeight = b - e - a.bottom;
        a.bgRight = d - a.right;
        a.bgBottom = b - a.bottom;
        b = this.sets;
        d = b.stsBgs;
        b = b.stsLayer;
        (d.bgRect || (d.bgRect = c.rect().attr({stroke: "#cccccc"}))).attr({x: a.left,y: e,width: g,height: f});
        for (var l = [], h = g / 16, o = f / 9, k = a.left + h; k < a.left + g; k += h)
            l.push("M", k, e, "L", k, a.bgBottom);
        for (k = 
        e + o; k < a.bgBottom; k += o)
            l.push("M", a.left, k, "L", a.bgRight, k);
        (d.bgCells || (d.bgCells = c.path().attr({stroke: "#f1f1f1"}))).attr({path: l});
        l = [];
        h = g / 4;
        o = f / 3;
        for (k = a.left + h; k < a.left + g; k += h)
            l.push("M", k, e, "L", k, a.bgBottom);
        for (k = e + o; k < a.bgBottom; k += o)
            l.push("M", a.left, k, "L", a.bgRight, k);
        (d.bgCellsBig || (d.bgCellsBig = c.path().attr({stroke: "#eeeeee","stroke-width": 2}))).attr({path: l});
        if (!b.bg)
            b.bg = c.path();
        return this
    };
    s.setData = function(c) {
        var a = -1, d = this.opts, b = [], e = maxX = minY = maxY = 0, g = [], f = m.getParams.C32().tags;
        m.each(f, function(l, h) {
            var o = c[h], k = {};
            b.push({text: h,color: m.getColor(l)});
            g.push(k);
            if (!o || !o.length)
                k.items = [];
            else {
                if (a < 0) {
                    a = l;
                    d.hL1st = l
                }
                k.items = o;
                m.each(k.items, function(t, q) {
                    q = q.split(",");
                    k.items[t] = [q[0], +q[1], +q[2], +q[3]]
                });
                k.items.sort(function(t, q) {
                    return q[1] - t[1]
                });
                var v = k.maxr = k.items[0][1], D = k.txtArr = [], w = k.rArr = [], r = k.xyArr = [];
                m.each(k.items, function(t, q) {
                    D.push(q[0]);
                    w.push(q[1] / v);
                    r.push([q[2], q[3]]);
                    if (q[2] < e)
                        e = q[2];
                    else if (q[2] > maxX)
                        maxX = q[2];
                    if (q[3] < minY)
                        minY = q[3];
                    else if (q[3] > 
                    maxY)
                        maxY = q[3]
                })
            }
        });
        this.datas = g;
        this.mmx = {minX: e,maxX: maxX,minY: minY,maxY: maxY};
        this.setZoom();
        this.drawTags(b, a);
        this.divTags(b, a);
        return this
    };
    s.setZoom = function() {
        var c = this.mmx, a = this.xys || (this.xys = {}), d = this.opts.padds;
        zoomX = d.bgWidth / (c.maxX - c.minX);
        zoomY = d.bgHeight / (c.maxY - c.minY);
        xoomR = 27 / zoomX;
        yoomR = 27 / zoomY;
        a.maxR = 9;
        a.ra = [9, 6, 4, 4, 2, 2, 2, 2, 2, 2];
        a.minX = c.minX - xoomR;
        a.maxX = c.maxX + xoomR;
        a.minY = c.minY - yoomR;
        a.maxY = c.maxY + yoomR;
        a.zoomX = zoomX = d.bgWidth / (a.maxX - a.minX);
        a.zoomY = zoomY = d.bgHeight / 
        (a.maxY - a.minY);
        a.offsetX = 0;
        a.offsetY = 0;
        if (zoomX > 400) {
            a.zoomX = 400;
            a.offsetX = (a.maxX - a.minX) * (zoomX - a.zoomX) / 2
        }
        if (zoomY > 100) {
            a.zoomY = 100;
            a.offsetY = (a.maxY - a.minY) * (zoomY - a.zoomY) / 2
        }
        return this
    };
    s.xyTrans = function(c) {
        var a = this.xys, d = this.opts.padds, b = {}.toString.call(c[0]).indexOf(" Array]") > 0, e = [];
        b || (c = [c]);
        for (var g = c.length; g--; )
            e.push([(c[g][0] - a.minX) * a.zoomX + d.left + a.offsetX, d.bgBottom - (c[g][1] - a.minY) * a.zoomY - a.offsetY]);
        return b ? e : e[0]
    };
    s.drawPoly = function() {
        var c = this, a = this.opts, d = this.paper, 
        b = this.sets, e = b.stsPoly;
        e = e[""] || (e[""] = []);
        var g = [];
        b = b.stsLayer;
        for (var f = this.datas.length; f < e.length; f++)
            e[f].hide();
        for (f = this.datas.length; f--; ) {
            if (!e[f]) {
                e[f] = d.path().attr({"stroke-width": 2,stroke: m.getColor(f),fill: m.getColor(f),"fill-opacity": 0.4,opacity: f == a.hL1st ? 0.9 : 0.2}).data("tagIndex", f);
                e[f].hover(function() {
                    var l = this.data("tagIndex");
                    T("#" + c.varsTags.divID).find(".items").removeClass("curr").eq(l).addClass("curr");
                    c.drawHover(l)
                }, function() {
                    c.drawHover()
                }).dragable(0, 0, function() {
                    this.transform("")
                })
            }
            if (!this.datas[f].xyArr || 
            !this.datas[f].xyArr.length)
                e[f].data("isHide", "hide");
            else {
                g = this.getGFinfo(f);
                e[f].attr({path: g.polyPath}).show().data("gfInfo", g)
            }
        }
        if (!b.poly)
            b.poly = d.path();
        g = e.slice();
        g.sort(function(l, h) {
            return (l.data("gfInfo") || {GFarea: 0}).GFarea - (h.data("gfInfo") || {GFarea: 0}).GFarea
        });
        for (f = g.length; f--; )
            g[f].insertBefore(b.poly);
        this.areaPolys = g;
        return this
    };
    s.hidePoly = function(c, a) {
        var d = this.sets.stsPoly[""], b = d.length;
        d[c][a]().data("isHide", a);
        if (a !== "show")
            for (a = +c + 1; a < +c + b; a++)
                if (d[a % b].data("isHide") !== 
                "hide") {
                    d[a % b].attr({opacity: 0.7});
                    break
                }
    };
    s.drawCircle = function() {
        var c = this, a = this.opts, d = this.paper, b = this.sets, e = b.stsCirc, g = e.circs || (e.circs = []), f = e.bgcrcs || (e.bgcrcs = []);
        e = b.stsLayer;
        var l = this.xys, h = {}, o = {};
        m.each(this.datas, function(w, r) {
            if (r.xyArr && r.xyArr.length) {
                var t = r.txtArr, q = r.xyArr;
                r = r.rArr.slice(0, a.topN);
                m.each(r, function(A) {
                    var E = c.xyTrans(q[A]), F = l.ra[A];
                    A = t[A];
                    (h[A] || (h[A] = [])).push({xy: E,cr: F,tagIndex: w});
                    o[A] = E
                })
            }
        });
        var k = -1;
        m.each(this.datas, function(w, r) {
            if (r.xyArr && r.xyArr.length) {
                w = 
                r.txtArr;
                var t = r.xyArr;
                r = r.rArr;
                for (var q = a.topN; q < r.length; q++) {
                    var A = w[q];
                    if (!o[A]) {
                        A = o[A] = c.xyTrans(t[q]);
                        k += 1;
                        (f[k] || (f[k] = d.circle(0, 0, l.ra[1]).attr({"stroke-width": 3,stroke: "#eeeeee",fill: "#dddddd"}).insertAfter(b.stsLayer.bg))).attr({cx: A[0],cy: A[1]})
                    }
                }
            }
        });
        var v = -1;
        m.each(h, function(w, r) {
            r.sort(function(t, q) {
                return t.cr - q.cr
            });
            for (w = r.length; w--; ) {
                v += 1;
                (g[v] || (g[v] = d.circle().attr({"stroke-width": 1,stroke: "#ffffff"}))).attr({cx: r[w].xy[0],cy: r[w].xy[1],r: r[w].cr,fill: m.getColor(r[w].tagIndex)}).show()
            }
        });
        for (var D = v + 1; D < g.length; D++)
            g[D].hide();
        if (!e.circ)
            e.circ = d.path();
        return this
    };
    s.drawText = function(c) {
        var a = this, d = this.opts, b = d.topN, e = d.padds, g = this.paper;
        d = this.sets;
        var f = d.stsText, l = f[""] || (f[""] = []), h = {};
        d = d.stsLayer;
        var o = this.xys.maxR, k = {fill: "#777777"}, v = -1;
        m.each(this.datas, function(D, w) {
            if (w.xyArr && w.xyArr.length) {
                D = w.xyArr;
                w = w.txtArr;
                for (var r = 0; r < (c || b); r++) {
                    var t = a.xyTrans(D[r]);
                    txt = w[r];
                    if (h[txt])
                        h[txt].show();
                    else {
                        var q = e.left + 40, A = e.bgRight - 40, E = e.bgBottom - 30;
                        if (t[0] < q)
                            t[0] = q;
                        else if (t[0] > 
                        A)
                            t[0] = A;
                        else if (t[1] > e.bgBottom - 64 && t[0] > e.bgRight - 264)
                            t[0] = e.bgRight - 210;
                        if (t[1] > E)
                            t[1] = E - o - 3;
                        else
                            t[1] += o + 6;
                        v += 1;
                        h[txt] = (l[v] || (l[v] = g.text().attr(k))).attr({x: t[0],y: t[1],text: txt}).show()
                    }
                }
            }
        });
        this.txtOnShow = h;
        for (f = v + 1; f < l.length; f++)
            l[f].hide();
        if (!d.text)
            d.text = g.path();
        return this
    };
    s.drawHover = function(c) {
        var a = this.opts.topN, d = this.paper, b = this.sets, e = b.stsPoly[""], g = b.stsHove;
        g = g.circs || (g.circs = []);
        var f = this.txtOnShow, l = this.xys.ra;
        if (!c && c != 0)
            a = 0;
        for (var h = a; h < g.length; h++)
            g[h].hide();
        m.each(f, function(k, v) {
            v.attr({fill: "#777777"})
        });
        if (a != 0) {
            for (h = e.length; h--; )
                h == c ? e[h].attr("opacity", 0.9) : e[h].attr("opacity", 0.2);
            h = this.datas[c];
            e = h.xyArr;
            var o = h.txtArr;
            if (e && e.length)
                for (h = a; h--; ) {
                    a = this.xyTrans(e[h]);
                    (g[h] || (g[h] = d.circle().attr({"stroke-width": 2,stroke: "#ffffff"})).insertBefore(b.stsLayer.circ)).attr({cx: a[0],cy: a[1],r: l[h] * 1.5,fill: m.getColor(c)}).show();
                    f[o[h]].attr({fill: "#000000"})
                }
        }
    };
    s.drawTags = function() {
        return this
    };
    s.divTags = function(c, a) {
        var d = c.length, b = this.varsTags || 
        (this.varsTags = {}), e = this.opts, g = e.padds, f = function() {
            var h = '<i class="rect"></i><span class="tag"></span>';
            h = '<div class="nmTag">' + h + '</div><div class="hvTag">' + h + "</div>";
            h = '<a class="items" href="javascript:;">' + h + "</a>";
            return (new Array(6)).join(h)
        };
        if (b.divID)
            e = T("#" + b.divID).hide();
        else {
            var l = this;
            e = T('<div class="tag4ints"></div>').hide().html(f()).appendTo(T("#" + e.divID).parent());
            e.find(".items").each(function(h) {
                T(this).data("tagIndex", h)
            }).click(function() {
                var h = T(this), o = h.data("tagIndex"), 
                k = "hide", v = l.paper.gsid;
                if (!h.hasClass("dsab")) {
                    if (h.hasClass("opct4")) {
                        h.removeClass("opct4");
                        k = "show";
                        m.evts(v + "tagHover", l, o)
                    } else {
                        h.addClass("opct4");
                        m.evts(v + "tagHover", l)
                    }
                    m.evts(v + "tagClick", l, o, k)
                }
            }).mouseenter(function() {
                if (!(T(this).hasClass("opct4") || T(this).hasClass("dsab"))) {
                    T(this).closest(".tag4ints").find(".items").removeClass("curr");
                    T(this).addClass("curr");
                    m.evts(l.paper.gsid + "tagHover", l, T(this).data("tagIndex"))
                }
            }).mouseleave(function() {
                T(this).hasClass("dsab") || m.evts(l.paper.gsid + 
                "tagHover", l)
            });
            b.divID = BID.gsid(e[0])
        }
        e.find(".items").hide().removeClass("curr").each(function(h) {
            if (h >= d)
                return "break";
            var o = T(this), k = c[h];
            h == a && d > 1 && o.addClass("curr");
            if (!l.datas[h] || !l.datas[h].xyArr || !l.datas[h].xyArr.length)
                o.addClass("dsab")[0].onmousemove = function() {
                    BID.showTip("noData")
                };
            else
                o.removeClass("dsab")[0].onmousemove = null;
            o.find(".rect").css({"background-color": k.color});
            o.find(".hvTag .tag").css({color: k.color});
            o.attr("title", k.text).show().find(".tag").html(k.text)
        });
        e.css({left: g.left - 
            10,top: g.title}).show()
    };
    s.drawValv = function() {
        var c = this.paper, a = this.xys, d = this.opts.padds, b = d.bgRight - 18 - 244;
        d = d.bgBottom - 16 - 38;
        var e = this.sets, g = e.stsValv;
        e = e.stsLayer;
        (g.rect0 || (g.rect0 = c.rect().attr({stroke: "#e2e2e2",fill: "#ffffff"}))).attr({x: b,y: d,width: 244,height: 38});
        for (var f = 0; f < 3; f++)
            (g["circ" + f] || (g["circ" + f] = c.circle().attr({stroke: "none",fill: "#999999"}))).attr({cx: b + [19, 66, 106][f] + 98,cy: d + 19,r: a.ra[f]});
        for (f = 0; f < 4; f++)
            (g["text" + f] || (g["text" + f] = c.text(0, 0, ["需求强烈程度：", "强", "中", "弱"][f]).attr({"text-anchor": "start",
                fill: "#333333"}))).attr({x: b + [-85, 33, 79, 118][f] + 98,y: d + 19});
        g.text0.attr({fill: "#999999"});
        if (!e.valv)
            e.valv = c.path();
        return this
    };
    s.isNoData = function() {
        for (var c = 1, a = this.paper, d = this.sets.stsLayer, b = this.datas.length; b--; )
            if (this.datas[b].xyArr && this.datas[b].xyArr.length) {
                c = 0;
                break
            }
        if (c)
            (d.noData || (d.noData = a.text(0, 0, m.sTips.noData)).attr(m.sTips.noDataAttr)).attr({x: a.width / 2,y: a.height / 2}).show();
        else
            d.noData && d.noData.hide()
    };
    s.getGFinfo = function(c) {
        var a = this.datas[c].xyArr.slice(0, this.opts.topN);
        c = y(a);
        for (var d = [], b = c.length, e = b; e--; )
            d[e] = a[c[e]];
        a = z(d);
        d = this.xyTrans(d);
        var g = ["M", d[b - 1][0], d[b - 1][1], "L"];
        m.each(d, function(f, l) {
            g.push(l[0], l[1])
        });
        return {polyPath: g,GFindexs: c,GFpoints: d,GFarea: a}
    };
    var n = function(c, a) {
        return function(d) {
            return (d[1] - c[1]) * (a[0] - c[0]) - (d[0] - c[0]) * (a[1] - c[1])
        }
    }, j = function(c) {
        for (var a = c[0][0], d = 0, b = c.length; b--; )
            if (c[b][0] < a) {
                a = c[b][0];
                d = b
            }
        return d
    }, i = function(c, a, d) {
        for (var b = c.length, e = a + 1; e < a + b; e++) {
            var g = e % b;
            if (g != d) {
                for (var f = n(c[a], c[g]), l = f(c[(e + 1) % 
                b]), h = 1, o = e + 2; o < e + 2 + b; o++)
                    if (l * f(c[o % b]) < 0) {
                        h = 0;
                        break
                    }
                if (h)
                    return g
            }
        }
        return -1
    }, p = function(c, a) {
        return Math.sqrt((a[0] - c[0]) * (a[0] - c[0]) + (a[1] - c[1]) * (a[1] - c[1]))
    }, x = function(c, a, d) {
        return p(d, a) + p(d, c) - p(a, c)
    }, u = function(c, a) {
        for (var d = c.length, b = indexLP = 0, e = minDsLP = 2147483647, g = {}, f = d; f--; )
            g[c[f]] = 1;
        for (f = 0; f < d; f++) {
            var l = a[c[f]], h = a[c[(f + 1) % d]], o = 0;
            minDsLP = 2147483647;
            for (var k = a.length; k--; )
                if (!g[k]) {
                    var v = x(l, h, a[k]);
                    if (v < minDsLP) {
                        minDsLP = v;
                        o = k
                    }
                }
            if (minDsLP < e) {
                e = minDsLP;
                b = f;
                indexLP = o
            }
        }
        return {ds: e,
            gf: b,lp: indexLP}
    }, y = function(c) {
        var a = [], d = prevGF = j(c), b = i(c, d);
        for (a.push(d); b >= 0 && d != b; ) {
            a.push(b);
            var e = i(c, b, prevGF);
            prevGF = b;
            b = e
        }
        for (; a.length < c.length; ) {
            d = u(a, c);
            a.splice(d.gf + 1, 0, d.lp)
        }
        return a
    }, z = function(c) {
        var a = c.slice(), d = [];
        [].push.apply(a, c);
        for (c = c.length; c--; )
            d.push(C(a.slice(c, c + 3)));
        d.sort(function(b, e) {
            return e - b
        });
        return d[1] + d[2]
    }, C = function(c) {
        var a = p(c[0], c[1]), d = p(c[1], c[2]);
        c = p(c[2], c[0]);
        var b = (a + d + c) / 2;
        return Math.sqrt(b * (b - a) * (b - d) * (b - c))
    };
    return m.Intrt = B
})(BID);
