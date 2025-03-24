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

import RayTracer from '/lib/Viz/RayTracer.js'
import StandardTextObject from '/lib/DSViz/StandardTextObject.js'
import RayTracingBoxObject from '/lib/DSViz/RayTracingBoxObject.js'
import Camera from '/lib/Viz/3DCamera.js'
import PGA3D from '/lib/Math/PGA3D.js'


async function init() {
  // Create a canvas tag
  const canvasTag = document.createElement('canvas');
  canvasTag.id = "renderCanvas";
  document.body.appendChild(canvasTag);
  // Create a ray tracer
  const tracer = new RayTracer(canvasTag);
  await tracer.init();
  // Create a 3D Camera
  var camera = new Camera();
  // Create an object to trace
  var tracerObj = new RayTracingBoxObject(tracer._device, tracer._canvasFormat, camera);
  await tracer.setTracerObject(tracerObj);
  
  let fps = '??';
  var instrText = new StandardTextObject('Press the following keys toggle each mode: \nADSWQE: Move Camera \nJLKIUO: Rotate Camera \nArrow Keys/12: Move Object \nVBNFHM: Rotate Object \n0: Orthogonal Camera \n9: Projective Camera \n[]: decrease/increase focal length');
  var fpsText = new StandardTextObject('fps: ' + fps);
  instrText.setPosition("bottom");

  var dist = 0.05;
  var rot_angle = 5;
  var focal = 1.0;
  var focal_change = 1.0;;

  
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
      tracer.render();
    }
    requestAnimationFrame(renderFrame);
  };

   //move in X direction
   window.addEventListener("keydown", (a) => {
    switch (a.key) {
//---------- Move Camera
      case 'a': case 'A': // 
        camera.moveX(-dist) 
        tracerObj.updateCameraPose() 
        break;
      case 'd': case 'D': // 
        camera.moveX(dist) 
        tracerObj.updateCameraPose() 
        break;
      case 'w': case 'W': // 
        camera.moveY(-dist) 
        tracerObj.updateCameraPose() 
        break;
        case 's': case 'W': // 
        camera.moveY(dist) 
        tracerObj.updateCameraPose() 
        break;
      case 'q': case 'Q': // 
        camera.moveZ(-dist) 
        tracerObj.updateCameraPose() 
        break;
      case 'e': case 'E': // 
        camera.moveZ(dist) 
        tracerObj.updateCameraPose() 
        break;
//---------- Rotate Camera
      case 'j': case 'J': // 
        camera.rotateY(rot_angle) 
        tracerObj.updateCameraPose() 
        break;
      case 'l': case 'L': // 
        camera.rotateY(-rot_angle) 
        tracerObj.updateCameraPose() 
        break;
      case 'i': case 'i': // 
        camera.rotateX(rot_angle) 
        tracerObj.updateCameraPose() 
        break;
      case 'k': case 'K': // 
        camera.rotateX(-rot_angle) 
        tracerObj.updateCameraPose() 
        break;
      case 'u': case 'U': // 
        camera.rotateZ(rot_angle) 
        tracerObj.updateCameraPose() 
        break;
      case 'o': case 'O': // 
        camera.rotateZ(-rot_angle) 
        tracerObj.updateCameraPose() 
        break;
//---------- Move Object
      case 'ArrowLeft': // 
        tracerObj.moveXObj(-dist) 
        break;
      case 'ArrowRight': // 
        tracerObj.moveXObj(dist) 
        break;
      case 'ArrowUp': // 
        tracerObj.moveYObj(-dist) 
        break;
      case 'ArrowDown': // 
        tracerObj.moveYObj(dist) 
        break;
      case '1': // 
        tracerObj.moveYObj(-dist) 
        break;
      case '2': // 
        tracerObj.moveYObj(dist) 
        break;
//---------- Rotate Object
      case 'v': case 'V': // 
        tracerObj.rotateXObj(rot_angle) 
        break;
      case 'n': case 'N': // 
        tracerObj.rotateXObj(-rot_angle) 
        break;
      case 'g': case 'G': // 
        tracerObj.rotateYObj(rot_angle) 
        break;
      case 'b': case 'B': // 
        tracerObj.rotateYObj(-rot_angle) 
        break;
      case 'f': case 'F': // 
        tracerObj.rotateZObj(rot_angle) 
        break;
      case 'h': case 'H': // 
        tracerObj.rotateZObj(-rot_angle) 
        break;
//---------- Change camera Mode
      case '0': // orthogonal
        camera._isProjective = false;
        break;
      case '9': // orthogonal
        camera._isProjective = true;
        break;
//---------- Change camera focal
      case '[': // decrease
        if (camera._focal[0]>1.0){
          camera._focal[0] -= focal_change;
          camera._focal[1] -= focal_change;
        }
        tracerObj.updateCameraFocal();
        break;

      case ']': // increase
          camera._focal[0] += focal_change;
          camera._focal[1] += focal_change;
        tracerObj.updateCameraFocal();
        break;
    }
  });
 


  lastCalled = Date.now();
  renderFrame();
  setInterval(() => { 
    fpsText.updateText('fps: ' + frameCnt);
    frameCnt = 0;
  }, 1000); // call every 1000 ms
  return tracer;
  
 

}




    init().then( ret => {
      console.log(ret);
    }).catch( error => {
      const pTag = document.createElement('p');
      pTag.innerHTML = navigator.userAgent + "</br>" + error.message;
      document.body.appendChild(pTag);
      document.getElementById("renderCanvas").remove();
    });``