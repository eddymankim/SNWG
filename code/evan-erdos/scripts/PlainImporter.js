///
/// PlainImporter
///
/// 2017-10-23 Ben Scott @evan-erdos <bescott.org>
///
/// uses just enough to get by
///
import * as M from '../module.js'

export default class PlainImporter {
    constructor({ path='./' }={}) {
        const sound = new M.SoundLoader(), model = new M.ModelLoader()
        const photo = new M.PhotoLoader(), atmos = new M.AtmosLoader()
        const loadAsync = (l,f) => new Promise((c,r) => l.load(f,c,r))
        this.loadSound = file => loadAsync(sound.load, `${path+file}`)
        this.loadImage = file => loadAsync(photo.load, `${path+file}`)
        this.loadAtmos = file => loadAsync(atmos.load, `${path+file}`)
        this.loadModel = file => loadAsync(model.load, `${path+file}`)
    }
}
