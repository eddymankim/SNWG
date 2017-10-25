///
/// @author alteredq / http://alteredqualia.com/
///
import * as T from '../module.js'
import { Pass } from './module.js'
import { Glitch } from '../shaders/module.js'

export default class GlitchPass extends Pass {
    constructor(size=64) { super()
        const shader = Glitch
        this.uniforms = T.UniformsUtils.clone(shader.uniforms)
        this.uniforms['tDisp'].value = this.generateHeightmap(size)
        this.material = new T.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader })
        this.camera = new T.OrthographicCamera(-1,1,1,-1,0,1)
        this.scene  = new T.Scene()
        this.quad = new T.Mesh(new T.PlaneBufferGeometry(2,2),null)
        this.quad.frustumCulled = false
        this.scene.add(this.quad)
        this.goWild = false
        this.curF = 0
        this.generateTrigger()
    }

    render(renderer, writeBuffer, readBuffer, delta, maskActive) {
        this.uniforms['tDiffuse'].value = readBuffer.texture
        this.uniforms['seed'].value = Math.random()
        this.uniforms['byp'].value = 0
        if (this.curF%this.randX==0 || this.goWild==true) {
            this.uniforms['amount'].value = Math.random()/30
            this.uniforms['angle'].value = T.Math.randFloat(-Math.PI,Math.PI)
            this.uniforms['seed_x'].value = T.Math.randFloat(-1,1)
            this.uniforms['seed_y'].value = T.Math.randFloat(-1,1)
            this.uniforms['distortion_x'].value = T.Math.randFloat(0,1)
            this.uniforms['distortion_y'].value = T.Math.randFloat(0,1)
            this.curF = 0
            this.generateTrigger()
        } else if (this.curF%this.randX<this.randX/5) {
            this.uniforms['amount'].value = Math.random()/90
            this.uniforms['angle'].value = T.Math.randFloat(-Math.PI,Math.PI)
            this.uniforms['distortion_x'].value = T.Math.randFloat(0,1)
            this.uniforms['distortion_y'].value = T.Math.randFloat(0,1)
            this.uniforms['seed_x'].value = T.Math.randFloat(-0.3,0.3)
            this.uniforms['seed_y'].value = T.Math.randFloat(-0.3,0.3)
        } else if (this.goWild==false) this.uniforms['byp'].value = 1
        this.curF++
        this.quad.material = this.material
        if (this.renderToScreen) renderer.render(this.scene, this.camera)
        else renderer.render(this.scene, this.camera, writeBuffer, this.clear)
    }

    generateTrigger() { this.randX = T.Math.randInt(120,240) }

    generateHeightmap(size) {
        const length = size*size, data = new Float32Array(length*3)
        for (let i=0;i<length;i++)
            data[i*3+0] = data[i*3+1] = data[i*3+2] = T.Math.randFloat(0,1)
        const tex = new T.DataTexture(data,size,size,T.RGBFormat,T.FloatType)
        tex.needsUpdate = true
        return tex
    }
}
