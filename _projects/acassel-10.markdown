---
layout: full
title: sound
permalink: /code/acassel-10/
author: adrienne
---

This is a primary sketchup of figuring out how to attach sound parameters from Pizzicato.js to shape parameters in THREE.js. I used distortion, a low pass filter, tremolo, a ring modulator, and a stero panner to generate some sounds and made some primitives that I could change accordingly. The key functions are J and K to start, lowercase j and k to stop. 

<script deferred type="module">


import * as THREE from '../lib/module.js'
import * as T from '../acassel/module.js'

var scene = new THREE.Scene();
var clock = new THREE.Clock();
var aspect = window.innerWidth / window.innerHeight;
scene.background = new THREE.Color(0xFBD2D7);
scene.fog = new THREE.FogExp2(0xcccccc, 0.002);


//set up camera
var camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 1000);
 camera.position.z = 500;
 camera.position.y = 50;


//set up the renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//orbit controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', render); 
controls.enableZoom = false;

//add the lights
var ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);

// //make the shapes
// var shapes = [];
// var geometry = new THREE.CubeGeometry(20, 20, 20);
// var material = new THREE.MeshNormalMaterial();
//positions the shapes randomly
// for (var i = 0; i < 400; i ++) {
// var mesh = new THREE.Mesh(geometry, material);
// mesh.position.x = Math.random() * 400 - 200
// mesh.position.y = Math.random() * 400 - 200
// mesh.position.z = Math.random() * 400 - 200

//shapes.push(mesh);

// }

var sound = new T.Pizzicato.Sound({ 
    source: 'wave',
    options: { type: 'sawtooth', frequency: 146.83 }
});

var sound2 = new T.Pizzicato.Sound({
    source: 'wave',
    options: { type: 'sine', frequency: 246.94 }
    
});

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
var lowPassFilter = new Pizzicato.Effects.LowPassFilter({
    frequency: 400,
    peak: 10
  });
var distortion = new Pizzicato.Effects.Distortion({
    gain: 1
});
var tremolo = new Pizzicato.Effects.Tremolo({
    speed: 10,
    depth: 0.8,
    mix: 0.8
});
var ringModulator = new Pizzicato.Effects.RingModulator({
    speed: 30,
    distortion: 1,
    mix: 0.5
});

var stereoPanner = new Pizzicato.Effects.StereoPanner({
    pan: 0
});

sound.addEffect(lowPassFilter);
sound.addEffect(distortion);
sound.addEffect(tremolo);
sound.addEffect(ringModulator);
sound.play();

sound2.addEffect(stereoPanner);
//sound2.play();

let t = -0.5

//primitives 
var geometry = new THREE.CubeGeometry(50, 50, 50);
var material = new THREE.MeshNormalMaterial();
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

var geometry2 = new THREE.SphereGeometry(20, 20, 20);
var material2 = new THREE.MeshBasicMaterial();
var sphere = new THREE.Mesh(geometry2, material2);
//scene.add(sphere);

var geometry3 = new THREE.SphereGeometry(60, 60, 60);
var material3 = new THREE.MeshBasicMaterial();
var blob = new THREE.Mesh(geometry3, material3);
blob.position.set(0, 0, 0)

scene.add(blob);

function render() {
  changeFrequency(t);
  t += clock.getDelta();
  mesh.position.set(0, 0, changeFrequency(t)/5);
  sphere.scale.set (changeFrequencyC(t*50), changeFrequencyC(t*50), changeFrequencyC(t*50))
  sphere.position.set(changeFrequencyC(t)*400,0,changeFrequencyD(t)*200);
  sphere.material.color.setHex(0xFFFF00)
  requestAnimationFrame(render);

  lowPassFilter.frequency = changeFrequency(t)
  distortion.gain = changeFrequency(t)*0.0005
  tremolo.speed = changeFrequency(t)
  ringModulator.speed = changeFrequency(t)
  stereoPanner.pan = changeFrequencyC(t)

  geometry.change = changeFrequency(t)*0.05
  sound2.frequency = changeFrequency(t*50)

//shape rotation
  for (var i = 0; i <400; i++){
    mesh.rotation.x += changeFrequencyB(t)*0.000001;
    mesh.rotation.y += 0.00001;
    mesh.rotation.z += 0.00001;
  }

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
    	case 32: sound2.stop(), scene.remove(sphere); break
      //J
      case 74: sound2.play(), scene.add(sphere); break
      //j
      case 74 + 32: sound2.stop(), scene.remove(sphere); break
      //K
      case 75:  sound.play(), scene.add(mesh); break
      //k
      case 75 + 32: sound.stop(), scene.remove(mesh); break

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
