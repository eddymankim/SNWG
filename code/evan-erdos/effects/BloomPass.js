///
/// @author alteredq / http://alteredqualia.com/
/// @author evan-erdos <bescott.org>
///
/// bloom pass
///
import * as T from '../module.js'
import { Pass } from './module.js'
import { Copy, Convolution } from '../shaders/module.js'

export default class BloomPass extends Pass {
    constructor({ power=1, kernel=25, sigma=4, size=256 }={}) { super()
        var pars = { format: T.RGBAFormat,
            minFilter: T.LinearFilter, magFilter: T.LinearFilter, }
        this.renderTargetX = new T.WebGLRenderTarget(size, size, pars)
        this.renderTargetX.texture.name = "BloomPass.x"
        this.renderTargetY = new T.WebGLRenderTarget(size, size, pars)
        this.renderTargetY.texture.name = "BloomPass.y"
        var copy = Copy
        this.copyUniforms = T.UniformsUtils.clone(copy.uniforms)
        this.copyUniforms[ "opacity" ].value = power
        this.materialCopy = new T.ShaderMaterial({
            uniforms: this.copyUniforms,
            vertexShader: copy.vertexShader,
            fragmentShader: copy.fragmentShader,
            blending: T.AdditiveBlending,
            transparent: true })

        var shader = Convolution
        this.uniforms = T.UniformsUtils.clone(shader.uniforms)
        this.uniforms[ "uImageIncrement" ].value = BloomPass.blurX
        this.uniforms[ "cKernel" ].value = Convolution.buildKernel(sigma)
        this.materialConvolution = new T.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader:  shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            defines: {
                "KERNEL_SIZE_FLOAT": kernel.toFixed(1),
                "KERNEL_SIZE_INT": kernel.toFixed(0), } })

        this.needsSwap = false
        this.camera = new T.OrthographicCamera(- 1, 1, 1, - 1, 0, 1)
        this.scene  = new T.Scene()
        this.quad = new T.Mesh(new T.PlaneBufferGeometry(2, 2), null)
        this.quad.frustumCulled = false
        this.scene.add(this.quad)
    }

    render(renderer, write, read, delta, mask) {
        if (mask) renderer.context.disable(renderer.context.STENCIL_TEST)
        this.quad.material = this.materialConvolution
        this.uniforms[ "tDiffuse" ].value = read.texture
        this.uniforms[ "uImageIncrement" ].value = BloomPass.blurX
        renderer.render(this.scene,this.camera,this.renderTargetX,true)
        this.uniforms[ "tDiffuse" ].value = this.renderTargetX.texture
        this.uniforms[ "uImageIncrement" ].value = BloomPass.blurY
        renderer.render(this.scene,this.camera,this.renderTargetY,true)
        this.quad.material = this.materialCopy
        this.copyUniforms[ "tDiffuse" ].value = this.renderTargetY.texture
        if (mask) renderer.context.enable(renderer.context.STENCIL_TEST)
        renderer.render(this.scene,this.camera,read,this.clear)
    }

    static get blurX() { return new T.Vector2(0.001953125, 0.0) }
    static get blurY() { return new T.Vector2(0.0, 0.001953125) }
}
