///
/// SNWG Foray into WebGL
///
/// 2017-09-26 Ben Scott @evan-erdos <bescott.org>
///
import * as THREE from '../lib/module.js'


/// a variable
var background = 0xFFFFFF

/// a variable which cannot be redefined
let id = '#RenderCanvas'

/// root directory for asset files
const dir = '../../data/evan-erdos'


let clock = new THREE.Clock()

function getRatio() {
    return 756/512
}

const getAspect = () => [756, 512]

let camera = new THREE.PerspectiveCamera(60, getRatio(), 1, 2e5)
    camera.position.z = 100

let renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setClearColor(background,1)
    renderer.setSize(...getAspect())
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

let light = new THREE.DirectionalLight(0xFFFAD3, 1)
    light.position.set(100,200,100)

let scene = new THREE.Scene()
    scene.fog = new THREE.Fog(background, 2**16, 2e5)
    scene.add(camera, light, new THREE.AmbientLight(0x14031B))

document.querySelector(id).appendChild(renderer.domElement)

window.onResize = () => {
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
}

function render(deltaTime=0.01) {
    renderer.render(scene, camera)
    requestAnimationFrame(() => render(clock.getDelta()))
}


const geometry = new THREE.SphereGeometry(32,16,16)
const material = new THREE.MeshPhongMaterial({
    color: 0xAAAAAA, shininess: 20 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

render()


