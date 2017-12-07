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
let rate = 3, dt = 0, dn = 0, iBoid = 0, subDiv = 256

// a "terrain" and a "thing", our object containers
let terrain = new T.Object3D(), lights = new T.Object3D()


let ground = new T.Mesh(
    new T.PlaneGeometry(1e4,1e4,subDiv,subDiv),
    new T.MeshStandardMaterial({ color:0xAAAAAA, roughness:0.9 }))
    ground.rotation.set(-Math.PI/2,0,0)
    ground.castShadow = true
    ground.recieveShadow = true
    terrain.add(ground)

// let hemiLight = new T.HemisphereLight( 0xccccff, 0x231100, 0.3 );
//     // hemiLight.color.setHSL( 0.6, 1, 0.6 );
//     hemiLight.position.set( 0, 50, 0 );
//     lights.add( hemiLight );
// // let hemiLightHelper = new T.HemisphereLightHelper( hemiLight, 10 );
//     //lights.add( hemiLightHelper );
                
// let dirLight = new T.DirectionalLight( 0xffffff, 0.5 );
//     // dirLight.color.setHSL( 0.1, 1, 0.95 );
//     dirLight.position.set( -1, 1.75, 1 );
//     // dirLight.position.multiplyScalar( 30 );
//     lights.add( dirLight );
//     dirLight.castShadow = true;
//     dirLight.shadow.mapSize.width = 2048;
//     dirLight.shadow.mapSize.height = 2048;
// var d = 50;
//     dirLight.shadow.camera.left = -d;
//     dirLight.shadow.camera.right = d;
//     dirLight.shadow.camera.top = d;
//     dirLight.shadow.camera.bottom = -d;
//     dirLight.shadow.camera.far = 3500;
//     dirLight.shadow.bias = -0.0001;
// let dirLightHelper = new T.DirectionalLightHelper( dirLight, 10 ) 
//     lights.add( dirLightHelper );


function MoveMesh(boid, i, j) {
    let v = Math.floor(boid.x+(i-2))*subDiv + Math.floor(boid.y-j+2)
    ground.geometry.vertices[v].z += Math.sqrt(mask[i][j])
}

// const mask = [
//   [0,0,1,0,0],
//   [0,1,2,1,0],
//   [1,2,3,2,1],
//   [0,1,2,1,0],
//   [0,0,1,0,0]]

  const mask = [
      [1,2,1],
      [2,3,2],
      [1,2,1]]

let boids = new BoidsRenderer({
    boidCount: 10,
    width: subDiv,
    height: subDiv,
    update: (dt) => update(dt),
})

boids.init()

let curBoids = boids.swarm.boids || []

function update(time) {
    for (let boid of curBoids)
        for (let i=0;i<mask.length;++i) 
            for (let j=0;j<mask[i].length;++j)  
                MoveMesh(boid, i, j)
    if (++dn%3!=0) return
    ground.geometry.computeVertexNormals()
    // ground.geometry.computeFaceNormals()
    ground.geometry.verticesNeedUpdate = true
}




let renderer = new OzRenderer({
    position: { x: 0, y: 50, z: 100 },
    update: (t) => update(t),
    path: '../../data/evan-erdos/' })



renderer.add(terrain)
renderer.add(lights)

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
 


</script>

