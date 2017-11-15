// Edward Shin
// Project Axis
// Phase 1
// Start: 11-09-17
// End: 11-15-17

import * as THREE from '../lib/module.js'

var scene, camera, raycaster, renderer;    // three.js elements
var nodes, bridgePieces, numBPieces, bridgeSize, bridgeSpace, gridLength, nodeSize, nodeSpace, end1, end2, activeEnd, otherEnd, nodeRange;    // parts for node and bridge
var player, bridge, activeNode, otherSideNode;    // to be used for moving player and bridge
var xIsRotating, yIsRotating, zIsRotating, cameraIsMoving;
var rotInc, rotIncX, rotIncY, rotIncZ, rotXCount, rotYCount, rotZCount, stepInc, remainingRot, remainingSteps, xAxis, yAxis, zAxis;
var cameraHeight;


var Colors = {
	red: 0xf25346,
	white: 0xd8d0d1,
	brown: 0x59332e,
	pink: 0xF5986E,
	brownDark: 0x23190f,
	blue: 0x68c3c0
};

// create scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
var raycaster = new THREE.Raycaster();
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;

// lights
var hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);
var ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);
var shadowLight = new THREE.DirectionalLight(0xffffff, .7);

shadowLight.position.set(10, 100, 10);

shadowLight.castShadow = true;
scene.add(hemisphereLight);
scene.add(ambientLight);
scene.add(shadowLight);


nodes = [];   // list of rotation nodes;
bridgePieces = [];    // list of bridge pieces
numBPieces = 5;       // number of bridge pieces
bridgeSize = 1;       
bridgeSpace = 0.125;    // spacing between bridge pieces
gridLength = 5;         
nodeSize = 1;
nodeSpace = ((numBPieces + 1) * bridgeSize) + ((numBPieces + 2) * bridgeSpace);     // spacing between nodes
nodeRange = 1;

player = new THREE.Object3D();
bridge = new THREE.Object3D();  // bridge Object by combining bridge and end pieces

xIsRotating = false;
yIsRotating = false;
zIsRotating = false;
cameraIsMoving = false;

rotInc = rotIncX = rotIncY = rotIncZ = Math.PI / 500;
rotXCount = rotYCount = rotZCount = 0;
stepInc = 0.01;
remainingRot = Math.PI / 2;
remainingSteps = nodeSpace + bridgeSize + bridgeSpace;
xAxis = new THREE.Vector3(1, 0, 0);
yAxis = new THREE.Vector3(0, 1, 0);
zAxis = new THREE.Vector3(0, 0, 1);

cameraHeight = 0.85;

function setScene() {
    makeNodeGrid();
    makeBridge();
    scene.add(player);
    camera.position.y = cameraHeight;
}

function makeNodeGrid() {
    var start = -(gridLength - 1) / 2;
    
    for (var i = start; i < start + gridLength; i++) {
        var x = i * nodeSpace;
        
        for (var j = start; j < start + gridLength; j++) {
            var y = j * nodeSpace;
            
            for (var k = start; k < start + gridLength; k++) {
                var z = k * nodeSpace;
                var newNode = new Node();
                
                newNode.position.set(x, y, z);
                nodes.push(newNode);
            }
        }
    }
    
    // add nodes to the scene
    for (var i = 0; i < nodes.length; i++) {
        scene.add(nodes[i]);
    }
}

function makeBridge() {
    for (var i = 0; i < numBPieces; i++) {
        var z = -(i + 1) * (bridgeSize + bridgeSpace);
        var newBPiece = new BridgePiece();
        
        newBPiece.position.z = z;
        bridge.add(newBPiece);
    }
    
    end1 = new EndPiece();
    end2 = new EndPiece();
    end2.position.z = -(numBPieces + 1) * (bridgeSize + bridgeSpace);
    bridge.add(end1);
    bridge.add(end2);
    
    scene.add(bridge);
    
}

function rotateCamera() {
    if(xIsRotating) {
        var q = new THREE.Quaternion();
        q.setFromAxisAngle(xAxis.normalize(), rotIncX);
        player.applyQuaternion(q);
        remainingRot -= rotInc;
        
        if(remainingRot <= 0) {
            remainingRot = Math.PI / 2;
            resetOtherNode();
            
            player.updateMatrixWorld();
            THREE.SceneUtils.detach(bridge, player, scene);
            THREE.SceneUtils.detach(camera, player, scene);
            THREE.SceneUtils.detach(activeNode, player, scene);
            
            updateAxis();
            xIsRotating = false;
        }
    }
    
    else if(yIsRotating) {
        var q = new THREE.Quaternion();
        q.setFromAxisAngle(yAxis.normalize(), rotIncY);
        player.applyQuaternion(q);
        remainingRot -= rotInc;
        
        if(remainingRot <= 0) {
            remainingRot = Math.PI / 2;
            resetOtherNode();
            
            player.updateMatrixWorld();
            THREE.SceneUtils.detach(bridge, player, scene);
            THREE.SceneUtils.detach(camera, player, scene);
            THREE.SceneUtils.detach(activeNode, player, scene);
            
            updateAxis();
            yIsRotating = false;
        }
    }
    
    else if(zIsRotating) {
        var q = new THREE.Quaternion();
        q.setFromAxisAngle(zAxis.normalize(), rotIncZ);
        player.applyQuaternion(q);
        remainingRot -= rotInc;
        
        if(remainingRot <= 0) {
            remainingRot = Math.PI / 2;
            player.updateMatrixWorld();
            THREE.SceneUtils.detach(bridge, player, scene);
            THREE.SceneUtils.detach(camera, player, scene);
            THREE.SceneUtils.detach(activeNode, player, scene);
            
            updateAxis();
            zIsRotating = false;
        }
    }
}

// update x, y, z axis to correspond with the rotated axis
function updateAxis() {
    if(xIsRotating) {
        var tempAxis = yAxis;
        yAxis = zAxis;
        zAxis = tempAxis;
        
        rotXCount++;
        if(rotXCount === 2) {
            rotIncY = -rotIncY;
            rotIncZ = -rotIncZ;
            rotXCount = 0;
        }
    }
    
    else if(yIsRotating) {
        var tempAxis = xAxis;
        xAxis = zAxis;
        zAxis = tempAxis;
        
        rotYCount++;
        if(rotYCount === 2) {
            rotIncX = -rotIncX;
            rotIncZ = -rotIncZ;
            rotYCount = 0;
        }
    }
    
    else if(zIsRotating) {
        var tempAxis = xAxis;
        xAxis = yAxis;
        yAxis = tempAxis;
        
        rotZCount++;
        if(rotZCount === 2) {
            rotIncX = -rotIncX;
            rotIncY = -rotIncY;
            rotZCount = 0;
        }
    }
}

// move camera to the node on the otherside of the bridge
function moveCamera() {
    if(cameraIsMoving) {
        
    }
}

function setActiveNode() {
    for(var i = 0; i < nodes.length; i++) {
        var curNode = nodes[i];
        var dx = Math.pow((camera.getWorldPosition().x - curNode.getWorldPosition().x), 2);
        var dy = Math.pow((camera.getWorldPosition().y - curNode.getWorldPosition().y), 2);
        var dz = Math.pow((camera.getWorldPosition().z - curNode.getWorldPosition().z), 2);
        var dist = Math.sqrt(dx + dy + dz);
        
        if(dist < nodeRange) {
            activeNode = nodes[i];
            activeEnd = end1;
            otherEnd = end2;
            break;
        }
    }
}

function resetOtherNode() {
    for(var i = 0; i < nodes.length; i++) {
        var curNode = nodes[i];
        var dx = Math.pow((otherEnd.getWorldPosition().x - curNode.getWorldPosition().x), 2);
        var dy = Math.pow((otherEnd.getWorldPosition().y - curNode.getWorldPosition().y), 2);
        var dz = Math.pow((otherEnd.getWorldPosition().z - curNode.getWorldPosition().z), 2);
        var dist = Math.sqrt(dx + dy + dz);
        
        if(dist < nodeRange) {
            otherSideNode = nodes[i];
            break;
        }
    }
}

// rotation nodes for player
function Node() {
    var nodeGeo = new THREE.BoxGeometry(nodeSize, nodeSize, nodeSize);
    var nodeMat = new THREE.MeshLambertMaterial( { color: Colors.brown } );
    var node = new THREE.Mesh(nodeGeo, nodeMat);

    return node;
}
    
// pieces of the moving bridge
function BridgePiece() {
    var pieceGeo = new THREE.BoxGeometry((nodeSize * 0.85), nodeSize, nodeSize);
    var pieceMat = new THREE.MeshLambertMaterial( { color: Colors.white } );
    var piece = new THREE.Mesh(pieceGeo, pieceMat);

    return piece;
}

// end nodes of the moving bridge
function EndPiece() {
    var endSize = nodeSize * 0.1;
    var pieceGeo = new THREE.BoxGeometry(endSize, endSize, endSize);
    var pieceMat = new THREE.MeshLambertMaterial( { color: Colors.white, transparent: true, opacity: 0 } );
    var piece = new THREE.Mesh(pieceGeo, pieceMat);
    piece.rotation.y = Math.PI / 4;

    return piece;
}


// controls for player to move around in the world
function onKeyPress( event ) {
    var k = String.fromCharCode(event.keyCode);
    
    if(k === 'x' || k === 'X') {
        if(!xIsRotating && !yIsRotating && !zIsRotating && !cameraIsMoving) {
            player.updateMatrixWorld();
            THREE.SceneUtils.attach(camera, scene, player);
            THREE.SceneUtils.attach(bridge, scene, player);
            THREE.SceneUtils.attach(activeNode, scene, player);
            
            xIsRotating = true;
        }
    }
    
    else if(k === 'y' || k === 'Y') {
        if(!xIsRotating && !yIsRotating && !zIsRotating && !cameraIsMoving) {
            player.updateMatrixWorld();
            THREE.SceneUtils.attach(camera, scene, player);
            THREE.SceneUtils.attach(bridge, scene, player);
            THREE.SceneUtils.attach(activeNode, scene, player);
            
            yIsRotating = true;
        }
    }
    
    else if(k === 'z' || k === 'Z') {
        if(!xIsRotating && !yIsRotating && !zIsRotating && !cameraIsMoving) {
            player.updateMatrixWorld();
            THREE.SceneUtils.attach(camera, scene, player);
            THREE.SceneUtils.attach(bridge, scene, player);
            THREE.SceneUtils.attach(activeNode, scene, player);
            
            zIsRotating = true;
        }
    }
    
    else if(k === ' ') {
        if(!xIsRotating && !yIsRotating && !zIsRotating && !cameraIsMoving) {
            player.updateMatrixWorld();
            THREE.SceneUtils.attach(camera, scene, player);
            
            cameraIsMoving = true;
        }
    }
}






function loop() {	
    rotateCamera();
    moveCamera();
    
    renderer.render(scene, camera);
    requestAnimationFrame( loop );
}

function init() {
    setScene();
    setActiveNode();
    resetOtherNode();
    
    document.querySelector("#RenderCanvas").appendChild(renderer.domElement);
    document.addEventListener("keypress", onKeyPress, false);
    loop();
}

init();
loop();
    
    
    
    
    
    
    
    
    
    
    
    