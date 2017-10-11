///
/// FancyRenderer
///
/// 2017-10-01 Ben Scott @evan-erdos <bescott.org>
///
/// encapsulates most of the pipeline
///
import * as T from '../lib/module.js'
import * as E from '../lib/effects/module.js'

const loader = new T.TextureLoader()

export default class FancyRenderer {
    constructor({
            path = '../../data/', id = '#RenderCanvas',
            width = window.innerWidth, height = window.innerHeight,
            background = 0x5A7F8B, ambient = 0x14031B,
            light = 0xFEEBC1, ground = 0xF2E9CF,
            objects = [], scenery = [], selectables = [],
            position = { x:0, y:10, z:10 }, rotation = { x:0, y:0, z:0 },
            fog = { color: 0xCBDBFE, near: 1e2, far: 1e3 },
            cam = { fov: 60, aspect: width/height, near: 0.1, far: 2e5 },
            webgl = { antialias: true, logarithmicDepthBuffer: true },
            bloom = { strength: 1, threshold: 0.4, radius: 3 },
            film = { noise: 0.5, scan: 0.1, grayscale: 0.5 },
            files = { sky: 'ash-canyon', },
            update = (time) => { },
            onclick = (object) => object.onclick(),
            }={}) {
        const clock = new T.Clock()
        const listener = new T.AudioListener()
        const raycaster = new T.Raycaster()
        const mouse = new T.Vector2()

        let renderer = new T.WebGLRenderer(webgl)
            renderer.setSize(width, height)
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setClearColor(ambient, 0)
            renderer.shadowMap.enabled = true
            renderer.shadowMap.type = T.PCFSoftShadowMap

        let camera = new T.PerspectiveCamera(...Object.values(cam))
            camera.position.set(...Object.values(position))
            camera.rotation.set(...Object.values(rotation))

        let sun = new T.HemisphereLight(light,ground,1)
            sun.position.set(1,2,0)

        let scene = new T.Scene()
            scene.fog = new T.Fog(...Object.values(fog))
            scene.background = new T.Color(background)
            scene.add(camera, sun, new T.AmbientLight(ambient))

        let composer = new E.EffectComposer(renderer)
            composer.addPass(new E.RenderPass(scene, camera))
            composer.addPass(new E.FilmPass(film))
            composer.addPass(new E.BloomPass(bloom))
            composer.addPass(new E.TXAAPass(scene,camera,background,1))

        for (let o of composer.passes) o.renderToScreen = true
        for (let o of scenery) scene.add(o)
        for (let o of objects) scene.add(o.object)

        objects.push(new T.OrbitControls(camera,renderer.domElement))

        scene.background = this.envMap = new T.CubeTextureLoader()
            .setPath(`${path}/${files.sky}/`).load([
                `${files.sky}+z.png`, `${files.sky}-z.png`,
                `${files.sky}+y.png`, `${files.sky}-y.png`,
                `${files.sky}+x.png`, `${files.sky}-x.png`])

        this.add = (...things) => things.forEach(o => scene.add(o))

        this.addObject = (...things) => { this.add(things)
            things.forEach(o => objects.push(o)) }

        const render = (time=clock.getDelta()) => {
            requestAnimationFrame(render.bind(this, clock.getDelta()))
            for (let o of objects) o.update(time)
            update(time); composer.render(time)
        }

        const mousedown = (e) => {
            e.preventDefault()
            mouse.x = (e.clientX/window.innerWidth)*2+1
            mouse.y = -(e.clientY/window.innerHeight)*2+1
            raycaster.setFromCamera(mouse, camera)
            for (let hit of raycaster.intersectObjects(selectables))
                if (hit!==null) onclick(hit)
        }

        const resize = () => {
            width = window.innerWidth
            height = window.innerHeight
            camera.aspect = width / height
            camera.updateProjectionMatrix()
            composer.setSize(width, height)
        }

        window.addEventListener('mousedown', mousedown)
        window.addEventListener('resize', resize)
        document.body.appendChild(renderer.domElement)
        render()
    }


    static *load(path='../../data/', ...files) {
        for (let file of files)
            yield new Promise((c,r) => loader.load(`${path}${file}`,c)) }

    // static async load(material, path='../../data/', ...files) {
    //     loader.setPath(`${path}/`)
    //     const loadImage = (f) => new Promise((c,r) => loader.load(f,c))
    //     if (files.albedo) material.map = await loadImage(files.albedo)
    //     if (files.normal) material.normalMap = await loadImage(files.normal)
    //     material.needsUpdate = true
    // }
}
