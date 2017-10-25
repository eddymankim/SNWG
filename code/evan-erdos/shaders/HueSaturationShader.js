/// @author tapio / http://tapio.github.com/
///
/// Hue and saturation adjustment
/// https://github.com/evanw/glfx.js
/// hue: -1 to 1 (-1 is 180 degrees in the negative direction, 0 is no change, etc.
/// saturation: -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast)
///
export default {

    uniforms: {
        'tDiffuse':   { value: null },
        'hue':        { value: 0 },
        'saturation': { value: 0 } },

    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }`,

    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float hue;
        uniform float saturation;
        varying vec2 vUv;

        void main() {
            gl_FragColor = texture2D(tDiffuse,vUv);
            float angle = hue*3.14159265; // hue
            float s = sin(angle), c = cos(angle);
            vec3 w = (vec3(2.0*c,-sqrt(3.0)*s-c, sqrt(3.0)*s-c)+1.0)/3.0;
            float len = length(gl_FragColor.rgb);
            gl_FragColor.rgb = vec3(
                dot(gl_FragColor.rgb,w.xyz),
                dot(gl_FragColor.rgb,w.zxy),
                dot(gl_FragColor.rgb,w.yzx));
            float avg = (gl_FragColor.r+gl_FragColor.g+gl_FragColor.b)/3.0; // saturation
            if (saturation<=0.0) gl_FragColor.rgb += (avg-gl_FragColor.rgb)*(-saturation);
            else gl_FragColor.rgb += (avg-gl_FragColor.rgb)*(1.0-1.0/(1.001-saturation));
        }`
}
