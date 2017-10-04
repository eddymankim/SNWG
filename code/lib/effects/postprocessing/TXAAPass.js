///
/// Temporal Anti-Aliasing Render Pass
///
/// @author bhouston / http://clara.io/
///
/// When there is no motion in the scene
/// the TAA render pass accumulates jittered camera samples
/// across frames to create a high quality anti-aliased result
///
/// References:
///
/// TODO: Add support for motion vector pass so that
/// accumulation of samples across frames can occur on dynamics scenes
///

import * as THREE from '../../three.js'
import SSAAPass from './SSAAPass.js'

export default class TXAAPass extends SSAAPass {
    static get JitterVectors() { return SSAAPass.JitterVectors; }
    constructor(scene, camera, params) {
        super(scene, camera, params)
        this.sampleLevel = 0
        this.accumulate = false
    }

    render(renderer, writeBuffer, readBuffer, delta) {
        if (!this.accumulate) {
            super.render(renderer,writeBuffer,readBuffer,delta)
            this.accumulateIndex = -1
            return
        }

        let jitterOffsets = TXAAPass.JitterVectors[5]
        if (!this.sampleRenderTarget) {
            this.sampleRenderTarget = new THREE.WebGLRenderTarget(
                readBuffer.width, readBuffer.height, this.params)
            this.sampleRenderTarget.texture.name = 'TXAAPass.sample'
        }

        if (!this.holdRenderTarget) {
            this.holdRenderTarget = new THREE.WebGLRenderTarget(
                readBuffer.width, readBuffer.height, this.params)
            this.holdRenderTarget.texture.name = 'TXAAPass.hold'
        }

        if (this.accumulate && this.accumulateIndex===-1) {
            THREE.SSAAPass.prototype.render.call(
                this,renderer,this.holdRenderTarget,readBuffer,delta)
            this.accumulateIndex = 0
        }

        let autoClear = renderer.autoClear
        renderer.autoClear = false
        let sampleWeight = 1.0/jitterOffsets.length
        if (this.accumulateIndex>=0 && this.accumulateIndex<jitterOffsets.length) {
            this.copyUniforms['opacity'].value = sampleWeight
            this.copyUniforms['tDiffuse'].value = writeBuffer.texture
            // each jitter offset from the last and accumulate the results
            let numSamplesPerFrame = Math.pow(2, this.sampleLevel)
            for (let i=0;i<numSamplesPerFrame;i++) {
                let j = this.accumulateIndex, jitterOffset = jitterOffsets[j]
                if (this.camera.setViewOffset) this.camera.setViewOffset(
                    readBuffer.width, readBuffer.height,
                    jitterOffset[0]*0.0625,jitterOffset[1]*0.0625,
                    readBuffer.width, readBuffer.height)
                renderer.render(this.scene, this.camera, writeBuffer, true)
                renderer.render(this.scene2, this.camera2,
                    this.sampleRenderTarget, (this.accumulateIndex === 0))
                this.accumulateIndex++
                if (this.accumulateIndex>=jitterOffsets.length) break
            }
            if (this.camera.clearViewOffset) this.camera.clearViewOffset()
        }

        var accumulationWeight = this.accumulateIndex*sampleWeight

        if (accumulationWeight>0) {
            this.copyUniforms['opacity'].value = 1.0
            this.copyUniforms['tDiffuse'].value = this.sampleRenderTarget.texture
            renderer.render(this.scene2, this.camera2, writeBuffer, true)
        }

        if (accumulationWeight<1.0) {
            this.copyUniforms['opacity'].value = 1.0-accumulationWeight
            this.copyUniforms['tDiffuse'].value = this.holdRenderTarget.texture
            renderer.render(this.scene2, this.camera2,
                writeBuffer, (accumulationWeight===0))
        } renderer.autoClear = autoClear
    }
}
