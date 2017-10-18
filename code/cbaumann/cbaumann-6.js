
import * as THREE from '../lib/module.js'

//start scene
var scene = new THREE.Scene();
var aspect = window.innerWidth / window.innerHeight;
scene.background = new THREE.Color(0xFAF8D7);
scene.fog = new THREE.FogExp2(0xACC6AA, 0.002);

//mouse
var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100, theta = 0;

var container = document.createElement('div');
document.body.appendChild(conteiner);

var info = document.createElement('div');



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
var ambientLight = new THREE.AmbientLight(0xFAF8D7);
scene.add(ambientLight);


//make a cube
var geometry = new THREE.BoxGeometry( 50, 50, 50 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
cube.castShadows = true;
scene.add( cube );


function onDocumentMouseMove( event ) {
				event.preventDefault();
				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			}

//rotates cube and calculates if mouse intersects with cube
var render = function() {
    
    theta += 0.1;
				camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
				camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
				camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
				camera.lookAt( scene.position );
				camera.updateMatrixWorld();
				// find intersections
				raycaster.setFromCamera( mouse, camera );
				var intersects = raycaster.intersectObjects( scene.children );
				if ( intersects.length > 0 ) {
					if ( INTERSECTED != intersects[ 0 ].object ) {
						if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
						INTERSECTED = intersects[ 0 ].object;
						INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
						INTERSECTED.material.emissive.setHex( 0xff0000 );
					}
				} else {
					if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
					INTERSECTED = null;
				}
	
	requestAnimationFrame(render);
		cube.rotation.x += 0.001;
		cube.rotation.y += 0.01;
		cube.rotation.z += 0.001;
	renderer.render(scene, camera);
};

render();


