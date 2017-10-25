/// @author alteredq <http://alteredqualia.com/>
///
/// Full-screen textured quad shader
export default {

    uniforms: {
        'tDiffuse': { value: null },
        'opacity':  { value: 1.0 } },

    vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv;
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,

    fragmentShader: `
        uniform float opacity;
        uniform sampler2D tDiffuse;
        varying vec2 vUv;

        void main() { gl_FragColor = opacity*texture2D(tDiffuse,vUv); }`
}
