///
/// @author alteredq / http://alteredqualia.com/
///

import * as THREE from '../../three.js'
import Pass from './Pass.js'
import CopyShader from '../shaders/CopyShader.js'
import ShaderPass from './ShaderPass.js'

export default class EffectComposer {
    constructor(renderer, renderTarget) {
        this.renderer = renderer
        if (renderTarget===undefined) {
            let size = renderer.getSize()
            renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                stencilBuffer: false })
            renderTarget.texture.name = 'EffectComposer.rt1'
        }

        this.passes = []
        this.renderTarget1 = renderTarget
        this.renderTarget2 = renderTarget.clone()
        this.renderTarget2.texture.name = 'EffectComposer.rt2'
        this.writeBuffer = this.renderTarget1
        this.readBuffer = this.renderTarget2
        this.copyPass = new ShaderPass(CopyShader)
    }

    swapBuffers() {
        var t=this.readBuffer;
        this.readBuffer=this.writeBuffer;
        this.writeBuffer=t;
    }

    addPass(pass) {
        this.passes.push(pass)
        var size = this.renderer.getSize()
        pass.setSize(size.width,size.height)
    }

    insertPass(pass,index) { this.passes.splice(index,0,pass) }

    render(delta) {
        var maskActive = false
        var pass, il = this.passes.length
        for (let i=0;i<il;i++) {
            pass = this.passes[i]
            if (pass.enabled===false) continue
            pass.render(this.renderer,this.writeBuffer,this.readBuffer,delta,maskActive)
            if (pass.needsSwap) {
                if (maskActive) {
                    var context = this.renderer.context
                    context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff)
                    this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,delta)
                    context.stencilFunc(context.EQUAL, 1, 0xffffffff)
                } this.swapBuffers()
            }

            if (THREE.MaskPass!==undefined) {
                if (pass instanceof THREE.MaskPass) maskActive = true
                else if (pass instanceof THREE.ClearMaskPass) maskActive = false
            }
        }
    }

    reset(renderTarget) {
        if (renderTarget===undefined) {
            var size = this.renderer.getSize()
            renderTarget = this.renderTarget1.clone()
            renderTarget.setSize(size.width, size.height)
        }

        this.renderTarget1.dispose()
        this.renderTarget2.dispose()
        this.renderTarget1 = renderTarget
        this.renderTarget2 = renderTarget.clone()
        this.writeBuffer = this.renderTarget1
        this.readBuffer = this.renderTarget2
    }

    setSize(width, height) {
        this.renderTarget1.setSize(width, height)
        this.renderTarget2.setSize(width, height)
        for (let i=0;i<this.passes.length;i++)
            this.passes[i].setSize(width,height)
    }
}
