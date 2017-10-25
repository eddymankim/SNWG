///
/// Depth-of-field post-process with bokeh shader
///
import * as THREE from '../module.js'
import { Pass } from './module.js'
import { Bokeh } from '../shaders/module.js'

export default class BokehPass extends Pass {
    constructor(scene, camera, params) { super()
        const bokehShader = Bokeh
        this.scene = scene
        this.camera = camera
        let focus = (params.focus!==undefined)?params.focus:1.0
        let aspect = (params.aspect!==undefined)?params.aspect:camera.aspect
        let aperture = (params.aperture!==undefined)?params.aperture:0.025
        let maxblur = (params.maxblur!==undefined)?params.maxblur:1.0
        let width = params.width || window.innerWidth || 1
        let height = params.height || window.innerHeight || 1
        this.renderTargetColor = new THREE.WebGLRenderTarget(width, height, {
            format: THREE.RGBFormat,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter })
        this.renderTargetColor.texture.name = "BokehPass.color"
        this.renderTargetDepth = this.renderTargetColor.clone()
        this.renderTargetDepth.texture.name = "BokehPass.depth"
        this.materialDepth = new THREE.MeshDepthMaterial()
        this.materialDepth.depthPacking = THREE.RGBADepthPacking
        this.materialDepth.blending = THREE.NoBlending
        let bokehUniforms = THREE.UniformsUtils.clone(bokehShader.uniforms)
        bokehUniforms['tDepth'].value = this.renderTargetDepth.texture
        bokehUniforms['focus'].value = focus
        bokehUniforms['aspect'].value = aspect
        bokehUniforms['aperture'].value = aperture
        bokehUniforms['maxblur'].value = maxblur
        bokehUniforms['nearClip'].value = camera.near
        bokehUniforms['farClip'].value = camera.far

        this.materialBokeh = new THREE.ShaderMaterial( {
            defines: bokehShader.defines,
            uniforms: bokehUniforms,
            vertexShader: bokehShader.vertexShader,
            fragmentShader: bokehShader.fragmentShader })

        this.uniforms = bokehUniforms
        this.needsSwap = false
        this.camera2 = new THREE.OrthographicCamera(-1,1,1,-1,0,1)
        this.scene2  = new THREE.Scene()
        this.quad2 = new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2),null)
        this.quad2.frustumCulled = false // avoid getting clipped
        this.scene2.add(this.quad2)
        this.oldClearColor = new THREE.Color()
        this.oldClearAlpha = 1
    }

    render(renderer, writeBuffer, readBuffer, delta, maskActive) {
        this.quad2.material = this.materialBokeh // Render depth into texture
        this.scene.overrideMaterial = this.materialDepth
        this.oldClearColor.copy(renderer.getClearColor())
        this.oldClearAlpha = renderer.getClearAlpha()
        const oldAutoClear = renderer.autoClear
        renderer.autoClear = false
        renderer.setClearColor(0xffffff)
        renderer.setClearAlpha(1.0)
        renderer.render(this.scene, this.camera, this.renderTargetDepth, true)

        this.uniforms['tColor'].value = readBuffer.texture
        this.uniforms['nearClip'].value = this.camera.near
        this.uniforms['farClip'].value = this.camera.far
        if (this.renderToScreen) renderer.render(this.scene2, this.camera2)
        else renderer.render(this.scene2, this.camera2, writeBuffer, this.clear)
        this.scene.overrideMaterial = null
        renderer.setClearColor(this.oldClearColor)
        renderer.setClearAlpha(this.oldClearAlpha)
        renderer.autoClear = this.oldAutoClear
    }
}
