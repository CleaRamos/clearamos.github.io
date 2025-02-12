/*!
 * Copyright (c) 2025 SingChun LEE @ Bucknell University. CC BY-NC 4.0.
 * 
 * This code is provided mainly for educational purposes at Bucknell University.
 *
 * This code is licensed under the Creative Commons Attribution-NonCommerical 4.0
 * International License. To view a copy of the license, visit 
 *   https://creativecommons.org/licenses/by-nc/4.0/
 * or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
 *
 * You are free to:
 *  - Share: copy and redistribute the material in any medium or format.
 *  - Adapt: remix, transform, and build upon the material.
 *
 * Under the following terms:
 *  - Attribution: You must give appropriate credit, provide a link to the license,
 *                 and indicate if changes where made.
 *  - NonCommerical: You may not use the material for commerical purposes.
 *  - No additional restrictions: You may not apply legal terms or technological 
 *                                measures that legally restrict others from doing
 *                                anything the license permits.
 */

// Check your browser supports: https://github.com/gpuweb/gpuweb/wiki/Implementation-Status#implementation-status
// Need to enable experimental flags chrome://flags/
// Chrome & Edge 113+ : Enable Vulkan, Default ANGLE Vulkan, Vulkan from ANGLE, Unsafe WebGPU Support, and WebGPU Developer Features (if exsits)
// Firefox Nightly: sudo snap install firefox --channel=latext/edge or download from https://www.mozilla.org/en-US/firefox/channel/desktop/

import Renderer from '/lib/Viz/2DRenderer.js'
import Camera from '/lib/Viz/2DCamera.js'
import CameraLineStrip2DAliveDeadObject from '/lib/DSViz/CameraLineStrip2DAliveDeadObject.js'
import StandardTextObject from '/lib/DSViz/StandardTextObject.js'
import PGA2D from '/lib/Math/PGA2D.js'
import Standard2DPGACameraSceneObject from '/lib/DSViz/Standard2DPGACameraSceneObject.js'

async function init() {
  const size = 256;

  // Create a canvas tag
  const canvasTag = document.createElement('canvas');
  canvasTag.id = "renderCanvas";
  document.body.appendChild(canvasTag);

  // Modify the canvas size
  const devicePixelRatio = window.devicePixelRatio || 1;
  const width = window.innerWidth * devicePixelRatio;
  const height = window.innerHeight * devicePixelRatio;
  canvasTag.width = width;
  canvasTag.height = height;

  // Create a 2d animated renderer
  const renderer = new Renderer(canvasTag);
  await renderer.init();

  var vertices = new Float32Array([
    // x, y
    // -0.5, -0.5,
    // 0.5, -0.5,
    // 0.5, 0.5,

    // -0.5, 0.5,
    // 0.5, 0.5,
    // -0.5, -0.5 // loop back to the first vertex
    -1, -1,
    1, -1,
    1, 1,

    -1, 1,
    1, 1,
    -1, -1 // loop back to the first vertex
  ]);
  const camera = new Camera();
  const grid = new CameraLineStrip2DAliveDeadObject(renderer._device, renderer._canvasFormat, camera._pose, vertices);

  await renderer.appendSceneObject(grid);

  // Add a movable colored quad
  // var pose = new Float32Array([1, 0, 0, 0, 0.025, 0.025]);
  // var quadVertices = new Float32Array([
  //   // x, y, r, g, b, a
  //   -1, -1, 1, 0, 0, 1,
  //   1, -1, 0, 1, 0, 1,
  //   -1, 1, 0, 0, 1, 1,
  //   1, 1, 1, 0, 1, 1,
  //   -1, 1, 0, 0, 1, 1,
  //   1, -1, 0, 1, 0, 1
  // ]);

  // const quad = new Standard2DPGACameraSceneObject(renderer._device, renderer._canvasFormat, camera._pose, quadVertices, pose);
  // await renderer.appendSceneObject(quad);


  let fps = '??';
  var fpsText = new StandardTextObject('fps: ' + fps);
  var instrText = new StandardTextObject('zoom in: q/Q \nzoom out:z/Z \nmove: AWSD \npause:p/P');
  instrText.setPosition("bottom");
  // var zoomIn = new StandardTextObject('zoom In: q/Q');

  // keyboard interaction
  var movespeed = 0.05;
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W':
        camera.moveUp(movespeed);
        grid.updateCameraPose();
        quad.updateCameraPose();
        break;
      case 'ArrowDown': case 's': case 'S':
        camera.moveDown(movespeed);
        grid.updateCameraPose();
        quad.updateCameraPose();
        break;
      case 'ArrowLeft': case 'a': case 'A':
        camera.moveLeft(movespeed);
        grid.updateCameraPose();
        quad.updateCameraPose();
        break;
      case 'ArrowRight': case 'd': case 'D':
        camera.moveRight(movespeed);
        grid.updateCameraPose();
        quad.updateCameraPose();
        break;
      case 'q': case 'Q':
        camera.zoomIn();
        grid.updateCameraPose();
        quad.updateCameraPose();
        break;
      case 'e': case 'E':
        camera.zoomOut();
        grid.updateCameraPose();
        quad.updateCameraPose();
        break;
      case 'f': case 'F': fpsText.toggleVisibility(); break;
      case 'p': case 'P': grid.updatePausedState(); break;
    }
  });
  // mouse interactions
  let isDragging = false;
  let oldP = [0, 0];
  canvasTag.addEventListener('mousedown', (e) => {

    var mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    var mouseY = (-e.clientY / window.innerHeight) * 2 + 1;
    mouseX /= camera._pose[4]; //translating normal coordinate - reverse camera pose getting back to camera coordinate
    mouseY /= camera._pose[5];
    let p = PGA2D.applyMotorToPoint([mouseX, mouseY], [camera._pose[0], camera._pose[1], camera._pose[2], camera._pose[3]]);
    //this would just be a shallow coppy - only want to set the old value to the value of p, not the object --> just get a deep copy of the value

    //finds the mouse position
    let halfLength = 1; // half cell length
    let cellLength = halfLength; // full cell length
    let u = Math.floor((p[0] + halfLength) / cellLength * size) - size / 2;
    let v = Math.floor((p[1] + halfLength) / cellLength * size) - size / 2;
    //checking what cell your mouse is closest to
    //treat mouse as an offwet -  and 
    //console.log(`TEST (${u}, ${v})`);

    if (u >= 0 && u < size && v >= 0 && v < size) {
      console.log(`clicks TEST: (${u}, ${v})`);

      let offsetX = - halfLength + u / size * cellLength + cellLength / size * 0.5;
      let offsetY = - halfLength + v / size * cellLength + cellLength / size * 0.5;
      // if (-0.5 / size + offsetX <= p[0] && p[0] <= 0.5 / size + offsetX && -0.5 / size + offsetY <= p[1] && p[1] <= 0.5 / size + offsetY) {
      //   //console.log(`in cell (${u}, ${v})`);
      // }

      //get the cell based on coordinate
      let idx = u % size + v * size; // we are expecting 10x10, so modulo gridSize to get the x index


    }

    oldP = [...p];
    p[0] /= pose[4];
    p[1] /= pose[5];
    //constantly updating pose
    let sp = PGA2D.applyMotorToPoint(p, PGA2D.reverse([pose[0], pose[1], pose[2], pose[3]]));
    if (-1 <= sp[0] && sp[0] <= 1 && -1 <= sp[1] && sp[1] <= 1) {
      isDragging = true;
    }



  });

  //dirty effect to improve efficiency - every time update - copy from CPU to GPU
  //save efficiency here
  //how smooth for it to update when youa re moving an object with a mouse
  //only set when you really need t update
  canvasTag.addEventListener('mousemove', (e) => {
    var mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    var mouseY = (-e.clientY / window.innerHeight) * 2 + 1;
    mouseX /= camera._pose[4];
    mouseY /= camera._pose[5];
    let p = PGA2D.applyMotorToPoint([mouseX, mouseY], [camera._pose[0], camera._pose[1], camera._pose[2], camera._pose[3]]);
    //compute the closest uV - determinate if mouse is in UC - compute the closest one
    let halfLength = 1; // half cell length
    let cellLength = halfLength; // full cell length
    let u = Math.floor((p[0] + halfLength) / cellLength * size) - size / 2;
    let v = Math.floor((p[1] + halfLength) / cellLength * size) - size / 2;
    //checking what cell your mouse is closest to
    //treat mouse as an offwet -  and 
    // console.log(`in cell TEsT (${u}, ${v})`);
    if (u >= 0 && u < size && v >= 0 && v < size) {
      console.log(`in cell TEsT (${u}, ${v})`);

      let offsetX = - halfLength + u / size * cellLength + cellLength / size * 0.5;
      let offsetY = - halfLength + v / size * cellLength + cellLength / size * 0.5;
      //IDK what this does ^^^already gets acurate ish poisition
      // if (-0.5 / size + offsetX <= p[0] && p[0] <= 0.5 / size + offsetX && -0.5 / size + offsetY <= p[1] && p[1] <= 0.5 / size + offsetY) {
      //   console.log(`in cell (${u}, ${v})`);
      // }
    }
    if (isDragging) {
      let diff = Math.sqrt(Math.pow(p[0] - oldP[0], 2) + Math.pow(p[1] - oldP[1], 2));
      if (diff > 0.001) { // a dirty flag spell
        let dt = PGA2D.createTranslator((p[0] - oldP[0]) / pose[4], (p[1] - oldP[1]) / pose[5]); // compute changes in the model space
        let newmotor = PGA2D.normaliozeMotor(PGA2D.geometricProduct(dt, [pose[0], pose[1], pose[2], pose[3]]));
        pose[0] = newmotor[0];
        pose[1] = newmotor[1];
        pose[2] = newmotor[2];
        pose[3] = newmotor[3];
        quad.updateGeometry();
        oldP = p;
      }
    }
  });
  canvasTag.addEventListener('mouseup', (e) => {
    isDragging = false;
  });
  // run animation at 60 fps
  var frameCnt = 0;
  var tgtFPS = 60;
  var secPerFrame = 1. / tgtFPS;
  var frameInterval = secPerFrame * 1000;
  var lastCalled;
  let renderFrame = () => {
    let elapsed = Date.now() - lastCalled;
    if (elapsed > frameInterval) {
      ++frameCnt;
      lastCalled = Date.now() - (elapsed % frameInterval);
      renderer.render();
    }
    requestAnimationFrame(renderFrame);
  };
  lastCalled = Date.now();
  renderFrame();
  setInterval(() => {
    fpsText.updateText('fps: ' + frameCnt);
    frameCnt = 0;
  }, 1000); // call every 1000 ms
  return renderer;
}

init().then(ret => {
  console.log(ret);
}).catch(error => {
  const pTag = document.createElement('p');
  pTag.innerHTML = navigator.userAgent + "</br>" + error.message;
  document.body.appendChild(pTag);
  document.getElementById("renderCanvas").remove();
});