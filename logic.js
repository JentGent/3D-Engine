// Mouse
var mouseIsPressed = false, mouseX = 0, mouseY = 0, pmouseX = 0, pmouseY = 0, clicked = false, pressed = false;
can.onmousedown = function(e) {
    mouseIsPressed = true;
    pressed = true;
}
can.onmouseup = function(e) {
    mouseIsPressed = false;
    clicked = true;
}
can.onmousemove = function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

// Keys
var keys = {};
document.onkeydown = function(e) {
    keys[e.key.toLowerCase()] = true;
}
document.onkeyup = function(e) {
    keys[e.key.toLowerCase()] = false;
}

// Game Logic
tris.length = 0;
tri(v(-100, -100, 100), v(100, -100, 100), v(100, 100, 100), v(0, 0, -1), v(1, 0, 0), v(0, 1, 0), v(0, 0, 1), 100);
tri(v(-100, -100, 100), v(100, -100, 100), v(100, 100, 100), v(0, 0, 1), v(1, 0, 0), v(0, 1, 0), v(0, 0, 1), 100);
tri(v(100, -100, 200), v(100, -100, 100), v(100, 100, 100), v(1, 0, 0), v(1, 0, 0), v(0, 1, 0), v(0, 0, 1), 100);
tri(v(-50, -100, 100), v(100, -100, 200), v(100, 100, 100), 0, v(1, 0, 0), v(0, 1, 0), v(0, 0, 1), 100);
tri(v(-200, -100, -200), v(200, -100, -200), v(200, -100, 200), v(0, 1, 0), v(1, 0, 0), v(0, 1, 0), v(0, 0, 1), 200);
tri(v(-200, -100, -200), v(-200, -100, 200), v(200, -100, 200), v(0, 1, 0), v(1, 0, 0), v(0, 1, 0), v(0, 0, 1), 200);
vertices.length = indices.length = 0;
for(var i = 0; i < tris.length; i += 1) {
    dispTri(tris[i], cam, false);
}
function update() {
    shadow.yaw += 0.5;
    sun = yRotate(-0.5, sun);
    shadow.x = cam.x - sun.x * shadow.depth / 2;
    shadow.y = cam.y - sun.y * shadow.depth / 2;
    shadow.z = cam.z - sun.z * shadow.depth / 2;

    if(mouseIsPressed) {
        yaw -= (mouseX - pmouseX);
        pitch -= (mouseY - pmouseY);
    }
    pitch = constrain(pitch, -90, 90);
    if(keys.a) {
        cam.x -= Math.cos(yaw * D2R);
        cam.z -= Math.sin(yaw * D2R);
    }
    if(keys.d) {
        cam.x += Math.cos(yaw * D2R);
        cam.z += Math.sin(yaw * D2R);
    }
    if(keys.w) {
        cam.x += Math.sin(-yaw * D2R);
        cam.z += Math.cos(-yaw * D2R);
    }
    if(keys.s) {
        cam.x -= Math.sin(-yaw * D2R);
        cam.z -= Math.cos(-yaw * D2R);
    }
    pmouseX = mouseX;
    pmouseY = mouseY;
}

// UI
function drawUI() {

}