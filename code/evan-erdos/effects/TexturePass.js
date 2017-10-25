///
/// @author alteredq / http://alteredqualia.com/
///
import * as THREE from '../module.js'
import { Pass } from './module.js'
import { Copy } from '../shaders/module.js'

export default class TexturePass extends Pass {
    constructor(map,opacity) { super()
        const shader = Copy
        this.map = map
        this.opacity = (opacity!==undefined)?opacity:1.0
        this.uniforms = THREE.UniformsUtils.clone(shader.uniforms)
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            depthTest: false, depthWrite: false })
        this.needsSwap = false
        this.camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1)
        this.scene  = new THREE.Scene()
        let geometry = new THREE.PlaneBufferGeometry(2,2)
        this.quad = new THREE.Mesh(geometry,this.material)
        this.quad.frustumCulled = false
        this.scene.add(this.quad)
    }

    render(renderer, writeBuffer, readBuffer, delta, maskActive) {
        let oldAutoClear = renderer.autoClear
        renderer.autoClear = false
        this.quad.material = this.material
        this.uniforms['opacity'].value = this.opacity
        this.uniforms['tDiffuse'].value = this.map
        this.material.transparent = (this.opacity<1.0)
        let buffer = this.renderToScreen ? null : readBuffer
        renderer.render(this.scene, this.camera, buffer, this.clear)
        renderer.autoClear = oldAutoClear
    }
}
