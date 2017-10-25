///
/// @author alteredq / http://alteredqualia.com/
///
import * as THREE from '../module.js'
import { Pass } from './module.js'

export default class MaskPass extends Pass {
    constructor(scene, camera) { super()
        this.scene = scene
        this.camera = camera
        this.clear = true
        this.needsSwap = false
        this.inverse = false
    }

    render(renderer, writeBuffer, readBuffer, delta, maskActive) {
        let context = renderer.context, state = renderer.state
        state.buffers.color.setMask(false)
        state.buffers.depth.setMask(false)
        state.buffers.color.setLocked(true)
        state.buffers.depth.setLocked(true)
        let writeValue = (this.inverse)?0:1
        let clearValue = (this.inverse)?1:0
        state.buffers.stencil.setTest(true)
        state.buffers.stencil.setOp(context.REPLACE, context.REPLACE, context.REPLACE)
        state.buffers.stencil.setFunc(context.ALWAYS,writeValue,0xffffffff)
        state.buffers.stencil.setClear(clearValue)
        renderer.render(this.scene,this.camera,readBuffer,this.clear)
        renderer.render(this.scene,this.camera,writeBuffer,this.clear)
        state.buffers.color.setLocked(false)
        state.buffers.depth.setLocked(false)
        state.buffers.stencil.setFunc(context.EQUAL,1,0xffffffff)
        state.buffers.stencil.setOp(context.KEEP,context.KEEP,context.KEEP)
    }
}


export class ClearMaskPass extends Pass {
    constructor() { super(); this.needsSwap = false }
    render(renderer, writeBuffer, readBuffer, delta, maskActive) {
        renderer.state.buffers.stencil.setTest(false) }
}
