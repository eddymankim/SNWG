///
/// RendererCamera
///
/// 2017-10-01 Ben Scott @evan-erdos <bescott.org>
///
/// encapsulates most of the pipeline
///
import * as T from '../lib/module.js'

export default class RendererCamera {
    constructor({
            file = '../../data/',
            id = '#RenderCanvas',
            fullscreen = true,
            width = window.innerWidth,
            height = window.innerHeight,
            background = 0x000000,
            ambient = 0x14031B,
            objects = [],
            scenery = [],
            fov = 60,
            near = 1,
            far = 2e5,
            position = { x:0, y:0, z:0 },
            rotation = { x:0, y:0, z:0 },
            webgl = { antialias: true, logarithmicDepthBuffer: true },
            fog = { color: 0x000000, near: 5e4, far: 2e6 },
            bloom = { strength: 1, threshold: 0.4, radius: 3 },
            film = { noise: 0.5, scan: 0.1, grayscale: 0.5 },
            txaa = { color: 0x14031B, alpha: 1 },
            files = { sky: 'ash-canyon', },
            }={}) {
        this.objects = objects
        let clock = new T.Clock()
        let renderer = new T.WebGLRenderer(webgl)
            renderer.setSize(width, height)
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setClearColor(background, 0)
            renderer.shadowMap.enabled = true
            renderer.shadowMap.type = T.PCFSoftShadowMap
        let camera = new T.PerspectiveCamera(fov, width/height, near, far)
            camera.position.set(0,0,1e3)
        let container = renderer.domElement
        this.scene = new T.Scene()
        this.scene.fog = new T.Fog(fog.color, fog.near, fog.far)
        this.scene.background = new T.Color(background)
        this.scene.add(camera, new T.AmbientLight(ambient))
        this.scene.add(...this.objects.map(o=>o.object))
        this.scene.add(...scenery.map(o=>o.object))
        this.objects.push(new T.OrbitControls(camera, container))
        let composer = new T.EffectComposer(renderer)
        const passes = [
            new T.RenderPass(this.scene, camera),
            new T.FilmPass(film),
            new T.BloomPass(bloom),
            new T.TXAAPass(this.scene, camera, Object.values(txaa)) ]

        for (let pass of passes) composer.addPass(pass)
        for (let pass of composer.passes) pass.renderToScreen = true

        // this.envMap = new T.CubeTextureLoader()
        //     .setPath(`${file}/${files.sky}/`).load([
        //         `${files.sky}+z.png`, `${files.sky}-z.png`,
        //         `${files.sky}+y.png`, `${files.sky}-y.png`,
        //         `${files.sky}+x.png`, `${files.sky}-x.png`])

        const _render = (time=clock.getDelta()) => {
            requestAnimationFrame(_render.bind(this))
            this.update()
            this.render()
            composer.render(time)
        }

        const resize = () => {
            [width, height] = [window.innerWidth, window.innerHeight]
            camera.aspect = width / height
            camera.updateProjectionMatrix()
            composer.setSize(width, height)
        }

        document.querySelector(id).appendChild(container)
        window.addEventListener('resize', resize)
        _render()
    }

    add(o) { this.scene.add(o.object) }

    update() { for (let o of this.objects) o.update() }

    render() { }
}
