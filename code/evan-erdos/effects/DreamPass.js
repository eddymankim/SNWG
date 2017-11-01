///
/// 2017-10-31 Ben Scott <bescott@andrew.cmu.edu>
///
/// dream shader pass
///
import * as M from '../module.js'
import { Pass } from './module.js'
import { Dream } from '../shaders/module.js'

export default class DreamPass extends Pass {
    constructor({
            pow=[1.0, 1.0, 1.0],
            mul=[1.0, 1.0, 1.0],
            add=[0.1, 0.1, 0.1],
            color=0XFFFFFF,
            noise=0.5, scan=0.05, lines=2048,
            hue=0.0, noir=0.0, time=0.0,
            }={}) { super()
        let shader = Dream
        this.uniforms = M.UniformsUtils.clone(shader.uniforms)
        this.material = new M.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader })
        this.uniforms.time.value = time
        this.uniforms.noir.value = noir
        this.uniforms.scan.value = scan
        this.uniforms.lines.value = lines
        this.uniforms.noise.value = noise
        this.uniforms.color.value = color
        this.uniforms.powRGB.value = new M.Vector3(...pow)
        this.uniforms.mulRGB.value = new M.Vector3(...mul)
        this.uniforms.addRGB.value = new M.Vector3(...add)
        this.scene = new M.Scene()
        this.camera = new M.OrthographicCamera(-1,1,1,-1,0,1)
        this.quad = new M.Mesh(new M.PlaneBufferGeometry(2,2),null)
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
