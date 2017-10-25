///
/// @author evan-erdos / http://bescott.org/
///
import * as T from '../module.js'
import { Pass, ShaderPass } from '../effects/module.js'
import { Copy } from '../shaders/module.js'

export default class FancyComposer {
    constructor(renderer, renderTarget=FancyComposer.createRT(renderer)) {
        this.renderer = renderer
        this.renderTarget1 = renderTarget
        this.renderTarget1.texture.name = 'FancyComposer.rt1'
        this.renderTarget2 = renderTarget.clone()
        this.renderTarget2.texture.name = 'FancyComposer.rt2'
        this.writeBuffer = this.renderTarget1
        this.readBuffer = this.renderTarget2
        this.passes = []
        this.copyPass = new ShaderPass(Copy)
    }

    add(pass) {
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

            if (T.MaskPass !== undefined) {
                if (pass instanceof T.MaskPass) mask = true
                else if (pass instanceof T.ClearMaskPass) mask = false
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
        this.renderer.setSize(width, height)
        this.renderTarget1.setSize(width, height)
        this.renderTarget2.setSize(width, height)
        for (let i=0;i<this.passes.length;++i)
            this.passes[i].setSize(width, height)
    }

    static createRT({ width=1, height=1 }) {
        return new T.WebGLRenderTarget(height, width, {
            minFilter: T.LinearFilter, magFilter: T.LinearFilter,
            format: T.RGBAFormat, stencilBuffer: false })
    }
}
