import * as THREE from '../lib/module.js'

//this is the shit you need to start off your scene:
var scene = new THREE.Scene();
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

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', render); 
controls.enableZoom = false;

//add the lights
var ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);


var shapes = [];

var geometry = new THREE.CubeGeometry(20, 90, 1);
var material = new THREE.MeshNormalMaterial();

//positions the shapes randomly
for (var i = 0; i < 400; i ++) {

var mesh = new THREE.Mesh(geometry, material);

mesh.position.x = Math.random() * 400 - 200
mesh.position.y = Math.random() * 400 - 200
mesh.position.z = Math.random() * 400 - 200

scene.add(mesh);
shapes.push(mesh);

}
//rotates all the shapes
var render = function() {
	
	requestAnimationFrame(render);
	for (var i = 0; i <400; i++){
		shapes[i].rotation.x += 0.001;
		shapes[i].rotation.y += 0.01;
		shapes[i].rotation.z += 0.001;
	}
	renderer.render(scene, camera);
};

render();



