/// @author bhouston / http://clara.io/
///
///luminosity http://en.wikipedia.org/wiki/Luminosity
///
import { Color } from '../module.js'

export default {

    shaderID: 'luminosityHighPass',

    uniforms: {
        'tDiffuse': { type: 't', value: null },
        'luminosityThreshold': { type: 'f', value: 1.0 },
        'smoothWidth': { type: 'f', value: 1.0 },
        'defaultColor': { type: 'c', value: new Color(0x000000) },
        'defaultOpacity':  { type: 'f', value: 0.0 } },

    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }`,

    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec3 defaultColor;
        uniform float defaultOpacity;
        uniform float luminosityThreshold;
        uniform float smoothWidth;
        varying vec2 vUv;

        void main() {
            vec4 tex = texture2D(tDiffuse,vUv);
            float v = dot(tex.xyz,vec3(0.299,0.587,0.114));
            float a = smoothstep(luminosityThreshold,luminosityThreshold+smoothWidth,v);
            gl_FragColor = mix(vec4(defaultColor.rgb,defaultOpacity),tex,a);
        }`
}
