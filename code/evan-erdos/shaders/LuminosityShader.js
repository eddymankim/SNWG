/// @author alteredq / http://alteredqualia.com/
///
///luminosity http://en.wikipedia.org/wiki/Luminosity
///
export default {

    uniforms: { 'tDiffuse': { value: null } },

    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }`,

    fragmentShader: `
        uniform sampler2D tDiffuse; varying vec2 vUv;

        void main() {
            vec4 tex = texture2D(tDiffuse,vUv);
            float v = dot(tex.xyz,vec3(0.299,0.587,0.114));
            gl_FragColor = vec4(v,v,v,tex.w);
        }`
}
