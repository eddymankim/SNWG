---
# layout: null
title: sound
# permalink: /code/acassel-10/
author: adrienne
---

This is a primary sketchup of figuring out how to attach sound parameters from Pizzicato.js to shape parameters in T.js. I used distortion, a low pass filter, tremolo, a ring modulator, and a stero panner to generate some sounds and made some primitives that I could change accordingly. The key functions are J and K to start, lowercase j and k to stop.

<script deferred type="module">

import * as T from '../acassel/module.js'

var uniforms = {
    amplitude: { value: 1.0 },
    color:     { value: new T.Color( 0xff2200 ) },
    texture:   { value: new T.TextureLoader().load( "textures/water.jpg" ) }
  };
  uniforms.texture.value.wrapS = uniforms.texture.value.wrapT = T.RepeatWrapping;
  var shaderMaterial = new T.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader:document.getElementById( 'vertexshader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentshader' ).textContent
  });

var renderer = new T.Renderer({
    color: 0xFBD2D7, ground: 0x1F11FF,
    ambient: 0x111111, light: 0xFBD2D7,
    position: { x:0, y:200, z:500 },
    rotation: { x:0, y:0, z:0 },
    fov:50, near:0.001, far:100000,
    fog: { color:0xccccee, near:1, far:10000 },
    gl: { logarithmicDepthBuffer:true, antialias:true },
    update: (time=0.01) => { },
    onload: (manager, load=()=>{}) => { },
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
var clay = new Pizzicato.Sound('../acassel/TRAX/clay.wav', function() {
    // Sound loaded!
    clay.play();
});

var sharps1 = new Pizzicato.Sound('../acassel/TRAX/sharps1.wav', function() {
    // Sound loaded!
    sharps1.play();
});

var sharps2 = new Pizzicato.Sound('../acassel/TRAX/sharps2.wav', function() {
    // Sound loaded!
    sharps2.play();
});

var squiggle = new Pizzicato.Sound('../acassel/TRAX/squiggle.wav', function() {
    // Sound loaded!
    squiggle.play();
});

var chimes = new Pizzicato.Sound('../acassel/TRAX/chimes.wav', function() {
    // Sound loaded!
    chimes.play();
});

var airways = new Pizzicato.Sound('../acassel/TRAX/airways.wav', function() {
    // Sound loaded!
    airways.play();
});

var dust = new Pizzicato.Sound('../acassel/TRAX/airways.wav', function() {
    // Sound loaded!
    dust.play();
});

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

let t = -0.5

//primitives
var geometry = new T.CubeGeometry(50, 50, 50);
var material = new T.MeshPhongMaterial();
var mesh = new T.Mesh(geometry, material);
//scene.add(mesh);

var geometry2 = new T.SphereGeometry(20, 20, 20);
var material2 = new T.MeshBasicMaterial();
var sphere = new T.Mesh(geometry2, material2);
//scene.add(sphere);

var geometry3 = new T.SphereGeometry(60, 60, 60);
var material3 = new T.MeshBasicMaterial();
var blob = new T.Mesh(geometry3, material3);
blob.position.set(0, 0, 0)

renderer.scene.add(blob);

var geometry4 = new T.PlaneGeometry(2000, 2000, worldWidth - 1, worldDepth - 1);
geometry.rotateX( - Math.PI / 2);

for (var i = 0, l = geometry.vertices.length; i < l; i ++) {
  geometry.vertices[i].y = 35 * Math.sin (i / 2);
}

function render() {
  changeFrequency(t);
  t += clock.getDelta();
  mesh.position.set(0, 0, changeFrequency(t)/5);
  sphere.scale.set (changeFrequencyC(t*50), changeFrequencyC(t*50), changeFrequencyC(t*50))
  sphere.position.set(changeFrequencyC(t)*400,0,changeFrequencyD(t)*200);
  sphere.material.color.setHex(0xFFFF00)

  requestAnimationFrame(render);
  // controls.update(1);
  // controls.movementSpeed = 20;

  // lowPassFilter.frequency = changeFrequency(t)
  // distortion.gain = changeFrequency(t)*0.0005
  // tremolo.speed = changeFrequencyC(t)*10
  // ringModulator.speed = changeFrequency(t)
  // stereoPanner.pan = changeFrequencyC(t)

  geometry.change = changeFrequency(t)*0.05
  //sound2.frequency = changeFrequency(t*50)

//shape rotation
  // for (var i = 0; i <400; i++){
  //   mesh.rotation.x += changeFrequencyB(t)*0.000001;
  //   mesh.rotation.y += 0.00001;
  //   mesh.rotation.z += 0.00001;
  // }

  renderer.render(scene, camera);
};


render();



//sawtoothWave.play();
//sound.play();
//sound.play(10);
// function soundPlayer() {
//   sound.play();
// }


function keyListener(event) {
    switch (event.keyCode) {
    	//spacebar
    	case 32: stopSound(); break
     //  //J
      case 74 + 32: clay.play(), renderer.scene.add(sphere); break
     //  //K
      case 75:  sound.play(), renderer.scene.add(mesh); break
     //  //k
      case 75 + 32: sound.stop(), renderer.scene.remove(mesh); break

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






async function onload(context, load) {

    // let files = ['planet-albedo.png', 'planet-normal.jpg' ]
    // let [albedo,normal] = await load(...files)

    var path = '../acassel/Models'
    var loader = new T.ModelLoader();
    var model = await loader.load(path + '/spikes/scene.gltf')
    var object = model.scene.children[0]
        console.log(object)
        object.scale.set(0.5, 0.5, 0.5)
        renderer.scene.add(object)
}

onload();
