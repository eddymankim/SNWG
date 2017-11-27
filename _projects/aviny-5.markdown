---
layout: post
author: Andrew Viny
title: Tree changer
thumbnail: w4_aviny_thumbnail.png
week-assignment: 4
---

<meta charset=utf-8>
<title>Tree changer</title>

<div style="font-family:'arial'; font-size: 18px"> This is Tree changer.  Building on the work done in the last project, this app uses a different set of controls for movement (arrow keys) and add a button that reloads a new texture on command!  Over all I think this is a much more satisfying app as it allows for more complete and definable rotation of the trees than the last app.  The ability to change the texture is pretty compelling as well.  The app does however lack a certain amount of fluidity</div> 

<style>

#bob {text-align: center; width: 100%; background-color: black; color: white; position: absolute; top:50px; font-family: Arial; font-size: 20px;}
button { margin: auto; margin-top: 75px;}
.btn {
  background: #6b6b6b;
  background-image: -webkit-linear-gradient(top, #6b6b6b, #3d3d3d);
  background-image: -moz-linear-gradient(top, #6b6b6b, #3d3d3d);
  background-image: -ms-linear-gradient(top, #6b6b6b, #3d3d3d);
  background-image: -o-linear-gradient(top, #6b6b6b, #3d3d3d);
  background-image: linear-gradient(to bottom, #6b6b6b, #3d3d3d);
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
  font-family: Arial;
  color: #ffffff;
  font-size: 20px;
  padding: 22px 36px 22px 36px;
  text-decoration: none;
  border: 0;
}

.btn:hover {
  background: #ff00ee;
  background-image: -webkit-linear-gradient(top, #ff00ee, #48ff00);
  background-image: -moz-linear-gradient(top, #ff00ee, #48ff00);
  background-image: -ms-linear-gradient(top, #ff00ee, #48ff00);
  background-image: -o-linear-gradient(top, #ff00ee, #48ff00);
  background-image: linear-gradient(to bottom, #ff00ee, #48ff00);
  text-decoration: none;
}
.btn:focus {
	outline: 0;
}
</style>

<br>
<div id= "bob"> <button id="b1" class="btn"> Change texture </button>
<br><br><br>
Use arrow keys to rotate object
</div>

<script src="http://threejs.org/build/three.js">
</script>

<script src="../code/aviny/OBJ_loader.js"></script>

<script>
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var container = document.getElementById("bob");

var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, 700 / 2, 700 / - 2, 1, 1000 );
scene.add( camera );
camera.position.z = 600;
camera.position.x = 0;

var ambient = new THREE.AmbientLight( 0x101030 );
scene.add( ambient );
var directionalLight = new THREE.DirectionalLight( 0xffeedd );
directionalLight.position.set( 0, 0, 1 );
scene.add( directionalLight );

var manager = new THREE.LoadingManager();
manager.onProgress = function ( item, loaded, total ) {
	console.log( item, loaded, total );
};

var t0 = new THREE.Texture();
var t1 = new THREE.Texture();
var t2 = new THREE.Texture();
var t3 = new THREE.Texture();
var t4 = new THREE.Texture();

var loader = new THREE.ImageLoader( manager );
loader.load( '../code/aviny/textures/t0.jpg', function ( image ) {
	t0.image = image;
	t0.needsUpdate = true;
} );
loader.load( '../code/aviny/textures/t1.jpg', function ( image ) {
	t1.image = image;
	t1.needsUpdate = true;
} );
loader.load( '../code/aviny/textures/t2.jpg', function ( image ) {
	t2.image = image;
	t2.needsUpdate = true;
} );
loader.load( '../code/aviny/textures/t3.jpg', function ( image ) {
	t3.image = image;
	t3.needsUpdate = true;
} );
loader.load( '../code/aviny/textures/t4.jpg', function ( image ) {
	t4.image = image;
	t4.needsUpdate = true;
} );



var renderer = new THREE.WebGLRenderer();

var cubeBumpMaterial = new THREE.MeshPhongMaterial();

var tree;

var objLoader = new THREE.OBJLoader();
objLoader.load('../code/aviny/models/THING.obj', function (obj) {
	tree = obj;
	obj.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
			child.material = cubeBumpMaterial;
			child.material.map = t0;
			child.material.bumpMap = t0;
			child.material.bumpScale = 12;
		}

	});

	obj.rotation.x = Math.PI/180*270;
	obj.position.y = -80;

	obj.scale.x = 2;
	obj.scale.y = 2;
	obj.scale.z = 2;

	console.log(obj);
	scene.add(obj);
});

renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, 700 );
container.appendChild( renderer.domElement );

function onDocumentMouseMove( event ) {
	mouseX = ( event.clientX - windowHalfX ) / 2;
	mouseY = ( event.clientY - windowHalfY ) / 2;
}

function onDocumentKeyDown( event ) {
	if (event.key == "ArrowUp") {
		tree.rotation.x += Math.PI/45;
		event.preventDefault();
	}
	if (event.key == "ArrowDown") {
		tree.rotation.x -= Math.PI/45;
		event.preventDefault();
	}
	if (event.key == "ArrowRight") {
		tree.rotation.z += Math.PI/45;
		event.preventDefault();
	}
	if (event.key == "ArrowLeft") {
		tree.rotation.z -= Math.PI/45;
		event.preventDefault();
	}
}

var textures = [t0,t1,t2,t3,t4];
var textureNum = 0;

function onButtonClick( event ) {
	if (textureNum < 5) {
		textureNum+=1;
	}
	else {
		textureNum = 0;
	}
	tree.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
			child.material = cubeBumpMaterial;
			child.material.map = textures[textureNum];
			child.material.bumpMap = textures[textureNum];
			child.material.bumpScale = 240;
		}
	});
}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {

	camera.lookAt( scene.position );
	renderer.render( scene, camera );
}

animate();

document.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.addEventListener( 'keydown', onDocumentKeyDown, false );

var b1 = document.getElementById("b1");
b1.addEventListener('click', onButtonClick, false )

</script>
