///
/// FancyRenderer
///
/// 2017-10-01 Ben Scott @evan-erdos <bescott.org>
///
/// I just hate the length of that one line
///
import * as M from '../module.js'

export default class FancyCamera extends M.PerspectiveCamera {
    constructor({ fov=60, aspect=1, near=0.01, far=2e5 }={}) {
        super(fov, aspect, near, far) }

    setSize(w, h) { super.aspect = w/h; super.updateProjectionMatrix() }
}
