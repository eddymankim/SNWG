---
layout: full
title: Field of Lights
permalink: /code/ocapunam-workshop-1/
author: Ozguc
---


<script deferred type="module">

///
/// SNWG - make your own atmosphere day
///
/// 2017-10-11 Ben Scott @evan-erdos <bescott.org>
///
import * as T from '../lib/module.js'

// you should rename this to match your own renderer
import ozRenderer from '../ocapunam/ozRenderer.js'

// a rate of rotation and delta time
let rate = 3, dt = 0

raycaster = new T.Raycaster();
mouse = new T.Vector2();

var mouse, raycaster;
var objects = [];

document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('keydown', handleKeyPressed, false);

// a "terrain" and a "thing", our object containers
let terrain = new T.Object3D(), thing = new T.Object3D()


let ground = new T.Mesh(
    new T.PlaneGeometry(1e2,1e2,32,32),
    new T.MeshPhongMaterial({ color: 0xAAAAAA }))
    ground.rotation.set(-Math.PI/2,0,0)
    ground.castShadow = true
    ground.receiveShadow = true
    terrain.add(ground)



function createPylon(x, y, z) {

    let light = new T.PointLight(0xFFDDFF, 1, 10, 2)
        light.position.set(0,1.5,0)
        light.castShadow = true
        light.shadow.camera.far = 100

    let bulb = new T.Mesh(
        new T.CylinderGeometry(0.1,0.1,0.5,8,2),
        new T.MeshStandardMaterial({
            color: 0xFFFFFF,
            emissive: 0xFFFFFF,
            emissiveIntensity: 2, }))
        bulb.position.set(0,1.7,0)
        bulb.castShadow = false
        bulb.receiveShadow = false


    let pylon = new T.Mesh(
        new T.CylinderGeometry(0.1,0.2,2.5,8,4),
        new T.MeshStandardMaterial({
            color: 0xBBEEFF,
            metalness: 0.1,
            roughness: 0.1,
            emissive: 1.0, }))
        pylon.add(light, bulb)
        pylon.rotation.set(0,0,0)
        pylon.position.set(x,y-1.5,z+1.5)
        pylon.castShadow = false
        pylon.receiveShadow = false

    return pylon
}


function addLight(x, y, z){
    let o = new T.Object3D()
    o.add(createPylon(x, y, z))
    thing.add(o)
    
    thing.traverse(function(children){
    objects.push(children)
    })
}

// this is the update function that we pass to the renderer,
// who then calls us back before it renders the scene.
function update(time) {
    dt += time

}



let renderer = new ozRenderer({
    position: { x: 0, y: 10, z: 15 },
    update: (t) => update(t),
    path: '../../data/evan-erdos/' })
    
    thing.position.set(0,2.5,0)


// adds our terrain and the spinning thing to the renderer
renderer.add(terrain, thing)

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera( mouse, this.camera );    
}

function handleKeyPressed(event) {
  if (event.keyCode === 65) {
    var randX = getRandom(-1e2/2+10,1e2/2-10)
    var randY = getRandom(-2,0)
    var randZ = getRandom(-1e2/2+10,1e2/2-10)
    addLight(randX, randY, randZ);
    ///if (objects.length > 10){
    ///  objects.pop(0);
    ///  thing.remove(objects.pop(0));}
}
}

function getRandom(min, max) {
    return Math.random() * (max - min + 1) + min;
}
</script>