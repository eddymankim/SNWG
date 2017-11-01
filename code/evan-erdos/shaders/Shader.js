/// @author evan-erdos <http://bescott.org/>
///
/// default shader
///
export default class Shader {
    constructor({
        vertex=`varying vec2 vUv; void main() { vUv = uv; gl_Position =
            projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragment=`void main() { gl_FragColor = vec4(1.0,0.0,0.0,0.5); }`,
        uniforms={tDiffuse:{value:null}},  defines={},   }={}) {
        this.uniforms = {...uniforms, ...{tDiffuse:{value:null}} }
        [this.defines, this._vertex, this._fragment] = [defines,vertex,fragment]
    }

    set(name, value) {
        if (this.uniforms[name]===undefined)
            this.uniforms[name] = { value: value }
        else this.uniforms[name].value = value
    }

    get vertex() { return this._vertex }
    get fragment() { return this._fragment }

    get parameters() { return {
        vertexShader:this._vertex, fragmentShader:this._fragment,
        uniforms:this.uniforms, defines:this.defines, } }
}
