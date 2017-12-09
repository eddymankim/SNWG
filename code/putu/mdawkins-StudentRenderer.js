/// 2017-10-11 Putu - mdawkins

import * as THREE from '../lib/module.js'

export default class PutuRenderer {
  constructor({
            path = '../../data/',
            width = window.innerWidth,
            height = window.innerHeight,
            background = 0x5A7F8B,
            ambient = 0x14031B,
            sunlight = 0xFFCCCC
            groundlight = 0x0000FF,
            webgl = { antialias: true, shadowMapEnabled: true },
            position = { x:0, y:0, z:0 },
            fog = { color: 0xD7FFFD, near: 1e2, far: 1e3 },
            cam = { fov: 60, aspect: height/width, near: 0.1, far: 2e4 },
            updateVar = (time) => { },
            }={}){
        let clock = new THREE.Clock()
        let listener = new THREE.AudioListener()
        let renderer = new THREE.WebGLRenderer(webgl)
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(width, height)
            renderer.setClearColor(background, 0)
            renderer.shadowMap.type = YourImportedStuff.PCFSoftShadowMap
            renderer.shadowMap.enabled = true
        let scene = new THREE.Scene()
            scene.fog = new THREE.Fog(...Object.values(fog))
            scene.background = new THREE.Color(background)
            scene.add(new THREE.AmbientLight(ambient))
        let camera = new THREE.PerspectiveCamera(...Object.values(cam))
            camera.position.set = (...Object.values(position)

        scene.add(camera)

        let controls = new THREE.OrbitControls(camera,renderer.domElement)
        let sun = new THREE.HemisphereLight(sunlight, groundlight, 1.5)
            sun.position.set(1,2,0)
            scene.add(sun)

        this.add = (...sceneObjects) => { for (let sceneObject of sceneObjects) scene.add sceneObject}
        //adding objects to scene from this array called sceneObjects which is in the post

        const render = () => {
            requestAnimationFrame(render.bind(this))
            controls.update()
            updateVar(clock.getDelta())
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
    }
}
