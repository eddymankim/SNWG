///
/// Supersample Anti-Aliasing Render Pass
///
/// @author bhouston / http://clara.io/
///
/// This manual approach to SSAA re-renders the scene once
/// for each sample with camera jitter and accumulates the results
///
/// https://en.wikipedia.org/wiki/Supersampling
///
import * as THREE from '../module.js'
import { Pass } from './module.js'
import { Copy } from '../shaders/module.js'

export default class SSAAPass extends Pass {
    static get JitterVectors() { return [
        [[+0,+0]],[[+4,+4],[-4,-4]],+[[-2,-6],[+6,-2],[-6,+2],[+2,+6]],
        [[+1,-3],[-1,+3],[+5,+1],[-3,-5],[-5,+5],[-7,-1],[+3,+7],[+7,-7]],
        [[+1,+1],[-1,-3],[-3,+2],[+4,-1],[-5,-2],[+2,+5],[+5,+3],[+3,-5],
         [-2,+6],[+0,-7],[-4,-6],[-6,+4],[-8,+0],[+7,-4],[+6,+7],[-7,-8]],
        [[-4,-7],[-7,-5],[-3,-5],[-5,-4],[-1,-4],[-2,-2],[-6,-1],[-4,+0],
         [-7,+1],[-1,+2],[-6,+3],[-3,+3],[-7,+6],[-3,+6],[-5,+7],[-1,+7],
         [+5,-7],[+1,-6],[+6,-5],[+4,-4],[+2,-3],[+7,-2],[+1,-1],[+4,-1],
         [+2,+1],[+6,+2],[+0,+4],[+4,+4],[+2,+5],[+7,+5],[+5,+6],[+3,+7]]] }

    constructor(scene, camera, clearColor, clearAlpha) { super()
        const shader = Copy
        this.scene = scene
        this.camera = camera
        this.sampleLevel = 4
        this.unbiased = true
        this.clearColor = (clearColor!==undefined)?clearColor:0x000000
        this.clearAlpha = (clearAlpha!==undefined)?clearAlpha:0
        this.copyUniforms = THREE.UniformsUtils.clone(shader.uniforms)
        this.copyMaterial = new THREE.ShaderMaterial({
            uniforms: this.copyUniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            blending: THREE.AdditiveBlending,
            premultipliedAlpha: true, transparent: true,
            depthTest: false, depthWrite: false })
        this.camera2 = new THREE.OrthographicCamera(-1,1,1,-1,0,1)
        this.scene2 = new THREE.Scene()
        let geometry = new THREE.PlaneGeometry(2,2)
        this.quad2 = new THREE.Mesh(geometry,this.copyMaterial)
        this.quad2.frustumCulled = false
        this.scene2.add(this.quad2)
    }

    dispose() {
        if (!this.sampleRenderTarget) return
        this.sampleRenderTarget.dispose()
        this.sampleRenderTarget = null
    }

    setSize(width,height) { if (this.sampleRenderTarget)
        this.sampleRenderTarget.setSize(width,height) }

    render(renderer, writeBuffer, readBuffer) {
        if (! this.sampleRenderTarget) {
            this.sampleRenderTarget = new THREE.WebGLRenderTarget(
                readBuffer.width, readBuffer.height, {
                    format: THREE.RGBAFormat,
                    minFilter: THREE.LinearFilter,
                    magFilter: THREE.LinearFilter })
            this.sampleRenderTarget.texture.name = "SSAARenderPass.sample"
        }

        const jitterOffsets = SSAAPass.JitterVectors[
            Math.max(0,Math.min(this.sampleLevel,5))]
        const autoClear = renderer.autoClear
        renderer.autoClear = false
        const oldClearColor = renderer.getClearColor().getHex()
        const oldClearAlpha = renderer.getClearAlpha()
        const baseSampleWeight = 1.0/jitterOffsets.length, round = 1/32
        this.copyUniforms['tDiffuse'].value = this.sampleRenderTarget.texture
        const width = readBuffer.width, height = readBuffer.height
        for (let i=0;i<jitterOffsets.length;++i) {
            const jitterOffset = jitterOffsets[i]
            this.camera.setViewOffset(
                width, height, jitterOffset[0]*0.0625,
                jitterOffset[1]*0.0625, width, height)
            let sampleWeight = baseSampleWeight
            if (this.unbiased)
                sampleWeight += round * -0.5+(i+0.5)/jitterOffsets.length
            this.copyUniforms['opacity'].value = sampleWeight
            renderer.setClearColor(this.clearColor, this.clearAlpha)
            renderer.render(this.scene,this.camera,this.sampleRenderTarget,true)
            if (i===0) renderer.setClearColor(0x000000, 0.0)
            let buffer = this.renderToScreen?null:writeBuffer
            renderer.render(this.scene2, this.camera2, buffer, i===0)
        }

        if (this.camera.clearViewOffset) this.camera.clearViewOffset()
        renderer.autoClear = autoClear
        renderer.setClearColor(oldClearColor, oldClearAlpha)
    }
}
