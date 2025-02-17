/* 
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

// TODO 3: Define a struct to store a particle


struct Particle {
  p: vec2f, //p: current particle position
  ip: vec2f, //p: initial particle position
  v: vec2f, //p: velocity 
  ls: f32, //lifespan
  lsi: f32, //initial ls
  vi: vec2f// initial velocity
  
  
  
};

struct VertexOutput {
  @builtin(position) pos: vec4<f32>,
  @location(0) dist: f32,

};




// TODO 4: Write the bind group spells here using array<Particle>
// name the binded variables particlesIn and particlesOut

@group(0) @binding(0) var<storage> particlesIn: array<Particle>;
@group(0) @binding(1) var<storage,read_write> particlesOut: array<Particle>;
@group(0) @binding(2) var inTexture: texture_2d<f32>;
@group(0) @binding(3) var inSampler: sampler;

// //random num generatior - need offset: particle location - use tahat as an offset for random location
// fn rand(offset:32) -> f32(
//   return(fract(sin(time+offset)* _____))
// )

@vertex
fn vertexMain(@builtin(instance_index) idx: u32, @builtin(vertex_index) vIdx: u32) -> VertexOutput {
  // TODO 5: Revise the vertex shader to draw circle to visualize the particles
  let particle = particlesIn[idx].p;
  var dist = length(particle - (-1)) * 1024; // address this for your flame height
  if (dist > 255) {
      dist = 255;
  }

  //let size = 0.0125 * (255 - dist) / 255;
  
  let size = 0.0125 * particlesIn[idx].ls/ 255; //radius
  let pi = 3.14159265;
  let theta = 2. * pi / 8 * f32(vIdx);
  let x = cos(theta) * size;
  let y = sin(theta) * size;
  //return vec4f(vec2f(x + particle[0], y + particle[1]), 0, 1);

  // scale the full screen canvas to the size of the particle
  // let r = size;
  // let xOffset = particle.x;
  // let yOffset= particle.y;

  // var pos = array<vec2f, 6>(
  //   vec2f(-r +xOffset, -r+yOffset), vec2f(r+xOffset, -r+yOffset), vec2f(-r+xOffset, r+yOffset),
  //   vec2f(r+xOffset, -r+yOffset), vec2f(r+xOffset, r+yOffset), vec2f(-r+xOffset, r+yOffset)
  // );

  //   var texCoords = array<vec2f, 6>(
  //   vec2f(xOffset, r+yOffset), vec2f(r+xOffset, r+yOffset), vec2f(xOffset, yOffset),
  //   vec2f(r+xOffset, r+yOffset), vec2f(r+xOffset, yOffset), vec2f(xOffset, yOffset)
  // );
  

  var out: VertexOutput;
  out.pos =vec4f(vec2f(x + particle[0], y + particle[1]), 0.0, 1.0);
  out.dist = out.pos.y;
  return out;
 

}



//can create an interpolation of colors between distances - going vvetween orange yellow and red based on distance
@fragment
fn fragmentMain(@location(0) dist: f32) -> @location(0) vec4f{
  //scale down texture to
  //return textureSample(inTexture, inSampler, texCoords);
  // return vec4f(248.f/255, 24.f/255, 160.f/255, 1); // (R, G, B, A)

 
  let center = vec4f(253./255,207./255,88./255, 1.);
  let mid = vec4f(242./255,125./255,12./255, 1.);
  let edge = vec4f(128./255,9./255,9./255, 1.);
  // dist is between 0 and 255
  if (dist > 0) {
    let t = dist;
      return edge * t + mid * (1 - t);
  }
  else {
    let t = -dist;
      return center * t + mid * (1 - t);
  }
  



}


// @fragment
// fn fragmentMain(@location(0) dist: f32) -> @location(0) vec4f {
//   let center = vec4f(253./255,207./255,88./255, 1.);
//   let mid = vec4f(242./255,125./255,12./255, 1.);
//   let edge = vec4f(128./255,9./255,9./255, 1.);
//   // dist is between 0 and 255
//   if (dist > 128.) {
//   let t = (dist - 128.) / (255. - 128.);
//     return edge * t + mid * (1 - t);
//   }
//   else {
//   let t = (128. - dist) / 128.;
//     return center * t + mid * (1 - t);
//   }
// }

@compute @workgroup_size(256)
fn computeMain(@builtin(global_invocation_id) global_id: vec3u) {
  // TODO 6: Revise the compute shader to update the particles using the velocity
  let idx = global_id.x;
  
  if (idx < arrayLength(&particlesIn)) {

    particlesOut[idx] = particlesIn[idx];

    //$$newPos = oldPos + velocity$$
    particlesOut[idx].p = particlesIn[idx].p + particlesIn[idx].v;

    //new positioning with velociity
    // oldVec = newVec + gravity
    particlesOut[idx].v.y = particlesIn[idx].v.y + (-9.8*(1/6000.0));//
   // particlesOut[idx].v.y = particlesIn[idx].v.y + (-0.5);


    //reduce the lifespan by 1 and check if it is zero
    // if (particlesOut[idx].ls <0) || ((particlesOut[idx].p > 1) || (particlesOut[idx].p < -1)){

       //particlesOut[idx].p = particlesIn[idx].ip; --> regenerate in the same position it started in
       

    //Circular regeneration across canvas
    if (particlesOut[idx].p.x > 1) || (particlesOut[idx].p.x < -1){
      particlesOut[idx].p.x = -particlesIn[idx].p.x;
      particlesOut[idx].ls = particlesOut[idx].lsi;   //lifespan
      particlesOut[idx].v = particlesOut[idx].vi;  //velocity
    
    }
    else if (particlesOut[idx].p.y > 1) || (particlesOut[idx].p.y < -1){
      particlesOut[idx].p.y = -particlesIn[idx].p.y;
      particlesOut[idx].ls = particlesOut[idx].lsi;   //lifespan
      particlesOut[idx].v = particlesOut[idx].vi;  //velocity
    }
    else if (particlesOut[idx].ls <0) { 
      //factory reset particle
      particlesOut[idx].p = particlesIn[idx].ip; //position
      particlesOut[idx].ls = particlesOut[idx].lsi;   //lifespan
      particlesOut[idx].v = particlesOut[idx].vi;  //velocity


    }
    else{ //decrease lifespan
        particlesOut[idx].ls = particlesIn[idx].ls-1;
    }
   
    
    // TOOD 7: Add boundary checking and respawn the particle when it is offscreen
   

  }
}