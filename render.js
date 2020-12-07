// Programs
var sky = new oc.Program(ih("sky.vsh"), ih("sky.fsh"));
var skyDelag = new oc.Program(ih("sky-delag.vsh"), ih("sky-delag.fsh"));
var color = new oc.Program(ih("color.vsh"), ih("color.fsh"));
var colorDelag = new oc.Program(ih("color-delag.vsh"), ih("color-delag.fsh"));
var shadowMap = new oc.Program(ih("shadows.vsh"), ih("shadows.fsh"));
var normalMap = new oc.Program(ih("normals.vsh"), ih("normals.fsh"));
oc.universalUniform("shadowDimensions", "3fv", [shadow.width, shadow.height, shadow.depth]);
oc.universalUniform("ambient", "4fv", [0.8, 0.9, 1, 0.2]);

// Set up buffers and textures for programs that render to textures
var shadowFramebuffer = gl.createFramebuffer();
var shadowDepthBuffer = gl.createRenderbuffer();
var shadowTexture = color.injectTexture("shadowMap", 1, shadow.width, shadow.height, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR);
var normalFramebuffer = gl.createFramebuffer();
var normalDepthBuffer = gl.createRenderbuffer();
var normalTexture = color.injectTexture("normalMap", 2, c.width, c.height, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR);
var skyFramebuffer = gl.createFramebuffer();
var skyTexture = color.injectTexture("skyTexture", 3, c.width, c.height, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR);
var skyDelagFramebuffer = gl.createFramebuffer();
var skyDelagTexture = colorDelag.injectTexture("skyDelagTexture", 4, c.width, c.height, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR);

// Set up vertex buffers and attributes
var bpe = new Float32Array(0).BYTES_PER_ELEMENT;
oc.setupBuffer(oc.ARRAY_BUFFER, new Float32Array(vertices), oc.STATIC_DRAW);
oc.setupBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), oc.STATIC_DRAW);
color.setAttribute("vertPos", 3, oc.FLOAT, false, 13 * bpe, 0);
color.setAttribute("vertCol", 3, oc.FLOAT, false, 13 * bpe, 3 * bpe);
color.setAttribute("vertNor", 3, oc.FLOAT, false, 13 * bpe, 6 * bpe);
color.setAttribute("faceNor", 3, oc.FLOAT, false, 13 * bpe, 9 * bpe);
color.setAttribute("vertSpec", 1, oc.FLOAT, false, 13 * bpe, 12 * bpe);
shadowMap.setAttribute("vertPos", 3, oc.FLOAT, false, 13 * bpe, 0);
shadowMap.setAttribute("vertCol", 3, oc.FLOAT, false, 13 * bpe, 3 * bpe);
shadowMap.setAttribute("vertNor", 3, oc.FLOAT, false, 13 * bpe, 6 * bpe);
shadowMap.setAttribute("faceNor", 3, oc.FLOAT, false, 13 * bpe, 9 * bpe);
shadowMap.setAttribute("vertSpec", 1, oc.FLOAT, false, 13 * bpe, 12 * bpe);
normalMap.setAttribute("vertPos", 3, oc.FLOAT, false, 13 * bpe, 0);
normalMap.setAttribute("vertCol", 3, oc.FLOAT, false, 13 * bpe, 3 * bpe);
normalMap.setAttribute("vertNor", 3, oc.FLOAT, false, 13 * bpe, 6 * bpe);
normalMap.setAttribute("faceNor", 3, oc.FLOAT, false, 13 * bpe, 9 * bpe);
normalMap.setAttribute("vertSpec", 1, oc.FLOAT, false, 13 * bpe, 12 * bpe);
colorDelag.setAttribute("vertPos", 3, oc.FLOAT, false, 13 * bpe, 0);
colorDelag.setAttribute("vertCol", 3, oc.FLOAT, false, 13 * bpe, 3 * bpe);
colorDelag.setAttribute("vertNor", 3, oc.FLOAT, false, 13 * bpe, 6 * bpe);
colorDelag.setAttribute("faceNor", 3, oc.FLOAT, false, 13 * bpe, 9 * bpe);

// Draw
var done = false;
function draw() {
    ctx.clearRect(0, 0, 600, 600);
    ctx.fillStyle = "rgb(0, 200, 255)";
    ctx.fillRect(0, 0, 600, 600);
    var view = xRotate(pitch, yRotate(yaw, v(0, 0, 1)));
    
    oc.universalUniform("res", "2fv", [c.width, c.height]);
    oc.universalUniform("delag", "1i", DELAG ? 1 : 0);
    oc.universalUniform("yaw", "1fv", [yaw * D2R]);
    oc.universalUniform("pitch", "1fv", [pitch * D2R]);
    oc.universalUniform("time", "1fv", [frameCount]);
    oc.universalUniform("cam", "3fv", [cam.x, cam.y, cam.z]);
    oc.universalUniform("sun", "3fv", [sun.x, sun.y, sun.z]);
    oc.universalUniform("FOV", "1fv", [FOV]);
    oc.universalUniform("shadowCam", "3fv", [shadow.x, shadow.y, shadow.z]);
    oc.universalUniform("shadowYaw", "1fv", [shadow.yaw * D2R]);
    oc.universalUniform("shadowPitch", "1fv", [shadow.pitch * D2R]);
    oc.universalUniform("fog_min", "1fv", [500]);
    oc.universalUniform("fog_max", "1fv", [600]);

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array([-100 + Math.cos(frameCount * 2 * D2R) * 50]));
    gl.bufferSubData(gl.ARRAY_BUFFER, 13 * 3 * bpe, new Float32Array([-100 + Math.cos(frameCount * 2 * D2R) * 50]));

    if(!DELAG) {
        // oc.use(sky);
        // gl.viewport(0, 0, c.width, c.height);
        // oc.depthTest(false);
        // oc.clearDepth();
        // oc.clearColor();
        // gl.activeTexture(gl.TEXTURE0 + 3);
        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, c.width, c.height, 0, gl.RGBA, gl.UNSIGNED_SHORT_4_4_4_4, null);
        // gl.bindFramebuffer(gl.FRAMEBUFFER, skyFramebuffer);
        // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, skyTexture, 0);
        // sky.fullscreen();
        // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        // sky.fullscreen();
        // ctx.drawImage(c, 0, 0, 600, 600);


        gl.viewport(0, 0, shadow.xRes, shadow.yRes);
        oc.use(shadowMap);
        oc.depthTest(true);
        oc.clearDepth();
        oc.clearColor();
        gl.activeTexture(gl.TEXTURE0 + 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, shadow.xRes, shadow.yRes, 0, gl.RGBA, gl.UNSIGNED_SHORT_4_4_4_4, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFramebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, shadowTexture, 0);
        gl.bindRenderbuffer(gl.RENDERBUFFER, shadowDepthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, shadow.xRes, shadow.yRes);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, shadowDepthBuffer);
        oc.renderElements(indices.length);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        ctx.drawImage(c, 0, 0, 600, 600);
        gl.viewport(0, 0, c.width, c.height);
        
        
        oc.use(normalMap);
        oc.depthTest(true);
        oc.clearDepth();
        oc.clearColor();
        gl.activeTexture(gl.TEXTURE0 + 2);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, c.width, c.height, 0, gl.RGBA, gl.UNSIGNED_SHORT_4_4_4_4, null);
        gl.viewport(0, 0, c.width, c.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, normalFramebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, normalTexture, 0);
        gl.bindRenderbuffer(gl.RENDERBUFFER, normalDepthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, c.width, c.height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, normalDepthBuffer);
        oc.renderElements(indices.length);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        ctx.drawImage(c, 0, 0, 600, 600);
    
    
        oc.use(color);
        oc.depthTest(true);
        oc.clearDepth();
        oc.clearColor();
        oc.renderElements(indices.length);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    else {
        // oc.use(skyDelag);
        // gl.viewport(0, 0, c.width, c.height);
        // oc.depthTest(false);
        // oc.clearDepth();
        // oc.clearColor();
        // gl.activeTexture(gl.TEXTURE0 + 4);
        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, c.width, c.height, 0, gl.RGBA, gl.UNSIGNED_SHORT_4_4_4_4, null);
        // gl.bindFramebuffer(gl.FRAMEBUFFER, skyFramebuffer);
        // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, skyDelagTexture, 0);
        // skyDelag.fullscreen();
        // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        // skyDelag.fullscreen();
        // ctx.drawImage(c, 0, 0, 600, 600);


        oc.use(colorDelag);
        oc.depthTest(true);
        oc.clearDepth();
        oc.clearColor();
        oc.renderElements(indices.length);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    ctx.drawImage(c, 0, 0, 600, 600);
    done = true;
}