/// @author felixturner / http://airtight.cc/
///
/// Kaleidoscope Shader
/// Radial reflection around center point
/// Ported from: http://pixelshaders.com/editor/
/// by Toby Schachman / http://tobyschachman.com/
///
/// sides: number of reflections
/// angle: initial angle in radians
///
export default {

    uniforms: {
        'tDiffuse': { value: null },
        'sides':    { value: 6.0 },
        'angle':    { value: 0.0 } },

    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        },

    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float sides, angle;
        varying vec2 vUv;

        void main() {
            vec2 p = vUv-0.5;
            float r = length(p), tau = 2.0*3.1416;
            float a = abs(mod(atan(p.y,p.x)+angle,tau/sides)-tau/sides/2.0);
            p = r*vec2(cos(a),sin(a));
            vec4 color = texture2D(tDiffuse,p+0.5);
            gl_FragColor = color;
        }`
}
