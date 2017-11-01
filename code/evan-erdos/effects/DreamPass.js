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
            pow=[1.0, 1.0, 1.0], mul=[1.0, 1.0, 1.0],
            add=[0.1, 0.1, 0.1], mhu=[1.2, 1.0, 1.0],
            colors=[
                [0XFFFFFF, 0XFFFFFF, 0XFFFFFF],
                [0XFFFFFF, 0XFFFFFF, 0XFFFFFF],
                [0XFFFFFF, 0XFFFFFF, 0XFFFFFF],
                [0XFFFFFF, 0XFFFFFF, 0XFFFFFF], ],
            color=0XFFFFFF, accent=0XFFFFFF,
            noise=0.5, scan=0.05, lines=2048,
            noir=0.0, creep=1.0, darken=1.0,
            bleach=0.5, techni=0.1, sepia=0.0,
            hue=0.0, fill=0.5, time=0.0,
            speed=0.02, gray=false }={}) { super()
        let shader = Dream
        this.speed = speed
        this.colors = [[
            new M.Color(colors[0][0]), new M.Color(colors[0][1]),
            new M.Color(colors[0][2]), new M.Color(colors[0][3])],[
            new M.Color(colors[1][0]), new M.Color(colors[1][1]),
            new M.Color(colors[1][2]), new M.Color(colors[1][3])],[
            new M.Color(colors[2][0]), new M.Color(colors[2][1]),
            new M.Color(colors[2][2]), new M.Color(colors[2][3])],[
            new M.Color(colors[3][0]), new M.Color(colors[3][1]),
            new M.Color(colors[3][2]), new M.Color(colors[3][3]),]]
        this.uniforms = M.UniformsUtils.clone(shader.uniforms)
        this.material = new M.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader })
        this.uniforms.gray.value = gray
        this.uniforms.time.value = time
        this.uniforms.hue.value = hue
        this.uniforms.fill.value = fill
        this.uniforms.noir.value = noir
        this.uniforms.scan.value = scan
        this.uniforms.lines.value = lines
        this.uniforms.noise.value = noise
        this.uniforms.techni.value = techni
        this.uniforms.sepia.value = sepia
        this.uniforms.color0.value = new M.Color(colors[1][0])
        this.uniforms.color1.value = new M.Color(colors[1][1])
        this.uniforms.color2.value = new M.Color(colors[1][2])
        this.uniforms.color3.value = new M.Color(colors[1][3])
        this.uniforms.mulHue.value = new M.Vector3(...mhu)
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
        this.uniforms.tDiffuse.value = read.texture
        let colors = this.colors, t = this.uniforms.time.value % 1.0
        if (t<=1.0 && t+delta>1.0)
            [colors[0], colors[1], colors[2], colors[3]] =
                [colors[1], colors[2], colors[3], colors[0]]
        this.uniforms.time.value += delta
        this.uniforms.color0.value.lerp(colors[0][0],t*this.speed)
        this.uniforms.color1.value.lerp(colors[0][1],t*this.speed)
        this.uniforms.color2.value.lerp(colors[0][2],t*this.speed)
        this.uniforms.color3.value.lerp(colors[0][3],t*this.speed)
        this.quad.material = this.material
        if (this.renderToScreen) renderer.render(this.scene,this.camera)
        else renderer.render(this.scene,this.camera,write,this.clear)
    }
}
