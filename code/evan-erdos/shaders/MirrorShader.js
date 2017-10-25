/// @author felixturner / http://airtight.cc/
///
/// Mirror Shader
/// Copies half the input to the other half
///
/// side: side of input to mirror (0 = left, 1 = right, 2 = top, 3 = bottom)
export default {

    uniforms: {
        'tDiffuse': { value: null },
        'side':     { value: 1 } },

    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }`,

    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform int side;
        varying vec2 vUv;

        void main() {
            vec2 p = vUv;
            if (side==0 && p.x>0.5) p.x = 1.0-p.x;
            else if (side==1 && p.x<0.5) p.x = 1.0-p.x;
            else if (side==2 && p.y<0.5) p.y = 1.0-p.y;
            else if (side==3 && p.y>0.5) p.y = 1.0-p.y;
            gl_FragColor = texture2D(tDiffuse,p);
        }`
}
