---
layout: full
title: roomscape
permalink: /code/acassel-final/
thumbnail: acassel-thumbnail.png
author: adrienne
---

<script src="../acassel/ammo.js"></script>
<!-- <script src="../acassel/ClothMesh.js"></script> -->
<script deferred type="module">

import * as T from '../acassel/module.js'

let t = 0

// var uniforms = {
//     amplitude: { value: 1.0 },
//     color:     { value: new T.Color( 0xff2200 ) },
//     texture:   { value: new T.TextureLoader().load( "textures/water.jpg" ) }
//   };
//   uniforms.texture.value.wrapS = uniforms.texture.value.wrapT = T.RepeatWrapping;
//   var shaderMaterial = new T.ShaderMaterial( {
//     uniforms: uniforms,
//     vertexShader:document.getElementById( 'vertexshader' ).textContent,
//     fragmentShader: document.getElementById( 'fragmentshader' ).textContent
// });

var renderer = new T.Renderer({
    color: 0xFBD2D7, ground: 0x1F11FF,
    ambient: 0xDDCEE5, light: 0xFBD2D7,
    scattering: 0.4, brightness: 0.6,
    position: { x:0, y:200, z:9000 },
    rotation: { x:0, y:0, z:0 },
    fov:50, near:0.001, far:100000,
    fog: { color:0xFBD2D7, near:1, far:1e4 },
    gl: { logarithmicDepthBuffer:true, antialias:true },
    update: (dt) => update(dt),
    onload: (context, load) => onload(context,load),
    onclick: (object={}) => { }, })

// //make the shapes
// var shapes = [];
// var geometry = new T.CubeGeometry(20, 20, 20);
// var material = new T.MeshNormalMaterial();
//positions the shapes randomly
// for (var i = 0; i < 400; i ++) {
// var mesh = new T.Mesh(geometry, material);
// mesh.position.x = Math.random() * 400 - 200
// mesh.position.y = Math.random() * 400 - 200
// mesh.position.z = Math.random() * 400 - 200

//shapes.push(mesh);


// }
var worldDepth = 1000

// var clay = new Pizzicato.Sound('../acassel/TRAX/clay.wav', function() {
//     // Sound loaded!
//     clay.play();
// });

// var sharps1 = new Pizzicato.Sound('../acassel/TRAX/sharps1.wav',
//   () => sharps1.play())

// var sharps2 = new Pizzicato.Sound('../acassel/TRAX/sharps2.wav',
//   () => sharps2.play())

// var squiggle = new Pizzicato.Sound('../acassel/TRAX/squiggle.wav',
//   () => squiggle.play())

// var chimes = new Pizzicato.Sound('../acassel/TRAX/chimes.wav', function() {
//     chimes.play();
// });

// var airways = new Pizzicato.Sound('../acassel/TRAX/airways.wav', function() {
//     airways.play();
// });

// var dust = new Pizzicato.Sound('../acassel/TRAX/airways.wav', function() {
//     dust.play();
// });

function stopSound () {
    clay.stop();
    sharps1.stop();
    sharps2.stop();
    squiggle.stop();
    chimes.stop();
    dust.stop();

}


// var sound = new T.Pizzicato.({
//     source: 'wave',
//     options: { type: 'sawtooth', frequency: 146.83 }
// });

// var sound2 = new T.Pizzicato.Sound({
//     source: 'wave',
//     options: { type: 'sine', frequency: 246.94 }

// });

//animations
function changeFrequency(n) {
 return Math.sin(n)*700 + 800;
}

function changeFrequencyB(n) {
  return Math.sin(n)*200 + 400
}

function changeFrequencyC(n){
  return Math.sin(n)
}

function changeFrequencyD(n){
  return Math.cos(n)
}

//sound modulation
// var lowPassFilter = new Pizzicato.Effects.LowPassFilter({
//     frequency: 400,
//     peak: 10
//   });
// var distortion = new Pizzicato.Effects.Distortion({
//     gain: 1
// });
// var tremolo = new Pizzicato.Effects.Tremolo({
//     speed: 10,
//     depth: 0.8,
//     mix: 0.8
// });
// var ringModulator = new Pizzicato.Effects.RingModulator({
//     speed: 30,
//     distortion: 1,
//     mix: 0.5
// });

// var stereoPanner = new Pizzicato.Effects.StereoPanner({
//     pan: 0
// });

// sound.addEffect(lowPassFilter);
// sound.addEffect(distortion);
// sound.addEffect(tremolo);
// sound.addEffect(ringModulator);
//sound.play();

// sound2.addEffect(stereoPanner);
//sound2.play();


//primitives

function createShape(geometry, material) {

  let mesh = new T.Mesh(geometry, material)
  mesh.receiveShadows = mesh.castShadows = true
  return mesh
}

let cube = createShape(
  new T.CubeGeometry(50, 50, 50),
  new T.MeshPhongMaterial())

let sphere = createShape(
  new T.SphereGeometry(10, 10, 10),
  new T.MeshBasicMaterial())


let blob = createShape(
  new T.SphereGeometry(60, 60, 60),
  //new T.MeshStandardMaterial({ color:0xFFFFFF, emission: 0xFF00AA }))
  new T.MeshPhongMaterial())
// let other = createShape(new T.PlaneGeometry(2000, 2000, -1, worldDepth-1), )

//mesh.geometry.rotateX(-Math.PI/2)


// for (var i=0, l=blob.geometry.vertices.length; i<l; ++i) //   let v = blob.geometry.vertices[i]
//   v.x += Math.sin(i*0.5)
//   v.y += Math.cos(i*0.5)
//   v.z += Math.sin(i*0.5)
// }
// var materialShader
// var material = new T.MeshNormalMaterial({flatShading: true})
var shader = {
    uniforms: {
      time: {value:0},
      speed: {value:4},
      tDiffuse: {value:null} },

    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      uniform float time, speed;

      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          float theta = sin(time*speed+position.y)/20.0;
          float c = cos(theta);
          float s = sin(theta);
          mat3 m = mat3(c, 0, s, 0, 1, 0, -s, 0, c);
          vec3 transformed = vec3(position)*m;
          mat4 modelView = viewMatrix * modelMatrix;
          mat4 modelViewProjection = projectionMatrix * modelView;
          vNormal = (modelView * vec4(normal.xyz, 0.0)).xyz*m;
          // vec3 vNormal = (modelViewMatrix * vec4(normal.xyz, 0.0)).xyz*m;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
          // gl_Position.xyz = vNormal*m; // HERE BE DRAGONS
          gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      }`,

    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      uniform sampler2D tDiffuse;
      uniform float time, speed;

      vec3 rgb2hsv(vec3 c) {
          vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
          vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
          vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
          float d = q.x - min(q.w, q.y);
          float e = 1.0e-10;
          return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
      }

      vec3 hsv2rgb(vec3 c) {
          vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }


      vec3 packNormalToRGB(const in vec3 normal) {
        return normalize(normal) * 0.5 + 0.5; }

      void main() {
        float opacity = 0.2;
        float saturation = 0.05, hue = 20.6, brightness =0.9;
        float yellowAmount = 0.9;
        vec3 tint = vec3(0.9, 0.5, 0.9);
        vec3 light = vec3(0.5, 0.2, 1.0);
        light = normalize(light);
        float dProd = max(0.0, dot(vNormal, light));
        gl_FragColor = texture2D(tDiffuse,vUv);
        //gl_FragColor = vec4(vNormal,0.25);
        vec3 color = rgb2hsv(packNormalToRGB(vNormal));
        // color.r += cos(time*speed*0.1);
        color = vec3(
          mix(color.r,1.0,hue),
          mix(color.g,1.0,saturation),
          mix(color.b,1.0,brightness));
        color = hsv2rgb(color);
        float avg = mix(color.r, color.g, 0.5);
        float distillR = mix(avg, color.r, yellowAmount);
        float distillG = mix(avg, color.g, yellowAmount);
        float tintAmount = 0.8;
        color.rgb = vec3(distillR, distillG, color.b);
        // color.rgb *= dProd;
        gl_FragColor = vec4(mix(color, tint, tintAmount), opacity);
        // gl_FragColor = vec4(dProd*0.5, dProd, dProd*0.2, 1.0);
      }`
}

var material = new T.ShaderMaterial(shader)

const lawOfCos = (t,a,b) => Math.cos(a)*Math.cos(b)+Math.sin(a)*Math.sin(b)*Math.cos(t)

function update(dt) { t += dt
  changeFrequency(t)
  cube.position.set(0, 0, changeFrequency(t)/5)
  sphere.scale.set(changeFrequencyC(t*50), changeFrequencyC(t*50), changeFrequencyC(t*50))
  sphere.position.set(changeFrequencyC(t)*400,0,changeFrequencyD(t)*200)
  sphere.material.color.setHex(0xFFFF00)
  // lowPassFilter.frequency = changeFrequency(t)
  // distortion.gain = changeFrequency(t)*0.0005
  // tremolo.speed = changeFrequencyC(t)*10
  // ringModulator.speed = changeFrequency(t)
  // stereoPanner.pan = changeFrequencyC(t)
  // cube.geometry.change = changeFrequency(t)*0.05
  //sound2.frequency = changeFrequency(t*50)
  var fixDrift = 1
  if (blob.geometry.vertices[0].y > 60) fixDrift = 1
  else fixDrift = 0
  // if (T.Vector3.Subtract(blob.geometry.vertices[i],blob.position)>200) fixDrift = -fixDrift

  for (var i=0, l=blob.geometry.vertices.length; i<l; ++i) {
    let v = blob.geometry.vertices[i], q = i/l;
    let z = v.z + lawOfCos(t+q, v.x, v.y) - 0.5 * fixDrift
    let y = v.y + lawOfCos(t+q, v.y, v.z) - 0.5 * fixDrift
    let x = v.x + lawOfCos(t+q, v.z, v.x) - 0.5 * fixDrift

    v.set(x,y,z)
    // v.z += Math.cos(v.x)*Math.cos(v.y)+Math.sin(v.x)*Math.sin(v.y)*Math.cos(t+q)
    // v.x += Math.cos(t+q)
    // v.y += Math.sin(t+q)
    shader.uniforms.time.value = performance.now() / 1000
    shader.uniforms.speed.value = 3
  }


  //blob.geometry.vertices.needsUpdate = true
  blob.geometry.needsUpdate = true
  blob.geometry.verticesNeedUpdate = true
  blob.material.needsUpdate = true

  for (var i = 0; i <400; i++){
    let mesh = []
    cube.rotation.x += changeFrequencyB(t)*0.000001;
    cube.rotation.y += 0.00001;
    cube.rotation.z += 0.00001;
    cube.position.x = Math.random() * 400 - 200
    cube.position.y = Math.random() * 400 - 200
    cube.position.z = Math.random() * 400 - 200
    sphere.position.x = Math.random() * 400 - 200
    sphere.position.y = Math.random() * 400 - 200
    sphere.position.z = Math.random() * 400 - 200

    mesh.push(cube)

  }



  //ballCloth.update(dt)
}

// var ballCloth = new T.ClothMesh({})
//     ballCloth.cloth.position.set(100,0,0)
//     renderer.scene.add(ballCloth.cloth)



async function onload(context, load) {
  var path = '../acassel/Models'
  var loader = new T.ModelLoader()
  var soundLoader = new T.SoundsLoader('../acassel/TRAX/')
  var background = await loader.load(`${path}/group2/scene.gltf`, `${path}/room1/scene.gltf`)
  var wildNonsense = background.scene.children[0]
      wildNonsense.scale.set(0.5, 0.5, 0.5)
      wildNonsense.material = material
      wildNonsense.renderOrder = 0
      context.scene.add(wildNonsense)
      T.applyMaterial(wildNonsense, (thing) => {
      //T.applyMaterial(wildNonsense, ({material}) => {
          if (thing.material===undefined) return
          thing.material = material
          thing.material.needsUpdate = true })

  // var background2 = await loader.load(`${path}/spikes-1/scene.gltf`)
  // var wildNonsense2 = background2.scene.children[0]
  //     wildNonsense2.scale.set(0.5, 0.5, 0.5)
  //     wildNonsense2.material = material
  //     wildNonsense2.renderOrder = 0
  //     context.scene.add(wildNonsense2)
  //     T.applyMaterial(wildNonsense2, (thing) => {
  //     //T.applyMaterial(wildNonsense2, ({material}) => {
  //         if (thing.material===undefined) return
          // thing.material = material
  //         thing.material.needsUpdate = true })

  var model = await loader.load(path + '/group2/scene.gltf')
  var object = model.scene.children[0]
      object.scale.set(1, 1, 1)
      object.material = material
      //context.scene.add(object)
      // T.applyMaterial(object, (thing) => {
      //     if (thing.material===undefined) return
      //     // thing.material = new T.MeshPhongMaterial({})
      //     thing.material.needsUpdate = true })

    var model1 = await loader.load(path + '/room1/scene.gltf')
    var object1 = model1.scene.children[0]
        object1.scale.set(1, 1, 1)
        object.material = material
        renderer.scene.add(object1)

    var model2 = await loader.load(path + '/group2/scene.gltf')
    var object2 = model2.scene.children[0]
        object2.scale.set(1, 1, 1)
        renderer.scene.add(object2)

    var title = await loader.load(path + '/words/scene.gltf')
    var object3 = title.scene.children[0]
        object3.scale.set(1, 1, 1)
        object3.position.set(-30,200, 7000)
        renderer.scene.add(object3)

    // var scroll = await loader.load(path + '/scroll/scene.gltf')
    // var words = title.scene.children[0]
    //     words.scale.set(1, 1, 1)
    //     words.position.set(0, 300, 7000)
    //     renderer.scene.add(words)

  context.scene.add(cube)
  context.scene.add(sphere)
  context.scene.add(blob)

  let clayFile = await soundLoader.load('clay.wav')
  let clay = new T.PositionalAudio(context.listener)
      clay.setBuffer(clayFile)
      clay.setRefDistance(20)
      clay.setLoop(true)
      clay.play()
      context.listener.add(clay)
      context.add(clay)
      clay.position.set(0, 0, 0)


  let chimesFile = await soundLoader.load('chimes.wav')
  let chimes = new T.PositionalAudio(context.listener)
      chimes.setBuffer(chimesFile)
      chimes.setRefDistance(100)
      chimes.setLoop(true)
      chimes.play()
      context.add(chimes)

  let squiggleFile = await soundLoader.load('squiggle.wav')
  let squiggle = new T.PositionalAudio(context.listener)
      squiggle.setBuffer(squiggleFile)
      squiggle.setRefDistance(100)
      squiggle.setLoop(true)
      //squiggle.play()
      context.add(squiggle)

  let dustFile = await soundLoader.load('dust.wav')
  let dust = new T.PositionalAudio(context.listener)
      dust.setBuffer(dustFile)
      dust.setRefDistance(100)
      dust.setLoop(true)
      //dust.play()
      context.add(dust)

}

//sawtoothWave.play();
//sound.play();
//sound.play(10);
// function soundPlayer() {
//   sound.play();
// }

function keyListener(event) {
  switch (event.keyCode) {
    case 32: stopSound(); break // spacebar
    case 74 + 32: clay.play(), renderer.scene.add(sphere); break // J
    case 75: renderer.scene.add(mesh); break // K
    case 75 + 32: renderer.scene.remove(mesh); break // k
  }
}

// var counter = 0;
// // 100 iterations
// var increase = Math.PI * 2 / 100;
// var x, y;

// for ( i = 0; i <= 1; i += 0.01 ) {
//   x = i;
//   y = Math.sin( counter ) / 2 + 0.5;
//   counter += increase;
// }

// console.log(x, y);

document.addEventListener ('keypress', keyListener);

// let object = null
// let sphere = new T.Mesh(new T.BoxGeometry( 1, 1, 1 ), new T.MeshNormalMaterial())

// function update (time) {
// 	object.position.set(0,0,0)
// 	sphere.position.set(0,0,0)
// }

// async function onload (context) {
//   	var modelLoader = new T.ModelLoader()
//   	object = await modelLoader.load('../acassel/Models/spikyball.obj')
//   	console.log(object.children[0]);
//   	context.add(object.children[0]);
//   	console.log(`sphere: ${sphere}, position: ${context.camera.position.y}`)
//   	context.scene.add(sphere)
// }

///////ADD SYNCHOPATED HIGH HATS

  </script>
  </body>
</html>



