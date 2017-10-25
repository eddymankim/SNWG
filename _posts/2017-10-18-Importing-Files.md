---
layout: full
title: Importing Files
permalink: /code/importing-files/
author: Ben Scott
---


<script deferred type="module">

///
/// SNWG - make your own files day
///
/// 2017-10-24 Ben Scott @evan-erdos bescott.org
///
import * as M from '../evan-erdos/module.js'

// a rate of rotation and delta time
let rate = 3, dt = 0

let terrain = new M.Object3D()
let spinner = new M.Object3D()

let cube = new M.Mesh(
    new M.CubeGeometry(10,10,10),
    new M.MeshStandardMaterial({ color:0xDDDDDD }))
    cube.position.set(-50,0,0)
    cube.receiveShadow = true
    cube.castShadow = true
    terrain.add(cube)


let box = new M.Mesh(
    new M.CubeGeometry(20,20,15),
    new M.MeshStandardMaterial({ color:0xBBAAAA }))
    box.position.set(30,0,10)
    box.receiveShadow = true
    box.castShadow = true
    terrain.add(box)


let tree = new M.Mesh(
    new M.CubeGeometry(5,30,6),
    new M.MeshStandardMaterial({ color:0x777777 }))
    tree.position.set(30,0,-40)
    tree.receiveShadow = true
    tree.castShadow = true
    terrain.add(tree)


let ground = new M.Mesh(
    new M.PlaneGeometry(1e2,1e2,32,32),
    new M.MeshPhongMaterial({ color:0xAAAAAA }))
    ground.rotation.set(-Math.PI/2,0,0)
    ground.castShadow = true
    ground.receiveShadow = true
    terrain.add(ground)




let tetrahedron = new M.Mesh(
    new M.TetrahedronGeometry(1,2),
    new M.MeshStandardMaterial({
        wireframe: true,
        color: 0xFFFFFFAA,
        metalness: 0.3,
        roughness: 0.6,
        emissiveIntensity: 1.5, }))
    tetrahedron.position.set(0,2.5,0)
    tetrahedron.scale.set(1,2,1)
    spinner.add(tetrahedron)


let sphere = new M.Mesh(
    new M.SphereGeometry(0.8,32,32),
    new M.MeshStandardMaterial({
        color: 0xFFAAEEAA,
        metalness: 0.1,
        roughness: 0.8, }))
    sphere.position.set(0,3,0)
    sphere.receiveShadow = true
    sphere.castShadow = true
    spinner.add(sphere)


let diamond = new M.Mesh(
    new M.IcosahedronGeometry(0.25,0),
    new M.MeshStandardMaterial({
        color: 0xC1BAB1,
        metalness: 0.8,
        roughness: 0.3, }))
    diamond.position.set(0,1,0)
    diamond.receiveShadow = true
    diamond.castShadow = true
    spinner.add(diamond)


let torus = new M.Mesh(
    new M.TorusKnotGeometry(1,0.1,32,16),
    new M.MeshStandardMaterial({
        color: 0x00FFAA,
        metalness: 0.0,
        roughness: 1.0, }))
    torus.position.set(0,0.5,0)
    torus.rotation.set(Math.PI/2,Math.PI/9,0)
    torus.receiveShadow = true
    torus.castShadow = true
    spinner.add(torus)


function createPylon() {

    let light = new M.PointLight(0xFFDDFF, 1, 10, 2)
        light.position.set(0,1.5,0)
        light.castShadow = true
        light.shadow.camera.far = 100

    let bulb = new M.Mesh(
        new M.CylinderGeometry(0.1,0.1,0.5,8,2),
        new M.MeshStandardMaterial({
            color: 0xFFFFFF,
            emissive: 0xFFFFFF,
            emissiveIntensity: 2, }))
        bulb.position.set(0,1.7,0)
        bulb.castShadow = false
        bulb.receiveShadow = false

    let pylon = new M.Mesh(
        new M.CylinderGeometry(0.1,0.2,2.5,8,4),
        new M.MeshStandardMaterial({
            flatShading: true,
            color: 0xBBEEFF,
            metalness: 0.1,
            roughness: 0.1,
            emissive: 0x777777, }))
        pylon.add(light, bulb)
        pylon.rotation.set(Math.PI/2,0,0)
        pylon.position.set(0,3,1.5)
        pylon.castShadow = false
        pylon.receiveShadow = false

    return pylon
}

function* angles() { yield 0; yield 180 }

for (let theta of angles()) {
    let o = new M.Object3D()
    o.add(createPylon())
    o.rotateY(M.Math.degToRad(theta))
    spinner.add(o)
}

spinner.position.set(4,2.5,0)



/// called when the page is loaded by the renderer
async function onload(context, load) {

    let [sound] = await load('red-alert.wav')
    let alarm = new M.PositionalAudio(context.listener)
        alarm.setBuffer(sound) // alarm.play()
        terrain.add(alarm)

    let [skybox] = await load('arrakis-day.hdr')
        context.setEnvMap(skybox)

    let images = [ 'planet-albedo.png', 'planet-normal.jpg', ]
    let others = [ 'planet-physic.png', 'star-albedo.png', ]
    let [albedo, normal] = await load(...images)
    let [physic, lucent] = await load(...others)
    let material = new M.MeshPhysicalMaterial({
        color:0xBBEEFF, map:albedo, alphaMap:null,
        normalMap:normal, normalScale:new M.Vector2(1.0,1.0),
        envMap:skybox, envMapIntensity:1.0,
        aoMap:physic, aoMapIntensity:1.0,
        roughnessMap:physic, roughness:1.0,
        metalnessMap:physic, metalness:0.5,
        emissive:0xFFF, emissiveMap:lucent, emissiveIntensity:1.5,
        reflectivity:0.5, clearCoat:0.5, clearCoatRoughness:0.5, })

    let table = new M.Mesh(new M.CubeGeometry(10,1,10), material)
        table.position.set(0,1,0)
        terrain.add(table)
}

/// called before rendering the scene
function update(time=0.01) {
    dt += time
    torus.position.z = 10*Math.sin(1+dt)*time
    torus.position.x = Math.cos(dt)*time
    torus.rotateY(-2*rate*time)
    spinner.rotateY(rate*time)
}

/// called when clicking on an object
function onclick(object) {
    if (object.material===undefined) return
    object.material.emissive = 0x111111
    object.material.emissiveIntensity = 2
    object.material.needsUpdate = true
}

/// create the renderer and pass it all in
let renderer = new M.Renderer({
    onload, update, onclick,
    position: { x:0, y:6, z:10 },
    objects: [spinner, terrain],
    path: '../evan-erdos/' })

</script>

