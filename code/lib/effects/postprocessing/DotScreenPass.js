///
/// @author alteredq / http://alteredqualia.com/
///

import * as THREE from '../../three.js'
import Pass from './Pass.js'
import DotScreenShader from '../shaders/DotScreenShader.js'

export default class DotScreenPass extends Pass {
    constructor(center, angle, scale) { super()
        const shader = DotScreenShader
        this.uniforms = THREE.UniformsUtils.clone(shader.uniforms)
        if (center!==undefined) this.uniforms['center'].value.copy(center)
        if (angle!==undefined) this.uniforms['angle'].value=angle
        if (scale!==undefined) this.uniforms['scale'].value=scale
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader })
        this.camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1)
        this.scene  = new THREE.Scene()
        this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2), null)
        this.quad.frustumCulled = false
        this.scene.add(this.quad)
    }

    render(renderer, writeBuffer, readBuffer, delta, maskActive) {
        this.uniforms['tDiffuse'].value = readBuffer.texture
        this.uniforms['tSize'].value.set(readBuffer.width, readBuffer.height)
        this.quad.material = this.material
        if (this.renderToScreen) renderer.render(this.scene, this.camera)
        else renderer.render(this.scene, this.camera, writeBuffer, this.clear)
    }
}
