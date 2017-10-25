///
/// @author evan-erdos / http://bescott.org/
///
import * as T from '../module.js'

export default class AtmosLoader {
    constructor(manager=T.DefaultLoadingManager) {
        const loader = new T.CubeTextureLoader()
        const find = (url, ext='png') => [
            `${url}/pz.${ext}`, `${url}/nz.${ext}`,
            `${url}/py.${ext}`, `${url}/ny.${ext}`,
            `${url}/px.${ext}`, `${url}/nx.${ext}`]
        this.load = (url, onload, loading, error) =>
            loader.load(find(url),onload,loading,error)
    }
}
