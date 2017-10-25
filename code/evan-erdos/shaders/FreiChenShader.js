/// @author zz85 <https://github.com/zz85>
///
/// Edge Detection Shader using Frei-Chen filter
/// Based on http://rastergrid.com/blog/2011/01/frei-chen-edge-detector
export default {

    uniforms: {
        'tDiffuse': { value: null },
        'aspect': { value: new THREE.Vector2(512,512) } }, // (1/width, 1/height)

    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }`,

    fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        uniform vec2 aspect;
        vec2 texel = vec2(1.0/aspect.x, 1.0/aspect.y);
        mat3 G[9];
        // hard coded matrix values
        // github.com/neilmendoza/ofxPostProcessing/blob/master/src/EdgePass.cpp
        const float m0 = 0.3535533845424652, m1=0.1666666716337204;
        const float m2 = 0.3333333432674408, m3 = 0.6666666865348816;
        const mat3 g0 = mat3(m0,0,-m0,0.5,0,-0.5,m0,0,-m0);
        const mat3 g1 = mat3(m0,0.5,m0,0,0,0,-m0,-0.5,-m0);
        const mat3 g2 = mat3(0,m0,-0.5,-m0,0,m0,0.5,-m0,0);
        const mat3 g3 = mat3(0.5,-m0,0,-m0,0,m0,0,m0,-0.5);
        const mat3 g4 = mat3(0,-0.5,0,0.5,0,0.5,0,-0.5,0);
        const mat3 g5 = mat3(-0.5,0,0.5,0,0,0,0.5,0,-0.5);
        const mat3 g6 = mat3(m1,-m2,m1,-m2,m3,-m2,m1,-m2,m1);
        const mat3 g7 = mat3(-m2,m1,-m2,m1,m3,m1,-m2,m1,-m2);
        const mat3 g8 = mat3(m2,m2,m2,m2,m2,m2,m2,m2,m2);

        float sq(float x) { return x*x; }

        void main(void) {
            G[0] = g0, G[1] = g1, G[2] = g2,
            G[3] = g3, G[4] = g4, G[5] = g5,
            G[6] = g6, G[7] = g7, G[8] = g8;

            mat3 I;
            float cnv[9];

            // get 3x3 neighborhood and use RGB vector length as intensity
            for (float i=0.0;i<3.0;i++) for (float j=0.0;j<3.0;j++)
                I[int(i)][int(j)] = length(texture2D(tDiffuse,vUv+texel*vec2(i-1.0,j-1.0)).rgb);
            // calculate the convolution values for all the masks
            for (int i=0;i<9;i++)
                cnv[i] = sq(dot(G[i][0],I[0])+dot(G[i][1],I[1])+dot(G[i][2],I[2]));
            float M = (cnv[0]+cnv[1])+(cnv[2]+cnv[3]);
            float S = (cnv[4]+cnv[5])+(cnv[6]+cnv[7])+(cnv[8]+M);
            gl_FragColor = vec4(vec3(sqrt(M/S)),1.0);
        }`
}
