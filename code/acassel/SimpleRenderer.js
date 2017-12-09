///
/// PlainRenderer
///
/// 2017-10-09 Ben Scott @evan-erdos <bescott.org>
///
/// a simple consolidation of the typical render setup
///
import * as T from '../acassel/module.js'

export default class SimpleRenderer {
    constructor({
            path = './',
            width = ()=>window.innerWidth,
            height = ()=>window.innerHeight,
            color = 0x5A7F8B, ground = 0xF2E9CF,
            ambient = 0x14031B, light = 0xFEEBC1,
            scattering = 0.5, brightness = 0.5,
            position = { x:0, y:0, z:0 },
            rotation = { x:0, y:0, z:0 },
            fov=60, aspect=width()/height(), near=0.001, far=2e4,
            fog = { color:0xD7FFFD, near:1e2, far:1e3 },
            gl = { antialias:true },
            update=(time=0.01) => { },
            onload=(manager, load=()=>{}) => { },
            onclick=(object={}) => { },
            }={}) {

        const clock = new T.Clock()
        const envMap = new T.CubeTexture()

        let scene = this.scene = new T.Scene()
            scene.background = new T.Color(color)
            scene.fog = new T.Fog(fog.color, fog.near, fog.far)
            scene.add(new T.AmbientLight(ambient,scattering))
            scene.add(new T.HemisphereLight(light,ground,brightness))


        let camera = this.camera = new T.PerspectiveCamera(fov,aspect,near,far)
            camera.position.set(position.x,position.y,position.z)
            // camera.rotation.set(rotation.x,rotation.y,rotation.z)
            scene.add(camera)


        this.listener = new T.AudioListener()
            camera.add(this.listener)


        let renderer = new T.WebGLRenderer(gl)
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(width(),height())
            renderer.setClearColor(ambient, 0)
            renderer.shadowMap.enabled = true
            renderer.shadowMap.type = T.PCFSoftShadowMap

        let controls = new T.Controls(camera, renderer.domElement)
            controls.enableZoom = true
        
        // let controls = new T.FlyControls(camera, renderer.domElement);
        //     controls.movementSpeed = 1000;
        //     controls.rollSpeed = Math.PI / 24;
        //     controls.autoForward = false;
        //     controls.dragToLook = false;


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


        const render = () => {
            requestAnimationFrame(render.bind(this))
            update(clock.getDelta())
            controls.update()
            renderer.render(scene, camera)
        }

        const init = async () => {
            await onload(this, null)
            render()
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
