function yRotate(theta, p) {
    var x = p.x, y = p.y, z = p.z;
    var s = Math.sin(theta * D2R);
    var c = Math.cos(theta * D2R);
    return v(x * c + z * s, y, z * c - x * s);
}
function zRotate(theta, p) {
    var x = p.x, y = p.y, z = p.z;
    var s = Math.sin(theta * D2R);
    var c = Math.cos(theta * D2R);
    return v(x * c - y * s, y * c + x * s, z);
}
function xRotate(theta, p) {
    var x = p.x, y = p.y, z = p.z;
    var s = Math.sin(theta * D2R);
    var c = Math.cos(theta * D2R);
    return v(x, y * c - z * s, z * c + y * s);
}
