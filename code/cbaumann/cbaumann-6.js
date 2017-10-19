
import * as THREE from '../lib/module.js'

//create scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.background = new THREE.Color(0xC7E78B);
scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

//create raycaster
var raycaster = new THREE.Raycaster();


//mouse
var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100, theta = 0;

//create renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById('RenderCanvas').appendChild(renderer.domElement) ;

//create a light
var ambientLight = new THREE.AmbientLight(0x143A52);
scene.add(ambientLight);


//Create a SpotLight and turn on shadows for the light
var light = new THREE.SpotLight( 0xffffff );
light.castShadow = true;            // default false
scene.add( light );
//Set up shadow properties for the light
light.shadow.mapSize.width = 512;  // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5;       // default
light.shadow.camera.far = 500 ;     // default


//create geometry
var geometry = new THREE.BoxGeometry( 20, 20, 20);
var material = new THREE.MeshBasicMaterial( { color: 0x6E828A } );
var cube = new THREE.Mesh( geometry, material );
cube.castShadows = true;
scene.add( cube );

camera.position.z = 5;



//mouse function
function onDocumentMouseMove( event ) {
				event.preventDefault();
				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			}

function animate() {
	requestAnimationFrame( animate );
    cube.rotation.x += 0.001;
    cube.rotation.y += 0.001;
    
	renderer.render( scene, camera );
}
animate();

function render(){
    
    theta += 0.1;
    camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
    camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
    camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
    camera.lookAt( scene.position );
    
    // find intersections
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children );
    if ( intersects.length > 0 ) {
        var targetDistance = intersects[ 0 ].distance;
        if ( INTERSECTED != intersects[ 0 ].object ) {
						if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
						INTERSECTED = intersects[ 0 ].object;
						INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
						INTERSECTED.material.emissive.setHex( 0xE3EFF3);
					}
				} else {
					if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
					INTERSECTED = null;
				}
}
render();