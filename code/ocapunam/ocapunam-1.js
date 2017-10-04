import * as THREE from '../lib/module.js'

var camera, scene, renderer, geometry, material, line;
var wX = 0
var wY = 0
var wZ = 0
let container
const width = window.innerWidth
const height = 450
    
init();
animate();

function init() {
    scene = new THREE.Scene();

    geometry = new THREE.Geometry();
    geometry.dynamic = true
    for (let i = 0; i < 20; i++) { 
    addStep();
};
    material = new THREE.LineBasicMaterial();

    line = new THREE.Line(geometry, material);
    scene.add(line);

    renderer = new THREE.WebGLRenderer();
    container = renderer.domElement
    renderer.setSize(width , height);

    document.querySelector("#RenderCanvas").appendChild(container)
    
    camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
    camera.position.z = 20;
    scene.add(camera);
    

}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
   line.rotation.x += 0.001;
   line.rotation.y += 0.002;

    renderer.render(scene, camera);
}

function addStep(){
    var choiceX = getRandomInt(-1,1);
    var choiceY = getRandomInt(-1,1);
    var choiceZ = getRandomInt(-1,1);

    wX = wX + choiceX;
    wY = wY + choiceY;
    wZ = wZ + choiceZ;

    geometry.vertices.push(
	new THREE.Vector3( wX, wY, wZ )
    );
    console.log("!")
    line.geometry.vertices.needsUpdate = true;
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.querySelector("#stepButton").onclick = addStep;