///
/// 2017-09-20 Ben Scott @evan-erdos <bescott.org>
///
/// helper library
///
export * from './three.js'
export { default as OrbitControls } from './OrbitControls.js'

export const pick = n => Math.floor(Math.random()*n)
export const random = (min=0,max=1) => Math.random()*(max-min)+min
export const randomInt = (l=0,h=1) => Math.floor(random(l,h))
export const range = function*(l=0,h=1) { for (let i=l;i<h;++i) yield i }

