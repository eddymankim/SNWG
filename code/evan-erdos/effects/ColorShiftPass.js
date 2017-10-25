///
/// @author evan-erdos / http://bescott.org/
///
import * as M from '../module.js'
import { ShaderPass } from '../effects/module.js'
import { ColorShift } from '../shaders/module.js'

export default class ColorShiftPass extends ShaderPass {
    constructor({
            noir=false, time=0, noise=0.5,
            pow=[1.0, 1.0, 1.0],
            mul=[1.0, 1.0, 1.0],
            add=[0.1, 0.1, 0.1],
            }={}) { super(ColorShift, 'tDiffuse')
        this.uniforms['noir'].value = noir?1:0
        this.uniforms['time'].value = time
        this.uniforms['noise'].value = noise
        this.uniforms['powRGB'].value = new M.Vector3(...pow)
        this.uniforms['mulRGB'].value = new M.Vector3(...mul)
        this.uniforms['addRGB'].value = new M.Vector3(...add)
        this.uniforms['tDiffuse'].value = null
        this.render = (renderer, write, read, delta, mask) => {
            this.uniforms['tDiffuse'].value = read.texture
            this.uniforms['time'].value += delta
            super.render(renderer, write, read, delta, mask)
        }
    }
}
