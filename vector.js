// Vector
function vec(x, y, z) {
    this.x = x || 0;
    this.y = !y && y !== 0 ? x : y;
    this.z = !z && z !== 0 ? x : z;
}
vec.prototype.ineg = function() {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
    return this;
}
vec.prototype.neg = function() {
    return new vec(-this.x, -this.y, -this.z);
}
vec.prototype.iadd = function(v2) {
    if(1 * v2 === v2) {
        this.x += v2;
        this.y += v2;
        this.z += v2;
        return;
    }
    this.x += v2.x;
    this.y += v2.y;
    this.z += v2.z;
    return this;
}
vec.prototype.add = function(v2) {
    if(1 * v2 === v2) {
        return new vec(this.x + v2, this.y + v2, this.z + v2);
    }
    return new vec(this.x + v2.x, this.y + v2.y, this.z + v2.z);
}
vec.prototype.isub = function(v2) {
    if(1 * v2 === v2) {
        this.x -= v2;
        this.y -= v2;
        this.z -= v2;
        return;
    }
    this.x -= v2.x;
    this.y -= v2.y;
    this.z -= v2.z;
    return this;
}
vec.prototype.sub = function(v2) {
    if(1 * v2 === v2) {
        return new vec(this.x - v2, this.y - v2, this.z - v2);
    }
    return new vec(this.x - v2.x, this.y - v2.y, this.z - v2.z);
}
vec.prototype.idiv = function(v2) {
    if(1 * v2 === v2) {
        this.x /= v2;
        this.y /= v2;
        this.z /= v2;
        return;
    }
    this.x /= v2.x;
    this.y /= v2.y;
    this.z /= v2.z;
    return this;
}
vec.prototype.div = function(v2) {
    if(1 * v2 === v2) {
        return new vec(this.x / v2, this.y / v2, this.z / v2);
    }
    return new vec(this.x / v2.x, this.y / v2.y, this.z / v2.z);
}
vec.prototype.imult = function(v2) {
    if(1 * v2 === v2) {
        this.x *= v2;
        this.y *= v2;
        this.z *= v2;
        return;
    }
    this.x *= v2.x;
    this.y *= v2.y;
    this.z *= v2.z;
    return this;
}
vec.prototype.mult = function(v2) {
    if(1 * v2 === v2) {
        return new vec(this.x * v2, this.y * v2, this.z * v2);
    }
    return new vec(this.x * v2.x, this.y * v2.y, this.z * v2.z);
}
vec.prototype.dot = function(v2) {
    return this.x * v2.x + this.y * v2.y + this.z * v2.z;
}
vec.prototype.cross = function(v2) {
    return new vec(this.y * v2.z - this.z * v2.y, this.z * v2.x - this.x * v2.z, this.x * v2.y - this.y * v2.x);
}
vec.prototype.mag = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
}
vec.prototype.inormalize = function() {
    this.idiv(this.mag());
    return this;
}
vec.prototype.normalize = function() {
    return this.div(this.mag());
}
function v(x, y, z) {
    return new vec(x, y, z);
}
