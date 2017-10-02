///
/// @author alteredq / http://alteredqualia.com/
/// @author evan-erdos <bescott.org>
///
/// bloom pass
///

import * as THREE from '../../three.js'
import Pass from './Pass.js'
import CopyShader from '../shaders/CopyShader.js'
import ConvolutionShader from '../shaders/ConvolutionShader.js'

export default class BloomFastPass extends Pass {
    static get blurX() { return new THREE.Vector2(0.001953125, 0.0) }
    static get blurY() { return new THREE.Vector2(0.0, 0.001953125) }
    constructor(strength, kernelSize, sigma, resolution) { super()
        const copyShader = CopyShader
        const convolutionShader = ConvolutionShader
        strength = (strength!==undefined) ? strength : 1
        kernelSize = (kernelSize!==undefined) ? kernelSize : 25
        sigma = (sigma!==undefined) ? sigma : 4
        resolution = (resolution!==undefined) ? resolution : 256

        const pars = { format: THREE.RGBAFormat,
            minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter }

        this.renderTargetX = new THREE.WebGLRenderTarget(resolution,resolution, pars)
        this.renderTargetX.texture.name = 'BloomPass.x'
        this.renderTargetY = new THREE.WebGLRenderTarget(resolution,resolution, pars)
        this.renderTargetY.texture.name = 'BloomPass.y'
        this.copyUniforms = THREE.UniformsUtils.clone(copyShader.uniforms)
        this.copyUniforms['opacity'].value = strength

        this.materialCopy = new THREE.ShaderMaterial({
            uniforms: this.copyUniforms,
            vertexShader: copyShader.vertexShader,
            fragmentShader: copyShader.fragmentShader,
            blending: THREE.AdditiveBlending,
            transparent: true })

        this.convolutionUniforms = THREE.UniformsUtils.clone(convolutionShader.uniforms)
        this.convolutionUniforms['uImageIncrement'].value = BloomFastPass.blurX
        this.convolutionUniforms['cKernel'].value = ConvolutionShader.buildKernel(sigma)

        this.materialConvolution = new THREE.ShaderMaterial({
            uniforms: this.convolutionUniforms,
            vertexShader: convolutionShader.vertexShader,
            fragmentShader: convolutionShader.fragmentShader,
            defines: {
                'KERNEL_SIZE_FLOAT': kernelSize.toFixed(1),
                'KERNEL_SIZE_INT': kernelSize.toFixed(0) } })

        this.needsSwap = false
        this.camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1)
        this.scene = new THREE.Scene()
        this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2), null)
        this.quad.frustumCulled = false
        this.scene.add(this.quad)
    }


    render(renderer, writeBuffer, readBuffer, delta, maskActive) {
        if (maskActive) renderer.context.disable(renderer.context.STENCIL_TEST)
        this.quad.material = this.materialConvolution
        this.convolutionUniforms['tDiffuse'].value = readBuffer.texture
        this.convolutionUniforms['uImageIncrement'].value = BloomFastPass.blurX
        renderer.render(this.scene,this.camera,this.renderTargetX,true)
        this.convolutionUniforms['tDiffuse'].value = this.renderTargetX.texture
        this.convolutionUniforms['uImageIncrement'].value = BloomFastPass.blurY
        renderer.render(this.scene,this.camera,this.renderTargetY,true)
        this.quad.material = this.materialCopy
        this.copyUniforms['tDiffuse'].value = this.renderTargetY.texture
        if (maskActive) renderer.context.enable(renderer.context.STENCIL_TEST)
        renderer.render(this.scene, this.camera, readBuffer, this.clear)
    }
}
