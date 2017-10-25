import * as THREE from '../lib/module.js'

var background = 0xFFFFFF
var meshNumber = 200
var meshObjects = []

////////////////////////////////////////////////////////////////

let id = '#RenderCanvas'
const dir = '../../data/mdawkins'
let clock = new THREE.Clock()
const getAspect = () => [756, 512]

let camera = new THREE.PerspectiveCamera(60, 1, 1, 2e5)
    camera.position.z = 100
let renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setClearColor(background,1)
    renderer.setSize(...getAspect())
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
let light = new THREE.DirectionalLight(0xFFFAD3, 1)
    light.position.set(100,200,100)
let scene = new THREE.Scene()
    scene.fog = new THREE.Fog(background, 2**16, 2e5)
    scene.add(camera, light, new THREE.AmbientLight(0x14031B))
document.querySelector(id).appendChild(renderer.domElement)
window.onResize = () => {
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
}

function render(deltaTime=0.01) {
    renderer.render(scene, camera)
    requestAnimationFrame(() => render(clock.getDelta()))
}

function update() {
  /*var mouseDown = 0; 
  document.body.onmousedown = function() { 
    mouseDown = 1;}
  document.body.onmouseup = function() {
    mouseDown = 0;}*/
  for (var i=0; i<meshObjects.length; i++)[ ///*
  const mousedown = (e) => {
      e.preventDefault()
      mouse.x = (e.clientX/window.innerWidth)*2+1
      mouse.y = -(e.clientY/window.innerHeight)*2+1
        }
  if (mousedown){
    var dx = meshObjects[i].position.x - mouse.x;
    var dy = meshObjects[i].position.y - mouse.y;
    var angle = atan2(dy, dx); //Math.atan(dy,dx);
    var xVel = cos(angle);
    var yVel = sin(angle);
    meshObjects[i].position.x += xVel;
    meshObjects[i].position.y += yVel;
    }
    else { //*/
    meshObjects[i].position.x += .3
    meshObjects[i].position.y += .3
    meshOBjects[i].position.z += .1
  }
}

////////////////////////////////////////////////////////////////

for (var i = 0;i<meshNumber;i++){
    const geometry = new THREE.SphereGeometry(32,16,16)
    const material = new THREE.MeshPhongMaterial({
    color: 0xAAAAAA, shininess: 20 })
    var mesh = new THREE.Mesh( geometry, material);
    mesh.position.x = ( Math.random() - 0.5) * 4000 * Math.random();
    mesh.position.y = ( Math.random() - 0.5) * 4000 * Math.random() ;
    mesh.position.z = ( Math.random() - 0.5) * 4000 * Math.random() ;

    mesh.rotation.x = Math.random();
    mesh.rotation.y = Math.random();
    mesh.rotation.z = Math.random();

    scene.add(mesh);
    meshObjects.push(mesh); //put them in an array to update their positions and have behaviors on click using update
    }


////////////////////////////////////////////////////////////////

render()
update()