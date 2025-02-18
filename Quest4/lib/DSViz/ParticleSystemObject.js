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

import SceneObject from '/lib/DSViz/SceneObject.js'

export default class ParticleSystemObject extends SceneObject {
  constructor(device, canvasFormat, numParticles = 4096, img) {
    super(device, canvasFormat);
    this._numParticles = numParticles;
    this._step = 0;
    this._img = new Image();
    this._img.src = img;
  }

  async createGeometry() {
    await this._img.decode();
    this._bitmap = await createImageBitmap(this._img);
    // Create texture buffer to store the texture in GPU
    this._texture = this._device.createTexture({
      label: "Texture " + this.getName(),
      size: [this._bitmap.width, this._bitmap.height, 1],
      format: "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    });
    // Copy from CPU to GPU
    this._device.queue.copyExternalImageToTexture({ source: this._bitmap }, { texture: this._texture }, [this._bitmap.width, this._bitmap.height]);
    // Create the texture sampler
    this._sampler = this._device.createSampler({
      magFilter: "linear",
      minFilter: "linear"
    });

    await this.createParticleGeometry();

  }

  async createParticleGeometry() {
    // Create particles
    this._particles = new Float32Array(this._numParticles * 6); // [x, y, ix, iy, vx, vy]
    // TODO 1 - create ping-pong buffers to store and update the particles in GPU
    // name the ping-pong buffers _particleBuffers
    console.log("HERE");
    //I THINK ITS THIS FUNCTION THATS INCORRECT
    this._particleBuffers = [
      this._device.createBuffer({
        label: "Particle Pose 1" + this.getName(),
        size: this._particles.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      }),
      this._device.createBuffer({
        label: "Particle Pose 2 " + this.getName(),
        size: this._particles.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      })

    ];
    console.log("HERE2");

    //TODO:ADD A BUFFER FOR TIMING??

    // Copy from CPU to GPU
    this._device.queue.writeBuffer(this._particleBuffers[0], 0, this._particles);
    // Set a step counter
    this._step = 0;


    console.log("HERE2.1");
    // calling the resetParticles function to reset the particle buffers
    this.resetParticles();
  }

  resetParticles() {
    let numAttrs = 10;

    for (let i = 0; i < this._numParticles; ++i) {
      let randLifespan = Math.random() * (255); //in frames
      // random position between [-1, 1] x [-1, 1]
      this._particles[numAttrs * i + 0] = (Math.random() * 2 - 1); // [-1, 1] 
      this._particles[numAttrs * i + 1] = (Math.random() * 2 - 1);
      // store the initial positions
      this._particles[numAttrs * i + 2] = this._particles[numAttrs * i + 0];
      this._particles[numAttrs * i + 3] = this._particles[numAttrs * i + 1];

      // TODO 6: update the velocity
      this._particles[numAttrs * i + 4] = 0.000;
      // this._particles[numAttrs * i + 5] = 0.000;
      // this._particles[numAttrs * i + 4] = Math.random() * (0.05) - 0.025;
      // this._particles[numAttrs * i + 5] = Math.random() * (0.05) - 0.025;
      this._particles[numAttrs * i + 4] = Math.random() * (0.025) - 0.0125;
      this._particles[numAttrs * i + 5] = Math.random() * (0.025) - 0.0125;


      this._particles[numAttrs * i + 6] = randLifespan; 0
      this._particles[numAttrs * i + 7] = randLifespan;

      this._particles[numAttrs * i + 8] = this._particles[numAttrs * i + 4]
      this._particles[numAttrs * i + 9] = this._particles[numAttrs * i + 5]




    }
    // Copy from CPU to GPU
    this._step = 0;
    this._device.queue.writeBuffer(this._particleBuffers[this._step % 2], 0, this._particles);


  }

  updateGeometry() { }

  async createShaders() {
    let shaderCode = await this.loadShader("/shaders/particles.wgsl");
    this._shaderModule = this._device.createShaderModule({
      label: "Particles Shader " + this.getName(),
      code: shaderCode,
    });
    console.log("HERE2.5");
    // TODO 2 - Create the bind group layout for using the ping-pong buffers in the GPU
    // name the bind group layout _bindGroupLayout
    //do we need 3 bindings?????????????????
    // Create the bind group layout
    this._bindGroupLayout = this._device.createBindGroupLayout({
      label: "Grid Bind Group Layout " + this.getName(),
      entries: [{
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: "storage" } // output
      }, {
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
        buffer: { type: "read-only-storage" } // input read only
      }, {
        binding: 2,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {}
      }, {
        binding: 3,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: {}
      }



      ]
    });





    console.log("HERE3");


    // create the pipeline layout using the bind group layout
    this._pipelineLayout = this._device.createPipelineLayout({
      label: "Particles Pipeline Layout",
      bindGroupLayouts: [this._bindGroupLayout],
    });
  }

  async createRenderPipeline() {
    await this.createParticlePipeline();
    console.log("HERE4");
  }



  async createParticlePipeline() {
    this._particlePipeline = this._device.createRenderPipeline({
      label: "Particles Render Pipeline " + this.getName(),
      layout: this._pipelineLayout,
      vertex: {
        module: this._shaderModule,
        entryPoint: "vertexMain",
      },
      // fragment: {
      //   module: this._shaderModule,
      //   entryPoint: "fragmentMain",
      //   targets: [{
      //     format: this._canvasFormat
      //   }]
      // },
      fragment: {
        module: this._shaderModule,
        entryPoint: "fragmentMain",
        targets: [{
          format: this._canvasFormat,
          blend: {
            color: {
              srcFactor: 'one',
              dstFactor: 'one-minus-src-alpha',
              operator: 'add',
            },
            alpha: {
              srcFactor: 'one',
              dstFactor: 'one-minus-src-alpha',
              operator: 'add',
            },
          },
        }]
      },
      // primitives: {
      //   typology: 'line-strip'
      // }
    });
    console.log("HERE5");
    // Create bind group to bind the particle buffers - ping pong
    this._bindGroups = [
      this._device.createBindGroup({
        layout: this._particlePipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: { buffer: this._particleBuffers[0] }
          },
          {
            binding: 1,
            resource: { buffer: this._particleBuffers[1] }
          },
          {
            binding: 2,
            resource: this._texture.createView(),
          },
          {
            binding: 3,
            resource: this._sampler,
          }
        ],
      }),
      this._device.createBindGroup({
        layout: this._particlePipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: { buffer: this._particleBuffers[1] }
          },
          {
            binding: 1,
            resource: { buffer: this._particleBuffers[0] }
          },
          {
            binding: 2,
            resource: this._texture.createView(),
          },
          {
            binding: 3,
            resource: this._sampler,
          }
        ],
      })
    ];
    console.log("HERE6");
  }

  render(pass) {
    pass.setPipeline(this._particlePipeline);
    pass.setBindGroup(0, this._bindGroups[this._step % 2]);
    pass.draw(128, this._numParticles);
  }

  async createComputePipeline() {
    this._computePipeline = this._device.createComputePipeline({
      label: "Particles Compute Pipeline " + this.getName(),
      layout: this._pipelineLayout,
      compute: {
        module: this._shaderModule,
        entryPoint: "computeMain",
      }
    });
  }

  compute(pass) {
    //TODO: write hte current time to the time buffer - pass in a time, physial time 
    //this._device.queue.writeBuffer(this.timeBuffer,0, newFloat32Array({performance.now()/1000}));

    pass.setPipeline(this._computePipeline);
    pass.setBindGroup(0, this._bindGroups[this._step % 2]);
    pass.dispatchWorkgroups(Math.ceil(this._numParticles / 256));
    ++this._step
  }
}