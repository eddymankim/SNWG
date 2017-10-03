//import * as THREE from '../lib/module.js';//import all from Three
//import THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/87/three.js";

const nicoCodeDir = "/nazel-modules";
const nicoAssetDir = "../../data/nazel";
/*
class My3dThing{
  constructor(divID,width,weight){
    this.height = height;
    this.width = width;
    this.divID = divID;
  }


}


var boxscene = new THREE.Scene();
var overHeadCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var basicRenderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById("3dDiv").appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {
   requestAnimationFrame( animate );
 renderer.render( scene, camera );
}
animate();

*/
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
      let theCube = scene.children[0].geometry;
      let cent = theCube.boundingSphere.center;
      theCube.translate(.1, .1, .1);
      console.log(cent);
    }
    if(e.keyCode == '83'){
      let theCube = scene.children[0].geometry;
      let cent = theCube.boundingSphere.center;
      theCube.translate(-.1, -.1, -.1);
      console.log(cent);
    }
    if(e.keyCode == '68'){
      let theCube = scene.children[0].geometry;
      theCube.scale(1.1, 1.1, 1.1);
    }
    if(e.keyCode == '65'){
      let theCube = scene.children[0].geometry;
      theCube.scale(.9, .9, .9);
    }
    if (e.keyCode =="13"){
      scene.children[0].geometry.center();
    }
};
//minupulated from :  http://keycode.info/


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
scene.add(ambientLight);
gui.add(directionalLight, 'intensity', 0, 10);
gui.add(directionalLight.position, 'x', 0, 20);
gui.add(directionalLight.position, 'y', 0, 20);
gui.add(directionalLight.position, 'z', 0, 20);
var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth/window.innerHeight,
  1,
  1000
);
camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 5;
camera.lookAt(new THREE.Vector3(0, 0, 0));
var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('rgb(120, 120, 120)');
document.getElementById('3dDiv').appendChild(renderer.domElement);
var controls = new THREE.OrbitControls(camera, renderer.domElement);
update(renderer, scene, camera, controls);

//make some geometry
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
cube.castShadows = true;
scene.add( cube );


var loader = new THREE.ObjectLoader();
loader.load("../../data/nazel/FUNNYMODEL.json", function ( obj ) {
      obj.name = "guy";
     scene.add( obj );
     //scene.children[-1].name = "guy";
});

//myObject.name = "objectName";
//...
//var object = scene.getObjectByName( "objectName" );

//Create a plane that receives shadows (but does not cast them)
var planeGeometry = new THREE.PlaneBufferGeometry( 20, 20, 32, 32 );
var planeMaterial = new THREE.MeshStandardMaterial( { color:"#9e9e9e" } )
var plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.receiveShadow = true;
scene.add( plane );

//Create a SpotLight and turn on shadows for the light
var light = new THREE.SpotLight( 0xffffff );
light.castShadow = true;            // default false
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

function updateCube(){
  cube = new THREE.Mesh( geometry, material );
  scene.add( cube );
}

var animate = function () {
  requestAnimationFrame( animate );
  cube.rotation.x += 0.1;
  cube.rotation.y += 0.1;

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

function update(renderer, scene, camera, controls) {
	renderer.render(
		scene,
		camera
	);

	controls.update();

	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls);
	})
}
