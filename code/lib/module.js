///
/// 2017-09-20 Ben Scott @evan-erdos <bescott.org>
///
/// helper library
///
export * from './three.js'
import * as L from './loaders/module.js'
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
export const randomInt = (min=0, max=1) => Math.floor(random(min,max))


///
/// returns generator for values [min..max]
///
export const range = function*(min=0, max=1) { for (let i=min;i<max;++i) yield i }



const modelLoader = new L.ModelLoader()
const soundLoader = new L.SoundLoader()
const imageLoader = new L.ImageLoader()
const envirLoader = new L.EnvirLoader()

///
/// loads a file, detects type based on file type
///
export const load = (path='./', ...files) => {
    const notSupported = /^*.(stl|json|ma|mb|dae|psd|raw)$/i.test
    const isModel = /^*.(fbx|obj|gltf)$/i.test
    const isImage = /^*.(png|jpe?g|tga|tiff?)$/i.test
    const isSound = /^*.(wav|mp3|ogg|)$/i.test
    const loadAsync = (l,f) => new Promise((c,r)=>l.load(f,c))
    for (let file of files)
        if (notSupported(file)) throw new Error('unsupported file format')
        else if (isModel(file)) return loadAsync(modelLoader,`${path}/models/${file}`)
        else if (isImage(file)) return loadAsync(imageLoader,`${path}/images/${file}`)
        else if (isSound(file)) return loadAsync(soundLoader,`${path}/sounds/${file}`)
}


