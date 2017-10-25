---
layout: full
title: Flash, Pop, and Hiss
permalink: /code/effects-workshop/
author: Ben Scott
---


<script deferred type="module">

import * as M from '../evan-erdos/module.js'

function createShape({
        position = [0,0,0], rotation = [0,0,0],
        geometry = [1,1,1], material = {color:0xAAAAAA},
        enableShadows = true,
        f = a => new M.MeshStandardMaterial(a),
        g = a => new M.CubeGeometry(...a),
        }={}) {
    let mesh = new M.Mesh(g(geometry),f(material))
        mesh.castShadow = enableShadows
        mesh.receiveShadow = enableShadows
        mesh.position.set(...position)
        mesh.rotation.set(...rotation)
    return mesh
}

let ground = createShape({
    position: [0,0,0],
    rotation: [-Math.PI/2,0,0],
    geometry: [1e3,1e3,256,256],
    material: { color:0x111111, roughness:0.1 },
    g: a => new M.PlaneGeometry(...a) })

let rock = createShape({
    position: [-50,0,0],
    geometry: [10,10,10],
    material: { roughness:0.5 }, })

let boulder = createShape({
    position: [30,0,10],
    geometry: [20,20,15],
    material: { color:0xBBAAAA }, })

/// called when the page is loaded by the renderer
async function onload(context, load) {

    let [sound] = await load('red-alert.wav')
    let alarm = new M.PositionalAudio(context.listener)
        alarm.setBuffer(sound) // alarm.play()
        context.add(alarm)

    let [skybox] = await load('depression-pass.hdr')
        context.setEnvMap(skybox)

    let files = [
        'planet-albedo.png', 'planet-normal.jpg', 'planet-physic.png',
        'star-albedo.png', 'noise-marble.jpg', 'noise-dithering.png', ]

    let [albedo,normal,physic,lucent,height,opaque] = await load(...files)

    let material = new M.MeshPhysicalMaterial({
        color:0xBBEEFF, reflectivity:1.5,
        map:albedo, alphaMap:opaque,
        normalMap:normal, normalScale:new M.Vector2(1.0,1.0),
        aoMap:physic, aoMapIntensity:1.0,
        roughnessMap:physic, roughness:1.0,
        metalnessMap:physic, metalness:0.5,
        envMap:skybox, envMapIntensity:1.0,
        emissive:0x000FFF, emissiveMap:lucent, emissiveIntensity:1.5,
        displacementMap:height,
        displacementScale:10, displacementBias:-5,
        clearCoat:0.5, clearCoatRoughness:0.5, })

    ground.material = material
    ground.material.needsUpdate = true

    let table = new M.Mesh(
        new M.CubeGeometry(9,1,4),
        new M.MeshStandardMaterial({
            color:0xBBEEFF, map:albedo,
            normalMap:normal, normalScale:new M.Vector2(1.0,1.0),
            envMap:skybox, envMapIntensity:1.0,
            aoMap:physic, aoMapIntensity:1.0, }))
        table.position.set(0,4.5,0)
        context.add(table)

    let [lamp] = await load('brass-lantern.gltf')
        context.importEnv(lamp.scene)
        lamp.scene.position.set(0,6,0)
        context.add(lamp.scene)

}

/// called before rendering the scene
function update(deltaTime=0.01) {
    // torus.position.z = 10*Math.sin(1+dt)*deltaTime
    // torus.rotateY(-2*deltaTime)
}

/// called when clicking on an object
function onclick(object) {
    let material = object.material
    if (material===undefined) return
    material.emissive = 0x111111
    material.emissiveIntensity = 2
    material.needsUpdate = true
}

/// create the renderer and pass it all in
window.renderer = new M.Renderer({
    position: {x:-7,y:7,z:2},
    fog: { color:0x000B14, near:1e1, far:1e3 },
    objects: [ground, rock, boulder],
    onload, update, onclick,
    path: '../evan-erdos/' })

</script>

