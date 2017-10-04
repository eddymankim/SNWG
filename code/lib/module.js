///
/// 2017-09-20 Ben Scott @evan-erdos <bescott.org>
///
/// helper library
///
import { TextureLoader as L } from './three.js'
export * from './three.js'
export * from './effects/module.js'
export { default as OrbitControls } from './orbit.js'


///
/// returns a random integer [0..max)
///
export const pick = n => Math.floor(Math.random()*n)


///
/// returns a random real [min..max)
///
export const random = (min=0, max=1) => Math.random()*(max-min)+min


///
/// returns a random integer [min..max)
///
export const randomInt = (min=0, max=1) => Math.floor(random(min, max))


///
/// returns generator for values [min..max]
///
export function* range(min=0, max=1) { for (let i=min;i<max;++i) yield i }


///
/// creates a promise for loading in textures
///
export const loadImage = f => new Promise((c,r) => new L().load(f,c))
