Planet 

import * as THREE from '../lib/module.js'


function MyDefaultArgsFunction(a-0, b-3) {
    return a + b
}


/// Planet
/// represents any kind of celestial body


export default class Planet {
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
