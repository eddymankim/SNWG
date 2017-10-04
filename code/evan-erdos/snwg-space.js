///
/// SNWG - now in spaceeeeeeee
///
/// 2017-09-26 Ben Scott @evan-erdos <bescott.org>
///
import * as T from '../lib/module.js'
import * as Space from './Space.js'
import RendererCamera from './RendererCamera.js'

const dir = '../../data/evan-erdos/'

let camera = new RendererCamera({ dir,
    scenery: [
        new Space.StarField({ count: 1e3, color: 0x111111, size: 1 }),
        new Space.StarField({ count: 2e2, color: 0xAAAAAA, size: 1 }),
        new Space.StarField({ count: 1e1, color: 0x448ACA, size: 2 }),
        new Space.StarField({ count: 2e1, color: 0xAA433B, size: 1 }),
        new Space.StarField({ count: 1e2, color: 0xFFFAD3, size: 1 }), ], })
    // objects: [
    //     new Space.Planet({ file: dir, orbit: 0.05, height: 5e2, period: 2 }),
    //     new Space.GasGiant({ file: dir, orbit: 0.05, moons: 2, period: 2 }),
    //     new Space.Star({ file: dir, color: 0xFFE600, power: 1.5, range: 3e6 }), ],


camera.add(new Space.Star({ file: dir, color: 0xFFE600, power: 1.5, range: 3e6 }))
camera.add(new Space.GasGiant({ file: dir, orbit: 0.05, moons: 2, period: 2 }))
camera.add(new Space.Planet({ file: dir, orbit: 0.05, height: 5e2, period: 2 }))



