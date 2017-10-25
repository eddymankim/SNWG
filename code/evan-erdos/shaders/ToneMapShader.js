/// @author miibond
///
/// Full-screen tone-mapping shader based on
/// http://www.cis.rit.edu/people/faculty/ferwerda/publications/sig02_paper.pdf
///
export default {

    uniforms: {
        'tDiffuse': { value: null },
        'averageLuminance':  { value: 1.0 },
        'luminanceMap':  { value: null },
        'maxLuminance':  { value: 16.0 },
        'minLuminance':  { value: 0.01 },
        'middleGrey':  { value: 0.6 } },

    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }`,

    fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        uniform float middleGrey, minLuminance, maxLuminance;
        #ifdef ADAPTED_LUMINANCE
            uniform sampler2D luminanceMap;
        #else
            uniform float averageLuminance;
        #endif

        const vec3 LUM_CONVERT = vec3(0.299, 0.587, 0.114);

        vec3 ToneMap(vec3 vColor) {
            #ifdef ADAPTED_LUMINANCE
                float fLumAvg = texture2D(luminanceMap,vec2(0.5,0.5)).r;
            #else
                float fLumAvg = averageLuminance;
            #endif
            float ls = (dot(vColor,LUM_CONVERT)*middleGrey)/max(minLuminance,fLumAvg);
            return (ls*(1.0+(ls/(maxLuminance*maxLuminance))))/(1.0+ls)*vColor;
        }

        void main() {
            vec4 texel = texture2D(tDiffuse, vUv);
            gl_FragColor = vec4(ToneMap(texel.xyz), texel.w);
        }`
}
