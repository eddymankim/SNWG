import * as THREE from '../lib/module.js'

var nodes, pieces, bridge, mouse, endPiece1, endPiece2, inMotion, activeNode, rotationInc, rotationCount, originalRotY, intersect;
            
var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera( -window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 1, 1000);
var raycaster = new THREE.Raycaster();
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
//document.body.appendChild( renderer.domElement );

// lights
var hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);
var ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);
var shadowLight = new THREE.DirectionalLight(0xffffff, .7);

shadowLight.position.set(10, 100, 10);

shadowLight.castShadow = true;
scene.add(hemisphereLight);
scene.add(ambientLight);
scene.add(shadowLight);

// make array of test nodes
nodes = [];

for(var i = 0; i < 9; i++) {
    nodes.push(new RotationNode());
    scene.add(nodes[i]);
}

bridge = new THREE.Object3D();
pieces = [];

for(var i = 0; i < 3; i++) {
    var piece = new BridgePiece();
    pieces.push(piece);
    bridge.add(piece);
}

endPiece1 = new EndPiece();
endPiece2 = new EndPiece();
bridge.add(endPiece1);
bridge.add(endPiece2);

// rotation nodes
nodes[1].position.x = 180;
nodes[1].position.z = 180;
nodes[2].position.x = -180;
nodes[2].position.z = 180;
nodes[3].position.x = -180;
nodes[3].position.z = -180;
nodes[4].position.x = 180;
nodes[4].position.z = -180;
nodes[5].position.x = 0;
nodes[5].position.z = 360;
nodes[6].position.x = 360;
nodes[6].position.z = 0;
nodes[7].position.x = 0;
nodes[7].position.z = -360;
nodes[8].position.x = -360;
nodes[8].position.z = 0;

// bridge pieces
pieces[0].position.x = 135;
pieces[0].position.z = 135;
pieces[1].position.x = 90;
pieces[1].position.z = 90;
pieces[2].position.x = 45;
pieces[2].position.z = 45;

// current End Pieces
endPiece2.position.x = 180;
endPiece2.position.z = 180;

scene.add(bridge);

camera.rotation.x = -Math.PI / 4;
camera.position.y = 475;
camera.position.z = 500;

mouse = new THREE.Vector2();

function loop() {	
    raycaster.setFromCamera( mouse, camera );
    intersect = raycaster.intersectObjects( scene.children ) [0];
    rotateBridge();
    

    renderer.render(scene, camera);
    requestAnimationFrame( loop );
}

function init() {
    // is the Bridge in motion?
    inMotion = false;
    rotationInc = 0.02;
    
    document.querySelector("#RenderCanvas").appendChild(renderer.domElement);
    document.addEventListener("mousemove", onMouseMove, false);
    document.addEventListener("click", checkForMatchingNodes, false);
    loop();
}

// FUNCTIONS

// provided online by mrdoob
// https://threejs.org/docs/index.html#api/core/Raycaster
function onMouseMove( event ) {
    // normalize mouse point
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

// check if bridge is next to a clicked node and is not moving
function checkForMatchingNodes() {
    if(!inMotion){
        

        if(intersect !== undefined && isNearNode(intersect.object)) {
            rotationCount = 0;
            activeNode = intersect.object;
            originalRotY = activeNode.rotation.y;
            activeNode.updateMatrixWorld();
            THREE.SceneUtils.attach(bridge, scene, activeNode);
            inMotion = true;
        }
    }
}

// rotate bridge until the bridge meets another Rotation Node
function rotateBridge() {
    if(inMotion === true) {
        activeNode.rotation.y += rotationInc;
        rotationCount += rotationInc;

        if(rotationCount >= (Math.PI / 2)) {
            activeNode.rotation.y = originalRotY + (Math.PI / 2);
            originalRotY = activeNode.rotation.y;
            rotationCount = 0;

            for(var i = 0; i < nodes.length; i++) {
                if(nodes[i] != activeNode && isNearNode(nodes[i])) {
                    activeNode.updateMatrixWorld();
                    THREE.SceneUtils.detach(bridge, activeNode, scene);
                    inMotion = false;
                    break;
                }
            }
        }
    }
}

// helper function for finding a nearby Rotation Node
function isNearNode(node) {
    // searching at end piece 1
    var a1 = node.position.x - endPiece1.getWorldPosition().x;
    var b1 = node.position.z - endPiece1.getWorldPosition().z;
    var dist1 = Math.sqrt(a1*a1 + b1*b1);

    if(dist1 < 10) {
        return true;
    }

    // searching at end piece 2
    var a2 = node.position.x - endPiece2.getWorldPosition().x;
    var b2 = node.position.z - endPiece2.getWorldPosition().z;
    var dist2 = Math.sqrt(a2*a2 + b2*b2);

    if(dist2 < 10) {
        return true;
    }

    return false;

}

//OBJECTS

// points of possible rotation pivots
function RotationNode() {
    var nodeGeo = new THREE.BoxGeometry(50, 50, 50);
    var nodeMat = new THREE.MeshLambertMaterial( { color: 0x59332e } );
    var node = new THREE.Mesh(nodeGeo, nodeMat);
    node.rotation.y = Math.PI / 4;

    return node;
}

// pieces of the moving bridge
function BridgePiece() {
    var pieceGeo = new THREE.BoxGeometry(50, 50, 50);
    var pieceMat = new THREE.MeshLambertMaterial( { color: 0xffffff } );
    var piece = new THREE.Mesh(pieceGeo, pieceMat);
    piece.rotation.y = Math.PI / 4;

    return piece;
}

// end nodes of the moving bridge
function EndPiece() {
    var pieceGeo = new THREE.BoxGeometry(10, 10, 10);
    var pieceMat = new THREE.MeshLambertMaterial( { color: 0xffffff, transparent: true, opacity: 0 } );
    var piece = new THREE.Mesh(pieceGeo, pieceMat);
    piece.rotation.y = Math.PI / 4;

    return piece;
}

init();
loop();

