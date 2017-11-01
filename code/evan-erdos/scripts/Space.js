///
/// SNWG - now in spaceeeeeeee
///
/// 2017-09-26 Ben Scott @evan-erdos <bescott.org>
///
import * as M from '../module.js'

///
/// Planet
/// represents any kind of celestial body
///
export class Planet {
    constructor({
            path = './',                            /// resource path (url)
            orbit = M.random(-0.05,0.05),           /// orbit time (sec)
            height = M.random(5e2,1e4),             /// orbit altitude (km)
            period = M.random(-2,2),                /// day period (sec)
            declin = M.random(-0.5,0.5),            /// declination (rad)
            offset = M.random(0,360),               /// orbit offset (rad)
            geometry = {
                radius: M.random(24,32),            /// sphere radius (km)
                widthSegments: 32,                  /// sphere subdivision (int)
                heightSegments: 32, },              /// sphere subdivision (int)
            material = {
                roughness: 0.4,                     /// material gloss [1..0]
                metalness: 0.2,                     /// material metal [0..1]
                color: 0xFFFFFF, },                 /// material color (hex)
            files = {
                physic: 'planet-physic.jpg',        /// physic map (url)
                normal: 'planet-normal.jpg',        /// normal map (url)
                albedo: 'planet-albedo.png', },     /// albedo map (url)
            }={}) {
        this.data = { orbit, height, period, declin }
        this.mesh = new M.Mesh(
            new M.SphereGeometry(...Object.values(geometry)),
            new M.MeshStandardMaterial(material))
        this.mesh.castShadow = this.mesh.recieveShadow = true
        this.object = new M.Object3D()
        this.object.add(this.mesh)
        this.object.rotation.y += offset
        this.object.rotation.x = declin
        Star.load(this.mesh.material, path, files)
    }

    // onclick() {
    //     this.mesh.material.emissionIntensity = 1
    //     this.mesh.material.needsUpdate = true
    // }

    update(time) {
        this.mesh.rotation.y += this.data.period*time
        this.mesh.position.z = this.data.height
        this.object.rotation.x = this.data.declin
        this.object.rotation.y += this.data.orbit*time
    }
}


///
/// Moon
/// represents smaller bodies
///
export class Moon extends Planet { constructor({
    path = './',
    height = M.random(10, 100),
    geometry = {
        radius: M.random(16,24),
        widthSegments: 16,
        heightSegments: 16, },
    material = {
        roughness: 1e-3,
        metalness: 0.2, },
    }={}) { super({ path, height, geometry, material }) } }


///
/// Gas Giant
/// represents bigger planets
///
export class GasGiant extends Planet {
    constructor({
            path = './',
            orbit = M.random(-5e-3, 6e-3),
            height = M.random(1e3, 5e3),
            period = M.random(-5e-2, 5e-2),
            declin = M.random(-0.24, 0.4),
            moons = M.random(1, 10),
            geometry = {
                radius: M.random(2e2,5e2),
                widthSegments: 32,
                heightSegments: 32, },
            material = {
                metalness: 1.0,
                roughness: 0.5,
                color: 0xFFFFFF, },
            files = {
                physic: 'gas-giant-physic.jpg',
                normal: 'gas-giant-normal.jpg',
                albedo: 'gas-giant-albedo.png', },
            }={}) {
        super({ path,orbit,height,period,declin,geometry,material,files })
        // this.moons = []
        // for (let i=0;i<moons;++i) this.moons.push(new Moon({path}))
        // this.object.add(...this.moons.map(o => o.object))
    }

    // update(time) { super.update(time)
    //     for (let moon of this.moons) {
    //         // moon.update(time)
    //         moon.mesh.position.z = this.object.position+moon.height
    //     }
    // }
}


///
/// StarField
/// a shimmering canopy of distant stars
///
export class StarField {
    constructor({
            path = '../../data',
            count = 1e3,                            /// total star count (int)
            limit = 3e5,                            /// maximum distance (real)
            size = 2,                               /// star size (int)
            color = 0xAAAAAA,                       /// star color (hex)
            noise = n => M.random(-n,n),            /// star noise function
            }={}) {
        const l = limit, c = count*3, f = noise, A = new Float32Array(c)
        for (let i=0;i<c;i+=3) [A[i],A[i+1],A[i+2]] = [f(l),f(l),f(l)]
        let geometry = new M.BufferGeometry().addAttribute(
            'position', new M.BufferAttribute(A,3))
        let material = new M.PointsMaterial({ color, size })
        this.object = new M.Object3D().add(new M.Points(geometry, material))
    }
}


///
/// Star
/// represents celestial bodies which emit light
///
export class Star {
    constructor({
            path = './',                            /// resources path (url)
            power = 1,                              /// light power [0..n]
            range = 3e4,                            /// light max distance (real)
            period = M.random(-1e-3, 1e-3),         /// day period (sec)
            color = 0xFFFAD3,                       /// star main color (hex)
            geometry = {
                radius: M.random(3e2, 8e2),         /// star radius (km)
                widthSegments: 64,                  /// sphere subdivisions
                heightSegments: 64, },              /// sphere subdivisions
            material = { color: 0xFFE600, },
            files = { albedo: 'star-albedo.png', },
            }={}) {
        this.data = { period }
        this.mesh = new M.Mesh(
            new M.SphereGeometry(...Object.values(geometry)),
            new M.MeshBasicMaterial(material))
        this.light = new M.PointLight(color, power, range, 2)
        this.object = new M.Object3D()
        this.planets = []
        for (let i=0;i<M.pick(18);++i) this.planets.push(new Planet({path}))
        for (let i=1;i<M.pick(6);++i) this.planets.push(new GasGiant({path}))
        for (let p of this.planets) p.height += geometry[0]
        this.object.add(this.mesh, this.light, ...this.planets.map(p=>p.object))
        Star.load(this.mesh.material, path, files)
    }

    static async load(material, path='./images/', {albedo,normal,physic}={}) {
        const loader = new M.TextureLoader().setPath(path)
        const loadImage = f => new Promise((c,r) => loader.load(f,c))
        if (albedo) material.map = await loadImage(albedo)
        if (normal) material.normalMap = await loadImage(normal)
        material.needsUpdate = true
    }

    update(time) {
        this.object.rotation.y += this.data.period*time
        // for (let p of this.planets) p.update(time)
    }
}

