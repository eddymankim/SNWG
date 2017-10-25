/// @author evan-erdos <http://bescott.org/>
///
/// color shift shader
///
import * as T from '../module.js'

export default {

    uniforms: {
        'noir': { value: true },
        'time': { value: 0 },
        'noise': { value: 0.5 },
        'powRGB': { value: new T.Vector3(1.5,1.5,1.5) },
        'mulRGB': { value: new T.Vector3(1.1,1.1,1.1) },
        'addRGB': { value: new T.Vector3(0.0,0.0,0.0) },
        'tDiffuse': { value: null }, },

    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }`,

    fragmentShader: `
        #include <common>
        uniform bool noir;
        uniform float time;
        uniform float noise;
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        uniform vec3 powRGB, mulRGB, addRGB;

        void main() {
            vec4 tex = texture2D(tDiffuse, vUv);
            vec3 cr = tex.rgb+tex.rgb*clamp(0.1+rand(vUv+time),0.0,1.0);
            cr = tex.rgb+clamp(noise,0.0,1.0)*(cr-tex.rgb);
            if (noir) cr = vec3(cr.r*0.3+cr.g*0.59+cr.b*0.11);
            cr = mulRGB*pow(cr.rgb+addRGB,powRGB);
            gl_FragColor = vec4(cr, tex.a);
        }`
}


// import { Shader } from '../shaders/module.js'
// export default class ColorShiftShader extends Shader { constructor({

//     fragment=`
//         #include <common>
//         uniform bool noir;
//         uniform float time, noise;
//         uniform sampler2D tDiffuse;
//         varying vec2 vUv;
//         uniform vec3 powRGB, mulRGB, addRGB;

//         void main() {
//             vec4 tex = texture2D(tDiffuse, vUv);
//             vec3 cr = tex.rgb+tex.rgb*clamp(0.1+rand(vUv+time),0.0,1.0);
//             cr = tex.rgb+clamp(noise,0.0,1.0)*(cr-tex.rgb);
//             if (noir) cr = vec3(cr.r*0.3+cr.g*0.59+cr.b*0.11);
//             cr = mulRGB*pow(cr.rgb+addRGB,powRGB);
//             gl_FragColor = vec4(cr, tex.a);
//         }`,

//     uniforms={
//         noir: { value: false },
//         time: { value: 0.0 },
//         noise: { value: 0.5 },
//         powRGB: { value: new M.Vector3(1.5,1.5,1.5) },
//         mulRGB: { value: new M.Vector3(1.1,1.1,1.1) },
//         addRGB: { value: new M.Vector3(0.0,0.0,0.0) },
//         tDiffuse: { value: null } },

//     }={}) { super({fragment, uniforms}) } }

