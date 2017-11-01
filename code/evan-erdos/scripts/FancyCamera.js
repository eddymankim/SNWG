///
/// 2017-10-01 Ben Scott @evan-erdos <bescott.org>
///
/// I just hate the length of the camera constructor line
///
import * as M from '../module.js'

export default class FancyCamera extends M.PerspectiveCamera {
    constructor({ fov=60, aspect=1, near=0.01, far=2e5 }={}) {
        super(fov, aspect, near, far) }

    setSize(width, height) {
        super.aspect = width/height
        super.updateProjectionMatrix()
    }
}
