import * as THREE from '../lib/module.js'
var camera, scene, renderer, geometry, object, material, line, controls;
var parentTransform, sphereInter, raycaster;
var currentIntersected;

var wX = 0
var wY = 0
var wZ = 0
var mouse = new THREE.Vector2();
let container
const width = window.innerWidth
const height = window.innerHeight
init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
    camera.position.z = 30;
    scene.add(camera);
    raycaster = new THREE.Raycaster();
    raycaster.linePrecision = 3;
    createLine(0, 0, 200)
    
    var geometry = new THREE.SphereGeometry(5);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });
    
    sphereInter = new THREE.Mesh(geometry, material);
    sphereInter.visible = false;
    scene.add(sphereInter);
    renderer = new THREE.WebGLRenderer({
        alpha: 1
        , antialias: true
        , clearColor: 0xffffff
    });
    renderer.setSize(width, height);
    container = renderer.domElement
    controls = new THREE.OrbitControls(camera, container);
    document.querySelector("#RenderCanvas").appendChild(container)
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    }

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    
    var intersects = raycaster.intersectObjects( object, true);

    
    camera.updateMatrixWorld();
    raycaster.setFromCamera(mouse, camera);
    renderer.render(scene, camera);
    if (intersects.length > 0) {
        if (currentIntersected !== undefined) {
            currentIntersected.material.linewidth = 1;
        }
        currentIntersected = intersects[0].object;
        currentIntersected.material.linewidth = 5;
        sphereInter.visible = true;
        sphereInter.position.copy(intersects[0].point);
    }
    else {
        if (currentIntersected !== undefined) {
            currentIntersected.material.linewidth = 1;
        }
        currentIntersected = undefined;
        sphereInter.visible = false;
    }
}

function createLine(x, y, step) {
    wX = x
    wY = y
    object = new THREE.Geometry();
    for (let i = 0; i < step; i++) {
        addStep();
    };
    line = new THREE.Line(object, material);
    scene.add(line);
}

function addStep() {
    var choiceX = getRandomInt(-1, 1);
    var choiceY = getRandomInt(-1, 1);
    var choiceZ = getRandomInt(-1, 1);
    wX = wX + choiceX;
    wY = wY + choiceY;
    wZ = wZ + choiceZ;
    object.vertices.push(new THREE.Vector3(wX, wY, wZ));
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log(mouse.x)
}