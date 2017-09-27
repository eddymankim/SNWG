///
/// SNWG - now in spaceeeeeeee
///
/// 2017-09-26 Ben Scott @evan-erdos <bescott.org>
///

import * as T from '../lib/module.js'

/// local directory for assets
const dir = '../../data/evan-erdos'

/// Planet
/// represents any kind of celestial body
class Planet {
    constructor({
        orbit = T.random(-0.05,0.05),       /// orbit time (ms)
        height = T.random(5e2,1e4),         /// orbit altitude (km)
        period = T.random(-2,2),            /// day period (ms)
        declin = T.random(-0.5,0.5),        /// declination (rad)
        offset = T.random(0,360),           /// orbit offset (rad)
        geometry = [T.random(24,32),32,32],
        material = {
            color: 0xFFFFFF,                /// tint color (hex)
            specular: 0x111111,             /// spec color (hex)
            shininess: 10,                  /// glossiness (real)
            reflectivity: 1.0 },            /// reflections (0,1)
        files = {
            physic: 'planet-physic.jpg',
            normal: 'planet-normal.jpg',
            albedo: 'planet-albedo.png'} }={}) {
        this.data = { orbit, height, period, declin }
        this.mesh = new T.Mesh(
            new T.SphereGeometry(...geometry),
            new T.MeshPhongMaterial(material))
        this.mesh.castShadow = this.mesh.recieveShadow = true
        this.obj = new T.Object3D()
        this.obj.add(this.mesh)
        this.obj.rotation.y += offset
        this.obj.rotation.x = declin
        Planet.load(this.mesh.material, files)
    }

    static async load(m,n) {
        if (n.albedo) m.map = await T.loadImage(`${dir}/${n.albedo}`)
        if (n.normal) m.normalMap = await T.loadImage(`${dir}/${n.normal}`)
        m.needsUpdate = true
    }

    render(deltaTime) {
        this.mesh.rotation.y += this.data.period*deltaTime
        this.mesh.position.z = this.data.height
        this.obj.rotation.x = this.data.declin
        this.obj.rotation.y += this.data.orbit*deltaTime
    }
}


/// Moon
/// represents smaller bodies
class Moon extends Planet {
    constructor({
            height = T.random(10, 100),
            geometry = [T.random(16,24),16,16],
            material = { color: 0xDDD, shininess: 2 } }={}) {
        super({ height, geometry, material })
    }
}


/// GasGiant
/// represents bigger planets
class GasGiant extends Planet {
    constructor({
            orbit = T.random(-5e-3, 6e-3),
            height = T.random(1e3, 5e3),
            period = T.random(-5e-2, 5e-2),
            declin = T.random(-0.24, 0.4),
            moonCount = T.random(1, 10),
            geometry = [ T.random(2e2,5e2),32,32],
            material = {
                color: 0xFFFFFF, specular: 0x555555,
                shininess: 10, reflectivity: 0 },
            files = {
                physic: 'gas-giant-physic.jpg',
                normal: 'gas-giant-normal.jpg',
                albedo: 'gas-giant-albedo.png'} }={}) {
        super({orbit, height, period, declin, geometry, material, files})
        this.moons = []
        for (let i=0;i<moonCount;++i) this.moons.push(new Moon())
        this.obj.add(...this.moons.map(o => o.obj))
    }

    render(deltaTime) { super.render(deltaTime)
        for (let moon of this.moons) {
            moon.render(deltaTime)
            moon.mesh.position.z = this.obj.position+moon.height
        }
    }
}


/// Star
/// represents celestial bodies which emit light
class Star {
    constructor({
            period = T.random(-1e-3, 1e-3),
            geometry = [ T.random(3e2, 8e2), 64, 64 ],
            material = { color: 0xFFE600 },
            files = { albedo: 'star-sun-albedo.png' },
            light = {
                color: 0xFFFAD3,
                intensity: 1,
                distance: 3e4,
                decay: 2 } }={}) {
        this.data = { period }
        this.mesh = new T.Mesh(
            new T.SphereGeometry(...geometry),
            new T.MeshBasicMaterial(material))
        this.mesh.castShadow = this.mesh.recieveShadow = false
        this.light = new T.PointLight(...Object.values(light))
        // this.light.castShadow = true
        this.obj = new T.Object3D()
        this.planets = []
        for (let i=0;i<T.pick(18);++i) this.planets.push(new Planet())
        for (let i=1;i<T.pick(6);++i) this.planets.push(new GasGiant())
        this.obj.add(this.mesh, this.light, ...this.planets.map(p => p.obj))
        for (let p of this.planets) p.height += geometry[0] // add sun radius
        Planet.load(this.mesh.material, files)
    }

    render(deltaTime) { // super.render(deltaTime)
        this.obj.rotation.y += this.data.period*deltaTime
        for (let p of this.planets) p.render(deltaTime)
    }
}


class StarField {
    constructor({
            count = 1e4,
            limit = 3e5,
            minimum = 2e4,
            func = n => T.random(-n,n),
            color = 0xAAAAAA,
            size = 2 }={}) {
        let geometry = new T.Geometry()
        let material = new T.PointsMaterial({ color, size })
        let [x,y,z] = [0,0,0] // noise.noise3
        const c = Math.floor(Math.cbrt(count))
        for (let i=0;i<c;++i) for (let j=0;j<c;++j) for (let k=0;k<c;++k) {
            [x,y,z] = [func(limit), func(limit), func(limit)]
            if (minimum<Math.sqrt(x**2+y**2+z**2))
                geometry.vertices.push(new T.Vector3(x,y,z)) }
        this.mesh = new T.Points(geometry, material)
        this.obj = new T.Object3D()
        this.obj.add(this.mesh)
    }
}


/// Main
/// program entrypoint for the whole affair
class Main {
    constructor({
            id = '#RenderCanvas',
            aspect = { width: 768, height: 512 },
            ambient = 0x14031B,
            background = 0xFEFEFE,
            renderers = [],
            renderer = { antialias: true, logarithmicDepthBuffer: true },
            fog = [ 0x000000, 5e4, 2e5 ],
            camera = [ 60, 768/512, 1, 2e5 ],
            bloom = { strength: 1, threshold: 0.4, radius: 3 },
            txaa = [ ambient, 1 ],
            film = { noise: 0.5, scan: 0.1, grayscale: 0.5 } }={}) {
        this.renderers = [...renderers]
        for (let r of renderers) scene.add(r)
        this.clock = new T.Clock()
        this.camera = new T.PerspectiveCamera(...camera)
        this.camera.position.z = 1e3
        this.renderer = new T.WebGLRenderer(renderer)
        this.renderer.setSize(aspect.width, aspect.height)
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setClearColor(background, 0)
        // this.renderer.shadowMap.enabled = true
        // this.renderer.shadowMap.type = T.PCFSoftShadowMap
        this.controls = new T.OrbitControls(this.camera,this.renderer.domElement)
        this.sun = new Star()
        this.renderers.push(this.sun)
        const starfields = [
            new StarField({ count: 1e4, material: { color: 0x111111, size: 1 }}),
            new StarField({ count: 2e3, material: { color: 0xAAAAAA, size: 1 }}),
            new StarField({ count: 1e1, material: { color: 0x448ACA, size: 2 }}),
            new StarField({ count: 2e1, material: { color: 0xAA433B, size: 1 }}),
            new StarField({ count: 1e2, material: { color: 0xFFFAD3, size: 1 }})]
        this.scene = new T.Scene()
        this.scene.fog = new T.Fog(...fog)
        this.scene.add(new T.AmbientLight(ambient))
        this.scene.add(this.sun.obj, ...starfields.map(o => o.obj))
        this.composer = new T.EffectComposer(this.renderer)
        this.composer.addPass(new T.RenderPass(this.scene, this.camera))
        this.composer.addPass(new T.FilmPass(film))
        this.composer.addPass(new T.BloomPass(bloom))
        this.composer.addPass(new T.TXAAPass(this.scene, this.camera, txaa))
        for (let pass of this.composer.passes) pass.renderToScreen = true
        document.querySelector(id).appendChild(this.renderer.domElement)
        window.onResize = () => {
            this.camera.aspect = aspect.width/aspect.height
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(aspect.width, aspect.height) }
    }

    /// render (deltaTime) => void
    /// this is the callback used by `requestAnimationFrame`,
    /// which calls render at the proper framerate to render the scene
    render(deltaTime=0.01) {
        this.controls.update()
        for (let renderer of this.renderers) renderer.render(deltaTime)
        this.composer.render(deltaTime)
        requestAnimationFrame(() => this.render(this.clock.getDelta())) }
}


new Main().render()
