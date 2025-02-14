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
  lsi: f32 //initial ls
  
  
};

// TODO 4: Write the bind group spells here using array<Particle>
// name the binded variables particlesIn and particlesOut

@group(0) @binding(0) var<storage> particlesIn: array<Particle>;
@group(0) @binding(1) var<storage,read_write> particlesOut: array<Particle>;

// //random num generatior - need offset: particle location - use tahat as an offset for random location
// fn rand(offset:32) -> f32(
//   return(fract(sin(time+offset)* _____))
// )

@vertex
fn vertexMain(@builtin(instance_index) idx: u32, @builtin(vertex_index) vIdx: u32) -> @builtin(position) vec4f {
  // TODO 5: Revise the vertex shader to draw circle to visualize the particles

  let particle = particlesIn[idx].p;
  let size = 0.0125 * particlesIn[idx].ls/ 255;
  let pi = 3.14159265;
  let theta = 2. * pi / 8 * f32(vIdx);
  let x = cos(theta) * size;
  let y = sin(theta) * size;
  return vec4f(vec2f(x + particle[0], y + particle[1]), 0, 1);
 
  // return vec4f(0, 0, 0, 1);
}

//can create an interpolation of colors between distances - going vvetween orange yellow and red based on distance
@fragment
fn fragmentMain() -> @location(0) vec4f {
  return vec4f(238.f/255, 118.f/255, 35.f/255, 1); // (R, G, B, A)
}

@compute @workgroup_size(256)
fn computeMain(@builtin(global_invocation_id) global_id: vec3u) {
  // TODO 6: Revise the compute shader to update the particles using the velocity
  let idx = global_id.x;

  

  
  if (idx < arrayLength(&particlesIn)) {
    particlesOut[idx] = particlesIn[idx];
    //$$newPos = oldPos + velocity$$
    particlesOut[idx].p = particlesIn[idx].p + particlesIn[idx].v;

    //reduce the lifespan by 1 and check if it is zero

    if (particlesIn[idx].ls <0) || ((particlesIn[idx].p[0] > 1) || (particlesIn[idx].p[0] < -1)){
       particlesOut[idx].p = particlesIn[idx].ip;
       particlesOut[idx].ls = particlesOut[idx].lsi;
    }
    else {
      particlesOut[idx].ls = particlesIn[idx].ls-1;
    }
   
    
    // TOOD 7: Add boundary checking and respawn the particle when it is offscreen
   

  }
}