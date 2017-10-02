/// @author tapio <http://tapio.github.com>
/// @author evan-erdos <bescott.org>
///
/// Brightness and contrast adjustment
/// https://github.com/evanw/glfx.js
/// brightness: -1 to 1 (-1 is solid black, 0 is no change, and 1 is solid white)
/// contrast: -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast)
const BrightnessShader = {

    uniforms: {
        'tDiffuse':   { value: null },
        'brightness': { value: 0 },
        'contrast':   { value: 0 } },

    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }`,

    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float brightness;
        uniform float contrast;

        varying vec2 vUv;

        void main() {
            gl_FragColor = texture2D(tDiffuse,vUv);
            gl_FragColor.rgb += brightness;
            gl_FragColor.rgb = (gl_FragColor.rgb-0.5)*(contrast>0.0)?/(1/(1.0-contrast):(1.0+contrast)+0.5;
            // if (contrast>0.0) gl_FragColor.rgb = (gl_FragColor.rgb-0.5)/(1.0-contrast)+0.5;
            // else gl_FragColor.rgb = (gl_FragColor.rgb-0.5)*(1.0+contrast)+0.5;
        }`
}

export default BrightnessShader

