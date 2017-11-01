///
/// @author ludobaka / ludobaka.github.io
/// SAO implementation inspired from bhouston previous SAO work
///
import * as THREE from '../module.js'
import { Pass } from './module.js'
import { Copy, SAO } from '../shaders/module.js'
import { DepthLimitedBlur, UnpackDepthRGBA } from '../shaders/module.js'

export default class SAOPass extends Pass {
    constructor(scene, camera, depthTexture, useNormals, resolution) { super()
        const copyShader = Copy
        const saoShader = SAO
        const depthShader = DepthLimitedBlur
        const unpackedShader = UnpackDepthRGBA
        this.scene = scene
        this.camera = camera
        this.clear = true
        this.needsSwap = false
        this.supportsDepthTextureExtension = (depthTexture!==undefined)?depthTexture:false
        this.supportsNormalTexture = (useNormals!==undefined)?useNormals:false
        this.oldClearColor = new THREE.Color()
        this.oldClearAlpha = 1

        this.params = {
            output: 0,  saoBias: 0.5,
            saoIntensity: 0.18, saoScale: 1,
            saoKernelRadius: 100, saoMinResolution: 0,
            saoBlur: true, saoBlurRadius: 8,
            saoBlurStdDev: 4, saoBlurDepthCutoff: 0.01 }

        this.resolution = (resolution==undefined)?new THREE.Vector2(256,256):
            new THREE.Vector2(resolution.x,resolution.y)

        this.saoRenderTarget = new THREE.WebGLRenderTarget(
            this.resolution.x,this.resolution.y, { format: THREE.RGBAFormat,
            minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter })
        this.blurIntermediateRenderTarget = this.saoRenderTarget.clone()
        this.beautyRenderTarget = this.saoRenderTarget.clone()

        this.normalRenderTarget = new THREE.WebGLRenderTarget(
            this.resolution.x, this.resolution.y, { format: THREE.RGBAFormat,
            minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter })

        this.depthRenderTarget = this.normalRenderTarget.clone()

        if (this.supportsDepthTextureExtension) {
            var depthTexture = new THREE.DepthTexture()
            depthTexture.type = THREE.UnsignedShortType
            depthTexture.minFilter = THREE.NearestFilter
            depthTexture.maxFilter = THREE.NearestFilter
            this.beautyRenderTarget.depthTexture = depthTexture
            this.beautyRenderTarget.depthBuffer = true
        }

        this.depthMaterial = new THREE.MeshDepthMaterial()
        this.depthMaterial.depthPacking = THREE.RGBADepthPacking
        this.depthMaterial.blending = THREE.NoBlending

        this.normalMaterial = new THREE.MeshNormalMaterial()
        this.normalMaterial.blending = THREE.NoBlending

        this.saoMaterial = new THREE.ShaderMaterial(saoShader)
        this.saoMaterial.extensions.derivatives = true
        this.saoMaterial.extensions.drawBuffers = true
        this.saoMaterial.defines['DEPTH_PACKING'] = this.supportsDepthTextureExtension ? 0 : 1
        this.saoMaterial.defines['NORMAL_TEXTURE'] = this.supportsNormalTexture ? 1 : 0
        this.saoMaterial.uniforms['tDepth'].value = (this.supportsDepthTextureExtension) ? depthTexture : this.depthRenderTarget.texture
        this.saoMaterial.uniforms['tNormal'].value = this.normalRenderTarget.texture
        this.saoMaterial.uniforms['size'].value.set(this.resolution.x, this.resolution.y)
        this.saoMaterial.uniforms['cameraNear'].value = this.camera.near
        this.saoMaterial.uniforms['cameraFar'].value = this.camera.far
        this.saoMaterial.uniforms['cameraInverseProjectionMatrix'].value.getInverse(this.camera.projectionMatrix)
        this.saoMaterial.uniforms['cameraProjectionMatrix'].value = this.camera.projectionMatrix
        this.saoMaterial.blending = THREE.NoBlending

        this.vBlurMaterial = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(depthShader.uniforms),
            defines: depthShader.defines,
            vertexShader: depthShader.vertexShader,
            fragmentShader: depthShader.fragmentShader })
        this.vBlurMaterial.defines['DEPTH_PACKING'] = this.supportsDepthTextureExtension?0:1
        this.vBlurMaterial.uniforms['tDiffuse'].value = this.saoRenderTarget.texture
        this.vBlurMaterial.uniforms['tDepth'].value = (this.supportsDepthTextureExtension)
            ? depthTexture : this.depthRenderTarget.texture
        this.vBlurMaterial.uniforms['cameraNear'].value = this.camera.near
        this.vBlurMaterial.uniforms['cameraFar'].value = this.camera.far
        this.vBlurMaterial.uniforms['size'].value.set(this.resolution.x, this.resolution.y)
        this.vBlurMaterial.blending = THREE.NoBlending

        this.hBlurMaterial = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(depthShader.uniforms),
            defines: depthShader.defines,
            vertexShader: depthShader.vertexShader,
            fragmentShader: depthShader.fragmentShader })
        this.hBlurMaterial.defines['DEPTH_PACKING'] = this.supportsDepthTextureExtension?0:1
        this.hBlurMaterial.uniforms['tDiffuse'].value = this.blurIntermediateRenderTarget.texture
        this.hBlurMaterial.uniforms['tDepth'].value = (this.supportsDepthTextureExtension)
            ? depthTexture : this.depthRenderTarget.texture
        this.hBlurMaterial.uniforms['cameraNear'].value = this.camera.near
        this.hBlurMaterial.uniforms['cameraFar'].value = this.camera.far
        this.hBlurMaterial.uniforms['size'].value.set(this.resolution.x, this.resolution.y)
        this.hBlurMaterial.blending = THREE.NoBlending
        this.materialCopy = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(copyShader.uniforms),
            vertexShader: copyShader.vertexShader,
            fragmentShader: copyShader.fragmentShader,
            blending: THREE.NoBlending })
        this.materialCopy.transparent = true
        this.materialCopy.depthTest = false
        this.materialCopy.depthWrite = false
        this.materialCopy.blending = THREE.CustomBlending
        this.materialCopy.blendSrc = THREE.DstColorFactor
        this.materialCopy.blendDst = THREE.ZeroFactor
        this.materialCopy.blendEquation = THREE.AddEquation
        this.materialCopy.blendSrcAlpha = THREE.DstAlphaFactor
        this.materialCopy.blendDstAlpha = THREE.ZeroFactor
        this.materialCopy.blendEquationAlpha = THREE.AddEquation

        this.depthCopy = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(UnpackDepthRGBA.uniforms),
            vertexShader: UnpackDepthRGBA.vertexShader,
            fragmentShader: UnpackDepthRGBA.fragmentShader,
            blending: THREE.NoBlending })

        this.quadCamera = new THREE.OrthographicCamera(-1,1,1,-1,0,1)
        this.quadScene = new THREE.Scene()
        this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2,2), null)
        this.quadScene.add(this.quad)
    }

    render(renderer, writeBuffer, readBuffer, delta, maskActive) {
        if (this.renderToScreen) { // readBuffer first when rendering to screen
            this.materialCopy.blending = THREE.NoBlending
            this.materialCopy.uniforms[ 'tDiffuse'].value = readBuffer.texture
            this.materialCopy.needsUpdate = true
            this.renderPass(renderer,this.materialCopy,null)
        }

        if (this.params.output==1) return
        this.oldClearColor.copy(renderer.getClearColor())
        this.oldClearAlpha = renderer.getClearAlpha()
        var oldAutoClear = renderer.autoClear
        renderer.autoClear = false
        renderer.clearTarget(this.depthRenderTarget)
        this.saoMaterial.uniforms['bias'].value = this.params.saoBias
        this.saoMaterial.uniforms['intensity'].value = this.params.saoIntensity
        this.saoMaterial.uniforms['scale'].value = this.params.saoScale
        this.saoMaterial.uniforms['kernelRadius'].value = this.params.saoKernelRadius
        this.saoMaterial.uniforms['minResolution'].value = this.params.saoMinResolution
        var depthCutoff = this.params.saoBlurDepthCutoff*(this.camera.far-this.camera.near)
        this.vBlurMaterial.uniforms['depthCutoff'].value = depthCutoff;
        this.hBlurMaterial.uniforms['depthCutoff'].value = depthCutoff;

        this.params.saoBlurRadius = Math.floor(this.params.saoBlurRadius)
        if ((this.prevStdDev!==this.params.saoBlurStdDev)
        || (this.prevNumSamples!==this.params.saoBlurRadius)) {
            THREE.BlurShaderUtils.configure(
                this.vBlurMaterial, this.params.saoBlurRadius,
                this.params.saoBlurStdDev, new THREE.Vector2(0,1))
            THREE.BlurShaderUtils.configure(
                this.hBlurMaterial, this.params.saoBlurRadius,
                this.params.saoBlurStdDev, new THREE.Vector2(1,0))
            this.prevStdDev = this.params.saoBlurStdDev
            this.prevNumSamples = this.params.saoBlurRadius
        }

        renderer.setClearColor(0x000000) // rendering scene to depth texture
        renderer.render(this.scene, this.camera, this.beautyRenderTarget, true)
        if (!this.supportsDepthTextureExtension) this.renderOverride(
            renderer, this.depthMaterial, this.depthRenderTarget, 0xffffff, 1.0)
        if (this.supportsNormalTexture) this.renderOverride(
            renderer, this.normalMaterial, this.normalRenderTarget, 0x7777ff, 1.0)
        this.renderPass(renderer, this.saoMaterial, this.saoRenderTarget, 0xffffff, 1.0)

        if (this.params.saoBlur) {
            this.renderPass(renderer, this.vBlurMaterial, this.blurIntermediateRenderTarget, 0xffffff, 1.0)
            this.renderPass(renderer, this.hBlurMaterial, this.saoRenderTarget, 0xffffff, 1.0)
        }

        var outputMaterial = this.materialCopy // Setting up SAO rendering
        if (this.params.output==3) {
            if (this.supportsDepthTextureExtension) {
                this.materialCopy.uniforms['tDiffuse'].value = this.beautyRenderTarget.depthTexture
                this.materialCopy.needsUpdate = true
            } else {
                this.depthCopy.uniforms['tDiffuse'].value = this.depthRenderTarget.texture
                this.depthCopy.needsUpdate = true
                outputMaterial = this.depthCopy
            }
        } else if (this.params.output==4) {
            this.materialCopy.uniforms['tDiffuse'].value = this.normalRenderTarget.texture
            this.materialCopy.needsUpdate = true
        } else {
            this.materialCopy.uniforms['tDiffuse'].value = this.saoRenderTarget.texture
            this.materialCopy.needsUpdate = true
        }

        if (this.params.output==0) outputMaterial.blending = THREE.CustomBlending
        else outputMaterial.blending = THREE.NoBlending

        let buffer = this.renderToScreen?null:readBuffer
        this.renderPass(renderer, outputMaterial, buffer)
        renderer.setClearColor(this.oldClearColor, this.oldClearAlpha)
        renderer.autoClear = oldAutoClear
    }

    renderPass(renderer, passMaterial, renderTarget, clearColor, clearAlpha) {
        let originalClearColor = renderer.getClearColor()
        let originalClearAlpha = renderer.getClearAlpha()
        let originalAutoClear = renderer.autoClear

        renderer.autoClear = false // setup pass state
        let clearNeeded = (clearColor!==undefined) && (clearColor!==null)
        if (clearNeeded) {
            renderer.setClearColor(clearColor)
            renderer.setClearAlpha(clearAlpha || 0.0)
        }

        this.quad.material = passMaterial;
        renderer.render(this.quadScene, this.quadCamera, renderTarget, clearNeeded)

        renderer.autoClear = originalAutoClear // restore original state
        renderer.setClearColor(originalClearColor)
        renderer.setClearAlpha(originalClearAlpha)
    }

    renderOverride(renderer, overrideMaterial, renderTarget, clearColor, clearAlpha) {
        let originalClearColor = renderer.getClearColor()
        let originalClearAlpha = renderer.getClearAlpha()
        let originalAutoClear = renderer.autoClear
        renderer.autoClear = false
        clearColor = overrideMaterial.clearColor || clearColor
        clearAlpha = overrideMaterial.clearAlpha || clearAlpha
        let clearNeeded = (clearColor!==undefined) && (clearColor!==null)
        if (clearNeeded) {
            renderer.setClearColor(clearColor)
            renderer.setClearAlpha(clearAlpha || 0.0)
        }

        this.scene.overrideMaterial = overrideMaterial
        renderer.render(this.scene, this.camera, renderTarget, clearNeeded)
        this.scene.overrideMaterial = null

        renderer.autoClear = originalAutoClear // restore original state
        renderer.setClearColor(originalClearColor)
        renderer.setClearAlpha(originalClearAlpha)
    }

    setSize(width, height) {
        this.beautyRenderTarget.setSize(width, height)
        this.saoRenderTarget.setSize(width, height)
        this.blurIntermediateRenderTarget.setSize(width, height)
        this.normalRenderTarget.setSize(width, height)
        this.depthRenderTarget.setSize(width, height)

        this.saoMaterial.uniforms['size'].value.set(width, height)
        this.saoMaterial.uniforms['cameraInverseProjectionMatrix'].value.getInverse(this.camera.projectionMatrix)
        this.saoMaterial.uniforms['cameraProjectionMatrix'].value = this.camera.projectionMatrix
        this.saoMaterial.needsUpdate = true
        this.vBlurMaterial.uniforms['size'].value.set(width, height)
        this.vBlurMaterial.needsUpdate = true
        this.hBlurMaterial.uniforms['size'].value.set(width, height)
        this.hBlurMaterial.needsUpdate = true
    }

    static get OUTPUT() { return { 'Beauty': 1, 'Default': 0, 'SAO': 2, 'Depth': 3, 'Normal': 4 } }
}
