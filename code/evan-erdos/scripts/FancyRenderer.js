///
/// FancyRenderer
///
/// 2017-10-01 Ben Scott @evan-erdos <bescott.org>
///
/// encapsulates most of the pipeline
///
import * as M from '../module.js'
import * as E from '../scripts/module.js'
import * as Effects from '../effects/module.js'
import * as Shaders from '../shaders/module.js'

export default class FancyRenderer {
    constructor({
            path='./', id='#viewport',
            files={ skybox: ['arrakis-day.hdr'], },
            useShadows=true, useEffects=true,
            width=()=>window.innerWidth,
            height=()=>window.innerHeight,
            color=0x5A7F8B, ambient=0x14031B,
            light=0xFEEBC1, ground=0xF2E9CF,
            position={x:0,y:10,z:10}, rotation={x:0,y:0,z:0},
            cam={fov:60,aspect:width()/height(),near:0.01,far:2e5},
            hdr={ exposure:1.5, whitePoint:1.0,
                tonemapping:M.LinearToneMapping, },
            gl={ antialias:true, logarithmicDepthBuffer:true,
                alpha:false, gamma:false, physical:true,
                shadowType:M.PCFSoftShadowMap,
                pixelRatio:window.devicePixelRatio, },
            fog={ color:0xCBDBFE, near:1e2, far:1e3 },
            alias={ width:width(), height:height(), },
            bloom={ power:1.0, kernel:36, sigma:1, size:256 },
            grain={ noise:0.1, scan:0.6, grayscale:0 },
            shift={
                pow:{r:1.5, g:1.5, b:1.6},
                mul:{r:1.1, g:1.1, b:1.1},
                add:{r:0.1, g:0.2, b:0.1}, },
            objects=[], scenery=[],
            lights=[
                new M.DirectionalLight(light,0.5),
                new M.HemisphereLight(light,ground,1),
                new M.AmbientLight(ambient), ],
            effects=[
                new Effects.FilmPass(grain),
                new Effects.ShaderPass(Shaders.Vignette), ],
            onload=(context, load=()=>{}) => { },
            update=(time=0.01) => { },
            onclick=(object={}) => { },
            }={}) {
        const clock = new M.Clock()
        const envMap = this.envMap = new M.CubeTexture()
        const raycaster = new M.Raycaster()
        const importer = new M.Importer({ path })
        const mouse = new M.Vector2()
        let isEnabled = true, time = 0

        let listener = this.listener = new M.AudioListener()

        let camera = this.camera = new E.Camera(cam)
            camera.position.set(position.x,position.y,position.z)
            camera.rotation.set(rotation.x,rotation.y,rotation.z)
            camera.add(listener)

        let scene = this.scene = new M.Scene()
            scene.fog = new M.Fog(fog.color,fog.near,fog.far)
            scene.background = new M.Color(color)
            scene.add(camera)

        let renderer = new M.WebGLRenderer(gl)
            renderer.setPixelRatio(gl.pixelRatio)
            renderer.setSize(width(),height())
            renderer.setClearColor(ambient,0)
            renderer.gammaInput = gl.gamma
            renderer.gammaOutput = gl.gamma
            renderer.shadowMap.enabled = useShadows
            renderer.shadowMap.type = gl.shadowType
            renderer.physicallyCorrectLights = gl.physical
            renderer.toneMapping = hdr.tonemapping
            renderer.toneMappingExposure = hdr.exposure
            renderer.toneMappingWhitePoint = hdr.whitePoint

        let controls = new M.Controls(camera,renderer.domElement)

        let composer = new M.Composer(renderer)
            composer.setSize(width(),height())
            composer.add(new Effects.RenderPass(scene,camera))
            if (useEffects) for (let o of effects) composer.add(o)
            composer.passes.slice(-1)[0].renderToScreen = true

        this.setEnvMap = (env) => scene.background = env

        this.applyEnv = ({material}) => {
            if (material===undefined) return
            if (material.envMap!==null) return
            material.envMap = envMap
            material.needsUpdate = true
        }

        this.importEnv = o => o.traverse(a=>this.applyEnv(a))

        this.add = (...things) => {
            for (let thing of things) {
                this.applyEnv(thing)
                scene.add(thing)
            }
        }

        const setSize = this.setSize = (width, height) => {
            camera.setSize(width,height)
            composer.setSize(width,height)
        }

        const init = async (e) => {
            await onload(this, importer.load)
            this.add(...objects, ...scenery, ...lights)
            if (isEnabled) render()
        }

        const render = () => {
            requestAnimationFrame(render.bind(this))
            time = clock.getDelta()
            update(time)
            controls.update(time)
            composer.render(time)
        }

        const mousedown = (e) => { e.preventDefault()
            mouse.x = (e.clientX/width())*2+1
            mouse.y = -(e.clientY/height())*2+1
            raycaster.setFromCamera(mouse, camera)
            for (let hit of raycaster.intersectObjects(objects))
                if (hit!==null) onclick(hit)
        }

        const resize = () => setSize(width(),height())
        const enable = () => isEnabled = true
        const disable = () => isEnabled = false
        window.addEventListener('focus', enable, false)
        window.addEventListener('blur', disable, false)
        window.addEventListener('mousedown', mousedown, false)
        window.addEventListener('resize', resize, false)
        window.addEventListener('load', init, false)
        window.addEventListener('load', render, false)
        document.body.appendChild(renderer.domElement)
    }

    get position() { return this.camera.position }
    set position({x,y,z}) { this.camera.position.set(x,y,z) }
    get rotation() { return this.camera.rotation }
}
