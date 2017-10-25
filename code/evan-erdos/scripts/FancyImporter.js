///
/// FancyImporter
///
/// 2017-10-23 Ben Scott @evan-erdos <bescott.org>
///
/// uses configurable filepaths to load files dynamically
///
import { ModelLoader, SoundLoader } from '../module.js'
import { PhotoLoader, AtmosLoader } from '../module.js'

export default class FancyImporter {
    constructor({
            path = './',  sounds='sounds',  images='images',  models='models',
            isSound = (f)=>/^.*\.(ogg|ogv|wav|aiff?|mp[34]|mpeg4?)$/i.test(f),
            isImage = (f)=>/^.*\.(png|jpe?g|tiff?|tga|gif|mp4|mov)$/i.test(f),
            isModel = (f)=>/^.*\.(gltf?|fbx|obj|dae|stl|blend|3ds)$/i.test(f),
            isAtmos = (f)=>/^.*\.(hdr|exr|raw|psd|bin|bmp)$/i.test(f), }={}) {
        const soundLoader = new SoundLoader(), modelLoader = new ModelLoader()
        const photoLoader = new PhotoLoader(), atmosLoader = new AtmosLoader()
        const loadSound = (f,e) => new Promise((c,r) => soundLoader.load(f,c))
        const loadPhoto = (f,e) => new Promise((c,r) => photoLoader.load(f,c))
        const loadAtmos = (f,e) => new Promise((c,r) => atmosLoader.load(f,c))
        const loadModel = (f,e) => new Promise((c,r) => modelLoader.load(f,c))
        this.load = (...files) => Promise.all(files.map(f=> this.loadFile(f)))
        this.loadFile = (file='') => { // console.log(`loading path: ${file}`)
            if (isSound(file)) return loadSound(`./${path}/${sounds}/${file}`)
            if (isImage(file)) return loadPhoto(`./${path}/${images}/${file}`)
            if (isAtmos(file)) return loadAtmos(`./${path}/${images}/${file}`)
            if (isModel(file)) return loadModel(`./${path}/${models}/${file}`)
            throw new Error(`unsupported filetype or file not found: ${file}`)
        }
    }
}
