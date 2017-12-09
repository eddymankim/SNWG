///
/// @author evan-erdos / http://bescott.org/
///
import * as T from '../acassel/module.js'


export default class SoundLoader {
    constructor(path='../') {
        const loader = new T.AudioLoader()
        const find = (url) => `${path}${url}`
        this.load = (url, onload, loading, error) =>
        	new Promise((c,r) => loader.load(find(url),c,undefined,r))
    }
}
