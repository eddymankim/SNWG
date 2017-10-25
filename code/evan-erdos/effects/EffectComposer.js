///
/// @author alteredq / http://alteredqualia.com/
///
import * as THREE from '../module.js'
import { Pass, ShaderPass } from '../effects/module.js'
import { Copy } from '../shaders/module.js'

export default class EffectComposer {
    constructor(renderer, renderTarget=EffectComposer.createRenderTarget(renderer)) {
        this.renderer = renderer
        this.renderTarget1 = renderTarget
        this.renderTarget1.texture.name = 'EffectComposer.rt1'
        this.renderTarget2 = renderTarget.clone()
        this.renderTarget2.texture.name = 'EffectComposer.rt2'
        this.writeBuffer = this.renderTarget1
        this.readBuffer = this.renderTarget2
        this.passes = []
        this.copyPass = new ShaderPass(Copy)
    }

    addPass(pass) {
        this.passes.push(pass)
        let {width, height} = this.renderer.getDrawingBufferSize()
        pass.setSize(width, height)
    }

    render(delta) {
        var mask = false, il = this.passes.length
        for (let pass, i=0; pass=this.passes[i], i<il; ++i) {
            if (pass.enabled===false) continue
            pass.render(this.renderer, this.writeBuffer, this.readBuffer, delta, mask)
            if (pass.needsSwap) {
                if (mask) {
                    var context = this.renderer.context
                    context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff)
                    this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, delta)
                    context.stencilFunc(context.EQUAL, 1, 0xffffffff)
                }
                var tmp = this.readBuffer
                this.readBuffer = this.writeBuffer
                this.writeBuffer = tmp
            }

            if (THREE.MaskPass !== undefined) {
                if (pass instanceof THREE.MaskPass) mask = true
                else if (pass instanceof THREE.ClearMaskPass) mask = false
            }
        }
    }

    reset(renderTarget) {
        if (renderTarget===undefined) {
            var size = this.renderer.getDrawingBufferSize()
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
        for (let i=0;i<this.passes.length;++i)
            this.passes[i].setSize(width, height)
    }

    static createRenderTarget({ width=1, height=1 }) {
        return new THREE.WebGLRenderTarget(height, width, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            stencilBuffer: false })
    }
}
