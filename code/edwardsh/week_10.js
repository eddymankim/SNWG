import * as THREE from '../lib/module.js'

var objArray;

var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera( -window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 1, 1000);
var raycaster = new THREE.Raycaster();
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

// lights
var hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);
var ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);
var shadowLight = new THREE.DirectionalLight(0xffffff, .7);

shadowLight.position.set(10, 100, 10);

shadowLight.castShadow = true;
scene.add(hemisphereLight);
scene.add(ambientLight);
scene.add(shadowLight);

function loop() {	
    raycaster.setFromCamera( mouse, camera );
    intersect = raycaster.intersectObjects( scene.children ) [0];
    
    

    renderer.render(scene, camera);
    requestAnimationFrame( loop );
}

function init() {
    
    
    document.querySelector("#RenderCanvas").appendChild(renderer.domElement);
    document.addEventListener("mousemove", onMouseMove, false);
    document.addEventListener("click", checkForMatchingNodes, false);
    loop();
}