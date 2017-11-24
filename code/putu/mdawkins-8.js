//import * as THREE from '../lib/module.js';//import all from Three
//import THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/87/three.js";

var meshNumber = 3

const nicoCodeDir = "/nazel-modules";
const nicoAssetDir = "../../data/nazel";

///<<--Key Codes-->>//
/////w////////87//////
///a/s/d///65/83/68///
//////////////////////

var threeControler = document.getElementById("3dDiv");
var threeControler = document.body;
threeControler.onkeydown = function(e) {
    //if (!e.metaKey) {
    //    e.preventDefault();
    //}
    console.log(e.keyCode);
    //if(masterKeyCodes[e.keyCode] == 'w'){}
    if(e.keyCode == '87'){
      scene.add(tetrahedronMesh);
      //console.log(cent);
    }
    if(e.keyCode == '83'){
      let theCube = scene.children[3].geometry;
      let cent = theCube.boundingSphere.center;
      theCube.translate(-.1, -.1, -.1);
      console.log(cent);
    }
    if(e.keyCode == '68'){
      let theCube = scene.children[3].geometry;
      theCube.scale(1.1, 1.1, 1.1);
    }
    if(e.keyCode == '65'){
      let theCube = scene.children[3].geometry;
      theCube.scale(.9, .9, .9);
    }
    if (e.keyCode =="13"){
      scene.children[3].geometry.center();
    }
};
//manupulated from :  http://keycode.info/

// create the basics and drop it into html
var scene = new THREE.Scene();
var gui = new dat.GUI();
var directionalLight = getDirectionalLight(1);
var helper = new THREE.CameraHelper(directionalLight.shadow.camera);
var ambientLight = getAmbientLight(10);
directionalLight.position.x = 13;
directionalLight.position.y = 10;
directionalLight.position.z = 10;
directionalLight.intensity = 2;
scene.add(directionalLight);
scene.add(helper);
scene.add(new THREE.AmbientLight(0x14031B))
gui.add(directionalLight, 'intensity', 0, 10);
gui.add(directionalLight.position, 'x', 0, 20);
gui.add(directionalLight.position, 'y', 0, 20);
gui.add(directionalLight.position, 'z', 0, 20);
var camera = new THREE.PerspectiveCamera(
  45,
  600/600,/*window.innerWidth/window.innerHeight,*/
  1,
  5000
  //fov — Camera frustum vertical field of view.
  //aspect — Camera frustum aspect ratio.
  //near — Camera frustum near plane.
  //far — Camera frustum far plane.

);
camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 5;
camera.lookAt(new THREE.Vector3(0, 0, 0));
var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(800, 600);
renderer.setClearColor('rgb(200, 230, 255)');
document.getElementById('3dDiv').appendChild(renderer.domElement);
var controls = new THREE.OrbitControls(camera, renderer.domElement);

//make some geometry and add to scene

for (var i = 0;i<meshNumber;i++){
  var tetrahedron = new THREE.TetrahedronGeometry(1,2);
  var material = new THREE.MeshStandardMaterial({
    wireframe: true,
    color: 0xFFFFFFAA,
    metalness: 0.3,
    roughness: 0.6,
    emissiveIntensity: 1.5, } );
  var tetrahedronMesh = new THREE.Mesh(tetrahedron, material);
  tetrahedronMesh.castShadows = true;
  tetrahedronMesh.position.set(0,2.5,0)
  scene.add(tetrahedronMesh);
  tetrahedronMesh.position.x = Math.random(0,5);
  tetrahedronMesh.position.y = Math.random(0,5);
  tetrahedronMesh.position.z = Math.random(0,5);
}

/*let tetrahedron = new T.Mesh(
    new T.TetrahedronGeometry(1,2),
    new T.MeshStandardMaterial({
        wireframe: true,
        color: 0xFFFFFFAA,
        metalness: 0.3,
        roughness: 0.6,
        emissiveIntensity: 1.5, }))
    tetrahedron.position.set(0,2.5,0)
    tetrahedron.scale.set(1,2,1)
    thing.add(tetrahedron)
    */

//Create a plane that receives shadows (but does not cast them)
var planeGeometry = new THREE.PlaneBufferGeometry( 20, 20, 32, 32 );
var planeMaterial = new THREE.MeshStandardMaterial( { color:"#bcd6ff" } )
var plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.receiveShadow = true;
//scene.add( plane );

//Create a SpotLight and turn on shadows for the light
var light = new THREE.SpotLight( 0xffffff );
light.castShadow = true;
scene.add( light );
//Set up shadow properties for the light
light.shadow.mapSize.width = 512;  // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5;       // default
light.shadow.camera.far = 500 ;     // default

	camera.position.x = 1;
	camera.position.y = 2;
	camera.position.z = 5;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

var animate = function () {
  requestAnimationFrame( animate );
  tetrahedronMesh.rotation.x += 0.1;
  tetrahedronMesh.rotation.y += 0.1;
  //tetrahedronMesh.position.x += 0.01;
  //tetrahedronMesh.position.y += 0.03;
  renderer.render(scene, camera);
};
animate();

function getPointLight(intensity) {
	var light = new THREE.PointLight(0xffffff, intensity);
	light.castShadow = true;
	return light;
}

function getSpotLight(intensity) {
	var light = new THREE.SpotLight(0xffffff, intensity);
	light.castShadow = true;
	light.shadow.bias = 0.001;
	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;
	return light;
}

function getDirectionalLight(intensity) {
	var light = new THREE.DirectionalLight(0xffffff, intensity);
	light.castShadow = true;
	light.shadow.camera.left = -10;
	light.shadow.camera.bottom = -10;
	light.shadow.camera.right = 10;
	light.shadow.camera.top = 10;
	return light;
}

function getAmbientLight(intensity) {
	var light = new THREE.AmbientLight('rgb(10, 30, 50)', intensity);
	return light;
}