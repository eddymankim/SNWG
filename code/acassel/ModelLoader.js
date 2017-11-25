///
/// @author evan-erdos / http://bescott.org/
///
import * as T from '../acassel/module.js'
// import { GLTFLoader } from './module.js'

export default class ModelLoader {
    constructor(manager=T.DefaultLoadingManager) {
        const loader = new T.OBJLoader()
        const find = (url) => `${url}`
        this.load = (url, onload, loading, error) =>
        	new Promise((c,r) => loader.load(find(url),c))
    }
}
