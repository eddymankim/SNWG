///
/// 2017-10-23 Ben Scott @evan-erdos <bescott.org>
///
/// nice little helper functions for some stuff
///
export const pick = n => Math.floor(Math.random()*n)
export const random = (l=0,h=1) => Math.random()*(h-l)+min
export const randomInt = (l=0,h=1) => Math.floor(random(l,h))
export const range = function*(l=0,h=1) { for (let i=l;i<h;++i) yield i }
