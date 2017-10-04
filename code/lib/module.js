///
/// 2017-09-20 Ben Scott @evan-erdos <bescott.org>
///
/// helper library
///

import { TextureLoader as T } from './three.js'
export * from './three.js'
export * from './effects/module.js'
export { default as OrbitControls } from './orbit.js'

/// returns a random integer where n => [0, max)
export const pick = n => Math.floor(Math.random()*n)

/// returns a random real where n => [min, max)
export const random = (min=0, max=1) => Math.random()*(max-min)+min

/// returns a random integer where n => [min, max)
export const randomInt = (min=0, max=1) => Math.floor(random(min, max))

/// returns an array of values from [min, min+1, ...max]
export function *range(min=0, max=1) { for (let i=min;i<max;++i) yield i }

/// creates a promise for loading in textures
export const loadImage = f => new Promise((c,r) => new T().load(f,o => c(o)))

/// generates curves too quickly
export function hilbert(center=[0,0,0], size=10, count=1,
                ...[a=0, b=1, c=2, d=3, e=4, f=5, g=6, h=7]) {
    const i = size/2, L = [
        [center.x-i,center.y+i,center.z-i],[center.x-i,center.y+i,center.z+i],
        [center.x-i,center.y-i,center.z+i],[center.x-i,center.y-i,center.z-i],
        [center.x+i,center.y-i,center.z-i],[center.x+i,center.y-i,center.z+i],
        [center.x+i,center.y+i,center.z+i],[center.x+i,center.y+i,center.z-i]]
    const v = [L[a],L[b],L[c],L[d],L[e],L[f],L[g],L[h]]
    if (--count<0) return v
    return [
        ...hilbert(v[0],i,count,a,d,e,h,g,f,c,b),
        ...hilbert(v[1],i,count,a,h,g,b,c,f,e,d),
        ...hilbert(v[2],i,count,a,h,g,b,c,f,e,d),
        ...hilbert(v[3],i,count,c,d,a,b,g,h,e,f),
        ...hilbert(v[4],i,count,c,d,a,b,g,h,e,f),
        ...hilbert(v[5],i,count,e,d,c,f,g,b,a,h),
        ...hilbert(v[6],i,count,e,d,c,f,g,b,a,h),
        ...hilbert(v[7],i,count,g,f,c,b,a,d,e,h)]
}

