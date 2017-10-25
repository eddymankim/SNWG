///
/// @author alteredq / http://alteredqualia.com/
///
import * as T from '../module.js'
import { Pass } from './module.js'
import { Film } from '../shaders/module.js'

export default class FilmPass extends Pass {
    constructor({
            noise=0.5, scan=0.05,
            scanlines=2048, grayscale=0,
            }={}) { super()
        let shader = Film
        this.uniforms = T.UniformsUtils.clone(shader.uniforms)
        this.material = new T.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader })
        this.uniforms.grayscale.value = grayscale
        this.uniforms.nIntensity.value = noise
        this.uniforms.sIntensity.value = scan
        this.uniforms.sCount.value = scanlines
        this.scene = new T.Scene()
        this.camera = new T.OrthographicCamera(-1,1,1,-1,0,1)
        this.quad = new T.Mesh(new T.PlaneBufferGeometry(2,2),null)
        this.quad.frustumCulled = false
        this.scene.add(this.quad)
    }

    render(renderer, write, read, delta, mask) {
        this.uniforms['tDiffuse'].value = read.texture
        this.uniforms['time'].value += delta
        this.quad.material = this.material
        if (this.renderToScreen) renderer.render(this.scene,this.camera)
        else renderer.render(this.scene,this.camera,write,this.clear)
    }
}
