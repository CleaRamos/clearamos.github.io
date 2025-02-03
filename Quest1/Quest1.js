async function init() {
  // Create a canvas tag
  const canvasTag = document.createElement('canvas');
  canvasTag.id = "renderCanvas"; // Important! This tells which CSS style to use
  // Modify the canvas size
  const devicePixelRatio = window.devicePixelRatio || 1;
  const width = window.innerWidth * devicePixelRatio;
  const height = window.innerHeight * devicePixelRatio;
  canvasTag.width = width;
  canvasTag.height = height;
  // Modify the canvas using CSS
  canvasTag.style.width = `${800}px`;
  canvasTag.style.height = `${500}px`;

  document.body.appendChild(canvasTag);
  // Check if the browser supports WebGPU
  if (!navigator.gpu) {
    throw Error("WebGPU is not supported in this browser.");
  }
  // Get an GPU adapter
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw Error("Couldn't request WebGPU adapter.");
  }
  // Get a GPU device
  const device = await adapter.requestDevice();
  // Get canvas context using webgpu
  const context = canvasTag.getContext("webgpu");
  const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device: device,
    format: canvasFormat,
  });


  // Create a gpu command encoder
  const encoder = device.createCommandEncoder();
  // Use the encoder to begin render pass
  const pass = encoder.beginRenderPass({
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      clearValue: { r: 22/255, g: 137 / 255, b: 186 / 255, a: 1 }, // Bucknell Blue
      loadOp: "clear",
      storeOp: "store",
    }]
  });

  //Rendering Pipelines
  // Vertex shader code
  var vertCode = `
    @vertex // this compute the scene coordinate of each input vertex
    fn vertexMain(@location(0) pos: vec2f) -> @builtin(position) vec4f {
    return vec4f(pos, 0, 1); // (pos, Z, W) = (X, Y, Z, W)
    }
    `;

  // Fragment shader code
  var fragCode = `
    @fragment // this compute the color of each pixel
    fn fragmentMain() -> @location(0) vec4f {
    return vec4f(238.f/255, 17.f/255, 35.f/255, 1); // (R, G, B, A)
    }
    `;
  // Fragment shader code
  var fragCodeBoat = `
    @fragment // this compute the color of each pixel
    fn fragmentMain() -> @location(0) vec4f {
    return vec4f(120.f/255, 99.f/255, 6.f/255, 1); // (R, G, B, A)
    }
    `;

  // Fragment shader code
  var fragCodeWater = `
    @fragment // this compute the color of each pixel
    fn fragmentMain() -> @location(0) vec4f {
    return vec4f(15.f/255, 60.f/255, 133.f/255, 1); // (R, G, B, A)
    }
    `;

  // Fragment shader code
  var fragCodeStar = `
    @fragment // this compute the color of each pixel
    fn fragmentMain() -> @location(0) vec4f {
    return vec4f(255.f/255, 227.f/255, 15.f/255, 1); // (R, G, B, A)
    }
    `;

  // Fragment shader code
  var fragCodeFish = `
    @fragment // this compute the color of each pixel
    fn fragmentMain() -> @location(0) vec4f {
    return vec4f(235.f/255, 90.f/255, 7.f/255, 1); // (R, G, B, A)
    }
    `;


  // Create a triangle sail geometry in CPU
  var vertices = new Float32Array([
    // x, y
    0, 0.5,
    -0.55, -0.2,
    0, -0.2,
  ]);

  var verticesBoat = new Float32Array([
    // x, y
    //Triangles --> Rect for sail 
    0, 0.5,
    0.05, 0.5,
    0, -0.4,

    0.05,-0.4,
    0.05, 0.5,
    0, -0.4,

    //Right triangle Boat

    -0.65, -0.4,
    -0.4, -0.69,
    -0.4, -0.4,

    //Rectable Boat
    -0.4, -0.4,
    -0.4, -0.69,
    0.2, -0.4,

    0.2,-0.69,
    -0.4, -0.69,
    0.2, -0.4,

    //Left triangle Boat
    0.2, -0.4,
    0.2, -0.69,
    0.4, -0.4,

  ]);

  var verticesWater = new Float32Array([
    // x, y
    -1, -0.69,
    -1, -1,
    1, -0.69,

    1, -0.69,
    1,-1,
    -1,-1,

  
        

    // //Star triangles
    // 0,0,
    // 0,0.3,
    // -0.05, 0.1,

    // 0,0,
    // 0,0.3,
    // 0.05, 0.1,

    // //Right upper triangles of star
    // 0,0,
    // 0.05, 0.1,
    // 0.17, 0.1,

    // 0,0,
    // 0.17, 0.1,
    // 0.06, -0.01,

    // //left upper triangles of star
    // 0,0,
    // -0.05, 0.1,
    // -0.17, 0.1,

    // 0,0,
    // -0.17, 0.1,
    // -0.06, -0.01,

    // //left bottom triangles of star
    // -0.06, -0.01,
    // 0,0,
    // -0.1, -0.2,

    // -0.0,-0.1,
    // 0,0,
    // -0.1, -0.2,

    // //right bottom triangles of star
    // 0.06, -0.01,
    // 0,0,
    // 0.1, -0.2,

    // -0.0,-0.1,
    // 0,0,
    // 0.1, -0.2,


    
  ]);

  var verticesStar = new Float32Array([
    // BIG STAR Star triangles
    -0.6, 0.5,
    -0.6, 0.8,
    -0.65, 0.6,

    -0.6, 0.5,
    -0.6, 0.8,
    -0.55, 0.6,

    // Right upper triangles of star
    -0.6, 0.5,
    -0.55, 0.6,
    -0.43, 0.6,

    -0.6, 0.5,
    -0.43, 0.6,
    -0.54, 0.49,

    // Left upper triangles of star
    -0.6, 0.5,
    -0.65, 0.6,
    -0.77, 0.6,

    -0.6, 0.5,
    -0.77, 0.6,
    -0.67, 0.49,

    // Left bottom triangles of star
    -0.67, 0.51,
    -0.6, 0.5,
    -0.7, 0.3,

    -0.6, 0.4,
    -0.6, 0.5,
    -0.7, 0.3,

    // Right bottom triangles of star
    -0.54, 0.49,
    -0.6, 0.5,
    -0.5, 0.3,

    -0.6, 0.4,
    -0.6, 0.5,
    -0.5, 0.3,

    // //SMALL STAR - ORIGINAL
    // // Star triangles
    // 0,0,
    // 0,0.15,
    // -0.025,0.05,

    // 0,0,
    // 0,0.15,
    // 0.025,0.05,

    // // Right upper triangles of star
    // 0,0,
    // 0.025,0.05,
    // 0.085,0.05,

    // 0,0,
    // 0.085,0.05,
    // 0.03,-0.005,

    // // Left upper triangles of star
    // 0,0,
    // -0.025,0.05,
    // -0.085,0.05,

    // 0,0,
    // -0.085,0.05,
    // -0.03,-0.005,

    // // Left bottom triangles of star
    // -0.03,-0.005,
    // 0,0,
    // -0.05,-0.1,

    // 0,0,
    // 0,-0.05,
    // -0.05,-0.1,

    // // Right bottom triangles of star
    // 0.03,-0.005,
    // 0,0,
    // 0.05,-0.1,

    // 0,0,
    // 0,-0.05,
    // 0.05,-0.1,

    // SMALL STAR - centered at 0.5, 0.5
    // Star triangles
    0.5, 0.5,
    0.5, 0.65,
    0.475, 0.55,

    0.5, 0.5,
    0.5, 0.65,
    0.525, 0.55,

    // Right upper triangles of star
    0.5, 0.5,
    0.525, 0.55,
    0.585, 0.55,

    0.5, 0.5,
    0.585, 0.55,
    0.53, 0.495,

    // Left upper triangles of star
    0.5, 0.5,
    0.475, 0.55,
    0.415, 0.55,

    0.5, 0.5,
    0.415, 0.55,
    0.47, 0.495,

    // Left bottom triangles of star
    0.47, 0.495,
    0.5, 0.5,
    0.45, 0.4,

    0.5, 0.45,
    0.5, 0.5,
    0.45, 0.4,

    // Right bottom triangles of star
    0.53, 0.495,
    0.5, 0.5,
    0.55, 0.4,

    0.5, 0.45,
    0.5, 0.5,
    0.55, 0.4,
    
      
    // SMALL STAR
    // Star triangles
    0.7, -0.4,
    0.7, -0.25,
    0.675, -0.35,

    0.7, -0.4,
    0.7, -0.25,
    0.725, -0.35,

    // Right upper triangles of star
    0.7, -0.4,
    0.725, -0.35,
    0.785, -0.35,

    0.7, -0.4,
    0.785, -0.35,
    0.73, -0.405,

    // Left upper triangles of star
    0.7, -0.4,
    0.675, -0.35,
    0.615, -0.35,

    0.7, -0.4,
    0.615, -0.35,
    0.67, -0.405,

    // Left bottom triangles of star
    0.67, -0.405,
    0.7, -0.4,
    0.65, -0.5,

    0.7, -0.45,
    0.7, -0.4,
    0.65, -0.5,

    // Right bottom triangles of star
    0.73, -0.405,
    0.7, -0.4,
    0.75, -0.5,

    0.7, -0.45,
    0.7, -0.4,
    0.75, -0.5,


    // //fish - turning right
    // 0.05,0,
    // 0, 0.06,
    // 0,-0.06,

    // -0.07,0,
    // 0, 0.06,
    // 0.0,-0.06,

    // //tail
    // -0.07,0,
    // -0.1,0.04,
    // -0.1,-0.04,


  ]);




  var verticesFish = new Float32Array([
    //fish
    0.71, -0.8,
    0.66, -0.74,
    0.66, -0.86,

    0.59, -0.8,
    0.66, -0.74,
    0.66, -0.86,

    //tail
    0.59, -0.8,
    0.56, -0.76,
    0.56, -0.84,


    //fish
    -0.3, -0.8,
    -0.25, -0.74,
    -0.25, -0.86,

    -0.18, -0.8,
    -0.25, -0.74,
    -0.25, -0.86,

    //tail
    -0.18, -0.8,
    -0.15, -0.75,
    -0.15, -0.84,


  ]);


  // Create vertex buffer to store the vertices in GPU
  var vertexBuffer = device.createBuffer({
    label: "Vertices",
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });

  // Create vertex buffer to store the vertices in GPU
  var vertexBufferBoat = device.createBuffer({
    label: "Vertices",
    size: verticesBoat.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });

  // Create vertex buffer to store the vertices in GPU
  var vertexBufferWater = device.createBuffer({
    label: "Vertices",
    size: verticesWater.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });

  // Create vertex buffer to store the vertices in GPU
  var vertexBufferStar = device.createBuffer({
    label: "Vertices",
    size: verticesStar.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });

  // Create vertex buffer to store the vertices in GPU
  var vertexBufferFish = device.createBuffer({
    label: "Vertices",
    size: verticesFish.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });

  // Copy from CPU to GPU
  device.queue.writeBuffer(vertexBuffer, 0, vertices);
  device.queue.writeBuffer(vertexBufferBoat, 0, verticesBoat);
  device.queue.writeBuffer(vertexBufferWater, 0, verticesWater);
  device.queue.writeBuffer(vertexBufferStar, 0, verticesStar);
  device.queue.writeBuffer(vertexBufferFish, 0, verticesFish);




  // Defne vertex buffer layout - how the shader should read the buffer
  var vertexBufferLayout = {
    arrayStride: 2 * Float32Array.BYTES_PER_ELEMENT,
    attributes: [{
      format: "float32x2", // 32 bits, each has two coordiantes - byte size of the buffer
      offset: 0,
      shaderLocation: 0, // position in the vertex shader
    }],
  };

  // Defne vertex buffer layout - how the shader should read the buffer
  var vertexBufferLayoutBoat = {
    arrayStride: 2 * Float32Array.BYTES_PER_ELEMENT,
    attributes: [{
      format: "float32x2", // 32 bits, each has two coordiantes - byte size of the buffer
      offset: 0,
      shaderLocation: 0, // position in the vertex shader
    }],
  };

  // Defne vertex buffer layout - how the shader should read the buffer
  var vertexBufferLayoutWater = {
    arrayStride: 2 * Float32Array.BYTES_PER_ELEMENT,
    attributes: [{
      format: "float32x2", // 32 bits, each has two coordiantes - byte size of the buffer
      offset: 0,
      shaderLocation: 0, // position in the vertex shader
    }],
  };

  var vertexBufferLayoutStar = {
    arrayStride: 2 * Float32Array.BYTES_PER_ELEMENT,
    attributes: [{
      format: "float32x2", // 32 bits, each has two coordiantes - byte size of the buffer
      offset: 0,
      shaderLocation: 0, // position in the vertex shader
    }],
  };

  var vertexBufferLayoutFish= {
    arrayStride: 2 * Float32Array.BYTES_PER_ELEMENT,
    attributes: [{
      format: "float32x2", // 32 bits, each has two coordiantes - byte size of the buffer
      offset: 0,
      shaderLocation: 0, // position in the vertex shader
    }],
  };

  // Create shader module - compiling shader mode
  var shaderModule = device.createShaderModule({
    label: "Shader",
    code: vertCode + '\n' + fragCode,
  });

  // Create shader module - compiling shader mode
  var shaderModuleBoat = device.createShaderModule({
    label: "Shader",
    code: vertCode + '\n' + fragCodeBoat,
  });

  var shaderModuleWater = device.createShaderModule({
    label: "Shader",
    code: vertCode + '\n' + fragCodeWater,
  });

  var shaderModuleStar = device.createShaderModule({
    label: "Shader",
    code: vertCode + '\n' + fragCodeStar,
  });

  var shaderModuleFish = device.createShaderModule({
    label: "Shader",
    code: vertCode + '\n' + fragCodeFish,
  });


  var renderPipeline = device.createRenderPipeline({
      label: "Render Pipeline",
      layout: "auto", // we will talk about layout later
      vertex: {
      module: shaderModule,         // the shader module
      entryPoint: "vertexMain",     // where the vertex shader starts
      buffers: [vertexBufferLayout,] // the buffer layout - more about it soon
      },
      fragment: {
      module: shaderModule,         // the shader module
      entryPoint: "fragmentMain",   // where the fragment shader starts
      targets: [{
        format: canvasFormat        // the target canvas format (the output)
      }]
      }
  });

  // Use the module to create a render pipeline - creating the GPU code
  var renderPipelineBoat = device.createRenderPipeline({
      label: "Render Pipeline",
      layout: "auto", // we will talk about layout later
      vertex: {
      module: shaderModuleBoat,         // the shader module
      entryPoint: "vertexMain",     // where the vertex shader starts
      buffers: [vertexBufferLayoutBoat,] // the buffer layout - more about it soon
      },
      fragment: {
      module: shaderModuleBoat,         // the shader module
      entryPoint: "fragmentMain",   // where the fragment shader starts
      targets: [{
        format: canvasFormat        // the target canvas format (the output)
      }]
      }
  });

  // Use the module to create a render pipeline - creating the GPU code
  var renderPipelineWater = device.createRenderPipeline({
    label: "Render Pipeline",
    layout: "auto", // we will talk about layout later
    vertex: {
    module: shaderModuleWater,         // the shader module
    entryPoint: "vertexMain",     // where the vertex shader starts
    buffers: [vertexBufferLayoutWater,] // the buffer layout - more about it soon
    },
    fragment: {
    module: shaderModuleWater,         // the shader module
    entryPoint: "fragmentMain",   // where the fragment shader starts
    targets: [{
      format: canvasFormat        // the target canvas format (the output)
    }]
    }
  });

  // Use the module to create a render pipeline - creating the GPU code
  var renderPipelineStar = device.createRenderPipeline({
    label: "Render Pipeline",
    layout: "auto", // we will talk about layout later
    vertex: {
    module: shaderModuleStar,         // the shader module
    entryPoint: "vertexMain",     // where the vertex shader starts
    buffers: [vertexBufferLayoutStar,] // the buffer layout - more about it soon
    },
    fragment: {
    module: shaderModuleStar,         // the shader module
    entryPoint: "fragmentMain",   // where the fragment shader starts
    targets: [{
      format: canvasFormat        // the target canvas format (the output)
    }]
    }
  });

  // Use the module to create a render pipeline - creating the GPU code
  var renderPipelineFish = device.createRenderPipeline({
    label: "Render Pipeline",
    layout: "auto", // we will talk about layout later
    vertex: {
    module: shaderModuleFish,         // the shader module
    entryPoint: "vertexMain",     // where the vertex shader starts
    buffers: [vertexBufferLayoutFish,] // the buffer layout - more about it soon
    },
    fragment: {
    module: shaderModuleFish,         // the shader module
    entryPoint: "fragmentMain",   // where the fragment shader starts
    targets: [{
      format: canvasFormat        // the target canvas format (the output)
    }]
    }
  });


  // add more render pass to draw the plane
  pass.setPipeline(renderPipeline);      // which render pipeline to use
  pass.setVertexBuffer(0, vertexBuffer); // which vertex buffer is used at location 0
  pass.draw(vertices.length / 2);        // how many vertices to draw

  pass.setPipeline(renderPipelineBoat);      // which render pipeline to use
  pass.setVertexBuffer(0, vertexBufferBoat)
  pass.draw(verticesBoat.length / 2);

  pass.setPipeline(renderPipelineWater);      // which render pipeline to use
  pass.setVertexBuffer(0, vertexBufferWater)
  pass.draw(verticesWater.length / 2);

  pass.setPipeline(renderPipelineStar);      // which render pipeline to use
  pass.setVertexBuffer(0, vertexBufferStar)
  pass.draw(verticesStar.length / 2);

  pass.setPipeline(renderPipelineFish);      // which render pipeline to use
  pass.setVertexBuffer(0, vertexBufferFish)
  pass.draw(verticesFish.length / 2);


  pass.end(); // end the pass
  // Create the command buffer
  const commandBuffer = encoder.finish();
  // Submit to the device to render
  device.queue.submit([commandBuffer]);

  // //-----------------------------------------------
  // //Create a square geometry in CPU
  // var verticesRect1 = new Float32Array([
  //   //x,y
  //   -1, 1,
  //   -0.25, 1,
  //   - 0.25, 0.75,


  // ])
  // var verticesRect2 = new Float32Array([
  //   //x,y
  //   -1, 1,
  //   -0.25, 0.75,
  //   - 1, 0.75,
  // ])

  // var verticesDiamond1 = new Float32Array([
  //   //x,y
  //   0.75, 0.75,
  //   0.5, 0.35,
  //   0.75, 0,
  // ])

  // var verticesDiamond2 = new Float32Array([
  //   //x,y
  //   0.75, 0.75,
  //   1, 0.35,
  //   0.75, 0,
  // ])

  // //Create vertex buffer to store the vertices in GPU
  // var vertexRect1Buffer = device.createBuffer({
  //   label: "Vertices",
  //   size: verticesRect1.byteLength,
  //   usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,

  // })
  // //Create vertex buffer to store the vertices in GPU
  // var vertexRect2Buffer = device.createBuffer({
  //   label: "Vertices",
  //   size: verticesRect2.byteLength,
  //   usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,

  // })

  // var vertexBufferDiamond1 = device.createBuffer({
  //   label: "Vertices",
  //   size: verticesDiamond1.byteLength,
  //   usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,

  // })
  // var vertexBufferDiamond2 = device.createBuffer({
  //   label: "Vertices",
  //   size: verticesDiamond2.byteLength,
  //   usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,

  // })


  // // Copy from CPU to GPU
  // device.queue.writeBuffer(vertexRect1Buffer, 0, verticesRect1);

  // // Copy from CPU to GPU
  // device.queue.writeBuffer(vertexRect2Buffer, 0, verticesRect2);

  // // Copy from CPU to GPU
  // device.queue.writeBuffer(vertexBufferDiamond1, 0, verticesDiamond1);

  // // Copy from CPU to GPU
  // device.queue.writeBuffer(vertexBufferDiamond2, 0, verticesDiamond2);

  // // // Create shader module - compiling shader mode
  // // var shaderModule = device.createShaderModule({
  // //   label: "Shader",
  // //   code: vertCode + '\n' + fragCode,
  // // });

  // // Create shader module - compiling shader mode
  // var shaderModuleRect = device.createShaderModule({
  //   label: "Shader",
  //   code: vertCode + '\n' + fragCodeRect,
  // });

  // // Use the module to create a render pipeline - creating the GPU code
  // var renderPipeline = device.createRenderPipeline({
  //   label: "Render Pipeline",
  //   layout: "auto", // we will talk about layout later
  //   vertex: {
  //     module: shaderModule,         // the shader module
  //     entryPoint: "vertexMain",     // where the vertex shader starts
  //     buffers: [vertexBufferLayout,] // the buffer layout - more about it soon
  //   },
  //   fragment: {
  //     module: shaderModule,         // the shader module
  //     entryPoint: "fragmentMain",   // where the fragment shader starts
  //     targets: [{
  //       format: canvasFormat        // the target canvas format (the output)
  //     }]
  //   }
  // });

  // // Use the module to create a render pipeline - creating the GPU code
  // var renderPipelineRect = device.createRenderPipeline({
  //   label: "Render Pipeline",
  //   layout: "auto", // we will talk about layout later
  //   vertex: {
  //     module: shaderModuleRect,         // the shader module
  //     entryPoint: "vertexMain",     // where the vertex shader starts
  //     buffers: [vertexBufferLayout,] // the buffer layout - more about it soon
  //   },
  //   fragment: {
  //     module: shaderModuleRect,         // the shader module
  //     entryPoint: "fragmentMain",   // where the fragment shader starts
  //     targets: [{
  //       format: canvasFormat        // the target canvas format (the output)
  //     }]
  //   }
  // });





  // add more render pass to draw the plane
  // pass.setPipeline(renderPipeline);      // which render pipeline to use
  // pass.setVertexBuffer(0, vertexBuffer); // which vertex buffer is used at location 0
  // pass.draw(vertices.length / 2);        // how many vertices to draw

  // pass.setPipeline(renderPipelineRect);      // which render pipeline to use
  // pass.setVertexBuffer(0, vertexRect1Buffer)
  // pass.draw(verticesRect1.length / 2);


  // pass.setVertexBuffer(0, vertexRect2Buffer)
  // pass.draw(verticesRect2.length / 2);

  // pass.setVertexBuffer(0, vertexBufferDiamond1)
  // pass.draw(verticesDiamond1.length / 2);


  // pass.setVertexBuffer(0, vertexBufferDiamond2)
  // pass.draw(verticesDiamond2.length / 2);

  // pass.end(); // end the pass
  // // Create the command buffer
  // const commandBuffer = encoder.finish();
  // // Submit to the device to render
  // device.queue.submit([commandBuffer]);

  return context;
}

init().then(ret => {
  console.log(ret);
}).catch(error => {
  // error handling - add a p tag to display the error message
  const pTag = document.createElement('p');
  pTag.innerHTML = navigator.userAgent + "</br>" + error.message;
  document.body.appendChild(pTag);
  // also remove the created canvas tag
  document.getElementById("renderCanvas").remove();
});
