---
layout: full
title: Shin Renderer Workshop
permalink: /code/shin-workshop-1/
author: Edward Shin
---



<script deferred type="module">

///
/// SNWG - make your own atmosphere day
///
/// 2017-10-11 Edward Shin @edwardsh
///
import * as T from '../lib/module.js'

// you should rename this to match your own renderer
import ShinRenderer from '../shin-workshop-1/ShinRenderer.js'

// a rate of rotation and delta time
let rate = 3, dt = 0

// a "terrain" and a "thing", our object containers
let terrain = new T.Object3D(), thing = new T.Object3D(), city = new T.Object3D(), stonehenge = new T.Object3D()


// shin's added city
let building1 = new T.Mesh(
    new T.CubeGeometry(15,35,10),
    new T.MeshStandardMaterial({ color: 0xFFAABB }))
    building1.position.set(0,-10,0)
    building1.receiveShadow = true
    building1.castShadow = true
    city.add(building1)
    
let building2 = new T.Mesh(
    new T.CubeGeometry(15,70,10),
    new T.MeshStandardMaterial({ color: 0xFFFFFF }))
    building2.position.set(12,-15,5)
    building2.receiveShadow = true
    building2.castShadow = true
    city.add(building2)

let building3 = new T.Mesh(
    new T.CubeGeometry(5,60, 30),
    new T.MeshStandardMaterial({ color: 0x83DDEE }))
    building3.position.set(-12,-20,-8)
    building3.receiveShadow = true
    building3.castShadow = true
    city.add(building3)
    
let building4 = new T.Mesh(
    new T.CubeGeometry(7, 40, 46),
    new T.MeshStandardMaterial({ color: 0xFFFFFF }))
    building4.position.set(-3,-14,-26)
    building4.receiveShadow = true
    building4.castShadow = true
    city.add(building4)

let building5 = new T.Mesh(
    new T.CubeGeometry(3, 24, 126),
    new T.MeshStandardMaterial({ color: 0xF1DDA0 }))
    building5.position.set(12,-5,57)
    building5.receiveShadow = true
    building5.castShadow = true
    city.add(building5)
    
    
let building6 = new T.Mesh(
    new T.CubeGeometry(35, 12, 14),
    new T.MeshStandardMaterial({ color: 0xDDA0D0 }))
    building6.position.set(24, 3, 27)
    building6.receiveShadow = true
    building6.castShadow = true
    city.add(building6)
    
    
let building7 = new T.Mesh(
    new T.CubeGeometry(14, 43, 14),
    new T.MeshStandardMaterial({ color: 0xDDA0D0 }))
    building7.position.set(-27, -8, 29)
    building7.receiveShadow = true
    building7.castShadow = true
    city.add(building7)


// shin's added stonehenge
for (var i = 0; i < 15; i++) {
    let topRad = (Math.random() + 0.2) * 10
    let bottomRad = (Math.random() + 0.2) * 10
    let height = (Math.random() * 30) + 10
    let radSeg = (Math.random() * 10) + 3
    
    let d = (Math.random() * 35) + 90
    let stoneX = d * Math.cos(2 * (Math.PI / 15) * i)
    let stoneZ = d * Math.sin(2 * (Math.PI / 15) * i)
    let stoneY = (Math.random() * 20) - 10;
    
    let stone = new T.Mesh(
        new T.CylinderGeometry(topRad, bottomRad, height, radSeg),
        new T.MeshStandardMaterial({ color: 0xD04444 }))
        stone.position.set(stoneX, stoneY, stoneZ)
        stone.receiveShadow = true
        stone.castShadow = true
        stonehenge.add(stone)
}



// everything else
let cube = new T.Mesh(
    new T.CubeGeometry(10,10,10),
    new T.MeshStandardMaterial({ color: 0xDDDDDD }))
    cube.position.set(-50,0,0)
    cube.receiveShadow = true
    cube.castShadow = true
    terrain.add(cube)


let box = new T.Mesh(
    new T.CubeGeometry(20,20,15),
    new T.MeshStandardMaterial({ color: 0xBBAAAA }))
    box.position.set(30,0,10)
    box.receiveShadow = true
    box.castShadow = true
    terrain.add(box)


let tree = new T.Mesh(
    new T.CubeGeometry(5,30,6),
    new T.MeshStandardMaterial({ color: 0x777777 }))
    tree.position.set(30,0,-40)
    tree.receiveShadow = true
    tree.castShadow = true
    terrain.add(tree)


let ground = new T.Mesh(
    new T.PlaneGeometry(104,34,32,32),
    new T.MeshPhongMaterial({ color: 0xAAAAAA }))
    ground.rotation.set(-Math.PI/2,0,0)
    ground.castShadow = true
    ground.receiveShadow = true
    terrain.add(ground)


let tetrahedron = new T.Mesh(
    new T.TetrahedronGeometry(1,2),
    new T.MeshStandardMaterial({
        wireframe: true,
        color: 0xFFFFFFAA,
        metalness: 0.3,
        roughness: 0.6,
        emissiveIntensity: 1.5, }))
    tetrahedron.position.set(0,2.5,0)
    tetrahedron.scale.set(1,2,1)
    thing.add(tetrahedron)


let sphere = new T.Mesh(
    new T.SphereGeometry(0.8,32,32),
    new T.MeshStandardMaterial({
        color: 0xFFAAEEAA,
        metalness: 0.1,
        roughness: 0.8, }))
    sphere.position.set(0,3,0)
    sphere.receiveShadow = true
    sphere.castShadow = true
    thing.add(sphere)


let diamond = new T.Mesh(
    new T.IcosahedronGeometry(0.25,0),
    new T.MeshStandardMaterial({
        color: 0xC1BAB1,
        metalness: 0.8,
        roughness: 0.3, }))
    diamond.position.set(0,1,0)
    diamond.receiveShadow = true
    diamond.castShadow = true
    thing.add(diamond)


let torus = new T.Mesh(
    new T.TorusKnotGeometry(1,0.1,32,16),
    new T.MeshStandardMaterial({
        color: 0x00FFAA,
        metalness: 0.0,
        roughness: 1.0, }))
    torus.position.set(0,0.5,0)
    torus.rotation.set(Math.PI/2,Math.PI/9,0)
    torus.receiveShadow = true
    torus.castShadow = true
    thing.add(torus)


function createPylon() {

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
        pylon.rotation.set(Math.PI/2,0,0)
        pylon.position.set(0,3,1.5)
        pylon.castShadow = false
        pylon.receiveShadow = false

    return pylon
}



// superfluous iterator pattern for very fast overdesigning!
for (let theta of (function*() { yield 0; yield 180 })()) {
    let o = new T.Object3D()
    o.add(createPylon())
    o.rotateY(T.Math.degToRad(theta))
    thing.add(o)
}


// this is the update function that we pass to the renderer,
// who then calls us back before it renders the scene.
function update(time) {
    dt += time
    torus.position.z = 10*Math.sin(1+dt)*time
    torus.position.x = Math.cos(dt)*time
    torus.rotateY(-2*rate*time)
    thing.rotateY(rate*time)
}



let renderer = new ShinRenderer({
    /* position: { x: 0, y: 10, z: 15 }, */
    /* update: (t) => update(t), */
    updateVar: time => update(time),
    path: '../../data/evan-erdos/' })


thing.position.set(-2,9,0)


// adds our terrain and the spinning thing to the renderer
renderer.add(terrain, thing, city, stonehenge)

</script>
