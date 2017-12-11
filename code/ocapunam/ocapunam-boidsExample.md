---
layout: full
title: Final Development
permalink: /code/ocapunam-boids/
author: Ozguc
---
<script deferred type="module">

import * as THREE from '../ocapunam/module.js'
import {Boid, Swarm} from '../ocapunam/boids.js'


let scene, camera
let rtTexture 
let swarm

let sWidth = window.innerWidth
let sHeight = window.innerHeight

let boidCount = 100

let renderer = new THREE.WebGLRenderer( { preserveDrawingBuffer: true } )
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(sWidth, sHeight)
    renderer.autoClear = false;


    document.body.appendChild(renderer.domElement)

function init(){
    
    scene = new THREE.Scene()

    camera = new THREE.OrthographicCamera( 0, sWidth, 0, sHeight, -10000, 10000 )
    camera.position.z = 1000

    swarm = new Swarm(sWidth, sHeight)
    swarm.createBoids(scene, boidCount)
    swarm.id = setInterval(swarm.animate, 10000)

    rtTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat } )
    

}
    
function animate(){
    requestAnimationFrame(animate)
    swarm.animate()
    render()
}

function render() { 
    renderer.render(scene, camera)
    renderer.render(scene,camera,rtTexture)
} 
    
    init()
    animate()

</script>

