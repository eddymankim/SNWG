///
/// @author spidersharma / http://eduperiment.com/
///
import * as THREE from '../module.js'
import { Pass } from './module.js'
import { Copy } from '../shaders/module.js'

export default class OutlinePass extends Pass {
    constructor(resolution, scene, camera, selectedObjects=[]) { super()
        const copyShader = Copy
        this.renderScene = scene
        this.renderCamera = camera
        this.selectedObjects = selectedObjects
        this.visibleEdgeColor = new THREE.Color(1,1,1)
        this.hiddenEdgeColor = new THREE.Color(0.1,0.04,0.02)
        this.edgeGlow = 0.0
        this.usePatternTexture = false
        this.edgeThickness = 1.0
        this.edgeStrength = 3.0
        this.downSampleRatio = 2
        this.pulsePeriod = 0
        this.resolution = (resolution===undefined) ? new THREE.Vector2(256,256)
            : new THREE.Vector2(resolution.x, resolution.y)
        let pars = { format: THREE.RGBAFormat,
            minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter }
        let resx = Math.round(this.resolution.x/this.downSampleRatio)
        let resy = Math.round(this.resolution.y/this.downSampleRatio)
        this.maskBufferMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
        this.maskBufferMaterial.side = THREE.DoubleSide
        this.renderTargetMaskBuffer = new THREE.WebGLRenderTarget(
            this.resolution.x, this.resolution.y, pars)
        this.renderTargetMaskBuffer.texture.name = 'OutlinePass.mask'
        this.renderTargetMaskBuffer.texture.generateMipmaps = false
        this.depthMaterial = new THREE.MeshDepthMaterial()
        this.depthMaterial.side = THREE.DoubleSide
        this.depthMaterial.depthPacking = THREE.RGBADepthPacking
        this.depthMaterial.blending = THREE.NoBlending
        this.prepareMaskMaterial = this.getPrepareMaskMaterial()
        this.prepareMaskMaterial.side = THREE.DoubleSide
        this.renderTargetDepthBuffer = new THREE.WebGLRenderTarget(
            this.resolution.x, this.resolution.y, pars)
        this.renderTargetDepthBuffer.texture.name = 'OutlinePass.depth'
        this.renderTargetDepthBuffer.texture.generateMipmaps = false
        this.renderTargetMaskDownSampleBuffer = new THREE.WebGLRenderTarget(resx,resy,pars)
        this.renderTargetMaskDownSampleBuffer.texture.name = 'OutlinePass.depthDownSample'
        this.renderTargetMaskDownSampleBuffer.texture.generateMipmaps = false
        this.renderTargetBlurBuffer1 = new THREE.WebGLRenderTarget(resx, resy, pars)
        this.renderTargetBlurBuffer1.texture.name = 'OutlinePass.blur1'
        this.renderTargetBlurBuffer1.texture.generateMipmaps = false
        this.renderTargetBlurBuffer2 = new THREE.WebGLRenderTarget(
            Math.round(resx/2), Math.round(resy/2), pars)
        this.renderTargetBlurBuffer2.texture.name = 'OutlinePass.blur2'
        this.renderTargetBlurBuffer2.texture.generateMipmaps = false
        this.edgeDetectionMaterial = this.getEdgeDetectionMaterial()
        this.renderTargetEdgeBuffer1 = new THREE.WebGLRenderTarget(resx,resy,pars)
        this.renderTargetEdgeBuffer1.texture.name = 'OutlinePass.edge1'
        this.renderTargetEdgeBuffer1.texture.generateMipmaps = false
        this.renderTargetEdgeBuffer2 = new THREE.WebGLRenderTarget(
            Math.round(resx/2), Math.round(resy/2), pars)
        this.renderTargetEdgeBuffer2.texture.name = 'OutlinePass.edge2'
        this.renderTargetEdgeBuffer2.texture.generateMipmaps = false
        const MAX_EDGE_THICKNESS = 4, MAX_EDGE_GLOW = 4
        this.separableBlurMaterial1 = this.getSeperableBlurMaterial(MAX_EDGE_THICKNESS)
        this.separableBlurMaterial1.uniforms['texSize'].value = new THREE.Vector2(resx, resy)
        this.separableBlurMaterial1.uniforms['kernelRadius'].value = 1
        this.separableBlurMaterial2 = this.getSeperableBlurMaterial(MAX_EDGE_GLOW)
        this.separableBlurMaterial2.uniforms['texSize'].value = new THREE.Vector2(
            Math.round(resx/2), Math.round(resy/2))
        this.separableBlurMaterial2.uniforms['kernelRadius'].value = MAX_EDGE_GLOW
        this.overlayMaterial = this.getOverlayMaterial() // overlay material
        this.copyUniforms = THREE.UniformsUtils.clone(copyShader.uniforms)
        this.copyUniforms['opacity'].value = 1.0
        this.materialCopy = new THREE.ShaderMaterial({
            uniforms: this.copyUniforms,
            vertexShader: copyShader.vertexShader,
            fragmentShader: copyShader.fragmentShader,
            blending: THREE.NoBlending,
            depthTest: false, depthWrite: false, transparent: true })
        this.enabled = true
        this.needsSwap = false
        this.oldClearColor = new THREE.Color()
        this.oldClearAlpha = 1
        this.camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1)
        this.scene = new THREE.Scene()
        this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2),null)
        this.quad.frustumCulled = false
        this.scene.add(this.quad)
        this.tempPulseColor1 = new THREE.Color()
        this.tempPulseColor2 = new THREE.Color()
        this.textureMatrix = new THREE.Matrix4()
    }

    dispose() {
        this.renderTargetMaskBuffer.dispose()
        this.renderTargetDepthBuffer.dispose()
        this.renderTargetMaskDownSampleBuffer.dispose()
        this.renderTargetBlurBuffer1.dispose()
        this.renderTargetBlurBuffer2.dispose()
        this.renderTargetEdgeBuffer1.dispose()
        this.renderTargetEdgeBuffer2.dispose()
    }

    setSize(width,height) {
        this.renderTargetMaskBuffer.setSize(width,height)
        let resx = Math.round(width/this.downSampleRatio)
        let resy = Math.round(height/this.downSampleRatio)
        this.renderTargetMaskDownSampleBuffer.setSize(resx,resy)
        this.renderTargetBlurBuffer1.setSize(resx,resy)
        this.renderTargetEdgeBuffer1.setSize(resx,resy)
        this.separableBlurMaterial1.uniforms['texSize'].value = new THREE.Vector2(resx,resy)
        resx = Math.round(resx/2), resy = Math.round(resy/2)
        this.renderTargetBlurBuffer2.setSize(resx, resy)
        this.renderTargetEdgeBuffer2.setSize(resx, resy)
        this.separableBlurMaterial2.uniforms['texSize'].value = new THREE.Vector2(resx,resy)
    }

    changeVisibilityOfSelectedObjects(bVisible) {
        const gatherSelectedMeshesCallBack = (object) {
            if (object instanceof THREE.Mesh) object.visible = bVisible }
        for (let i=0;i<this.selectedObjects.length;i++)
            this.selectedObjects[i].traverse(gatherSelectedMeshesCallBack)
    }

    changeVisibilityOfNonSelectedObjects(bVisible) {
        let selectedMeshes = []
        const gatherSelectedMeshesCallBack = (object) => {
            if (object instanceof THREE.Mesh) selectedMeshes.push(object) }

        for (let i=0;i<this.selectedObjects.length;i++)
            this.selectedObjects[i].traverse( gatherSelectedMeshesCallBack)

        const VisibilityChangeCallBack = (object) => {
            if (!(object instanceof THREE.Mesh)) return
            let bFound = false
            for (let i=0;i<selectedMeshes.length;i++)
                if (selectedMeshes[i].id===object.id) { bFound = true; break }
            if (!bFound) {
                let visibility = object.visible
                if (!bVisible || object.bVisible) object.visible = bVisible
                object.bVisible = visibility
            }
        }
        this.renderScene.traverse(VisibilityChangeCallBack)
    }

    updateTextureMatrix() {
        this.textureMatrix.set(
            0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5,
            0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0)
        this.textureMatrix.multiply(this.renderCamera.projectionMatrix)
        this.textureMatrix.multiply(this.renderCamera.matrixWorldInverse)
    }

    render(renderer, writeBuffer, readBuffer, delta, maskActive) {
        if (this.selectedObjects.length===0) return
        this.oldClearColor.copy(renderer.getClearColor())
        this.oldClearAlpha = renderer.getClearAlpha()
        let oldAutoClear = renderer.autoClear
        renderer.autoClear = false
        if (maskActive) renderer.context.disable(renderer.context.STENCIL_TEST)
        renderer.setClearColor(0xffffff,1)
        this.changeVisibilityOfSelectedObjects(false)
        this.renderScene.overrideMaterial = this.depthMaterial
        renderer.render(this.renderScene,this.renderCamera,this.renderTargetDepthBuffer,true)
        this.changeVisibilityOfSelectedObjects(true) // Make selected objects visible
        this.updateTextureMatrix() // update Texture Matrix for Depth compare
        this.changeVisibilityOfNonSelectedObjects(false)
        this.renderScene.overrideMaterial = this.prepareMaskMaterial
        this.prepareMaskMaterial.uniforms['cameraNearFar'].value = new THREE.Vector2(
            this.renderCamera.near, this.renderCamera.far)
        this.prepareMaskMaterial.uniforms['depthTexture'].value = this.renderTargetDepthBuffer.texture
        this.prepareMaskMaterial.uniforms['textureMatrix'].value = this.textureMatrix
        renderer.render(this.renderScene,this.renderCamera,this.renderTargetMaskBuffer,true)
        this.renderScene.overrideMaterial = null
        this.changeVisibilityOfNonSelectedObjects(true)
        this.quad.material = this.materialCopy // 2. Downsample to Half resolution
        this.copyUniforms['tDiffuse'].value = this.renderTargetMaskBuffer.texture
        renderer.render(this.scene,this.camera,this.renderTargetMaskDownSampleBuffer,true)
        this.tempPulseColor1.copy(this.visibleEdgeColor)
        this.tempPulseColor2.copy(this.hiddenEdgeColor)
        if (this.pulsePeriod>0) {
            let sl = (1+0.25)/2+Math.cos(performance.now()*0.01/this.pulsePeriod)*(1-0.25)/2
            this.tempPulseColor1.multiplyScalar(sl)
            this.tempPulseColor2.multiplyScalar(sl)
        }

        this.quad.material = this.edgeDetectionMaterial
        this.edgeDetectionMaterial.uniforms['maskTexture'].value = this.renderTargetMaskDownSampleBuffer.texture
        this.edgeDetectionMaterial.uniforms['texSize'].value = new THREE.Vector2(
            this.renderTargetMaskDownSampleBuffer.width,
            this.renderTargetMaskDownSampleBuffer.height)
        this.edgeDetectionMaterial.uniforms['visibleEdgeColor'].value = this.tempPulseColor1
        this.edgeDetectionMaterial.uniforms['hiddenEdgeColor'].value = this.tempPulseColor2
        renderer.render(this.scene, this.camera, this.renderTargetEdgeBuffer1, true)
        this.quad.material = this.separableBlurMaterial1 // apply blur on half res
        this.separableBlurMaterial1.uniforms['colorTexture'].value = this.renderTargetEdgeBuffer1.texture
        this.separableBlurMaterial1.uniforms['direction'].value = THREE.OutlinePass.BlurDirectionX
        this.separableBlurMaterial1.uniforms['kernelRadius'].value = this.edgeThickness
        renderer.render(this.scene, this.camera, this.renderTargetBlurBuffer1, true)
        this.separableBlurMaterial1.uniforms['colorTexture'].value = this.renderTargetBlurBuffer1.texture
        this.separableBlurMaterial1.uniforms['direction'].value = THREE.OutlinePass.BlurDirectionY
        renderer.render(this.scene,this.camera,this.renderTargetEdgeBuffer1,true)
        this.quad.material = this.separableBlurMaterial2 // apply Blur on quarter res
        this.separableBlurMaterial2.uniforms['colorTexture'].value = this.renderTargetEdgeBuffer1.texture
        this.separableBlurMaterial2.uniforms['direction'].value = THREE.OutlinePass.BlurDirectionX
        renderer.render(this.scene, this.camera, this.renderTargetBlurBuffer2, true)
        this.separableBlurMaterial2.uniforms['colorTexture'].value = this.renderTargetBlurBuffer2.texture
        this.separableBlurMaterial2.uniforms['direction'].value = THREE.OutlinePass.BlurDirectionY
        renderer.render(this.scene, this.camera, this.renderTargetEdgeBuffer2, true)
        this.quad.material = this.overlayMaterial // blend additively over the input texture
        this.overlayMaterial.uniforms['maskTexture'].value = this.renderTargetMaskBuffer.texture
        this.overlayMaterial.uniforms['edgeTexture1'].value = this.renderTargetEdgeBuffer1.texture
        this.overlayMaterial.uniforms['edgeTexture2'].value = this.renderTargetEdgeBuffer2.texture
        this.overlayMaterial.uniforms['patternTexture'].value = this.patternTexture
        this.overlayMaterial.uniforms['edgeStrength'].value = this.edgeStrength
        this.overlayMaterial.uniforms['edgeGlow'].value = this.edgeGlow
        this.overlayMaterial.uniforms['usePatternTexture'].value = this.usePatternTexture
        if (maskActive) renderer.context.enable(renderer.context.STENCIL_TEST)
        renderer.render(this.scene, this.camera, readBuffer, false)
        renderer.setClearColor(this.oldClearColor, this.oldClearAlpha)
        renderer.autoClear = oldAutoClear
    }

    getPrepareMaskMaterial() { return new THREE.ShaderMaterial({

        uniforms: {
            'depthTexture': { value: null },
            'cameraNearFar': { value: new THREE.Vector2( 0.5, 0.5 ) },
            'textureMatrix': { value: new THREE.Matrix4() } },

        vertexShader: `
            varying vec2 vUv;
            varying vec4 projTexCoord;
            varying vec4 vPosition;
            uniform mat4 textureMatrix;
            void main() {
                vUv = uv;
                vPosition = modelViewMatrix*vec4(position,1.0);
                vec4 worldPosition = modelMatrix*vec4(position,1.0);
                projTexCoord = textureMatrix*worldPosition;
                gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
            }`,

        fragmentShader: `
            #include <packing>
            varying vec2 vUv;
            varying vec4 vPosition;
            varying vec4 projTexCoord;
            uniform sampler2D depthTexture;
            uniform vec2 cameraNearFar;

            void main() {
                float d = unpackRGBAToDepth(texture2DProj(depthTexture,projTexCoord));
                float z = -perspectiveDepthToViewZ(d,cameraNearFar.x,cameraNearFar.y);
                gl_FragColor = vec4(0.0,(-vPosition.z>z)?1.0:0.0,1.0,1.0);
            }
        `}) }

    getEdgeDetectionMaterial() { return new THREE.ShaderMaterial({

        uniforms: {
            'maskTexture': { value: null },
            'texSize': { value: new THREE.Vector2( 0.5, 0.5 ) },
            'visibleEdgeColor': { value: new THREE.Vector3( 1.0, 1.0, 1.0 ) },
            'hiddenEdgeColor': { value: new THREE.Vector3( 1.0, 1.0, 1.0 ) } },

        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
            }`,

        fragmentShader: `
            varying vec2 vUv;
            uniform sampler2D maskTexture;
            uniform vec2 texSize;
            uniform vec3 visibleEdgeColor;
            uniform vec3 hiddenEdgeColor;

            void main() {
                vec2 invSize = 1.0 / texSize;
                vec4 uvOffset = vec4(1.0, 0.0, 0.0, 1.0) * vec4(invSize, invSize);
                vec4 c1 = texture2D( maskTexture, vUv + uvOffset.xy);
                vec4 c2 = texture2D( maskTexture, vUv - uvOffset.xy);
                vec4 c3 = texture2D( maskTexture, vUv + uvOffset.yw);
                vec4 c4 = texture2D( maskTexture, vUv - uvOffset.yw);
                float diff1 = (c1.r - c2.r)*0.5;
                float diff2 = (c3.r - c4.r)*0.5;
                float d = length( vec2(diff1, diff2) );
                float a1 = min(c1.g, c2.g);
                float a2 = min(c3.g, c4.g);
                float visibilityFactor = min(a1, a2);
                vec3 edgeColor = (1.0-visibilityFactor)>0.001
                    ? visibleEdgeColor : hiddenEdgeColor;
                gl_FragColor = vec4(edgeColor, 1.0) * vec4(d);
            }
        `}) }

    getSeperableBlurMaterial(maxRadius) { return new THREE.ShaderMaterial({

        defines: { 'MAX_RADIUS': maxRadius },

        uniforms: {
            'colorTexture': { value: null },
            'texSize': { value: new THREE.Vector2( 0.5, 0.5 ) },
            'direction': { value: new THREE.Vector2( 0.5, 0.5 ) },
            'kernelRadius': { value: 1.0 } },

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
            uniform vec2 texSize, direction;
            uniform float kernelRadius;

            float gaussianPdf(in float x, in float sigma) {
                return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma; }

            void main() {
                vec2 invSize = 1.0/texSize;
                float weightSum = gaussianPdf(0.0,kernelRadius);
                vec3 diffuseSum = texture2D(colorTexture,vUv).rgb*weightSum;
                vec2 delta = direction*invSize*kernelRadius/float(MAX_RADIUS);
                vec2 uvOffset = delta;
                for (int i=1;i<=MAX_RADIUS;i++) {
                    float w = gaussianPdf(uvOffset.x, kernelRadius);
                    vec3 sample1 = texture2D(colorTexture, vUv+uvOffset).rgb;
                    vec3 sample2 = texture2D(colorTexture, vUv-uvOffset).rgb;
                    diffuseSum += (sample1+sample2)*w;
                    weightSum += 2.0*w; uvOffset += delta;
                } gl_FragColor = vec4(diffuseSum/weightSum,1.0);
            }
        `}) }

    getOverlayMaterial() { return new THREE.ShaderMaterial({
        blending: THREE.AdditiveBlending,
        depthTest: false, depthWrite: false, transparent: true,

        uniforms: {
            'maskTexture': { value: null },
            'edgeTexture1': { value: null },
            'edgeTexture2': { value: null },
            'patternTexture': { value: null },
            'edgeStrength': { value: 1.0 },
            'edgeGlow': { value: 1.0 },
            'usePatternTexture': { value: 0.0 } },

        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
            }`,

        fragmentShader: `
            varying vec2 vUv;
            uniform sampler2D edgeTexture1, edgeTexture2;
            uniform sampler2D maskTexture, patternTexture;
            uniform float edgeStrength, edgeGlow;
            uniform bool usePatternTexture;

            void main() {
                vec4 edgeValue1 = texture2D(edgeTexture1, vUv);
                vec4 edgeValue2 = texture2D(edgeTexture2, vUv);
                vec4 maskColor = texture2D(maskTexture, vUv);
                vec4 patternColor = texture2D(patternTexture, 6.0*vUv);
                float visibilityFactor = 1.0-maskColor.g>0.0?1.0:0.5;
                vec4 edgeValue = edgeValue1+edgeValue2*edgeGlow;
                vec4 finalColor = edgeStrength*maskColor.r*edgeValue;
                if (usePatternTexture) finalColor +=
                    + visibilityFactor*(1.0-maskColor.r)*(1.0-patternColor.r);
                gl_FragColor= finalColor;
            }
        `}) }

    static BlurDirectionX() { return new THREE.Vector2(1.0,0.0) }
    static BlurDirectionY() { return new new THREE.Vector2(0.0,1.0) }

}
