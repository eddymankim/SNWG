///
/// @author alteredq / http://alteredqualia.com/
/// @author evan-erdos <bescott.org>
///
export default class Pass {
    constructor() {
        this.enabled = true
        this.needsSwap = true
        this.clear = false
        this.renderToScreen = false
    }

    setSize(width, height) { }

    render(renderer, writeBuffer, readBuffer, delta, maskActive) { }
}
