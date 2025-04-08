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
import PolygonObject from '/lib/DSViz/PolygonObject.js'
import Polygon from '/lib/DS/Polygon.js'
import StandardTextObject from '/lib/DSViz/StandardTextObject.js'

async function init() {
  // Create a canvas tag
  const canvasTag = document.createElement('canvas');
  canvasTag.id = "renderCanvas";
  document.body.appendChild(canvasTag);
  // Create a 2d animated renderer
  const renderer = new Renderer(canvasTag);
  await renderer.init();
  const polygon = new PolygonObject(renderer._device, renderer._canvasFormat, '/assets/box.polygon');
 

  window.addEventListener("keydown", async(q) => {

    switch(q.key){
      //change between shapes
      case 'q':
        await renderer.removeSceneObject(polygon);
        polygon._polygon= new Polygon('/assets/circle.box');
        await polygon.createGeometry();
        await renderer.appendSceneObject(polygon);
        break;
      case 'w':
        await renderer.removeSceneObject(polygon);
        polygon._polygon= new Polygon('/assets/circle.polygon');
        await polygon.createGeometry();
        await renderer.appendSceneObject(polygon);
        break;
      case 'e':
        await renderer.removeSceneObject(polygon);
        polygon._polygon= new Polygon('/assets/star.polygon');
        await polygon.createGeometry();
        await renderer.appendSceneObject(polygon);
        break;
      case 'r':
        await renderer.removeSceneObject(polygon);
        polygon._polygon= new Polygon('/assets/human.polygon');
        await polygon.createGeometry();
        await renderer.appendSceneObject(polygon);
        break;
      case 't':
        await renderer.removeSceneObject(polygon);
        polygon._polygon= new Polygon('/assets/dense.polygon');
        await polygon.createGeometry();
        await renderer.appendSceneObject(polygon);
        break;
     
    }
  });


  await renderer.appendSceneObject(polygon);

  let fps = '??';
  var fpsText = new StandardTextObject('fps: ' + fps);

  // console.log("polygon vertices:")
  // console.log(polygon._vertices.length)
  // var num_vertices = polygon._vertices.length
 
  var instrText = new StandardTextObject('Press the following keys toggle each mode: \nq: box \nw: circle \ne: star \nr: human \nt: dense');
  instrText.setPosition("bottom");

  var collision_type = "signed triangle area test";
  var collision_type_text= new StandardTextObject(collision_type);
  collision_type_text.setPosition("left");
  //change the mode of collision detection

  window.addEventListener("keydown", async(a) => {
    switch(a.key){
      //change between shapes
      case 'a':
        collision_type = "winding number";
        break;
      case 's':
        collision_type = "signed triangle area test";
        break;
      }
  });
  


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

  var mouseX = 0;
  var mouseY = 0;

  var out_in = "outside polygon";
  var out_in_text = new StandardTextObject(out_in);
  out_in_text.setPosition("right");

  


  // TODO: implemnt the mousemove functio to track the mouse position
  canvasTag.addEventListener('mousemove', (e) => {

      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (-e.clientY / window.innerHeight) * 2 + 1;
      console.log(`mouse position (${mouseX}, ${mouseY})`);

      
  
    // TODO: iterate through the vertices of the polygon - want to check each verticeiesof the polygon with the  isInside funciton

    if (collision_type == "signed triangle area test"){
      console.log("signed triangle area test")
      var insideAll = true;
      for (let i = 0; i < polygon._vertices.length-2; i+=2) {
        // console.log(polygon._polygon.isInside([polygon[0], polygon[1]], [polygon[2], polygon[3]], [mouseX, mouseY]));
        
        if (!(polygon._polygon.isInside([polygon._vertices[i], polygon._vertices[i+1]], [polygon._vertices[i+2], polygon._vertices[i+3]], [mouseX, mouseY]))){
          insideAll = false;
          break;
        }
      }

      if (insideAll == true) {
        out_in = "inside polygon"
        console.log("inside polygon")
      } else {
        out_in = "outside polygon"
        console.log("outside polygon")
      }
      out_in_text.updateText(out_in);


    }
    else if (collision_type == "winding number"){
      console.log("winding number")
      // TODO: implment winding number function for non-convex polygons
      // given a point p
      var p = [mouseX, mouseY]
      //pick direction want to check - x direction
      //initialize two winding numbers to 0s
      var windingPos =0;
      var windingNeg =0;

      // for each edge of polygon
      // console.log(polygon._vertices.length)
      for (let i = 0; i< polygon._vertices.length -1; i+=2){
        // get the two vertices of the edge
        var v0 = [polygon._vertices[i], polygon._vertices[i+1]];
        var v1 = [polygon._vertices[i+2], polygon._vertices[i+3]];

        //Check if a point drawn horizontally from p intersects the edge (v0, v1)
        if (mouseY > Math.min(v0[1], v1[1]) && mouseY < Math.max(v0[1], v1[1])) {
          // check if p is to the left of the edge (v0, v1)
          if (mouseX > Math.min(v0[0], v1[0])) {
            windingPos += 1;
          } else {
            windingNeg += 1;
          }
        }

      }
      
      if (windingPos ==0 || windingNeg ==0) {
        out_in = "outside polygon"
        console.log("outside polygon")
      }
      else {
        out_in = " inside polygon"
        console.log(" inside polygon")
      }

  }

  out_in_text.updateText(out_in);
  collision_type_text.updateText(collision_type);
    
  });

  

  




  lastCalled = Date.now();
  renderFrame();
  setInterval(() => { 
    fpsText.updateText('fps: ' + frameCnt);
    frameCnt = 0;
  }, 1000); // call every 1000 ms
  return renderer;



}

init().then( ret => {
  console.log(ret);
}).catch( error => {
  const pTag = document.createElement('p');
  pTag.innerHTML = navigator.userAgent + "</br>" + error.message;
  document.body.appendChild(pTag);
  document.getElementById("renderCanvas").remove();
});