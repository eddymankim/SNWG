import * as THREE from '../lib/module.js'

var camera, scene, renderer, geometry, material, line, controls, sphereInter, currentIntersected;
var wX = 0;
var wY = 0;
var wZ = 0;
var mouse, raycaster;
var objects = [];
let container
const width = window.innerWidth;
const height = window.innerHeight;
init();
animate();


function init() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
    camera.position.z = 30;
    scene.add(camera);
    
    raycaster = new THREE.Raycaster();
    raycaster.linePrecision = 5;
    mouse = new THREE.Vector2();
    
    
    
    geometry = new THREE.SphereGeometry( 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    
    sphereInter = new THREE.Mesh( geometry, material );
	sphereInter.visible = false;
	scene.add( sphereInter );
    
    createLine();

    renderer = new THREE.WebGLRenderer({ alpha: 1, antialias: true, clearColor: 0xffffff });
    renderer.setSize(width, height);
    container = renderer.domElement

    controls = new THREE.OrbitControls( camera, renderer.domElement );

    
    document.querySelector("#RenderCanvas").appendChild(container)
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('keydown', handleKeyPressed, false);


}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
    var sphereCen
    var intersects = raycaster.intersectObjects( objects );
    currentIntersected = intersects[ 0 ];
    if ( intersects.length > 0 ){
        sphereInter.visible = true;
        sphereInter.position.copy( intersects[ 0 ].point )
    } else {
        sphereInter.visible = false;
        
    }

}

function createLine(wX, wY, wZ) {
    geometry = new THREE.Geometry();
    for (let i = 0; i < 10; i++) {
        addStep();
    };
    material = new THREE.LineBasicMaterial({ color: 0x587498 });
    line = new THREE.Line(geometry, material);
    scene.add(line);
    scene.traverse(function(children){
    objects.push(children)
    })
}

function addStep() {
    var choiceX = getRandomInt(-5, 5);
    var choiceY = getRandomInt(-5, 5);
    var choiceZ = getRandomInt(-5, 5);
    
    geometry.vertices.push(new THREE.Vector3(wX, wY, wZ));
    
    wX = wX + choiceX;
    wY = wY + choiceY;
    wZ = wZ + choiceZ;
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera( mouse, camera );    
}

function handleKeyPressed(event) {
  if (event.keyCode === 65) {
    wX = currentIntersected.point.x
    wY = currentIntersected.point.y
    wZ = currentIntersected.point.z
    createLine();
  }
  if (event.keyCode === 68) {
      objects.pop( objects.indexOf( currentIntersected.object ))
      scene.remove( currentIntersected.object );
  }
}
function onKeyPressed(event){

}