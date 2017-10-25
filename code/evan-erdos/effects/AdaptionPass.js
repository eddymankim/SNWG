///
/// @author miibond
/// Generate a texture that represents the luminosity of the current scene,
/// adapted over time to simulate the optic nerve responding to light
/// Based on a GDC2007 talk by Wolfgang Engel, "Post-Processing Pipeline"
///
/// Full-screen tone-mapping shader
/// http://www.graphics.cornell.edu/~jaf/publications/sig02_paper.pdf
///
import * as THREE from '../module.js'
import { Pass } from './module.js'
import { Copy, Luminosity, ToneMap } from '../shaders/module.js'

export default class AdaptionPass extends Pass {
    constructor(adaptive, resolution) { super()
        const copyShader = Copy
        this.resolution = (resolution!==undefined)?resolution:256
        this.needsInit = true
        this.adaptive = adaptive!==undefined? !! adaptive:true
        this.luminanceRT = null
        this.previousLuminanceRT = null
        this.currentLuminanceRT = null
        this.copyUniforms = THREE.UniformsUtils.clone(copyShader.uniforms)
        this.materialCopy = new THREE.ShaderMaterial({
            uniforms: this.copyUniforms,
            vertexShader: copyShader.vertexShader,
            fragmentShader: copyShader.fragmentShader,
            blending: THREE.NoBlending,
            depthTest: false })
        this.materialLuminance = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(Luminosity.uniforms),
            vertexShader: Luminosity.vertexShader,
            fragmentShader: Luminosity.fragmentShader,
            blending: THREE.NoBlending })

        this.adaptLuminanceShader = {

            defines: {
                'MIP_LEVEL_1X1': (Math.log(this.resolution)/Math.log(2.0)).toFixed(1) },

            uniforms: {
                'lastLum': { value: null },
                'currentLum': { value: null },
                'minLuminance': { value: 0.01 },
                'delta': { value: 0.016 },
                'tau': { value: 1.0 } },

            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
                }`,

            fragmentShader: `
                varying vec2 vUv;
                uniform sampler2D lastLum, currentLum;
                uniform float minLuminance, delta, tau;

                void main() {
                    vec4 lastLum = texture2D(lastLum, vUv, MIP_LEVEL_1X1);
                    vec4 currentLum = texture2D(currentLum, vUv, MIP_LEVEL_1X1);
                    float fLastLum = max(minLuminance, lastLum.r);
                    float fCurrentLum = max(minLuminance, currentLum.r);
                    fCurrentLum *= fCurrentLum; // works better in weird lighting
                    // adapt the luminance using Pattanaik's technique
                    float fAdaptedLum = fLastLum+(fCurrentLum-fLastLum)*(1.0-exp(-delta*tau));
                    gl_FragColor.r = fAdaptedLum; // fAdaptedLum = sqrt(fAdaptedLum);
                }`
        }

        this.materialAdaptiveLum = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(this.adaptLuminanceShader.uniforms),
            vertexShader: this.adaptLuminanceShader.vertexShader,
            fragmentShader: this.adaptLuminanceShader.fragmentShader,
            defines: this.adaptLuminanceShader.defines,
            blending: THREE.NoBlending })

        this.materialToneMap = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(ToneMap.uniforms),
            vertexShader: ToneMap.vertexShader,
            fragmentShader: ToneMap.fragmentShader,
            blending: THREE.NoBlending })

        this.camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1)
        this.scene  = new THREE.Scene()
        this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2),null)
        this.quad.frustumCulled = false
        this.scene.add(this.quad)
    }


    render(renderer, writeBuffer, readBuffer, delta, maskActive) {
        if (this.needsInit) {
            this.reset(renderer)
            this.luminanceRT.texture.type = readBuffer.texture.type
            this.previousLuminanceRT.texture.type = readBuffer.texture.type
            this.currentLuminanceRT.texture.type = readBuffer.texture.type
            this.needsInit = false
        }

        if (this.adaptive) {
            // luminance of the current scene into a render target
            this.quad.material = this.materialLuminance
            this.materialLuminance.uniforms.tDiffuse.value = readBuffer.texture
            renderer.render(this.scene, this.camera, this.currentLuminanceRT)
            // the previous luminance and the frame delta to adapt the luminance
            this.quad.material = this.materialAdaptiveLum
            this.materialAdaptiveLum.uniforms.delta.value = delta
            this.materialAdaptiveLum.uniforms.lastLum.value = this.previousLuminanceRT.texture
            this.materialAdaptiveLum.uniforms.currentLum.value = this.currentLuminanceRT.texture
            renderer.render(this.scene,this.camera,this.luminanceRT)
            // adapted luminance value so that it can be used by the next frame
            this.quad.material = this.materialCopy
            this.copyUniforms.tDiffuse.value = this.luminanceRT.texture
            renderer.render(this.scene,this.camera,this.previousLuminanceRT)
        }

        this.quad.material = this.materialToneMap
        this.materialToneMap.uniforms.tDiffuse.value = readBuffer.texture
        if (this.renderToScreen) renderer.render(this.scene,this.camera)
        else renderer.render(this.scene,this.camera,writeBuffer,this.clear)
    }


    reset(renderer) {
        if (this.luminanceRT) this.luminanceRT.dispose()
        if (this.currentLuminanceRT) this.currentLuminanceRT.dispose()
        if (this.previousLuminanceRT) this.previousLuminanceRT.dispose()
        var pars = { format: THREE.RGBAFormat,
            minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter }
        this.luminanceRT = new THREE.WebGLRenderTarget(this.resolution,this.resolution,pars)
        this.luminanceRT.texture.name = "AdaptiveToneMappingPass.l"
        this.luminanceRT.texture.generateMipmaps = false
        this.previousLuminanceRT = new THREE.WebGLRenderTarget(this.resolution, this.resolution, pars)
        this.previousLuminanceRT.texture.name = "AdaptiveToneMappingPass.pl"
        this.previousLuminanceRT.texture.generateMipmaps = false
        // We only need mipmapping for the current luminosity
        pars.minFilter = THREE.LinearMipMapLinearFilter
        this.currentLuminanceRT = new THREE.WebGLRenderTarget(this.resolution,this.resolution,pars)
        this.currentLuminanceRT.texture.name = "AdaptiveToneMappingPass.cl"
        if (this.adaptive) {
            this.materialToneMap.defines["ADAPTED_LUMINANCE"] = ""
            this.materialToneMap.uniforms.luminanceMap.value = this.luminanceRT.texture
        }

        // adaptive luminance texture so that the scene can render initially
        this.quad.material = new THREE.MeshBasicMaterial({ color: 0x777777 })
        this.materialLuminance.needsUpdate = true
        this.materialAdaptiveLum.needsUpdate = true
        this.materialToneMap.needsUpdate = true
        // renderer.render(this.scene, this.camera, this.luminanceRT)
        // renderer.render(this.scene, this.camera, this.previousLuminanceRT)
        // renderer.render(this.scene, this.camera, this.currentLuminanceRT)
    }

    setAdaptionRate() { this.materialAdaptiveLum.uniforms.tau.value = Math.abs(rate) }
    setMaxLuminance(max) { this.materialToneMap.uniforms.maxLuminance.value = max }
    setAverageLuminance(avg) { this.materialToneMap.uniforms.averageLuminance.value = avg }
    setMiddleGrey(color) { this.materialToneMap.uniforms.middleGrey.value = color }
    setMinLuminance(min) { this.materialToneMap.uniforms.minLuminance.value =
        this.materialAdaptiveLum.uniforms.minLuminance.value = min }
    setAdaptive(adaptive) {
        if (adaptive) {
            this.adaptive = true
            this.materialToneMap.defines["ADAPTED_LUMINANCE"] = ""
            this.materialToneMap.uniforms.luminanceMap.value = this.luminanceRT.texture
        } else {
            this.adaptive = false
            delete this.materialToneMap.defines["ADAPTED_LUMINANCE"]
            this.materialToneMap.uniforms.luminanceMap.value = null
        } this.materialToneMap.needsUpdate = true
    }

    dispose() {
        if (this.luminanceRT) this.luminanceRT.dispose()
        if (this.previousLuminanceRT) this.previousLuminanceRT.dispose()
        if (this.currentLuminanceRT) this.currentLuminanceRT.dispose()
        if (this.materialLuminance) this.materialLuminance.dispose()
        if (this.materialAdaptiveLum) this.materialAdaptiveLum.dispose()
        if (this.materialCopy) this.materialCopy.dispose()
        if (this.materialToneMap) this.materialToneMap.dispose()
    }
}
