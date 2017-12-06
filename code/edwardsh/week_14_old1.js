// Edward Shin
// Realms and Bridges
// Phase 3
// Start: 11-09-17
// End: 12-06-17

import * as THREE from '../lib/module.js'

var scene, skybox, camera, raycaster, renderer;    // three.js elements
var nodes, bridgePieces, numBPieces, bridgeSize, bridgeSpace, 
    gridLength, nodeSize, nodeSpace, end1, end2, nodeRange;  // parts for node and bridge

var player, playerXAxis, playerYAxis, bridge, activeNode, otherSideNode;    // to be used for moving player and bridge
var xIsRotating, yIsRotating, zIsRotating, cameraIsMoving;
var rotInc, rotIncX, rotIncY, rotIncZ, rotXCount, rotYCount, rotZCount, stepInc, remainingRot, remainingSteps, xAxis, yAxis, zAxis;
var nodelessOpacity, nodeOpacity, opacityInc, bridgeIsReforming;
var cameraHeight;
var goal, goalSize, goalRange, goalHeight, goalRot, goalNode;
var mousePos, minMouseX, maxMouseX, minMouseY, maxMouseY;

var natureSources, natureLength;


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
var renderer = new THREE.WebGLRenderer( {antialias: true, } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;


//var skyLoader = new THREE.CubeTextureLoader();
//skyLoader.setPath( '../../code/evan-erdos/images/arrakis-day.hdr/' );
//skybox = new THREE.CubeTexture();
//scene.background = skyLoader.load( [
//	'nx.png', 'px.png',
//	'py.png', 'ny.png',
//	'pz.png', 'nz.png'
//] );


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

nodeOpacity = 0.75;
nodelessOpacity = 0.35;   // opacity for bridge when the player does not have a node to move to
opacityInc = 0.005;
bridgeIsReforming = false;

cameraHeight = 0.85;

goalSize = 0.25;
goalRange = 0.5;
goalHeight = cameraHeight;
goalRot = 0.01;

mousePos = {x: 0, y: 0};
minMouseX = -Math.PI / 8;
maxMouseX = Math.PI / 4;
minMouseY = -Math.PI / 8;
maxMouseY = Math.PI / 8;

natureSources = [];
natureLength = gridLength + 1;

/////////////////////////




// "NORMAL" FUNCTIONS

// create node grid and bridge and set specific parameters
function setScene() {
    makeNodeGrid();
    makeBridge();
    makeNatureGrid();
    setActiveNode();
    resetOtherNode();
    goalNode = otherSideNode;
    goalNode.material.color.setHex( Colors.red );
    
    scene.add(player);
    scene.add(playerXAxis);
    scene.add(playerYAxis);
    player.add(playerXAxis);
    player.add(playerYAxis);
    
    goal = new Goal();
    scene.add(goal);
    
    goal.position.x = goalNode.getWorldPosition().x;
    goal.position.y = goalNode.getWorldPosition().y + goalHeight;
    goal.position.z = goalNode.getWorldPosition().z;
    
    // this line oddly needed, or the goal will not show
    console.log(goal.getWorldPosition());
    
    goalNode.updateMatrixWorld();
    THREE.SceneUtils.attach(goal, scene, goalNode);   // parent the goalNode to goal so the goal rotates with the goalNode
    
    // this line oddly needed, or the goal will not show
    console.log(goal.getWorldPosition());
    
    player.updateMatrixWorld();
    THREE.SceneUtils.attach(camera, scene, player);
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

function makeNatureGrid() {
    var start = (-natureLength / 2) + 0.5;
    
    for (var i = start; i < start + natureLength; i++) {
        var x = i * nodeSpace;
        
        for (var j = start; j < start + natureLength; j++) {
            var y = j * nodeSpace;
            
            for (var k = start; k < start + natureLength; k++) {
                var z = k * nodeSpace;
                var newNode = new NatureNode();
                
                newNode.position.set(x, y, z);
                natureSources.push(newNode);
            }
        }
    }
    
    // add nodes to the scene
    for (var i = 0; i < natureSources.length; i++) {
        scene.add(natureSources[i]);
    }
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
            //THREE.SceneUtils.detach(camera, player, scene);
            
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
            if(bridgePieces[0].material.opacity >= nodeOpacity)
                bridgeIsReforming = false;
        }
    }
}

// reset goal's position 
function resetGoal() {
    if(remainingSteps <= 1) {
        var dx = Math.pow((camera.getWorldPosition().x - goal.getWorldPosition().x), 2);
        var dy = Math.pow((camera.getWorldPosition().y - goal.getWorldPosition().y), 2);
        var dz = Math.pow((camera.getWorldPosition().z - goal.getWorldPosition().z), 2);
        var dist = Math.sqrt(dx + dy + dz);

        // choose a random node aside from the current goal node to be the new goalNode
        if(dist < goalSize) {
            var rand = Math.round(Math.random() * (nodes.length - 1));
            while(nodes[rand] === otherSideNode){
                rand = Math.round(Math.random() * (nodes.length - 1));
            }

            goalNode.updateMatrixWorld();
            THREE.SceneUtils.detach(goal, goalNode, scene);
            goalNode.material.color.setHex( Colors.brown );
            goalNode = nodes[rand];
            goalNode.material.color.setHex( Colors.red );
            
            
            console.log(goalNode.getWorldPosition());

            // choose position of goal relative to new goal node
            var choice = Math.round(Math.random() * 5);

            switch(choice) {
                case 0:
                    goal.position.x = goalNode.getWorldPosition().x + goalHeight;
                    goal.position.y = goalNode.getWorldPosition().y;
                    goal.position.z = goalNode.getWorldPosition().z;
                    break;

                case 1:
                    goal.position.x = goalNode.getWorldPosition().x - goalHeight;
                    goal.position.y = goalNode.getWorldPosition().y;
                    goal.position.z = goalNode.getWorldPosition().z;
                    break;

                case 2:
                    goal.position.x = goalNode.getWorldPosition().x;
                    goal.position.y = goalNode.getWorldPosition().y + goalHeight;
                    goal.position.z = goalNode.getWorldPosition().z;
                    break;

                case 3:
                    goal.position.x = goalNode.getWorldPosition().x;
                    goal.position.y = goalNode.getWorldPosition().y - goalHeight;
                    goal.position.z = goalNode.getWorldPosition().z;
                    break;

                case 4:
                    goal.position.x = goalNode.getWorldPosition().x;
                    goal.position.y = goalNode.getWorldPosition().y;
                    goal.position.z = goalNode.getWorldPosition().z + goalHeight;
                    break;

                case 5:
                    goal.position.x = goalNode.getWorldPosition().x;
                    goal.position.y = goalNode.getWorldPosition().y;
                    goal.position.z = goalNode.getWorldPosition().z - goalHeight;
                    break;

                default:
                    goal.position.x = goalNode.getWorldPosition().x;
                    goal.position.y = goalNode.getWorldPosition().y;
                    goal.position.z = goalNode.getWorldPosition().z - goalHeight;
                    break;
            }
            
            // this line oddly needed, or the goal will not show
            console.log(goal.getWorldPosition());
            
            // parent goal Node to goal again
            goalNode.updateMatrixWorld();
            THREE.SceneUtils.attach(goal, scene, goalNode);
            
            // this line oddly needed, or the goal will not show
            console.log(goal.getWorldPosition());
        }
        
    }
}

// reset the game when player reaches the goal;
// the game should create a new environment and
// set the goal to a random node at a random orientation
function resetWorld() {
    
}

function animateGoal() {
    goal.rotation.x += goalRot;
    goal.rotation.y += goalRot;
    goal.rotation.z += goalRot;
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
            setBridgeOpacity(nodeOpacity);
            return;
        }
    }
    
    // if the bridge goes out of bounds
    otherSideNode = null;
    setBridgeOpacity(nodelessOpacity);
}

// update camera's rotation based on mouse's position
function updateCamera() {
    var angleX = normalize(mousePos.y, -1, 1, maxMouseX, minMouseX);
    var angleY = normalize(mousePos.x, -1, 1, maxMouseY, minMouseY);
    
    camera.rotation.x = angleX;
    camera.rotation.y = angleY;
}

// algorithm found in the Aviator
// https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/
function normalize(v,vmin,vmax,tmin, tmax){
	var nv = Math.max(Math.min(v,vmax), vmin);
	var dv = vmax-vmin;
	var pc = (nv-vmin)/dv;
	var dt = tmax-tmin;
	var tv = tmin + (pc*dt);
	return tv;
}

////////////



// OBJECTS

// rotation nodes for player
function Node() {
    var nodeGeo = new THREE.BoxGeometry(nodeSize, nodeSize, nodeSize);
    var nodeMat = new THREE.MeshLambertMaterial( { color: Colors.brown, transparent: true, opacity: 0.85 } );
    var node = new THREE.Mesh(nodeGeo, nodeMat);

    return node;
}
    
// pieces of the moving bridge
function BridgePiece() {
    var pieceGeo = new THREE.BoxGeometry((nodeSize * 0.85), nodeSize, nodeSize);
    var pieceMat = new THREE.MeshLambertMaterial( { color: Colors.white, transparent: true, opacity: nodeOpacity } );
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

// goal for the game
function Goal() {
    var goalGeo = new THREE.DodecahedronGeometry(goalSize);
    var goalMat = new THREE.MeshLambertMaterial( {color: Colors.pink } );
    var goalMesh = new THREE.Mesh(goalGeo, goalMat);
    
    return goalMesh;
}

// different envrionment objects/algorithms

// test
function NatureNode() {
    var nodeGeo = new THREE.BoxGeometry(nodeSize * 2, nodeSize * 2, nodeSize * 2);
    var nodeMat = new THREE.MeshLambertMaterial( { color: Colors.blue } );
    var node = new THREE.Mesh(nodeGeo, nodeMat);

    return node;
}

////////////



// EVENT FUNCTIONS

// controls for player to move around in the world
function onKeyPress( event ) {
    var k = String.fromCharCode(event.keyCode);
    
    if(k === 'x' || k === 'X') {
        if(!xIsRotating && !yIsRotating && !zIsRotating && !cameraIsMoving) {
            player.updateMatrixWorld();
            THREE.SceneUtils.attach(bridge, scene, player);
            THREE.SceneUtils.attach(activeNode, scene, player);
            
            xIsRotating = true;
        }
    }
    
    else if(k === 'y' || k === 'Y') {
        if(!xIsRotating && !yIsRotating && !zIsRotating && !cameraIsMoving) {
            player.updateMatrixWorld();
            THREE.SceneUtils.attach(bridge, scene, player);
            THREE.SceneUtils.attach(activeNode, scene, player);
            
            yIsRotating = true;
        }
    }
    
    else if(k === 'z' || k === 'Z') {
        if(!xIsRotating && !yIsRotating && !zIsRotating && !cameraIsMoving) {
            player.updateMatrixWorld();
            THREE.SceneUtils.attach(bridge, scene, player);
            THREE.SceneUtils.attach(activeNode, scene, player);
            
            zIsRotating = true;
        }
    }
}

// click mouse to move player only when player and/or nodes are not moving 
// and only if there is a node on the other side of the bridge
function onMouseClick( event ) {
    if(!xIsRotating && !yIsRotating && !zIsRotating && !cameraIsMoving && (otherSideNode !== null)) {
        player.updateMatrixWorld();
        cameraIsMoving = true;
    }
}

// update mouse's position relative to screen
function onMouseMove( event ) {
    var tx = -1 + (event.clientX / window.innerWidth) * 2;
    var ty = -1 + (event.clientY / window.innerHeight) * 2;
    
    mousePos = {x: tx, y: ty};
}

/////////////////////////////


// IMPLEMENTATION

function loop() {	
    rotateCamera();
    moveCamera();
    updateCamera();
    
    resetGoal();
    
    reformBridge();
    animateGoal();
    
    renderer.render(scene, camera);
    requestAnimationFrame( loop );
}

function init() {
    setScene();
    
    document.querySelector("#RenderCanvas").appendChild(renderer.domElement);
    document.addEventListener("keypress", onKeyPress, false);
    document.addEventListener("click", onMouseClick, false);
    document.addEventListener("mousemove", onMouseMove, false);
    loop();
}

init();
loop();
    
    
    
    
    
    
    
    
    
    
    
    