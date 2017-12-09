// Edward Shin
// Project Axis
// Phase 2
// Start: 11-09-17
// End: 11-29-17

import * as THREE from '../lib/module.js'

var scene, skybox, camera, raycaster, renderer;    // three.js elements
var nodes, bridgePieces, numBPieces, bridgeSize, bridgeSpace, 
    gridLength, nodeSize, nodeSpace, end1, end2, nodeRange;  // parts for node and bridge

var player, playerXAxis, playerYAxis, bridge, activeNode, otherSideNode;    // to be used for moving player and bridge
var xIsRotating, yIsRotating, zIsRotating, cameraIsMoving;
var rotInc, rotIncX, rotIncY, rotIncZ, rotXCount, rotYCount, rotZCount, stepInc, remainingRot, remainingSteps, xAxis, yAxis, zAxis;
var nodelessOpacity, opacityInc, bridgeIsReforming;
var cameraHeight;


var Colors = {
	red: 0xf25346,
	white: 0xd8d0d1,
	brown: 0x59332e,
	pink: 0xF5986E,
	brownDark: 0x23190f,
	blue: 0x68c3c0
};


// CREATE SCENE AND ELEMENTS

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
var raycaster = new THREE.Raycaster();
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;


var skyLoader = new THREE.CubeTextureLoader();
skyLoader.setPath( '../../code/evan-erdos/images/arrakis-day.hdr/' );
skybox = new THREE.CubeTexture();
scene.background = skyLoader.load( [
	'nx.png', 'px.png',
	'py.png', 'ny.png',
	'pz.png', 'nz.png'
] );


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
nodeRange = 0.5;

player = new THREE.Object3D();      // responsible to rotations and movements and ref for player z axis
playerXAxis = new THREE.Object3D(); // reference for player x axis
playerYAxis = new THREE.Object3D(); // reference for player y aixs
playerXAxis.rotation.y = Math.PI / 2;
playerYAxis.rotation.x = Math.PI / 2;
bridge = new THREE.Object3D();  // bridge Object by combining bridge and end pieces

xIsRotating = false;
yIsRotating = false;
zIsRotating = false;
cameraIsMoving = false;

rotInc = rotIncX = rotIncY = rotIncZ = Math.PI / 1000;
rotXCount = rotYCount = rotZCount = 0;
stepInc = 0.01;
remainingRot = Math.PI / 2;
remainingSteps = nodeSpace;
xAxis = playerXAxis.getWorldDirection().normalize();      // x axis in player's POV
yAxis = playerYAxis.getWorldDirection().normalize();      // y axis in player's POV
zAxis = player.getWorldDirection().normalize();           // z axis in player's POV

nodelessOpacity = 0.5;   // opacity for bridge when the player does not have a node to move to
opacityInc = 0.005;
bridgeIsReforming = false;

cameraHeight = 0.85;

/////////////////////////




// "NORMAL" FUNCTIONS

// create node grid and bridge and set specific parameters
function setScene() {
    makeNodeGrid();
    makeBridge();
    scene.add(player);
    scene.add(playerXAxis);
    scene.add(playerYAxis);
    player.add(playerXAxis);
    player.add(playerYAxis);
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
        bridgePieces.push(newBPiece);
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
            
            player.updateMatrixWorld();
            THREE.SceneUtils.detach(bridge, player, scene);
            THREE.SceneUtils.detach(camera, player, scene);
            THREE.SceneUtils.detach(activeNode, player, scene);
            
            updateAxis();
            resetOtherNode();
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
            
            player.updateMatrixWorld();
            THREE.SceneUtils.detach(bridge, player, scene);
            THREE.SceneUtils.detach(camera, player, scene);
            THREE.SceneUtils.detach(activeNode, player, scene);
            
            updateAxis();
            resetOtherNode();
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
            resetOtherNode();
            zIsRotating = false;
        }
    }
}

// update x, y, z axis to correspond with the rotated axis
function updateAxis() {
    xAxis = playerXAxis.getWorldDirection().normalize();
    yAxis = playerYAxis.getWorldDirection().normalize();
    zAxis = player.getWorldDirection().normalize();
}

// move camera to the node on the otherside of the bridge
function moveCamera() {
    if(cameraIsMoving) {
        player.translateZ(-stepInc);
        remainingSteps -= stepInc;
        
        if(remainingSteps <= 0) {
            remainingSteps = nodeSpace;
            
            bridge.translateZ(-remainingSteps);
            bridge.updateMatrixWorld();
            
            setActiveNode();
            resetOtherNode();
            setBridgeOpacity(0.0);
            
            // to ensure accuracy of player's position relative to the node
            player.position.set(activeNode.getWorldPosition().x, 
                                activeNode.getWorldPosition().y, 
                                activeNode.getWorldPosition().z); 
            
            player.updateMatrixWorld();
            THREE.SceneUtils.detach(camera, player, scene);
            
            updateAxis();
            
            cameraIsMoving = false;
            bridgeIsReforming = true;
        }
    }
}

// change bridge opacity by a value val
function changeBridgeOpacity(val) {
    for(var i = 0; i < bridgePieces.length; i++) {
        bridgePieces[i].material.opacity += val;
    }
}

// set bridge opacity to new value newVal
function setBridgeOpacity(newVal) {
    for(var i = 0; i < bridgePieces.length; i++) {
        bridgePieces[i].material.opacity = newVal;
    }
}

// reform bridge's opacity gradually
function reformBridge() {
    if(bridgeIsReforming) {
        changeBridgeOpacity(opacityInc);
        
        if(otherSideNode === null) {
            if(bridgePieces[0].material.opacity >= nodelessOpacity)
                bridgeIsReforming = false;
        }
        
        else {
            if(bridgePieces[0].material.opacity >= 1.0)
                bridgeIsReforming = false;
        }
    }
}

// assign the current node the camera hovers over and is used for rotating the bridge
function setActiveNode() {
    for(var i = 0; i < nodes.length; i++) {
        var curNode = nodes[i];
        var dx = Math.pow((end1.getWorldPosition().x - curNode.getWorldPosition().x), 2);
        var dy = Math.pow((end1.getWorldPosition().y - curNode.getWorldPosition().y), 2);
        var dz = Math.pow((end1.getWorldPosition().z - curNode.getWorldPosition().z), 2);
        var dist = Math.sqrt(dx + dy + dz);
        
        if(dist < nodeRange) {
            activeNode = nodes[i];
            break;
        }
    }
}

function resetOtherNode() {
    for(var i = 0; i < nodes.length; i++) {
        var curNode = nodes[i];
        var dx = Math.pow((end2.getWorldPosition().x - curNode.getWorldPosition().x), 2);
        var dy = Math.pow((end2.getWorldPosition().y - curNode.getWorldPosition().y), 2);
        var dz = Math.pow((end2.getWorldPosition().z - curNode.getWorldPosition().z), 2);
        var dist = Math.sqrt(dx + dy + dz);
        
        // set the new other node if found near the end of the bridge
        if(dist < nodeRange) {
            otherSideNode = nodes[i];
            setBridgeOpacity(1.0);
            return;
        }
    }
    
    // if the bridge goes out of bounds
    otherSideNode = null;
    setBridgeOpacity(nodelessOpacity);
}

////////////



// OBJECTS

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
    var pieceMat = new THREE.MeshLambertMaterial( { color: Colors.white, transparent: true, opacity: 1 } );
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

////////////



// EVENT FUNCTIONS

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
    
    // press m to move only when player and/or nodes are not moving 
    // and only if there is a node on the other side of the bridge
    else if(k === 'm' || k === 'M') {
        if(!xIsRotating && !yIsRotating && !zIsRotating && !cameraIsMoving && (otherSideNode != null)) {
            player.updateMatrixWorld();
            THREE.SceneUtils.attach(camera, scene, player);
            cameraIsMoving = true;
        }
    }
}




// implementing the program

function loop() {	
    rotateCamera();
    moveCamera();
    reformBridge();
    
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
    
    
    
    
    
    
    
    
    
    
    
    