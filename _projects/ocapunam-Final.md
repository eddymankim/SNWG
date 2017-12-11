---
layout: full
author: Ozguc
title: Field of Lights
thumbnail: ocapunam-Final.gif
assignment: 99
final: true
---

<!-- <body> -->
<div id="info" style="
        position:fixed; top:0.5em;
        width:100%; height:4em; z-index:99;"><center>
    Welcome to Wanderland!<br/>
    Press <b>R</b> to Reset,
    <b>WASD</b> to Move.
</center></div>

<script deferred type="module">

import * as T from '../code/ocapunam/module.js   '

import OzRenderer from '../code/ocapunam/OzRenderer-finalDev.js'
import BoidsRenderer from '../code/ocapunam/BoidsRenderer.js'

let dt = 0, dn = 0, iBoid = 0

let ground, starsGeometry, objects = []
let terrain = new T.Object3D(), sky = new T.Object3D()
let raycaster
let subDiv = 256
let dim = 1e4

let rtMaterial = new T.MeshPhongMaterial({ color: 0xbea9de})

    ground = new T.Mesh(
    new T.PlaneGeometry(dim, dim, subDiv, subDiv), rtMaterial)
    ground.rotation.set(-Math.PI/2,0,0)
    ground.castShadow = true
    ground.receiveShadow = true
    terrain.add(ground)
    objects.push(ground)


starsGeometry = new T.Geometry();

for ( let i = 0; i < 10000; i ++ ) {

    let star = new T.Vector3();
    star.x = T.Math.randFloatSpread( 2000 );
    star.y = T.Math.randFloatSpread( 2000 );
    star.z = T.Math.randFloatSpread( 2000 );

    starsGeometry.vertices.push( star );

}

let starsMaterial = new T.PointsMaterial( { color: 0x888888 } );

let starField = new T.Points( starsGeometry, starsMaterial );

sky.add( starField );

function ResetGround(){
    terrain.remove(ground)
    ground = new T.Mesh(
    new T.PlaneGeometry(dim, dim, subDiv, subDiv), rtMaterial)
    ground.rotation.set(-Math.PI/2,0,0)
    ground.castShadow = true
    ground.receiveShadow = true
    terrain.add(ground)
    objects.push(ground)
}


function MoveMesh(boid, i, j) {
    let v = Math.floor(boid.x+(i-2))*subDiv + Math.floor(boid.y-j+2)
    ground.geometry.vertices[v].z += Math.sqrt(mask[i][j]) * multiplier
}

const mask = [
  [0,0,1,0,0],
  [0,1,2,1,0],
  [1,2,3,2,1],
  [0,1,2,1,0],
  [0,0,1,0,0]]

// const mask = [
//       [1,2,1],
//       [2,3,2],
//       [1,2,1]]

let multiplier = 2

let boids = new BoidsRenderer({
    boidCount: 50,
    width: subDiv,
    height: subDiv,
    update: (dt) => update(dt),
})

boids.init()

let curBoids = boids.swarm.boids || []

raycaster = new T.Raycaster( new T.Vector3(0,10,0), new T.Vector3( 0, - 1, 0 ), 0, 100 );


function update(time) {
    for (let boid of curBoids)
        for (let i=0;i<mask.length;++i)
            for (let j=0;j<mask[i].length;++j)
                MoveMesh(boid, i, j)

    raycaster.ray.origin.copy( renderer.camera.position );
    raycaster.ray.origin.y += 50;

    var intersect = raycaster.intersectObjects( objects )[0]

    if (intersect != undefined){
    renderer.camera.position.y = intersect.point.y + 5
    }
    if(renderer.camera.position.x <= -(dim/2-100)){
        renderer.camera.position.x = -(dim/2-100)
    }
    if(renderer.camera.position.x >= (dim/2-100)){
        renderer.camera.position.x = (dim-100)
    }
    if(renderer.camera.position.z <= -(dim/2-100)){
        renderer.camera.position.z = -(dim-100)
    }
    if(renderer.camera.position.z >= (dim/2-100)){
        renderer.camera.position.z = (dim/2-100)
    }

    if (++dn%4!=0) return
    ground.geometry.computeVertexNormals()
    ground.geometry.verticesNeedUpdate = true
}


let renderer = new OzRenderer({
    position: { x: 0, y: 10, z: 0 },
    background: 0x2e4482,
    ambient: 0x546bab,
    update: (t) => update(t),
    })

renderer.add(terrain, sky)

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 82) {
        ResetGround()
    }
};

</script>
<!-- </body> -->


<!--
<iframe width="100%" height="600" src="/code/ocapunam-final/"></iframe>
<div id="text">
Wander through the ever-changing topography of wanderland. Agent-based swarm simulation manipulates the land you are walking on over time, creating mountains and valleys that you can climb over. At each instance, the state of the land is unique and offers a whole new world to discover.
<br />
<br />
Click <a href="../code/ocapunam-final/">here</a> for fullscreen.
</div>
-->
