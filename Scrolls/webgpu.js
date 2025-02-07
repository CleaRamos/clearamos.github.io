// const _0x527e21=_0x5c61;function _0x427b(){const _0x44f2d9=['13515880GroUAi','appendChild','5760525cUohpx','getElementById','writeBuffer','requestDevice','submit','WebGPU\x20is\x20not\x20supported\x20in\x20this\x20browser.','gpu','length','createView','configure','canvas','finish','renderCanvas','Couldn\x27t\x20request\x20WebGPU\x20adapter.','queue','createRenderPipeline','end','6pDtDLU','Vertices','message','clear','userAgent','3250356HIMZlt','createBuffer','requestAdapter','Render\x20Pipeline','8894081mmJQba','getPreferredCanvasFormat','26441WzImRN','\x0a\x20\x20\x20\x20@fragment\x20//\x20this\x20compute\x20the\x20color\x20of\x20each\x20pixel\x0a\x20\x20\x20\x20fn\x20fragmentMain()\x20->\x20@location(0)\x20vec4f\x20{\x0a\x20\x20\x20\x20return\x20vec4f(238.f/255,\x20118.f/255,\x2035.f/255,\x201);\x20//\x20(R,\x20G,\x20B,\x20A)\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20','getContext','webgpu','setVertexBuffer','innerHTML','body','761816HqtJxD','BYTES_PER_ELEMENT','</br>','vertexMain','beginRenderPass','95346TWwkWh','VERTEX','auto','24TZuJzR','Shader','\x0a\x20\x20\x20\x20@vertex\x20//\x20this\x20compute\x20the\x20scene\x20coordinate\x20of\x20each\x20input\x20vertex\x0a\x20\x20\x20\x20fn\x20vertexMain(@location(0)\x20pos:\x20vec2f)\x20->\x20@builtin(position)\x20vec4f\x20{\x0a\x20\x20\x20\x20return\x20vec4f(pos,\x200,\x201);\x20//\x20(pos,\x20Z,\x20W)\x20=\x20(X,\x20Y,\x20Z,\x20W)\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20','float32x2','createElement','then','1384qTuECq'];_0x427b=function(){return _0x44f2d9;};return _0x427b();}(function(_0xa14571,_0x823df9){const _0x3bd309=_0x5c61,_0x501cde=_0xa14571();while(!![]){try{const _0x38e5df=-parseInt(_0x3bd309(0x1f4))/0x1*(-parseInt(_0x3bd309(0x1e9))/0x2)+-parseInt(_0x3bd309(0x203))/0x3*(parseInt(_0x3bd309(0x1fb))/0x4)+parseInt(_0x3bd309(0x20c))/0x5+-parseInt(_0x3bd309(0x1ee))/0x6+parseInt(_0x3bd309(0x1f2))/0x7+parseInt(_0x3bd309(0x209))/0x8*(parseInt(_0x3bd309(0x200))/0x9)+-parseInt(_0x3bd309(0x20a))/0xa;if(_0x38e5df===_0x823df9)break;else _0x501cde['push'](_0x501cde['shift']());}catch(_0x4a90f4){_0x501cde['push'](_0x501cde['shift']());}}}(_0x427b,0xe0143));async function _0x21f84c(){const _0x56cb03=_0x5c61,_0x55ddb9=document['createElement'](_0x56cb03(0x1e2));_0x55ddb9['id']=_0x56cb03(0x1e4),document[_0x56cb03(0x1fa)][_0x56cb03(0x20b)](_0x55ddb9);if(!navigator[_0x56cb03(0x212)])throw Error(_0x56cb03(0x211));const _0x346378=await navigator[_0x56cb03(0x212)][_0x56cb03(0x1f0)]();if(!_0x346378)throw Error(_0x56cb03(0x1e5));const _0xd4a8c2=await _0x346378[_0x56cb03(0x20f)](),_0x4320ac=_0x55ddb9[_0x56cb03(0x1f6)](_0x56cb03(0x1f7)),_0x3c750e=navigator[_0x56cb03(0x212)][_0x56cb03(0x1f3)]();_0x4320ac[_0x56cb03(0x215)]({'device':_0xd4a8c2,'format':_0x3c750e});const _0x31c446=_0xd4a8c2['createCommandEncoder'](),_0x6985f2=_0x31c446[_0x56cb03(0x1ff)]({'colorAttachments':[{'view':_0x4320ac['getCurrentTexture']()[_0x56cb03(0x214)](),'clearValue':{'r':0x0,'g':0x38/0xff,'b':0x65/0xff,'a':0x1},'loadOp':_0x56cb03(0x1ec),'storeOp':'store'}]});var _0x30ada6=_0x56cb03(0x205),_0x2b8714=_0x56cb03(0x1f5),_0x3b23e0=new Float32Array([0x0,0.5,-0.5,0x0,0.5,0x0]),_0x471784=_0xd4a8c2[_0x56cb03(0x1ef)]({'label':_0x56cb03(0x1ea),'size':_0x3b23e0['byteLength'],'usage':GPUBufferUsage[_0x56cb03(0x201)]|GPUBufferUsage['COPY_DST']});_0xd4a8c2[_0x56cb03(0x1e6)][_0x56cb03(0x20e)](_0x471784,0x0,_0x3b23e0);var _0x868ea0={'arrayStride':0x2*Float32Array[_0x56cb03(0x1fc)],'attributes':[{'format':_0x56cb03(0x206),'offset':0x0,'shaderLocation':0x0}]},_0x3940d2=_0xd4a8c2['createShaderModule']({'label':_0x56cb03(0x204),'code':_0x30ada6+'\x0a'+_0x2b8714}),_0x58c1b9=_0xd4a8c2[_0x56cb03(0x1e7)]({'label':_0x56cb03(0x1f1),'layout':_0x56cb03(0x202),'vertex':{'module':_0x3940d2,'entryPoint':_0x56cb03(0x1fe),'buffers':[_0x868ea0]},'fragment':{'module':_0x3940d2,'entryPoint':'fragmentMain','targets':[{'format':_0x3c750e}]}});_0x6985f2['setPipeline'](_0x58c1b9),_0x6985f2[_0x56cb03(0x1f8)](0x0,_0x471784),_0x6985f2['draw'](_0x3b23e0[_0x56cb03(0x213)]/0x2),_0x6985f2[_0x56cb03(0x1e8)]();const _0x398bfd=_0x31c446[_0x56cb03(0x1e3)]();return _0xd4a8c2[_0x56cb03(0x1e6)][_0x56cb03(0x210)]([_0x398bfd]),_0x4320ac;}function _0x5c61(_0x291fb6,_0x2f30b7){const _0x427bc7=_0x427b();return _0x5c61=function(_0x5c6136,_0x275aa1){_0x5c6136=_0x5c6136-0x1e2;let _0x23b9ac=_0x427bc7[_0x5c6136];return _0x23b9ac;},_0x5c61(_0x291fb6,_0x2f30b7);}_0x21f84c()[_0x527e21(0x208)](_0x141367=>{console['log'](_0x141367);})['catch'](_0x124c33=>{const _0x3a0a09=_0x527e21,_0x5a0d86=document[_0x3a0a09(0x207)]('p');_0x5a0d86[_0x3a0a09(0x1f9)]=navigator[_0x3a0a09(0x1ed)]+_0x3a0a09(0x1fd)+_0x124c33[_0x3a0a09(0x1eb)],document[_0x3a0a09(0x1fa)][_0x3a0a09(0x20b)](_0x5a0d86),document[_0x3a0a09(0x20d)](_0x3a0a09(0x1e4))['remove']();});

async function init() {
    // Create a canvas tag - uses GPU to display output
    const canvasTag = document.createElement('canvas');
    canvasTag.id = "renderCanvas"; // Important! This tells which CSS style to use
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
            clearValue: { r: 0, g: 56 / 255, b: 101 / 255, a: 1 }, // Bucknell Blue
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
    return vec4f(238.f/255, 118.f/255, 35.f/255, 1); // (R, G, B, A)
    }
    `;

    // Create a triangle geometry in CPU
    var vertices = new Float32Array([
        // x, y
        0, 0.5,
        -0.5, 0,
        0.5,  0,
    ]);

    // Create vertex buffer to store the vertices in GPU
    var vertexBuffer = device.createBuffer({
        label: "Vertices",
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    // Copy from CPU to GPU
    device.queue.writeBuffer(vertexBuffer, 0, vertices);


    // Defne vertex buffer layout - how the shader should read the buffer
    var vertexBufferLayout = {
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
    // Use the module to create a render pipeline - creating the GPU code
    var renderPipeline = device.createRenderPipeline({
        label: "Render Pipeline",
        layout: "auto", // we will talk about layout later
        vertex: {
        module: shaderModule,         // the shader module
        entryPoint: "vertexMain",     // where the vertex shader starts
        buffers: [vertexBufferLayout] // the buffer layout - more about it soon
        },
        fragment: {
        module: shaderModule,         // the shader module
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

    //Modify the canvas size
    // const devicePixelRatio = window.devicePixelRatio || 1;
    // const width = window.innerWidth * devicePixelRatio;
    // const height = window.innerHeight * devicePixelRatio;
    // canvasTag.width = width;
    // canvasTag.height = height;


    pass.end(); // end the pass
    // Create the command buffer
    const commandBuffer = encoder.finish();
    // Submit to the device to render
    device.queue.submit([commandBuffer]);


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
