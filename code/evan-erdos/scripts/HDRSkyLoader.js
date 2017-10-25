///
/// @author Prashant Sharma / spidersharma03
/// @author Ben Houston / http://clara.io/bhouston
///
import * as T from '../module.js'

export default class HDRSkyLoader {
    constructor(manager=T.DefaultLoadingManager) {
        [this.manager,this.hdrLoader] = [manager,new T.RGBELoader()]
    }

    load(type, urls, onLoad, onProgress, onError) {
        const RGBEByteToRGBFloat = (source, offset, target, skew) => {
            let e = source[offset+3], scale = Math.pow(2,e-128)/255
            target[skew+0] = source[offset+0]*scale
            target[skew+1] = source[offset+1]*scale
            target[skew+2] = source[offset+2]*scale
        }

        var RGBEByteToRGBHalf = (()=>{
            let floatView = new Float32Array(1)
            let int32View = new Int32Array(floatView.buffer)

            function toHalf(val) {
                floatView[0] = val
                var x = int32View[0]
                var bits = (x>>16)&0x8000
                var m = (x>>12)&0x07ff
                var e = (x>>23)&0xff
                if (e<103) return bits
                if (e>142) {
                    bits |= 0x7c00
                    bits |= ((e==255)?0:1)&&(x&0x007fffff)
                    return bits
                } if (e < 113) {
                    m |= 0x0800
                    bits |= (m>>(114-e))+((m>>(113-e))&1)
                    return bits
                }
                bits |= ((e-112)<<10)|(m>>1)
                bits += m&1
                return bits
            }

            return (source, offset, target, skew) => {
                let e = source[offset+3], scale = Math.pow(2,e-128)/255
                target[skew+0] = toHalf(source[offset+0]*scale)
                target[skew+1] = toHalf(source[offset+1]*scale)
                target[skew+2] = toHalf(source[offset+2]*scale)
            }
        })()

        let texture = new T.CubeTexture()
        texture.type = type
        texture.encoding = (type===T.UnsignedByteType) ? T.RGBEEncoding : T.LinearEncoding
        texture.format = (type===T.UnsignedByteType) ? T.RGBAFormat : T.RGBFormat
        texture.minFilter = (texture.encoding===T.RGBEEncoding) ? T.NearestFilter : T.LinearFilter
        texture.magFilter = (texture.encoding===T.RGBEEncoding) ? T.NearestFilter : T.LinearFilter
        texture.generateMipmaps = (texture.encoding!==T.RGBEEncoding)
        texture.anisotropy = 0
        let loaded = 0, scope = this.hdrLoader

        function loadHDRData(i,onLoad,onProgress,onError) {
            let loader = new T.FileLoader(this.manager)
            loader.setResponseType('arraybuffer')
            loader.load(urls[i],(buffer) => {
                loaded++
                var texData = scope._parser(buffer)
                if (!texData) return
                if (type===T.FloatType) {
                    let numElements = (texData.data.length/4)*3
                    let floatdata = new Float32Array(numElements)
                    for (let j=0;j<numElements;++j)
                        RGBEByteToRGBFloat(texData.data, j*4, floatdata, j*3)
                    texData.data = floatdata
                } else if (type===T.HalfFloatType) {
                    let numElements = (texData.data.length/4)*3
                    let halfdata = new Uint16Array(numElements)
                    for (let j=0;j<numElements;j++)
                        RGBEByteToRGBHalf(texData.data, j*4, halfdata, j*3)
                    texData.data = halfdata
                }

                if (undefined!==texData.image) texture[i].images = texData.image
                else if (undefined!==texData.data) {
                    var dataTexture = new T.DataTexture(texData.data, texData.width, texData.height)
                    dataTexture.format = texture.format
                    dataTexture.type = texture.type
                    dataTexture.encoding = texture.encoding
                    dataTexture.minFilter = texture.minFilter
                    dataTexture.magFilter = texture.magFilter
                    dataTexture.generateMipmaps = texture.generateMipmaps
                    texture.images[i] = dataTexture
                }

                if (loaded===6) {
                    texture.needsUpdate = true
                    if (onLoad) onLoad(texture)
                }
            }, onProgress, onError)
        }
        for (let i=0;i<urls.length;i++) loadHDRData(i,onLoad,onProgress,onError)
        return texture
    }
}
