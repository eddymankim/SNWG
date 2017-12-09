import * as THREE from '../lib/module.js'

var container;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
//document.body.appendChild( renderer.domElement );

// lights
var hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);
var ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);
var shadowLight = new THREE.DirectionalLight(0xffffff, .7);

shadowLight.position.set(10, 100, 10);

shadowLight.castShadow = true;
scene.add(hemisphereLight);
scene.add(ambientLight);
scene.add(shadowLight);


// WATER WHEEL
var waterWheelMesh = new THREE.Object3D();


// wheel
var wheelGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.75, 10);
var wheelMat = new THREE.MeshLambertMaterial( { color: 0x59332e } );
var wheel = new THREE.Mesh(wheelGeo, wheelMat);
wheel.rotation.x = Math.PI / 2;
wheel.receiveShadow = true;
waterWheelMesh.add(wheel);


// spokes
for(var i = 0; i < 10; i++) {
    var spokeGeo = new THREE.BoxGeometry(0.15, 4, 0.9);
    var spokeMat = new THREE.MeshLambertMaterial( { color: 0x23190f } );
    var spoke = new THREE.Mesh(spokeGeo, spokeMat);
    spoke.rotation.z = ((Math.PI * 2) / 10) * i;
    spoke.receiveShadow = true;
    waterWheelMesh.add(spoke);
}

// axis
var axisGeo = new THREE.CylinderGeometry(.25, .25, 12, 5);
var axisMat = new THREE.MeshLambertMaterial( { color: 0x70644c } );
var axis = new THREE.Mesh(axisGeo, axisMat);
axis.rotation.x = Math.PI / 2;
axis.position.z = -5.25;
axis.receiveShadow = true;
waterWheelMesh.add(axis);



// pinwheel
var pinwheel = new THREE.Object3D();
for (var i = 0; i < 2; i++) {
    var bladeGeo = new THREE.BoxGeometry(2, 15, 0.2);
    var bladeMat = new THREE.MeshLambertMaterial( { color: 0x666460 } );
    var blade = new THREE.Mesh(bladeGeo, bladeMat);
    var blade2 = new THREE.Mesh(bladeGeo, bladeMat);
    blade.rotation.z = (Math.PI / 2) * i;
    blade2.rotation.z = (Math.PI / 2) * (i + 0.5);
    blade2.position.z = -5;
    pinwheel.add(blade);
    pinwheel.add(blade2);
}
pinwheel.position.z = -5;
pinwheel.receiveShadow = true;
waterWheelMesh.add(pinwheel);


// WATER
var water = new THREE.Object3D();

var waterGeo = new THREE.CylinderGeometry(7, 7, 4, 15);
var waterMat = new THREE.MeshPhongMaterial( 
    {
        color: 0x68c3c0,
        transparent: true,
        opacity: .7,
        shading: THREE.FlatShading
    }
);
var waterMesh = new THREE.Mesh(waterGeo, waterMat);
waterMesh.rotation.x = Math.PI / 2;
water.receiveShadow = true;
water.add(waterMesh);
water.position.x = -3;
water.position.y = -7.8;
water.position.z = 1;


// WATER AXIS
var waterAxis = new THREE.Object3D();

var waterAxisGeo = new THREE.CylinderGeometry(5, 5, 10, 6);
var waterAxisMat = new THREE.MeshLambertMaterial( { color: 0x23190f } );
var waterAxisMesh = new THREE.Mesh(waterAxisGeo, waterAxisMat);
waterAxisMesh.rotation.x = Math.PI / 2;
waterAxisMesh.receiveShadow = true;
waterAxis.add(waterAxisMesh);
waterAxis.position.x = -3;
waterAxis.position.y = -7.8;
waterAxis.position.z = 3;


// add objects to scene
scene.add( waterWheelMesh );
scene.add(water);
scene.add(waterAxis);

camera.rotation.x = -Math.PI / 8;
camera.rotation.y = Math.PI / 4;
camera.position.x = 5;
camera.position.y = 1;
camera.position.z = 4;

function loop() {

    waterWheelMesh.rotation.z += 0.01;
    water.rotation.z -= 0.01;
    waterAxis.rotation.z -= 0.005;

    renderer.render(scene, camera);
    requestAnimationFrame( loop );
}

function init() {
    document.querySelector("#RenderCanvas").appendChild(renderer.domElement);
    loop();
}

init();
loop();
//window.addEventListener("load", init, false);