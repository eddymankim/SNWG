
export default class setupClass {
    constructor(
      { // Constructor inputs
            path = '../../data/',
            width = 500,
            height = 500,
            background = 0x151b0a,
            ambient = 0x14031B,
            light = 0xFEEBC1,
            ground = 0xF2E9CF,
            webgl = { antialias: true, shadowMapEnabled: true },
            position = { x:0, y:0, z:0 },
            fog = { color: 0xD7FFFD, near: 1e2, far: 1e3 },
            cam = { fov: 60, aspect: width/height, near: 0.1, far: 2e4 },
            update = (time) => { },
      }={})
      { //Start of Constructor function

        let gui = new dat.GUI({ autoPlace: false });
        let guiDiv = document.getElementById('my-gui-div');
        guiDiv.appendChild(gui.domElement);

        let clock = new pkgLib.Clock()

        let listener = new pkgLib.AudioListener()

        let renderer = new pkgLib.WebGLRenderer(webgl)
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(width, height)
            renderer.setClearColor(ambient, 0)
            renderer.shadowMap.type = pkgLib.PCFSoftShadowMap
            renderer.shadowMap.enabled = true


        let scene = new pkgLib.Scene()
            scene.fog = new pkgLib.Fog(...Object.values(fog))
            scene.background = new pkgLib.Color(background)
            scene.add(new pkgLib.AmbientLight(ambient))


        let camera = new pkgLib.PerspectiveCamera(...Object.values(cam))
            camera.position.set(...Object.values(position))
            scene.add(camera)


        //let sun = new pkgLib.HemisphereLight(light, ground, 0.5)
        //    sun.position.set(1,2,0)
        //    scene.add(sun)

        let controls = new pkgLib.OrbitControls(camera,renderer.domElement)

        this.ObjectsToScene = (...things) => things.forEach(o => scene.add(o))


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


        window.addEventListener('resize', resize, false);
        window.addEventListener('load', () => render(), false);
        let div = document.getElementById('3dDiv')
        div.appendChild(renderer.domElement)
    }//end constructor
}//end of class
