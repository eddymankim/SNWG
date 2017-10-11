import * as THREE from '../lib/module.js'


var container, stats;
var camera, controls, scene, renderer;
var mesh, texture, geometry, material;
var worldWidth = 128, worldDepth = 128,
worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
var clock = new THREE.Clock();
var scene = new THREE.Scene();
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
camera.position.z = 5;init();
animate();


	

function init() {
	container = document.getElementById( 'container' );
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
	camera.position.y = 200;
	//controls = new THREE.FirstPersonControls( camera );
	//controls.movementSpeed = 500;
	//controls.lookSpeed = 0.1;
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xaaccff );
	scene.fog = new THREE.FogExp2( 0xaaccff, 0.0007 );
	geometry = new THREE.PlaneGeometry( 20000, 20000, worldWidth - 1, worldDepth - 1 );
	geometry.rotateX( - Math.PI / 2 );
	for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
		geometry.vertices[ i ].y = 35 * Math.sin( i / 2 );
	}
	var texture = new THREE.TextureLoader().load( "code/acassel/water.jpg" );
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 5, 5 );
	material = new THREE.MeshBasicMaterial( { color: 0xF5986E, map: texture } );
	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	//container.innerHTML = "";
	
	container = document.getElementById('RenderCanvas');
	container.appendChild(renderer.domElement);
	//stats = new Stats();
	//container.appendChild( stats.dom );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	controls.handleResize();
}

//

function animate() {
	requestAnimationFrame( animate );
	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;

	render();
	//stats.update();
}

function render() {
	var delta = clock.getDelta(),
		time = clock.getElapsedTime() * 10;
	for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
		geometry.vertices[ i ].y = 35 * Math.sin( i / 5 + ( time + i ) / 7 );
	}
	mesh.geometry.verticesNeedUpdate = true;
	//controls.update( delta );
	renderer.render( scene, camera );
}