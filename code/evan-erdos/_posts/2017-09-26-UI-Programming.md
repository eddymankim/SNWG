---
layout: full
title: UI/UX Programming
permalink: /code/ui-programming/
author: Ben Scott
---


<script deferred type="module">

///
/// 2017-10-31 make your own user interface day
///
/// copy this file to your own folder to get started
///
import * as T from '../evan-erdos/module.js'
import * as Effects from '../evan-erdos/effects/module.js'
import * as Shaders from '../evan-erdos/shaders/module.js'

let floor = new T.Mesh(
    new T.PlaneGeometry(1e3,1e3,512,512),
    new T.MeshStandardMaterial({ color:0x111111, roughness:0.9 }))
    floor.castShadow = floor.receiveShadow = true
    floor.rotation.set(-Math.PI/2,0,0)

async function onload(context, load) {
    let [sound] = await load('red-alert.wav')
    let alarm = new T.PositionalAudio(context.listener)
        alarm.setBuffer(sound) // alarm.play()
        context.add(alarm)

    let [skybox] = await load('depression-pass.hdr')
        context.setEnvMap(skybox)

    let files = [
        'planet-albedo.png', 'planet-normal.jpg',
        'planet-physic.png', 'star-albedo.png',
        'noise-blue-blur.png', 'noise-dithering.png' ]

    let [albedo,normal,physic,lucent,height,opaque] = await load(...files)

    let material = new T.MeshPhysicalMaterial({
        color:0xBBEEFF, reflectivity:1.5,
        map:albedo, alphaMap:opaque,
        normalMap:normal, normalScale:new T.Vector2(1.0,1.0),
        aoMap:physic, aoMapIntensity:1.0,
        roughnessMap:physic, roughness:1.0,
        metalnessMap:physic, metalness:0.5,
        envMap:skybox, envMapIntensity:1.0,
        emissive:0x000FFF, emissiveMap:lucent, emissiveIntensity:1.5,
        displacementMap:height,
        displacementScale:10, displacementBias:-5,
        clearCoat:0.5, clearCoatRoughness:0.5, })

    floor.material = material
    floor.material.needsUpdate = true

    let table = new T.Mesh(
        new T.CubeGeometry(9,1,4),
        new T.MeshStandardMaterial({
            color:0xBBEEFF, roughness: 0.6,
            map:albedo, normalMap:normal,
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

}

/// called when clicking on an object
function onclick(object) {
    let material = object.material
    if (material===undefined) return
    material.emissive = 0x111111
    material.emissiveIntensity = 2
    material.needsUpdate = true
}


// let colors = T.OdysseyDoors.SereneFright
// let colors = T.OdysseyDoors.AbandonedIce
// let colors = T.OdysseyDoors.RustedWounds
// let colors = T.OdysseyDoors.BurnedMemory
// let colors = T.OdysseyDoors.IllFireburst
// let colors = T.OdysseyDoors.SomnolentEnd
// let colors = T.OdysseyDoors.IncisionAils
// let colors = T.OdysseyDoors.VeinEnergies
let colors = T.OdysseyDoors.PiercingLove
// let colors = T.OdysseyDoors.DoorsReality

window.renderer = new T.Renderer({
    color: 0x5A7F8B, ambient: 0x14031B,
    light: 0xFEEBC1, ground: 0xF2E9CF,
    position: { x:-7, y:7, z:2 },
    fog: { color: 0x000B14, near: 1e1, far: 1e3, },
    hdr: { tonemapping: T.CineonToneMapping, exposure: 1.5 },
    objects: [ floor ],
    effects: [new Effects.DreamPass({
        pow:[1.0, 1.0, 1.0], mul:[1.0, 1.0, 1.0],
        add:[0.1, 0.1, 0.1], mhu:[1.2, 1.0, 1.0],
        colors: [ ...colors ],
        noise:0.5, scan:0.05, lines:2048, creep:1.0, darken:1.0,
        noir:0.0, hue:0.0, fill:0.5, time:0.0,
        gray:true, })],
    onload, update, onclick,
    path: '../evan-erdos/' })

</script>

