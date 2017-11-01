///
/// @author alteredq / http://alteredqualia.com/
///
import * as THREE from '../module.js'
import { Pass } from './module.js'
import { Copy } from '../shaders/module.js'

export default class SavePass extends Pass {
    constructor(renderTarget) { super()
        const shader = Copy

        this.textureID = 'tDiffuse'
        this.uniforms = THREE.UniformsUtils.clone(shader.uniforms)
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader })
        this.renderTarget = renderTarget
        if (this.renderTarget===undefined) {
            const params = { format: THREE.RGBFormat, stencilBuffer: false,
                minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter }
            this.renderTarget = new THREE.WebGLRenderTarget(
                window.innerWidth, window.innerHeight, params)
            this.renderTarget.texture.name = 'SavePass.rt'
        }

        this.needsSwap = false
        this.camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1)
        this.scene = new THREE.Scene()
        this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2),null)
        this.quad.frustumCulled = false // can't clip this, Stop, Hammer time
        this.scene.add(this.quad)
    }

    render(renderer, writeBuffer, readBuffer) {
        if (this.uniforms[this.textureID])
            this.uniforms[this.textureID].value = readBuffer.texture
        this.quad.material = this.material
        renderer.render(this.scene, this.camera, this.renderTarget, this.clear)
    }
}
