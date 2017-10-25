///
/// @author alteredq / http://alteredqualia.com/
///
import * as THREE from '../module.js'
import { Pass } from './module.js'

export default class RenderPass extends Pass {
    constructor(scene, camera, material, clearColor, clearAlpha) { super()
        this.scene = scene
        this.camera = camera
        this.overrideMaterial = material
        this.clearColor = clearColor
        this.clearAlpha = (clearAlpha!==undefined)?clearAlpha:0
        this.clear = true
        this.clearDepth = false
        this.needsSwap = false
    }

    render(renderer, writeBuffer, readBuffer, delta, maskActive) {
        let oldAutoClear = renderer.autoClear
        renderer.autoClear = false
        this.scene.overrideMaterial = this.overrideMaterial
        let oldClearColor, oldClearAlpha
        if (this.clearColor) {
            oldClearColor = renderer.getClearColor().getHex()
            oldClearAlpha = renderer.getClearAlpha()
            renderer.setClearColor(this.clearColor, this.clearAlpha)
        }

        if (this.clearDepth) renderer.clearDepth()
        let buffer = this.renderToScreen?null:readBuffer
        renderer.render(this.scene, this.camera, buffer, this.clear)
        if (this.clearColor) renderer.setClearColor(oldClearColor, oldClearAlpha)
        this.scene.overrideMaterial = null
        renderer.autoClear = oldAutoClear
    }
}
