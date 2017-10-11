///
/// SNWG - now in spaceeeeeeee
///
/// 2017-09-26 Ben Scott @evan-erdos <bescott.org>
///
import * as T from '../lib/module.js'
import * as Space from './Space.js'
import FancyRenderer from './FancyRenderer.js'

const path = '../../data/evan-erdos/'

let renderer = new FancyRenderer({ path, scenery: [
    new Space.StarField({ count: 1e3, color: 0x111111, size: 1 }),
    new Space.StarField({ count: 2e2, color: 0xAAAAAA, size: 1 }),
    new Space.StarField({ count: 1e1, color: 0x448ACA, size: 2 }),
    new Space.StarField({ count: 2e1, color: 0xAA433B, size: 1 }),
    new Space.StarField({ count: 1e2, color: 0xFFFAD3, size: 1 }), ]})

renderer.add(new Space.Star({ path, color: 0xFFE600, power: 1.5, range: 3e6 }))
renderer.add(new Space.GasGiant({ path, orbit: 0.05, moons: 2, period: 2 }))
renderer.add(new Space.Planet({ path, orbit: 0.05, height: 5e2, period: 2 }))

