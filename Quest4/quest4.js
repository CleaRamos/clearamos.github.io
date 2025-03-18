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
import ParticleSystemObject from '/lib/DSViz/ParticleSystemObject.js'
import StandardTextObject from '/lib/DSViz/StandardTextObject.js'



async function init() {
  // Create a canvas tag
  const canvasTag = document.createElement('canvas');
  canvasTag.id = "renderCanvas";
  document.body.appendChild(canvasTag);



  // Create a 2d animated renderer
  const renderer = new Renderer(canvasTag);
  await renderer.init();

  //THIS IS FINE
  const particles = new ParticleSystemObject(renderer._device, renderer._canvasFormat, 75000, 1, "./assets/thisIsFine.jpg");
  await renderer.appendSceneObject(particles);

  //ELMO
  const particles02 = new ParticleSystemObject(renderer._device, renderer._canvasFormat, 75000, 1, "./assets/elmoFire.jpeg");
  //await renderer.appendSceneObject(particles02);

  //FIRE COLOR LINEAR INTERPOLATION
  const particles03 = new ParticleSystemObject(renderer._device, renderer._canvasFormat, 20000, 2, "./assets/elmoFire.jpeg");
 

  //FIRE COLOR NON INTERPOLATION
  const particles04 = new ParticleSystemObject(renderer._device, renderer._canvasFormat, 20000, 3, "./assets/elmoFire.jpeg");
  


  //TODO: have multiple settings to switch between interpolation and other settings
  //make a new particle system object and make a new fragment and vertex shader with the appropriate things called 



  //gets this is Fine to appear and disapear with the push of "E"
  window.addEventListener("keydown", (f) => {
    switch (f.key) {
      case 'ArrowUp': case 'f': case 'F': // want to switch the renderer
        // renderer.removeSceneObject(particles);
        renderer.appendSceneObject(particles);

        break;
    }
  });


  //gets elmo to appear and disapear with the push of "E"
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case 'ArrowUp': case 'e': case 'E': // want to switch the renderer
        renderer.appendSceneObject(particles02);

        break;
    }
  });

   //switch mode from the picture to non linearlyy colored particles based on position
   window.addEventListener("keydown", (r) => {
    switch (r.key) {
      case 'ArrowUp': case 'r': case 'R': // want to switch the renderer
        renderer.appendSceneObject(particles03);

        break;
    }
  });

  //switch mode from the picture to LIEARLY interpolated colored particles based on position
  window.addEventListener("keydown", (i) => {
    switch (i.key) {
      case 'ArrowUp': case 'i': case 'I': // want to switch the renderer
        renderer.appendSceneObject(particles04);

        break;
    }
  });

  let fps = '??';
  var fpsText = new StandardTextObject('fps: ' + fps);
  var instrText = new StandardTextObject('Press the following keys toggle each mode: \nf/F: This is Fine \ne/E: Elmo \nr/R: Non-linear colored waterfall \ni/I: linearly colored waterfall');
  instrText.setPosition("bottom");

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