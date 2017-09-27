///
/// @author spidersharma / http://eduperiment.com/
///

import * as THREE from '../../three.js'
import Pass from './Pass.js'
import CopyShader from '../shaders/CopyShader.js'
import LuminShader from '../shaders/LuminosityHighPassShader.js'

export default class BloomPass extends Pass {
    static get blurX() { return new THREE.Vector2(1.0, 0.0) }
    static get blurY() { return new THREE.Vector2(0.0, 1.0) }
    constructor({ strength=1, threshold=0.4, radius=3, resolution=256 }={}) {
        super()
        const copy = CopyShader
        const shader = LuminShader
        this.strength = strength
        this.radius = radius
        this.threshold = threshold
        this.resolution = new THREE.Vector2(resolution, resolution)
        const pars = { format: THREE.RGBAFormat,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter }
        this.renderTargetsHorizontal = []
        this.renderTargetsVertical = []
        this.nMips = 5
        let resx = Math.round(this.resolution.x/2)
        let resy = Math.round(this.resolution.y/2)
        this.renderTargetBright = new THREE.WebGLRenderTarget(resx,resy,pars)
        this.renderTargetBright.texture.name = 'BloomPass.bright'
        this.renderTargetBright.texture.generateMipmaps = false

        for (var i=0;i<this.nMips;i++) {
            var renderTarget = new THREE.WebGLRenderTarget(resx,resy,pars)
            renderTarget.texture.name = `{BloomPass.h}{i}`
            renderTarget.texture.generateMipmaps = false
            this.renderTargetsHorizontal.push(renderTarget)
            var renderTarget = new THREE.WebGLRenderTarget(resx,resy,pars)
            renderTarget.texture.name = `{BloomPass.v}{i}`
            renderTarget.texture.generateMipmaps = false
            this.renderTargetsVertical.push(renderTarget)
            resx = Math.round(resx/2)
            resy = Math.round(resy/2)
        }

        this.highPassUniforms = THREE.UniformsUtils.clone(shader.uniforms)
        this.highPassUniforms[`luminosityThreshold`].value = threshold
        this.highPassUniforms[`smoothWidth`].value = 0.01
        this.materialHighPassFilter = new THREE.ShaderMaterial({
            defines: {},
            uniforms: this.highPassUniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader })

        this.separableBlurMaterials = []
        const kernelSizeArray = [3,5,7,9,11]
        resx = Math.round(this.resolution.x/2)
        resy = Math.round(this.resolution.y/2)
        for (let i=0;i<this.nMips;i++) {
            this.separableBlurMaterials.push(
                this.getSeperableBlurMaterial(kernelSizeArray[i]))
            this.separableBlurMaterials[i].uniforms['texSize'].value =
                new THREE.Vector2(resx, resy)
            resx = Math.round(resx/2); resy = Math.round(resy/2)
        }

        this.compositeMaterial = this.getCompositeMaterial(this.nMips);
        let uniforms = this.compositeMaterial.uniforms
        uniforms['blurTexture1'].value = this.renderTargetsVertical[0].texture
        uniforms['blurTexture2'].value = this.renderTargetsVertical[1].texture
        uniforms['blurTexture3'].value = this.renderTargetsVertical[2].texture
        uniforms['blurTexture4'].value = this.renderTargetsVertical[3].texture
        uniforms['blurTexture5'].value = this.renderTargetsVertical[4].texture
        uniforms['bloomStrength'].value = strength
        uniforms['bloomRadius'].value = 0.1
        this.compositeMaterial.needsUpdate = true
        var bloomFactors = [1.0, 0.8, 0.6, 0.4, 0.2]
        uniforms['bloomFactors'].value = bloomFactors
        this.bloomTintColors = [
            new THREE.Vector3(1,1,1),new THREE.Vector3(1,1,1),
            new THREE.Vector3(1,1,1),new THREE.Vector3(1,1,1),
            new THREE.Vector3(1,1,1)]
        uniforms['bloomTintColors'].value = this.bloomTintColors
        this.compositeMaterial.uniforms = uniforms
        this.copyUniforms = THREE.UniformsUtils.clone(copy.uniforms)
        this.copyUniforms['opacity'].value = 1.0
        this.materialCopy = new THREE.ShaderMaterial({
            depthTest: false, depthWrite: false, transparent: true,
            uniforms: this.copyUniforms, blending: THREE.AdditiveBlending,
            vertexShader: copy.vertexShader,
            fragmentShader: copy.fragmentShader })
        this.enabled = true
        this.needsSwap = false
        this.oldClearColor = new THREE.Color()
        this.oldClearAlpha = 1
        this.camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1)
        this.scene = new THREE.Scene()
        let geometry = new THREE.PlaneBufferGeometry(2,2)
        this.quad = new THREE.Mesh(geometry,null)
        this.quad.frustumCulled = false
        this.scene.add(this.quad)
    }

    dispose() {
        for (let i=0;i<this.renderTargetsHorizontal.length;i++)
            this.renderTargetsHorizontal[i].dispose()
        for (let i=0;i<this.renderTargetsVertical.length;i++)
            this.renderTargetsVertical[i].dispose()
        this.renderTargetBright.dispose()
    }

    setSize(width, height) {
        let resx = Math.round(width/2), resy = Math.round(height/2)
        this.renderTargetBright.setSize(resx, resy)
        for (let i=0;i<this.nMips;i++) {
            this.renderTargetsHorizontal[i].setSize(resx,resy)
            this.renderTargetsVertical[i].setSize(resx,resy)
            this.separableBlurMaterials[i].uniforms['texSize'].value = new THREE.Vector2(resx,resy)
            resx = Math.round(resx/2)
            resy = Math.round(resy/2)
        }
    }

    render(renderer, writeBuffer, readBuffer, delta, maskActive) {
        this.oldClearColor.copy(renderer.getClearColor())
        this.oldClearAlpha = renderer.getClearAlpha()
        let oldAutoClear = renderer.autoClear
        renderer.autoClear = false
        renderer.setClearColor(new THREE.Color(0, 0, 0),0)
        if (maskActive) renderer.context.disable(renderer.context.STENCIL_TEST)

        this.highPassUniforms['tDiffuse'].value = readBuffer.texture
        this.highPassUniforms['luminosityThreshold'].value = this.threshold
        this.quad.material = this.materialHighPassFilter
        renderer.render(this.scene, this.camera, this.renderTargetBright, true)

        let inputRenderTarget = this.renderTargetBright
        for (let i=0;i<this.nMips;i++) {
            let material = this.quad.material = this.separableBlurMaterials[i]
            let uniforms = this.quad.material.uniforms
            uniforms['colorTexture'].value = inputRenderTarget.texture
            uniforms['direction'].value = BloomPass.blurX
            renderer.render(this.scene, this.camera,
                this.renderTargetsHorizontal[i],true)
            uniforms['colorTexture'].value = this.renderTargetsHorizontal[i].texture
            uniforms['direction'].value = BloomPass.blurY
            this.separableBlurMaterials[i] = material
            renderer.render(this.scene, this.camera, this.renderTargetsVertical[i], true)
            inputRenderTarget = this.renderTargetsVertical[i]
        }

        this.quad.material = this.compositeMaterial; // composite all mips
        this.compositeMaterial.uniforms['bloomStrength'].value = this.strength
        this.compositeMaterial.uniforms['bloomRadius'].value = this.radius
        this.compositeMaterial.uniforms['bloomTintColors'].value = this.bloomTintColors
        renderer.render(this.scene, this.camera, this.renderTargetsHorizontal[0], true)

        this.quad.material = this.materialCopy
        this.copyUniforms['tDiffuse'].value = this.renderTargetsHorizontal[0].texture
        if (maskActive) renderer.context.enable(renderer.context.STENCIL_TEST)
        renderer.render(this.scene, this.camera, readBuffer, false)
        renderer.setClearColor(this.oldClearColor, this.oldClearAlpha)
        renderer.autoClear = oldAutoClear
    }

    getSeperableBlurMaterial(kernelRadius) { return new THREE.ShaderMaterial({

        defines: {
            'KERNEL_RADIUS': kernelRadius,
            'SIGMA': kernelRadius },

        uniforms: {
            'colorTexture': { value: null },
            'texSize': { value: new THREE.Vector2(0.5, 0.5) },
            'direction': { value: new THREE.Vector2(0.5, 0.5)} },

        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
            }`,

        fragmentShader: `
            #include <common>
            varying vec2 vUv;
            uniform sampler2D colorTexture;
            uniform vec2 texSize;
            uniform vec2 direction;

            float gaussianPdf(in float x, in float sigma) {
                return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma; }

            void main() {
                vec2 invSize = 1.0/texSize;
                float fSigma = float(SIGMA);
                float weightSum = gaussianPdf(0.0, fSigma);
                vec3 diffuseSum = texture2D(colorTexture, vUv).rgb*weightSum;
                for (int i=1;i<KERNEL_RADIUS;i++) {
                    float x = float(i), w = gaussianPdf(x, fSigma);
                    vec2 uvOffset = direction*invSize*x;
                    vec3 sample1 = texture2D(colorTexture, vUv+uvOffset).rgb;
                    vec3 sample2 = texture2D(colorTexture, vUv-uvOffset).rgb;
                    diffuseSum += (sample1+sample2)*w;
                    weightSum += 2.0*w;
                } gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
            }
    `})}

    getCompositeMaterial(nMips) { return new THREE.ShaderMaterial({

        defines: { 'NUM_MIPS': nMips },

        uniforms: {
            'blurTexture1': { value: null },
            'blurTexture2': { value: null },
            'blurTexture3': { value: null },
            'blurTexture4': { value: null },
            'blurTexture5': { value: null },
            'dirtTexture': { value: null },
            'bloomStrength': { value: 1.0 },
            'bloomFactors': { value: null },
            'bloomTintColors': { value: null },
            'bloomRadius': { value: 0.0 } },

        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
            }`,

        fragmentShader: `
            varying vec2 vUv;
            uniform sampler2D blurTexture1;
            uniform sampler2D blurTexture2;
            uniform sampler2D blurTexture3;
            uniform sampler2D blurTexture4;
            uniform sampler2D blurTexture5;
            uniform sampler2D dirtTexture;
            uniform float bloomStrength;
            uniform float bloomRadius;
            uniform float bloomFactors[NUM_MIPS];
            uniform vec3 bloomTintColors[NUM_MIPS];

            float lerpBloomFactor(const in float factor) {
                return mix(factor, 1.2-factor, bloomRadius); }

            void main() {
                gl_FragColor = bloomStrength*(
                    + lerpBloomFactor(bloomFactors[0])*vec4(
                        bloomTintColors[0],1.0)*texture2D(blurTexture1, vUv)
                    + lerpBloomFactor(bloomFactors[1])*vec4(
                        bloomTintColors[1],1.0)*texture2D(blurTexture2,vUv)
                    + lerpBloomFactor(bloomFactors[2])*vec4(
                        bloomTintColors[2],1.0)*texture2D(blurTexture3,vUv)
                    + lerpBloomFactor(bloomFactors[3])*vec4(
                        bloomTintColors[3],1.0)*texture2D(blurTexture4,vUv)
                    + lerpBloomFactor(bloomFactors[4])*vec4(
                        bloomTintColors[4],1.0)*texture2D(blurTexture5,vUv));
            }
    `}) }

}
