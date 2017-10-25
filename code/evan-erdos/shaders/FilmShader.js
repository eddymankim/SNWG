/// @author alteredq / http://alteredqualia.com/
///
/// Film grain & scanlines shader
///
/// - ported from HLSL to WebGL / GLSL
/// http://www.truevision3d.com/forums/showcase/staticnoise_colorblackwhite_scanline_shaders-t18698.0.html
///
/// Screen Space Static Postprocessor
///
/// Produces an analogue noise overlay similar to a film grain / TV static
///
/// Original implementation and noise algorithm
/// Pat 'Hawthorne' Shearon
///
/// Optimized scanlines + noise version with intensity scaling
/// Georg 'Leviathan' Steinrohder
///
/// This version is provided under a Creative Commons Attribution 3.0 License
/// http://creativecommons.org/licenses/by/3.0/
export default {

    uniforms: {
        'tDiffuse':   { value: null },
        'time':       { value: 0.0 },
        'nIntensity': { value: 0.5 },
        'sIntensity': { value: 0.05 },
        'sCount':     { value: 4096 },
        'grayscale':  { value: 1 } },

    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }`,


    fragmentShader: `
        #include <common>

        uniform float time; // control parameter
        uniform bool grayscale;
        uniform float nIntensity; // (0 = no noise, 1 = full intensity)
        uniform float sIntensity; // (0 = no scanlines, 1 = full intensity)
        uniform float sCount; // (0 = no scanlines, 4096 = many scanlines)
        uniform sampler2D tDiffuse;
        varying vec2 vUv;

        void main() {
            vec4 tex = texture2D(tDiffuse, vUv); // sample the source
            vec3 cr = tex.rgb+tex.rgb*clamp(0.1+rand(vUv+time),0.0,1.0); // add noise
            vec2 sc = vec2(sin(vUv.y*sCount), cos(vUv.y*sCount)); // get cos, sin
            cr += tex.rgb*vec3(sc.x,sc.y,sc.x)*sIntensity; // add scanlines
            cr = tex.rgb+clamp(nIntensity,0.0,1.0)*(cr-tex.rgb); // interpolate by power
            if (grayscale) cr = vec3(cr.r*0.3+cr.g*0.59+cr.b*0.11);
            gl_FragColor =  vec4(cr, tex.a);
        }`
}
