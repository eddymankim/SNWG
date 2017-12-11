---
layout: full
title: Final Development
permalink: /code/ocapunam-meshTerrain/
author: Ozguc
---
<body>
<div id="info"><center>Press <b>R</b> to Reset the Field.</center>
        </div>
<script deferred type="module">

import * as T from '../ocapunam/module.js   '

import sRenderer from '../ocapunam/SimpleRenderer.js'

let dt = 0, dn = 0

let ground
let terrain = new T.Object3D()
let raycaster
let subDiv = 64
let dim = 1e2

let rtMaterial = new T.MeshPhongMaterial({ color: 0xbea9de})

    ground = new T.Mesh(
    new T.PlaneGeometry(dim, dim, subDiv, subDiv), rtMaterial)
    ground.rotation.set(-Math.PI/2,0,0)
    ground.castShadow = true
    ground.receiveShadow = true
    terrain.add(ground)

function ResetGround(){
    terrain.remove(ground)
    ground = new T.Mesh(
    new T.PlaneGeometry(dim, dim, subDiv, subDiv), rtMaterial)
    ground.rotation.set(-Math.PI/2,0,0)
    ground.castShadow = true
    ground.receiveShadow = true
    terrain.add(ground)
}

function update(time) {
    
    if (++dn%4!=0) return
    let temp =  T.randomInt(0,ground.geometry.vertices.length)
    ground.geometry.vertices[temp].z += T.randomInt(1,10)
    ground.geometry.computeVertexNormals()
    ground.geometry.verticesNeedUpdate = true
}


let renderer = new sRenderer({
    position: { x: dim, y: dim/2, z: dim },
    background: 0x2e4482,
    ambient: 0x546bab,
    update: (t) => update(t),
    })

renderer.add(terrain)
 
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 82) {
        ResetGround()
    }
}

</script>
</body>

