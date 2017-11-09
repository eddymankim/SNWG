---
layout: post
author: Andrew Viny
title: Cube builder
thumbnail: w2_aviny_thumbnail.png
week-assignment: 7
---
<meta charset=utf-8>
<title>Forest explorer</title>

<div style="font-family:'arial'; font-size: 24px"> Forest explorer </div> 
<br>
<div style="font-family:'arial'; font-size: 18px"> This app lets you explore the saddest forest in the whole world.  Here only a single tree is left as man has cut down all the others.  Here I explore placing objects in a scene as well as a new set of motion controls (orbital controls).  Over all the fluidity of the experience is much better than in any of the previous apps. </div> 

<script src="http://threejs.org/build/three.js">
</script>

<script src="../js/OrbitControls.js"></script>
<script src="../code/aviny/OBJ_loader.js"></script>

<script>
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var container = document.createElement( 'div' );
document.body.appendChild( container );

var scene = new THREE.Scene();
var pcamera = new THREE.PerspectiveCamera( 35, window.innerWidth/600, 1, 10000);
scene.add( pcamera );

pcamera.position.set(10,10,1);
pcamera.rotation.set(-1.471127674303735, 0.7829105909463133, 1.4299604532284798);
pcamera.quaternion.set( -0.2828893717104605, 0.6202469851440885, 0.25601136285167025, 0.6853652040217393);

var controls = new THREE.OrbitControls(pcamera);

var manager = new THREE.LoadingManager();
manager.onProgress = function ( item, loaded, total ) {
	console.log( item, loaded, total );
};

var cubeBumpMaterial = new THREE.MeshPhongMaterial();

var t0 = new THREE.Texture();
var loader = new THREE.ImageLoader( manager );
loader.load( '../code/aviny/textures/t0.jpg', function ( image ) {
	t0.image = image;
	t0.needsUpdate = true;
} );

var t1 = new THREE.Texture();
loader.load( '../code/aviny/textures/t2.jpg', function ( image ) {
	t1.image = image;
	t1.needsUpdate = true;
} );

t1.wrapS = t1.wrapT = THREE.RepeatWrapping;

var geometry = new THREE.PlaneGeometry( 5000, 5000, 1, 1 );

var uvs = [];
for(var i=0,len=geometry.faces.length;i<len;i+=2){
	uvs.push([new THREE.Vector2(0,1200),new THREE.Vector2(0,0),new THREE.Vector2(1200,1200)]);
	uvs.push([new THREE.Vector2(0,0),new THREE.Vector2(1200,0),new THREE.Vector2(1200,1200)]);            
}       

geometry.faceVertexUvs = [uvs];
geometry.uvsNeedUpdate = true;

var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( geometry, material );

plane.traverse(function (child) {
	if (child instanceof THREE.Mesh) {
		child.material.map = t1;
		child.material.bumpMap = t1;
		child.material.bumpScale = 12;
	}

});

plane.rotation.set(Math.PI/2,0,0);
plane.position.set(0,-2,0);
scene.add( plane );

// var ambient = new THREE.AmbientLight( 0xffffff );
// scene.add( ambient );
var light = new THREE.DirectionalLight( 0xFFFFFF);
var light2 = new THREE.DirectionalLight( 0xFFFFFF);
var light3 = new THREE.DirectionalLight( 0xFFFFFF);
var light4 = new THREE.DirectionalLight( 0xFFFFFF);
// var helper = new THREE.DirectionalLightHelper(light, 5);
light.position.set(0,1,0).normalize();
scene.add(light);
light2.position.set(0,-1,0).normalize();
scene.add(light2);
light3.position.set(-1,0,0).normalize();
scene.add(light3);
light4.position.set(1,0,1).normalize();
scene.add(light4);
// scene.add(helper);

var cube;
var objLoader = new THREE.OBJLoader();
objLoader.load('../code/aviny/models/THING2.obj', function (obj) {
	cube = obj;
	obj.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
			child.material = cubeBumpMaterial;
			child.material.map = t0;
			child.material.bumpMap = t0;
			child.material.bumpScale = 12;
		}

	});
	obj.scale.set(4,4,4);

	scene.add(obj);
	renderer.render(scene, pcamera);
	drawCubes();
});

renderer = new THREE.WebGLRenderer();
// renderer.setPixelRatio( 1 );
renderer.setClearColor(0x000000, 1.0);
renderer.setSize( window.innerWidth, 600 );
container.appendChild( renderer.domElement );


function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	controls.update();

	renderer.render(scene, pcamera);
}

var cubes;
function drawCubes() {
	cubes = [cube];
}

var spacing = 3;

animate();

</script>