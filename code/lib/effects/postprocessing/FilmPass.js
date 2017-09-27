///
/// @author alteredq / http://alteredqualia.com/
///

import * as THREE from '../../three.js'
import Pass from './Pass.js'
import FilmShader from '../shaders/FilmShader.js'

export default class FilmPass extends Pass {
    constructor(noise, scan, scanlines, grayscale) { super()
        let shader = FilmShader
        this.uniforms = THREE.UniformsUtils.clone(shader.uniforms)
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader })
        if (grayscale!==undefined) this.uniforms.grayscale.value = grayscale
        if (noise!==undefined) this.uniforms.nIntensity.value = noise
        if (scan!==undefined) this.uniforms.sIntensity.value = scan
        if (scanlines!==undefined) this.uniforms.sCount.value = scanlines
        this.camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1)
        this.scene = new THREE.Scene()
        this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2),null)
        this.quad.frustumCulled = false
        this.scene.add(this.quad)
    }

    render(renderer, writeBuffer, readBuffer, delta, maskActive) {
        this.uniforms['tDiffuse'].value = readBuffer.texture
        this.uniforms['time'].value += delta
        this.quad.material = this.material
        if (this.renderToScreen) renderer.render(this.scene,this.camera)
        else renderer.render(this.scene,this.camera,writeBuffer,this.clear)
    }
}
