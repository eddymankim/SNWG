---
layout: full
title: Final Development
permalink: /code/ocapunam-finalDev/
author: Ozguc
---


<canvas id="Boids" width="640" height="640" style="position: absolute; left: 0; top: 0;"></canvas>

<script deferred type="module">


import * as T from '../lib/module.js'

import OzRenderer from '../ocapunam/OzRenderer-finalDev.js'
import BoidsRenderer from '../ocapunam/BoidsRenderer.js'

// a rate of rotation and delta time
let rate = 3, dt = 0

// a "terrain" and a "thing", our object containers
let terrain = new T.Object3D(), thing = new T.Object3D()

let subDiv = 20

// let boids = new BoidsRenderer()

let ground = new T.Mesh(
    new T.PlaneGeometry(1e2,1e2,subDiv,subDiv),
    new T.MeshPhongMaterial({ color: 0xAAAAAA }))
    ground.rotation.set(-Math.PI/2,0,0)
    ground.castShadow = true
    ground.receiveShadow = true
    terrain.add(ground)


// this is the update function that we pass to the renderer,
// who then calls us back before it renders the scene.
function update(time) {
    dt += time
    ground.geometry.vertices[11].z += 1*time
    ground.geometry.verticesNeedUpdate = true
}



let renderer = new OzRenderer({
    position: { x: 0, y: 10, z: 15 },
    update: (t) => update(t),
    path: '../../data/evan-erdos/' })


thing.position.set(0,2.5,0)


// adds our terrain and the spinning thing to the renderer
renderer.add(terrain, thing)

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
 


</script>

