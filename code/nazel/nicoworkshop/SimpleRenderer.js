///
/// SimpleRenderer
///
/// 2017-10-09 Ben Scott @evan-erdos <bescott.org>
///
/// a simple consolidation of the typical render setup
///
import * as THREE from '../lib/module.js'

export default class SimpleRenderer {
    constructor({
            path = '../../data/',
            width = window.innerWidth,
            height = window.innerHeight,
            background = 0x5A7F8B,
            ambient = 0x14031B,
            light = 0xFEEBC1,
            ground = 0xF2E9CF,
            webgl = { antialias: true, shadowMapEnabled: true },
            position = { x:0, y:0, z:0 },
            fog = { color: 0xD7FFFD, near: 1e2, far: 1e3 },
            cam = { fov: 60, aspect: width/height, near: 0.1, far: 2e4 },
            update = (time) => { },
            }={}) {

        let clock = new THREE.Clock()

        let listener = new THREE.AudioListener()

        let renderer = new THREE.WebGLRenderer(webgl)
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(width, height)
            renderer.setClearColor(ambient, 0)
            renderer.shadowMap.type = THREE.PCFSoftShadowMap
            renderer.shadowMap.enabled = true


        let scene = new THREE.Scene()
            scene.fog = new THREE.Fog(...Object.values(fog))
            scene.background = new THREE.Color(background)
            scene.add(new THREE.AmbientLight(ambient))


        let camera = new THREE.PerspectiveCamera(...Object.values(cam))
            camera.position.set(...Object.values(position))
            scene.add(camera)


        let sun = new THREE.HemisphereLight(light, ground, 0.5)
            sun.position.set(1,2,0)
            scene.add(sun)

        let controls = new THREE.OrbitControls(camera,renderer.domElement)

        this.add = (...things) => things.forEach(o => scene.add(o))


        const render = () => {
            requestAnimationFrame(render.bind(this))
            controls.update()
            update(clock.getDelta())
            renderer.render(scene, camera)
        }


        const resize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }


        window.addEventListener('resize', resize, false)
        window.addEventListener('load', () => render(), false)
        document.body.appendChild(renderer.domElement)
    }//end constructor
}// end class
