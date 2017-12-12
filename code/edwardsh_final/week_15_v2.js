// Edward Shin
// Realms and Bridges
// Final Phase
// Start: 11-09-17
// End: 12-08-17

import * as THREE from '../lib/module.js'

var scene, camera, raycaster, renderer;    // three.js elements
var nodes, bridgePieces, numBPieces, bridgeSize, bridgeSpace, 
    gridLength, nodeSize, nodeSpace, end1, end2, nodeRange;  // parts for node and bridge

var player, playerXAxis, playerYAxis, bridge, activeNode, otherSideNode, blackScreen;    // to be used for moving player and bridge
var xIsRotating, yIsRotating, zIsRotating, cameraIsMoving;
var originalRotInc, rotInc, rotIncX, rotIncY, rotIncZ, rotXCount, rotYCount, rotZCount, stepInc, remainingRot, originalRot,                   remainingSteps, xAxis, yAxis, zAxis, blackProgress;
var nodelessOpacity, nodeOpacity, opacityInc, bridgeIsReforming;

var cameraHeight;

var goal, goalSize, goalRange, goalHeight, goalRot, goalNode;

var mousePos, minMouseX, maxMouseX, minMouseY, maxMouseY;

var natureSources, natureLength, natureIsReforming, natureOpInc, remainingNatureOp, totalNatureOp, firstTime;

var elements, formingElements, elementScaleInc, remainingElementScale, totalElementScale, gameRound, elemColChance, maxElemChance;

var orientMap, orientRef;

var textMesh, speed, uiRead, uiDone;


var Colors = {
	red: 0xf25346,
	white: 0xffffff,
	brown: 0x59332e,
	pink: 0xF5986E,
	brownDark: 0x23190f,
	blue: 0x5b6d8c,
    lightBlue: 0xa1ccea, 
    black: 0x000000,
    green: 0x72ef6b
};

var ElemColors = {
    blue: 0x819ee2,
    green: 0x43b242,
    gray: 0xc8cec8,
    purple: 0xdca5e5,
    yellowG: 0x819ee2,
    magenta: 0xce5c9d,
    orange: 0xe8a33c
};


// CREATE SCENE AND ELEMENTS

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
var raycaster = new THREE.Raycaster();
var renderer = new THREE.WebGLRenderer( {antialias: true, } );
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
gridLength = 4;         
nodeSize = 1;
nodeSpace = ((numBPieces + 1) * bridgeSize) + ((numBPieces + 2) * bridgeSpace);     // spacing between nodes
nodeRange = 0.5;

player = new THREE.Object3D();      // responsible to rotations and movements and ref for player z axis
playerXAxis = new THREE.Object3D(); // reference for player x axis
playerYAxis = new THREE.Object3D(); // reference for player y aixs
playerXAxis.rotation.y = Math.PI / 2;
playerYAxis.rotation.x = Math.PI / 2;
bridge = new THREE.Object3D();  // bridge Object by combining bridge and end pieces
blackScreen = new BlackScreen();   // a plane used to fade the screen in or out

xIsRotating = false;
yIsRotating = false;
zIsRotating = false;
cameraIsMoving = false;

originalRotInc = rotInc = rotIncX = rotIncY = rotIncZ = Math.PI / 500;
rotXCount = rotYCount = rotZCount = 0;
stepInc = 0.02;
remainingRot = Math.PI / 2;
originalRot = remainingRot;
remainingSteps = nodeSpace;
xAxis = playerXAxis.getWorldDirection().normalize();      // x axis in player's POV
yAxis = playerYAxis.getWorldDirection().normalize();      // y axis in player's POV
zAxis = player.getWorldDirection().normalize();           // z axis in player's POV
blackProgress = 0;   // progression in fading the screen in and out

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
minMouseX = -Math.PI / 2;
maxMouseX = Math.PI / 2;
minMouseY = -Math.PI / 4;
maxMouseY = Math.PI / 4;

natureSources = [];
natureLength = gridLength + 1;
natureIsReforming = false;
natureOpInc = 0.001;
remainingNatureOp = 0;
totalNatureOp = 1;
firstTime = true;

elements = [];
formingElements = false;
elementScaleInc = 0.01;
remainingElementScale = 0;
totalElementScale = 1;
gameRound = 0;
elemColChance = 0;
maxElemChance = 7;

orientMap = new Orient();
orientMap.position.set(0.8, 0.5, -0.7);
scene.add(orientMap);

orientRef = new OrientRefAxis();
orientRef.position.set(0.8, 0.5, -0.7);
scene.add(orientRef);

uiRead = false;
uiDone = false;
speed = 100;

var clock = new THREE.Clock();

/////////////////////////




// "NORMAL" FUNCTIONS

// create node grid and bridge and set specific parameters
function setScene() {
    makeNodeGrid();
    makeBridge();
    makeNatureGrid();
    //turnOffWorld();   // world is off on for the start
    
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
    
    player.updateMatrixWorld();
    THREE.SceneUtils.attach(camera, scene, player);
    camera.position.y = cameraHeight;
    
    
    scene.add(blackScreen);
    blackScreen.position.y = cameraHeight;
    blackScreen.position.z = -0.1;
    blackScreen.scale.y = 0.01;
    
    // this line oddly needed, or the black screen will not show
    console.log(blackScreen.getWorldPosition());
    console.log(orientMap.getWorldPosition());
    console.log(orientRef.getWorldPosition());
    
    camera.updateMatrixWorld();
    THREE.SceneUtils.attach(blackScreen, scene, camera);
    THREE.SceneUtils.attach(orientMap, scene, camera);
    THREE.SceneUtils.attach(orientRef, scene, camera);
    
}

function makeNodeGrid() {
    var start = -(gridLength) / 2;
    
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
    var start = (-(natureLength + 1) / 2) + 0.5;
    
    for (var i = start; i < start + natureLength; i++) {
        var x = i * nodeSpace;
        
        for (var j = start; j < start + natureLength; j++) {
            var y = j * nodeSpace;
            
            for (var k = start; k < start + natureLength; k++) {
                var z = k * nodeSpace;
                var newNode = new NatureNode();
                
                newNode.position.set(x, y, z);
                natureSources.push(newNode);
                scene.add(newNode);
            }
        }
    }
}

// rotate the camera and orienting figure based on key input
function rotateCamera() {
    if(xIsRotating) {
        if(blackScreen.material.opacity === 1)
            rotIncX = originalRotInc * 4;
        
        else
            rotIncX = originalRotInc;
        
        var q = new THREE.Quaternion();
        q.setFromAxisAngle(xAxis, rotIncX);
        player.applyQuaternion(q);

        orientMap.rotateX(rotIncX);
        
        remainingRot -= rotIncX;
        
        blacking();
        
        if(remainingRot <= 0) {
            remainingRot = originalRot;
            
            player.updateMatrixWorld();
            THREE.SceneUtils.detach(bridge, player, scene);
            THREE.SceneUtils.detach(activeNode, player, scene);
            
            blackScreen.scale.y = 0;
            blackScreen.material.opacity = 0;
            
            updateAxis();
            resetOtherNode();
            xIsRotating = false;
        }
    }
    
    else if(yIsRotating) {
        var q = new THREE.Quaternion();
        q.setFromAxisAngle(yAxis, rotIncY);
        player.applyQuaternion(q);

        orientMap.rotateY(-rotIncY);
        
        remainingRot -= (rotIncY);
        
        if(remainingRot <= 0) {
            remainingRot = originalRot;
            
            player.updateMatrixWorld();
            THREE.SceneUtils.detach(bridge, player, scene);
            THREE.SceneUtils.detach(activeNode, player, scene);
            
            updateAxis();
            resetOtherNode();
            yIsRotating = false;
        }
    }
    
    else if(zIsRotating) {
        if(blackScreen.material.opacity === 1)
            rotIncZ = originalRotInc * 4;
        
        else
            rotIncZ = originalRotInc;
        
        var q = new THREE.Quaternion();
        q.setFromAxisAngle(zAxis, rotIncZ);
        player.applyQuaternion(q);
        
        orientMap.rotateZ(rotIncZ);
        
        remainingRot -= rotIncZ;
        
        blacking();
        
        
        if(remainingRot <= 0) {
            remainingRot = originalRot;
            
            player.updateMatrixWorld();
            THREE.SceneUtils.detach(bridge, player, scene);
            THREE.SceneUtils.detach(activeNode, player, scene);
            
            blackScreen.scale.y = 0;
            blackScreen.material.opacity = 0;
            
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
function reformBridge(deltaTime) {
    if(bridgeIsReforming) {
        changeBridgeOpacity(opacityInc * deltaTime * speed);
        
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
            
            // this line oddly needed, or the goal will not show
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
            
            resetWorld();
        }
        
    }
}

function animateGoal(deltaTime) {
    goal.rotation.x += (goalRot * deltaTime * speed);
    goal.rotation.y += (goalRot * deltaTime * speed);
    goal.rotation.z += (goalRot * deltaTime * speed);
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

// fading the screen in and out
function blacking() {
    // "de-blackening" screen
    if(remainingRot < (Math.PI / 16)) {
        blackProgress -= rotInc;
        blackScreen.material.opacity = blackProgress / (Math.PI / 16);
    }
    
    // "blackening" screen
    else if(remainingRot > (7 * Math.PI / 16) && remainingRot < (Math.PI / 2)) {
        blackProgress += rotInc;
        blackScreen.material.opacity = blackProgress / (Math.PI / 16);
    }
    
    else {
        blackScreen.material.opacity = 1;
    }
    
    
}

// reset the game when player reaches the goal;
// the game should create a new environment and
// set the goal to a random node at a random orientation
function resetWorld() {
    // reset nature nodes
    if(firstTime) {
        firstTime = false;
        natureIsReforming = true;
        return;
    }
    
    removeElements();
    
    // increase number of colors to choose from every round
    gameRound++;
    if(gameRound % 1 === 0 && elemColChance < maxElemChance) {
        elemColChance++;
    }
    
    var chance =  Math.floor(Math.random() * 3);
    
    switch(chance) {
        case 0:
            world1();
            break;
            
        case 1:
            world2();
            break;
            
        case 2:
            world3();
            break;
            
        default:
            break;
    }
    
    formingElements = true;
}

// set opacity of all nature nodes to 0;
function turnOffWorld() {
    for(var i = 0; i < natureSources.length; i++) {
        natureSources[i].getObjectByName("core").material.opacity = 0;
        natureSources[i].getObjectByName("brace1").material.opacity = 0;
        natureSources[i].getObjectByName("brace2").material.opacity = 0;
        natureSources[i].getObjectByName("brace3").material.opacity = 0;
    }
}

// animating the appearance of a new environment 
function animateWorld() {
    if(natureIsReforming) {
        for(var i = 0; i < natureSources.length; i++) {
            natureSources[i].getObjectByName("core").material.opacity += natureOpInc;
            natureSources[i].getObjectByName("brace1").material.opacity += natureOpInc;
            natureSources[i].getObjectByName("brace2").material.opacity += natureOpInc;
            natureSources[i].getObjectByName("brace3").material.opacity += natureOpInc;
        }
        
        remainingNatureOp += natureOpInc;
        if(remainingNatureOp >= totalNatureOp) {
            remainingNatureOp = 0;
            natureIsReforming = false;
        }
    }
}

function world1() {
    for(var i = 0; i < natureSources.length; i++) {
        var newPos = natureSources[i].getWorldPosition();
        var newColor = randomElemColor();
        var newElem = new Element1(newPos, newColor);
        
        elements.push(newElem);
        scene.add(newElem);
    }
}

function world2() {
    for(var i = 0; i < nodes.length; i++) {
        var chance = Math.random();
        
        if(chance < 0.2) {
            var newPos = nodes[i].getWorldPosition();
            var newColor = randomElemColor();
            var newElem = new Element2(newPos, newColor);

            elements.push(newElem);
            scene.add(newElem);
        }
        
    }
}

function world3() {
    for(var i = 0; i < natureSources.length; i++) {
        var newPos = natureSources[i].getWorldPosition();
        var newColor = randomElemColor();
        var newElem = new Element3(newPos, newColor);
        
        elements.push(newElem);
        scene.add(newElem);
    }
}

// remove elements from scene and list when reforming world
function removeElements() {
    for(var i = 0; i < elements.length; i++) {
        scene.remove(elements[i]);
    }
    
    elements = [];
}

// animate elements using scale;
function formElements(deltaTime) {
    if(formingElements) {
        var scaleInc = Math.round(elementScaleInc * deltaTime * speed);
        
        for(var i = 0; i < elements.length; i++) {
            var element = elements[i];
            
            element.scale.x += elementScaleInc;
            element.scale.y += elementScaleInc;
            element.scale.z += elementScaleInc;
        }
        
        remainingElementScale += elementScaleInc;
        
        if(remainingElementScale >= totalElementScale) {
            formingElements = false;
            remainingElementScale = 0;
        }
    }
}

// return a random color
function randomElemColor() {
    var chance = Math.floor(Math.random() * elemColChance);
    
    switch(chance) {
        case 0:
            return ElemColors.blue;
            
        case 1:
            return ElemColors.green;
            
        case 2:
            return ElemColors.gray;
            
        case 3:
            return ElemColors.purple;
            
        case 4:
            return ElemColors.yellowG;
            
        case 5:
            return ElemColors.magenta;
            
        case 6:
            return ElemColors.orange;
            
        default:
            return null;
    }
    
    return null;
}

function fadeText(deltaTime) {
    if(uiDone || !uiRead) 
        return;
    
    textMesh.material.opacity -= deltaTime;
    if(textMesh.material.opacity <= 0){
        scene.remove(textMesh);
        uiDone = true;
    }
        
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

// blackout screen used in during transitions of x and z rotations
// used so that players will not experience motion and/or mental sickness
function BlackScreen() {
    var blackGeo = new THREE.BoxGeometry(1.5, 1, 0);
    var blackMat = new THREE.MeshBasicMaterial( { color: Colors.black, transparent: true, opacity: 0 } );
    var black = new THREE.Mesh(blackGeo, blackMat);

    return black;
}


// core of the nature nodes with braces that move to change the experience
function NatureNode() {
    var node = new THREE.Object3D();
    
    var coreGeo = new THREE.BoxGeometry(nodeSize * 0.5, nodeSize * 0.5, nodeSize * 0.5);
    var coreMat = new THREE.MeshLambertMaterial( { color: Colors.blue, transparent: true, opacity: 0 } );
    var core = new THREE.Mesh(coreGeo, coreMat);    
    core.name = "core";
    
    var braceGeo = new THREE.BoxGeometry(0.15, nodeSpace, 0.15);
    var braceMat = new THREE.MeshLambertMaterial( { color: Colors.blue, transparent: true, opacity: 0  } );
    var brace1 = new THREE.Mesh(braceGeo, braceMat);
    var brace2 = new THREE.Mesh(braceGeo, braceMat);
    var brace3 = new THREE.Mesh(braceGeo, braceMat);
    var brace4 = new THREE.Mesh(braceGeo, braceMat);
    
    brace1.name = "brace1";
    brace2.name = "brace2";
    brace3.name = "brace3";
    
    node.add(core);
    node.add(brace1);
    node.add(brace2);
    node.add(brace3);
    
    brace2.rotation.z = -Math.PI / 2;
    brace3.rotation.x = -Math.PI / 2;

    return node;
}


// nature element: city-esque 
function Element1(newPos, eColor) {
    var elemGeo = new THREE.BoxGeometry(((Math.random() * 5) + 1), ((Math.random() * 5) + 1), ((Math.random() * 5) + 1));
    var elemMat = new THREE.MeshNormalMaterial( { color: eColor, transparent: true, opacity: 0.9 } );
    var elem = new THREE.Mesh(elemGeo, elemMat);   
    
    elem.position.x = newPos.x;
    elem.position.y = newPos.y;
    elem.position.z = newPos.z;
    
    elem.scale.set(0, 0, 0);
    
    return elem;
}

// nature element: inside/outside
function Element2(newPos, eColor) {
    var wallsX = new Walls(eColor);
    var wallsY = new Walls(eColor);
    var wallsZ = new Walls(eColor);
    
    wallsY.rotation.z = Math.PI / 2;
    wallsZ.rotation.y = Math.PI / 2;
    
    var elem = new THREE.Object3D();
    
    elem.add(wallsX);
    elem.add(wallsY);
    elem.add(wallsZ);
    
    elem.scale.set(0, 0, 0);
    
    elem.position.set(newPos.x, newPos.y, newPos.z);
    
    return elem;
}

// pair of walls for element2
function Walls(eColor) {
    var wallGeo = new THREE.BoxGeometry(nodeSize * 0.1, nodeSize * 6, nodeSize * 6);
    var wallMat = new THREE.MeshNormalMaterial( { color: eColor, transparent: true, opacity: 0.57 } );
    var wall1 = new THREE.Mesh(wallGeo, wallMat);  
    var wall2 = new THREE.Mesh(wallGeo, wallMat);
    
    wall1.position.x = (nodeSize * 3);
    wall2.position.x = -(nodeSize * 3);
    
    var walls = new THREE.Object3D();
    
    walls.add(wall1);
    walls.add(wall2);
    
    return walls;
}

// nature element: abstract
function Element3(newPos, eColor) {
    var elem = new THREE.Object3D();
    var size = Math.floor((Math.random() * 5)) + 3;
    
    for(var i = 0; i < size; i++) {
        var cubeGeo = new THREE.BoxGeometry(nodeSize, nodeSize, nodeSize);
        var cubeMat = new THREE.MeshNormalMaterial( { color: eColor, transparent: true, opacity: 0.85 } );
        var cube = new THREE.Mesh(cubeGeo, cubeMat);   
        
        cube.scale.x = (Math.random() * 5);
        cube.scale.y = (Math.random() * 5);
        cube.scale.z = (Math.random() * 5);
        
        cube.rotation.x = (Math.random() * Math.PI);
        cube.rotation.y = (Math.random() * Math.PI);
        cube.rotation.z = (Math.random() * Math.PI);
        
        cube.position.x += (Math.random() * 3) - 1.5;
        cube.position.y += (Math.random() * 3) - 1.5;
        cube.position.z += (Math.random() * 3) - 1.5;
        
        elem.add(cube);
    }
    
    elem.position.set(newPos.x, newPos.y, newPos.z);
    elem.scale.set(0, 0, 0);
    
    return elem;
}

// a figure to represent current orientation
function Orient() {
    var orient = new THREE.Object3D();
    
    var headGeo = new THREE.CylinderGeometry(0.01, 0.1, 0.15, 4);
    var headMat = new THREE.MeshLambertMaterial( { color: Colors.red, transparent: true, opacity: 1 } );
    var head = new THREE.Mesh(headGeo, headMat);
    head.name = "head";
    
    var bodyGeo = new THREE.CylinderGeometry(0.03, 0.07, 0.25, 4);
    var bodyMat = new THREE.MeshLambertMaterial( { color: Colors.white, transparent: true, opacity: 1 } );
    var body = new THREE.Mesh(bodyGeo, bodyMat);
    body.name = "body";
    
    head.position.y = 0.14;
    head.rotation.x = -Math.PI / 2;
    
    orient.add(body);
    orient.add(head);
    
    orient.scale.set(0.7, 0.7, 0.7);
    orient.rotation.y = (Math.PI / 16);
    
    return orient;
}


// axis representing original direction of player
function OrientRefAxis() {
    var ref = new THREE.Object3D();
    
    var axisGeo = new THREE.BoxGeometry(0.01, 0.01, 1);
    var axisMat = new THREE.MeshLambertMaterial( { color: Colors.green } );
    var axis = new THREE.Mesh(axisGeo, axisMat);  
    
    ref.add(axis);
    axis.position.z -= 0.5;
    ref.rotation.y = -Math.PI + (Math.PI / 16);
    
    return ref;
}


////////////



// EVENT FUNCTIONS

// controls for player to move around in the world
function onKeyPress( event ) {
    var k = String.fromCharCode(event.keyCode);
    
    if(k === 'x' || k === 'X') {
        if(!xIsRotating && !yIsRotating && !zIsRotating && !cameraIsMoving) {
            // prepare black screen objetc for fading transition
            blackScreen.scale.y = 1;
            
            player.updateMatrixWorld();
            THREE.SceneUtils.attach(bridge, scene, player);
            THREE.SceneUtils.attach(activeNode, scene, player);
            
            xIsRotating = true;
            uiRead = true;
        }
    }
    
    else if(k === 'y' || k === 'Y') {
        if(!xIsRotating && !yIsRotating && !zIsRotating && !cameraIsMoving) {
            player.updateMatrixWorld();
            THREE.SceneUtils.attach(bridge, scene, player);
            THREE.SceneUtils.attach(activeNode, scene, player);
            
            yIsRotating = true;
            uiRead = true;
        }
    }
    
    else if(k === 'z' || k === 'Z') {
        if(!xIsRotating && !yIsRotating && !zIsRotating && !cameraIsMoving) {
            // prepare black screen objetc for fading transition
            blackScreen.scale.y = 1;
            
            player.updateMatrixWorld();
            THREE.SceneUtils.attach(bridge, scene, player);
            THREE.SceneUtils.attach(activeNode, scene, player);
            
            zIsRotating = true;
            uiRead = true;
        }
    }
}

// click mouse to move player only when player and/or nodes are not moving 
// and only if there is a node on the other side of the bridge
function onMouseClick( event ) {
    if(!xIsRotating && !yIsRotating && !zIsRotating && !cameraIsMoving && (otherSideNode !== null)) {
        player.updateMatrixWorld();
        cameraIsMoving = true;
        uiRead = true;
    }
}

// update mouse's position relative to screen
function onMouseMove( event ) {
    var tx = -1 + (event.clientX / window.innerWidth) * 2;
    var ty = -1 + (event.clientY / window.innerHeight) * 2;
    
    mousePos = {x: tx, y: ty};
}

async function onLoad( event ) {
    var loader = new THREE.FontLoader();
    var load = (file) => new Promise((c,r) => loader.load(file, c, undefined, r))

    var font = await load('../../code/edwardsh/fonts/optimer_bold.typeface.json');
    var message = "click: forward\n      x: x-axis\n      y: y-axis\n      z: z-axis";
    
    var geometry = new THREE.TextGeometry( message, {
            font: font,
            size: 0.4,
            height: 0.1,
            curveSegments: 5,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 1,
            bevelSegments: 3
    } );
    
    
    var pos = otherSideNode.getWorldPosition();
    
    var material = new THREE.MeshLambertMaterial( { color: Colors.white,  transparent: true, opacity: 1 } );
    textMesh = new THREE.Mesh(geometry, material);
    
    textMesh.scale.set(1.2, 1.2, 1.2);
    textMesh.position.set(pos.x - 1.5, pos.y + (cameraHeight * 5.3), pos.z);
    console.log(textMesh.getWorldPosition());
    
    scene.add(textMesh);
}

/////////////////////////////


// IMPLEMENTATION

function loop() {	
    var deltaTime = clock.getDelta();
    
    rotateCamera();
    moveCamera();
    updateCamera();
    
    resetGoal();
    
    reformBridge(deltaTime);
    animateGoal(deltaTime);
    
    animateWorld(deltaTime);
    formElements(deltaTime);
    
    fadeText(deltaTime);
    
    renderer.render(scene, camera);
    requestAnimationFrame( loop );
}

function init() {
    setScene();
    
    document.querySelector("#RenderCanvas").appendChild(renderer.domElement);
    document.addEventListener("keypress", onKeyPress, false);
    document.addEventListener("click", onMouseClick, false);
    document.addEventListener("mousemove", onMouseMove, false);
    onLoad();
    
    loop();
}

init();
    
    
    
    
    
    
    
    
    
    
    
    