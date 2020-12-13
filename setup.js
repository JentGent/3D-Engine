// Setup
var oc = OCGL;
var c = create("canvas");
c.width = 300;
c.height = 300;
oc.applyGL(c);
var gl = oc.gl;
var can = create("canvas");
can.width = 600;
can.height = 600;
can.setAttribute("id", "display");
can.setAttribute("oncontextmenu", "return false");
var ctx = can.getContext("2d");
document.body.appendChild(can);
var frameCount = 0;
gl.viewport(0, 0, c.width, c.height);

// Constants
var D2R = Math.PI/180;
var FPS = 60;
var CLIP_START = 0.1;

// Globals
var tris = [],
    vertices = [],
    indices = [];
var cam = v(0, 0, 0),
    yaw = 0,
    pitch = 0;
var shadow = {
    x: -20, y: 20, z: 20,
    yaw: 0 + 180, pitch: -50,
    width: 700, height: 700, depth: 600,
    xRes: 700, yRes: 700
};
var sun = v(-1, 0, 0);
sun = zRotate(-shadow.pitch, sun);
sun = yRotate(-shadow.yaw + 90, sun);
var FOV = 1;

// Triangle
function threePointNormal(v1, v2, v3, neg) {
    var n = v2.sub(v1).cross(v3.sub(v2));
    return neg ? n.ineg() : n;
}
function tri(v1, v2, v3, fn, n, n2, n3, c1, c2, c3, spec) {
    if(!c2) {
        return tri(v1, v2, v3, fn, fn, fn, fn, n, n2, n3, c1);
    }
    tris.push({
        v1: v1,
        v2: v2,
        v3: v3,
        get normal() {
            return (fn === -1 ? threePointNormal(this.v1, this.v2, this.v3, true) : (fn || threePointNormal(this.v1, this.v2, this.v3)));
        },
        get normal1() {
            return (n === -1 ? threePointNormal(this.v1, this.v2, this.v3, true) : (n || threePointNormal(this.v1, this.v2, this.v3)));
        },
        get normal2() {
            return (n2 === -1 ? threePointNormal(this.v1, this.v2, this.v3, true) : (n2 || threePointNormal(this.v1, this.v2, this.v3)));
        },
        get normal3() {
            return (n3 === -1 ? threePointNormal(this.v1, this.v2, this.v3, true) : (n3 || threePointNormal(this.v1, this.v2, this.v3)));
        },
        c1: c1,
        c2: c2,
        c3: c3,
        spec: spec
    });
}
function glVert(p, c, n, fn, spec) {
    indices.push(vertices.length / 13);
    vertices.push(p.x, p.y, p.z);
    vertices.push(c.x, c.y, c.z);
    vertices.push(n.x, n.y, n.z);
    vertices.push(fn.x, fn.y, fn.z);
    vertices.push(spec);
};
function glTri(v1, v2, v3, n, n2, n3, fn, c1, c2, c3, spec) {
    glVert(v1, c1, n, fn, spec);
    glVert(v2, c2, n2, fn, spec);
    glVert(v3, c3, n3, fn, spec);
};
function dispTri(t, c, ortho) {
    glTri(t.v1, t.v2, t.v3, t.normal1, t.normal2, t.normal3, t.normal, t.c1, t.c2, t.c3, t.spec);
}

// Cylinder
function cylinder(x, y, z, r, h, R, G, B, s, q) {
    q = q || 10;
    var inc = Math.PI * 2 / q;
    for(var i = 0; i < Math.PI * 2; i += inc) {
        var c0 = Math.cos(i - inc) * r, s0 = Math.sin(i - inc) * r;
        var c1 = Math.cos(i) * r, s1 = Math.sin(i) * r;
        var c2 = Math.cos(i + inc) * r, s2 = Math.sin(i + inc) * r;
        var c3 = Math.cos(i + inc * 2) * r, s3 = Math.sin(i + inc * 2) * r;
        var o1 = v(x + c0, y + h / 2, z + s0),
            o2 = v(x + c0, y - h / 2, z + s0),
            p1 = v(x + c1, y + h / 2, z + s1),
            p2 = v(x + c1, y - h / 2, z + s1),
            q1 = v(x + c2, y + h / 2, z + s2),
            q2 = v(x + c2, y - h / 2, z + s2),
            r1 = v(x + c3, y + h / 2, z + s3),
            r2 = v(x + c3, y - h / 2, z + s3);
        var n1 = threePointNormal(p1, q1, q2).add(threePointNormal(o1, p1, p2)),
            n2 = threePointNormal(p1, q1, q2).add(threePointNormal(q1, r1, r2));
        tri(
            p1,
            q1,
            q2,
            0, n1, n2, n2,
            v(R, G, B),
            v(R, G, B),
            v(R, G, B),
            s
        );
        tri(
            p1,
            p2,
            q2,
            -1, n1, n1, n2,
            v(R, G, B),
            v(R, G, B),
            v(R, G, B),
            s
        );
        tri(
            p1, q1, v(x, y + h / 2, z),
            v(0, 1, 0),
            v(R, G, B),
            v(R, G, B),
            v(R, G, B),
            s
        );
        tri(
            p2, q2, v(x, y - h / 2, z),
            v(0, -1, 0),
            v(1, 1, 0),
            v(1, 1, 0),
            v(1, 1, 0),
            s
        );
    }
}

// Ellipsoid
var ellipsoid = (function() {
    function getVertex(vs, ex, ey, ez, w, h, d, x, y, z) {
        var D = Math.hypot(x, y, z);
        x /= D;
        y /= D;
        z /= D;
        x *= w / 2;
        y *= h / 2;
        z *= d / 2;
        x += ex;
        y += ey;
        z += ez;
        var p = vs.indexOf(x + "," + y + "," + z);
        if(p < 0) {
            p = vs.length;
            vs.push(x + "," + y + "," + z);
        }
        return p;
    }
    function genVertex(vs, p) {
        var bruh = vs[p].split(",");
        return v(bruh[0], bruh[1], bruh[2]);
    }
    return function(x, y, z, w, h, d, R, G, B, s, q) {
        var vs = [];
        var fs = [];
        for(var i = -q / 2; i < q / 2; i += 1) {
            for(var j = -q / 2; j < q / 2; j += 1) {
                var p1 = getVertex(vs, x, y, z, w, h, d, i, j, -q / 2);
                var p2 = getVertex(vs, x, y, z, w, h, d, i + 1, j, -q / 2);
                var p3 = getVertex(vs, x, y, z, w, h, d, i + 1, j + 1, -q / 2);
                var p4 = getVertex(vs, x, y, z, w, h, d, i, j + 1, -q / 2);
                fs.push([p1, p3, p2]);
                fs.push([p1, p4, p3]);
                var p1 = getVertex(vs, x, y, z, w, h, d, i, j, q / 2);
                var p2 = getVertex(vs, x, y, z, w, h, d, i + 1, j, q / 2);
                var p3 = getVertex(vs, x, y, z, w, h, d, i + 1, j + 1, q / 2);
                var p4 = getVertex(vs, x, y, z, w, h, d, i, j + 1, q / 2);
                fs.push([p1, p2, p3]);
                fs.push([p1, p3, p4]);
            }
        }
        for(var i = -q / 2; i < q / 2; i += 1) {
            for(var j = -q / 2; j < q / 2; j += 1) {
                var p1 = getVertex(vs, x, y, z, w, h, d, -q / 2, j, i);
                var p2 = getVertex(vs, x, y, z, w, h, d, -q / 2, j, i + 1);
                var p3 = getVertex(vs, x, y, z, w, h, d, -q / 2, j + 1, i + 1);
                var p4 = getVertex(vs, x, y, z, w, h, d, -q / 2, j + 1, i);
                fs.push([p1, p2, p3]);
                fs.push([p1, p3, p4]);
                var p1 = getVertex(vs, x, y, z, w, h, d, q / 2, j, i);
                var p2 = getVertex(vs, x, y, z, w, h, d, q / 2, j, i + 1);
                var p3 = getVertex(vs, x, y, z, w, h, d, q / 2, j + 1, i + 1);
                var p4 = getVertex(vs, x, y, z, w, h, d, q / 2, j + 1, i);
                fs.push([p1, p3, p2]);
                fs.push([p1, p4, p3]);
            }
        }
        for(var i = -q / 2; i < q / 2; i += 1) {
            for(var j = -q / 2; j < q / 2; j += 1) {
                var p1 = getVertex(vs, x, y, z, w, h, d, j, -q / 2, i);
                var p2 = getVertex(vs, x, y, z, w, h, d, j, -q / 2, i + 1);
                var p3 = getVertex(vs, x, y, z, w, h, d, j + 1, -q / 2, i + 1);
                var p4 = getVertex(vs, x, y, z, w, h, d, j + 1, -q / 2, i);
                fs.push([p1, p3, p2]);
                fs.push([p1, p4, p3]);
                var p1 = getVertex(vs, x, y, z, w, h, d, j, q / 2, i);
                var p2 = getVertex(vs, x, y, z, w, h, d, j, q / 2, i + 1);
                var p3 = getVertex(vs, x, y, z, w, h, d, j + 1, q / 2, i + 1);
                var p4 = getVertex(vs, x, y, z, w, h, d, j + 1, q / 2, i);
                fs.push([p1, p2, p3]);
                fs.push([p1, p3, p4]);
            }
        }
        for(var i = 0; i < fs.length; i += 1) {
            var f1 = fs[i];
            var v1 = genVertex(vs, f1[0]),
                v2 = genVertex(vs, f1[1]),
                v3 = genVertex(vs, f1[2]);
            var n1 = threePointNormal(v1, v2, v3),
                n2 = threePointNormal(v1, v2, v3),
                n3 = threePointNormal(v1, v2, v3);
            for(var j = 0; j < fs.length; j += 1) {
                var f2 = fs[j];
                if(j === i) {
                    continue;
                }
                if(f1[0] === f2[0] || f1[0] === f2[1] || f1[0] === f2[2]) {
                    n1.iadd(threePointNormal(genVertex(vs, f2[0]), genVertex(vs, f2[1]), genVertex(vs, f2[2])));
                }
                if(f1[1] === f2[0] || f1[1] === f2[1] || f1[1] === f2[2]) {
                    n2.iadd(threePointNormal(genVertex(vs, f2[0]), genVertex(vs, f2[1]), genVertex(vs, f2[2])));
                }
                if(f1[2] === f2[0] || f1[2] === f2[1] || f1[2] === f2[2]) {
                    n3.iadd(threePointNormal(genVertex(vs, f2[0]), genVertex(vs, f2[1]), genVertex(vs, f2[2])));
                }
            }
            tri(
                v1, v2, v3,
                0, n1, n2, n3,
                v(R, G, B), v(R, G, B), v(R, G, B),
                s
            )
        }
    };
})();
