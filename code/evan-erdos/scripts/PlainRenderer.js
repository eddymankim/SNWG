///
/// PlainRenderer
///
/// 2017-10-09 Ben Scott @evan-erdos <bescott.org>
///
/// a simple consolidation of the typical render setup
///
import * as M from '../module.js'

export default class PlainRenderer {
    constructor({
            path = './',
            width = ()=>window.innerWidth,
            height = ()=>window.innerHeight,
            color = 0x5A7F8B, ground = 0xF2E9CF,
            ambient = 0x14031B, light = 0xFEEBC1,
            objects = [],
            position = { x:0, y:0, z:0 },
            rotation = { x:0, y:0, z:0 },
            fov=60, aspect=width()/height(), near=0.1, far=2e4,
            fog = { color:0xD7FFFD, near:1e2, far:1e3 },
            gl = { antialias:true },
            update=(time=0.01) => { },
            onload=(manager, load=()=>{}) => { },
            onclick=(object={}) => { },
            }={}) {

        const envMap = new M.CubeTexture()

        let importer = new M.Importer({ path })

        let scene = new M.Scene()
            scene.background = new M.Color(color)
            scene.fog = new M.Fog(fog.color,fog.near,fog.far)
            scene.add(new M.AmbientLight(ambient))
            scene.add(new M.HemisphereLight(light,ground,0.5))


        let camera = new M.PerspectiveCamera(fov,aspect,near,far)
            camera.position.set(position.x,position.y,position.z)
            camera.rotation.set(rotation.x,rotation.y,rotation.z)
            scene.add(camera)


        this.listener = new M.AudioListener()
            camera.add(this.listener)


        let renderer = new M.WebGLRenderer(gl)
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(width(),height())
            renderer.setClearColor(ambient, 0)
            renderer.shadowMap.enabled = true
            renderer.shadowMap.type = M.PCFSoftShadowMap

        let controls = new M.Controls(camera,renderer.domElement)

        this.add = (...things) => things.forEach(o=>scene.add(o))

        this.setEnvMap = (env) => scene.background = env

        this.applyAtmosphere = ({material}) => {
            if (material===undefined) return
            if (material.envMap!==null) return
            material.envMap = envMap
            material.needsUpdate = true
        }

        this.importAtmosphere = thing =>
            thing.traverse(a=>this.applyAtmosphere(a))

        const init = async () => {
            this.add(...objects)
            await onload(this, importer.load)
            render()
        }

        const render = () => {
            requestAnimationFrame(render.bind(this))
            update()
            controls.update()
            renderer.render(scene, camera)
        }

        const resize = () => {
            camera.aspect = width()/height()
            camera.updateProjectionMatrix()
            renderer.setSize(width(),height())
        }

        window.addEventListener('resize', resize, false)
        window.addEventListener('load', init, false)
        document.body.appendChild(renderer.domElement)
    }
}
