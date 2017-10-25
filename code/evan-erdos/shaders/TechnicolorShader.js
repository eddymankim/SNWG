/// @author flimshaw / http://charliehoey.com
///
/// Technicolor Shader
/// Simulates the look of the two-strip technicolor process popular in early 20th century films.
/// More historical info here: http://www.widescreenmuseum.com/oldcolor/technicolor1.htm
/// Demo here: http://charliehoey.com/technicolor_shader/shader_test.html
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
        uniform sampler2D tDiffuse;
        varying vec2 vUv;

        void main() {
            vec4 tex = texture2D(tDiffuse,vec2(vUv.x,vUv.y));
            gl_FragColor = vec4(tex.r,(tex.g+tex.b)*0.5,(tex.g+tex.b)*0.5,1.0);
        }`
}
