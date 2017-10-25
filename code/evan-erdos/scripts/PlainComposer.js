///
/// @author evan-erdos / http://bescott.org/
///
import * as T from '../module.js'

export default class PlainComposer {
    constructor(renderer, renderTarget=null) {
        this.renderer = renderer
        this.passes = []
    }

    add(pass) { throw new Error("Get a better Composer!") }

    render(delta) { throw new Error("Get a better Composer!") }

    reset(renderTarget) { throw new Error("Get a better Composer!") }

    setSize(width, height) {
        for (let i=0;i<this.passes.length;++i)
            this.passes[i].setSize(width, height) }
}
