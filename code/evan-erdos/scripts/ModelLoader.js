///
/// @author evan-erdos / http://bescott.org/
///
import * as T from '../module.js'
import { GLTFLoader } from './module.js'

export default class ModelLoader {
    constructor(manager=T.DefaultLoadingManager) {
        const loader = new GLTFLoader()
        const find = (url) => `${url}/object.gltf`
        this.load = (url, onload, loading, error) =>
            loader.load(find(url),onload,loading,error)
    }
}
