import * as THREE from '../lib/module.js'

var camera, scene, renderer, geometry, material, line, controls;
var wX = 0
var wY = 0
var wZ = 0
let container
const width = 800
const height = 450
init();
animate();

function init() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
    camera.position.z = 30;
    scene.add(camera);
    
    geometry = new THREE.Geometry();
    for (let i = 0; i < 300; i++) {
        addStep();
    };
    material = new THREE.LineBasicMaterial({ color: 0x587498 });
    line = new THREE.Line(geometry, material);
    scene.add(line);
    
    renderer = new THREE.WebGLRenderer({ alpha: 1, antialias: true, clearColor: 0xffffff });
    renderer.setSize(width, height);
    container = renderer.domElement

    controls = new THREE.OrbitControls( camera, renderer.domElement );

    
    document.querySelector("#RenderCanvas").appendChild(container)

}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}

function addStep() {
    var choiceX = getRandomInt(-1, 1);
    var choiceY = getRandomInt(-1, 1);
    var choiceZ = getRandomInt(-1, 1);
    
    wX = wX + choiceX;
    wY = wY + choiceY;
    wZ = wZ + choiceZ;
    
    geometry.vertices.push(new THREE.Vector3(wX, wY, wZ));
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.querySelector("#stepButton").onclick = addStep;