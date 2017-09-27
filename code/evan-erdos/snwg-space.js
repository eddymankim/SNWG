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
    constructor(data={}) {
        const defaults = {
            orbit: T.random(-0.05,0.05),        /// orbit time (ms)
            height: T.random(4.2e3,5e3),        /// orbit altitude (km)
            offset: T.random(0,360),            /// orbit offset (rad)
            period: T.random(-2,2),             /// day period (ms)
            declin: T.random(-0.5,0.5),         /// declination (rad)
            geometry: [T.random(24,32),32,32],
            material: {
                color: 0xFFFFFF,                /// tint color (hex)
                specular: 0x111111,             /// spec color (hex)
                shininess: 10,                  /// glossiness (real)
                reflectivity: 1.0 },            /// reflections (0,1)
            files: {
                physic: 'planet-physic.jpg',
                normal: 'planet-normal.jpg',
                albedo: 'planet-albedo.png'} }
        this.data = Object.assign(defaults, data)
        let geometry = new T.SphereGeometry(...this.data.geometry)
        let material = new T.MeshPhongMaterial(this.data.material)
        this.mesh = new T.Mesh(geometry, material)
        this.mesh.castShadow = this.mesh.recieveShadow = true
        this.obj = new T.Object3D()
        this.obj.rotation.y += this.data.offset
        this.obj.add(this.mesh)
        Planet.load(this.mesh.material, this.data.files)
    }

    static async load(m,f) {
        if (f.albedo) m.map = await T.loadImage(`${dir}/${f.albedo}`)
        if (f.normal) m.normalMap = await T.loadImage(`${dir}/${f.normal}`)
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
    constructor(data={}) { super({
        height: T.random(10, 100),
        geometry: [ T.random(16,24), 16, 16 ],
        material: { color: 0xDDDDDD, shininess: 2 } })}
}


/// GasGiant
/// represents bigger planets
class GasGiant extends Planet {
    constructor(data={}) { super({
        orbit: T.random(-5e-3, 6e-3),
        height: T.random(3e3, 5e3),
        period: T.random(-5e-2, 5e-2),
        declin: T.random(-0.24, 0.4),
        geometry: [T.random(2e2, 5e2), 32, 32],
        material: {
            color: 0xFFFFFF, specular: 0x555555,
            shininess: 10, reflectivity: 0 },
        files: {
            physic: 'gas-giant-physic.jpg',
            normal: 'gas-giant-normal.jpg',
            albedo: 'gas-giant-albedo.png'} })
        this.moons = []
        for (let i=0;i<T.pick(10);++i) this.moons.push(new Moon())
        this.obj.add(...this.moons.map(o => o.obj))
    }

    render(deltaTime) { super.render(deltaTime)
        for (let moon of this.moons) {
            moon.render(deltaTime)
            moon.mesh.position.z = this.obj.position+moon.data.height
        }
    }
}


/// Star
/// represents celestial bodies which emit light
class Star extends Planet {
    constructor(data={}) { super({
            height: 0, orbit: 0,
            period: T.random(-1e-3, 1e-3),
            declin: T.random(-0.2, 0.2),
            light: { color: 0xFFFAD3, intensity: 1, distance: 3e4, decay: 2 },
            geometry: [ T.random(3e2, 8e2), 64, 64 ],
            material: {
                color: 0xFFFAD3,
                emissive: 0xFBE62B,
                shininess: 10,
                reflectivity: 0 },
            files: { albedo: 'star-blue-albedo.png', normal: null } })
        let geometry = new T.SphereGeometry(...this.data.geometry)
        let material = new T.MeshPhongMaterial(this.data.material)
        this.mesh = new T.Mesh(geometry, material)
        this.mesh.castShadow = this.mesh.recieveShadow = false
        this.light = new T.PointLight(...Object.values(this.data.light))
        this.light.castShadow = true
        this.obj = new T.Object3D()
        this.planets = []
        for (let i=0;i<T.pick(18);++i) this.planets.push(new Planet())
        for (let i=1;i<T.pick(6);++i) this.planets.push(new GasGiant())
        this.obj.add(this.mesh, this.light)
        this.obj.add(...this.planets.map(p => p.obj))
        Planet.load(this.mesh.material, this.data.files)
    }

    render(deltaTime) { // super.render(deltaTime)
        this.obj.rotation.y += this.data.period*deltaTime
        for (let p of this.planets) p.render(deltaTime)
    }
}


class StarField {
    constructor(data={}) {
        const defaults = { count: 2e4, material: { color: 0xAAAAAA, size: 2 } }
        this.data = { ...defaults, ...data }
        this.data = Object.assign(defaults, data)
        let geometry = new T.Geometry()
        let material = new T.PointsMaterial(this.data.material)
        const [lim, min, f] = [3e5, 2e4, n => T.random(-n,n)]
        const c = Math.floor(Math.cbrt(this.data.count)) // noise.noise3
        let [x,y,z] = [f(lim), f(lim), f(lim)]
        for (let i=0;i<c;++i) for (let j=0;j<c;++j) for (let k=0;k<c;++k) {
            [x,y,z] = [f(lim), f(lim), f(lim)]
            if (min<Math.sqrt(x**2+y**2+z**2))
                geometry.vertices.push(new T.Vector3(x,y,z)) }
        this.mesh = new T.Points(geometry, material)
        this.obj = new T.Object3D()
        this.obj.add(this.mesh)
    }
}


/// Main
/// program entrypoint for the whole affair
class Main {
    constructor(data={}) {
        const defaults = {
            id: '#RenderCanvas', width: 768, height: 512,
            ambient: 0x14031B, background: 0xFEFEFE,
            fog: { color: 0xFEFEFE, near: 2**16, far: 2**18 },
            cam: { fov: 60, aspect: 768/512, near: 1, far: 2**17 },
            bloom: { strength: 5, size: 25, sigma: 5, res: 256 },
            film: { noise: 0.5, scan: 0.05, scanlines: 1024, gray: 0.875 },
            webgl: { antialias: true, logarithmicDepthBuffer: true } }
        this.data = { ...defaults, ...data }
        this.renderers = []
        this.clock = new T.Clock()
        this.camera = new T.PerspectiveCamera(...Object.values(this.data.cam))
        this.camera.position.z = 2048
        this.renderer = new T.WebGLRenderer(this.data.webgl)
        this.renderer.setSize(this.data.width, this.data.height)
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setClearColor(this.data.background, 0)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = T.PCFSoftShadowMap
        this.controls = new T.OrbitControls(this.camera, this.renderer.domElement)
        this.controls.userZoom = false
        this.sun = new Star()
        this.renderers.push(this.sun)
        const starfields = [
            new StarField({ count: 2e4, material: { color: 0x111111, size: 1 }}),
            new StarField({ count: 2e3, material: { color: 0xAAAAAA, size: 1 }}),
            new StarField({ count: 2e1, material: { color: 0x448ACA, size: 2 }}),
            new StarField({ count: 2e1, material: { color: 0xAA433B, size: 1 }}),
            new StarField({ count: 2e2, material: { color: 0xFFFAD3, size: 1 }})]
        this.scene = new T.Scene()
        this.scene.fog = new T.Fog(...Object.values(this.data.fog))
        this.scene.add(new T.AmbientLight(this.data.ambient))
        this.scene.add(this.sun.obj, ...starfields.map(o => o.obj))
        this.data.txaa = [ this.scene, this.camera, this.ambient, 1 ]
        const initPass = (C,d) => {
            let pass = new C(...Object.values(d))
            pass.renderToScreen = true; return pass }
        this.composer = new T.EffectComposer(this.renderer)
        this.composer.addPass(new T.RenderPass(this.scene, this.camera))
        this.composer.addPass(initPass(T.FilmPass, this.data.film))
        this.composer.addPass(initPass(T.BloomPass, this.data.bloom))
        this.composer.addPass(initPass(T.TXAAPass, this.data.txaa))
        document.querySelector(this.data.id).appendChild(this.renderer.domElement)
        window.onResize = () => {
            this.camera.aspect = this.data.width/this.data.height
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(this.data.width,this.data.height) }
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
