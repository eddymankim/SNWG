import * as THREE from '../lib/module.js'

var nodes, bPieces, rotationObjects, originalXRot, originalYRot, originalZRot, xIsRotating, yIsRotating, zIsRotating, remainingRot, rotInc, numRand;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
var raycaster = new THREE.Raycaster();
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

nodes = [];     // all rotation nodes
bPieces = [];   // all bridge pieces
rotationObjects = new THREE.Object3D(); // what objects are to be rotated

originalXRot = rotationObjects.rotation.x;
originalYRot = rotationObjects.rotation.y;
originalZRot = rotationObjects.rotation.z;
xIsRotating = false;
yIsRotating = false;
zIsRotating = false;
remainingRot = Math.PI / 2;    // amount to rotate by
rotInc = 0.01;   // how much to rotate view by

numRand = 100;

// lights
var hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);
var ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);
var shadowLight = new THREE.DirectionalLight(0xffffff, .7);

shadowLight.position.set(10, 100, 10);

shadowLight.castShadow = true;
scene.add(hemisphereLight);
scene.add(ambientLight);
scene.add(shadowLight);


rotationObjects.add(camera);

camera.position.y = 3;

// make rotation nodes
for(var i = 0; i < 7; i++) {
    nodes.push(new RotationNode());
    scene.add(nodes[i]);
}

// make bridge pieces
for(var i = 0; i < 3; i++) {
    bPieces.push(new BridgePiece());
    scene.add(bPieces[i]);
    rotationObjects.add(bPieces[i]);
    bPieces[i].position.z = -3.25 * (i + 1);
}

// make random objects in space
for(var i = 0; i < numRand; i++) {
    // random size
    var x = Math.random() * 30 + 5;
    var y = Math.random() * 30 + 5;
    var z = Math.random() * 30 + 5;
    
    // random distances and rotations
    var dists = [];
    var rots = [];
    
    for(var j = 0; j < 3; j++) {
        var dist = Math.random() * 100 + 16;
        if (Math.random() < 0.5) { dist *= (-1) }
        dists.push(dist);
        
        var rot = Math.random() * (2 * Math.PI);
        rots.push(rot);
    }
    
    //color factors
    var randR = Math.random();
    var randG = Math.random();
    var randB = Math.random();
    var randColor = new THREE.Color(randR ,randG ,randB);
    
    var randGeo = new THREE.BoxGeometry(x, y, z);
    var randMat = new THREE.MeshLambertMaterial( { color: randColor } );
    var randMesh = new THREE.Mesh(randGeo, randMat);
    
    scene.add(randMesh);
    randMesh.position.set(dists[0], dists[1], dists[2]);
    randMesh.rotation.set(rots[0], rots[1], rots[2]);
}

rotationObjects.add(nodes[0]);

nodes[1].position.z = 13;
nodes[2].position.z = -13;
nodes[3].position.x = 13;
nodes[4].position.x = -13;
nodes[5].position.y = 13;
nodes[6].position.y = -13;

scene.add(rotationObjects);

// points of possible rotation pivots
function RotationNode() {
    var nodeGeo = new THREE.BoxGeometry(3, 3, 3);
    var nodeMat = new THREE.MeshLambertMaterial( { color: 0x59332e } );
    var node = new THREE.Mesh(nodeGeo, nodeMat);

    return node;
}

// pieces of the moving bridge
function BridgePiece() {
    var pieceGeo = new THREE.BoxGeometry(3, 3, 3);
    var pieceMat = new THREE.MeshLambertMaterial( { color: 0xffffff } );
    var piece = new THREE.Mesh(pieceGeo, pieceMat);

    return piece;
}

// rotate at specifed axis
function rotateAxis() {
    if(xIsRotating) {
        rotationObjects.rotation.x += rotInc;
        remainingRot -= rotInc;
        
        if(remainingRot <= 0) {
            rotationObjects.rotation.x = originalXRot + (Math.PI / 2);
            originalXRot = rotationObjects.rotation.x;
            remainingRot = Math.PI / 2;
            xIsRotating = false;
        }
    }
    
    else if(yIsRotating) {
        rotationObjects.rotation.y += rotInc;
        remainingRot -= rotInc;
        
        if(remainingRot <= 0) {
            rotationObjects.rotation.y = originalYRot + (Math.PI / 2);
            originalYRot = rotationObjects.rotation.y;
            remainingRot = Math.PI / 2;
            yIsRotating = false;
        }
    }
    
    else if(zIsRotating) {
        rotationObjects.rotation.z += rotInc;
        remainingRot -= rotInc;
        
        if(remainingRot <= 0) {
            rotationObjects.rotation.z = originalZRot + (Math.PI / 2);
            originalZRot = rotationObjects.rotation.z;
            remainingRot = Math.PI / 2;
            zIsRotating = false;
        }
    }
}

// press x, y, z to rotate corresponding axis
function onKeyPress ( event ) {
    var k = String.fromCharCode(event.keyCode);
    
    if(k === 'x' || k === 'X') {
        if(!yIsRotating && !zIsRotating) {
            xIsRotating = true;
        }
    }
    
    else if(k === 'y' || k === 'Y') {
        if(!yIsRotating && !xIsRotating) {
            yIsRotating = true;
        }
    }
    
    else if(k === 'z' || k === 'Z') {
        if(!yIsRotating && !xIsRotating) {
            zIsRotating = true;
        }
    }
}

function loop() {	
    rotateAxis();

    renderer.render(scene, camera);
    requestAnimationFrame( loop );
}

function init() {
    
    
    document.querySelector("#RenderCanvas").appendChild(renderer.domElement);
    document.addEventListener("keypress", onKeyPress, false);
    loop();
}

init();
loop();

