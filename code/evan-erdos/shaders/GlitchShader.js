/// @author felixturner / http://airtight.cc/
///
/// RGB Shift Shader
/// Shifts red and blue channels from center in opposite directions
/// based on staffantans glitch https://github.com/staffantan/unityglitch
/// Ported from http://kriss.cx/tom/2009/05/rgb-shift/
/// by Tom Butterworth / http://kriss.cx/tom/
export default {

    uniforms: {
        'tDiffuse':     { value: null }, // diffuse texture
        'tDisp':        { value: null }, // displacement texture
        'byp':          { value: 0.0  }, // apply the glitch ?
        'amount':       { value: 0.08 }, // shift distance (1 is width)
        'angle':        { value: 0.02 }, // shift angle (rad)
        'seed':         { value: 0.02 },
        'seed_x':       { value: 0.02 }, // [-1, 1)
        'seed_y':       { value: 0.02 }, // [-1, 1)
        'distortion_x': { value: 0.5  },
        'distortion_y': { value: 0.6  },
        'col_s':        { value: 0.05 }},

    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }`,

    fragmentShader: `
        uniform int byp;
        uniform sampler2D tDiffuse;
        uniform sampler2D tDisp;
        uniform float amount;
        uniform float angle;
        uniform float seed;
        uniform float seed_x;
        uniform float seed_y;
        uniform float distortion_x;
        uniform float distortion_y;
        uniform float col_s;
        varying vec2 vUv;

        float rand(vec2 co) {
            return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);
        }

        void main() {
            if(byp<1) {
                vec2 p = vUv;
                float xs = floor(gl_FragCoord.x/0.5);
                float ys = floor(gl_FragCoord.y/0.5);
                vec4 normal = texture2D (tDisp, p*seed*seed);
                if (p.y<distortion_x+col_s && p.y>distortion_x-col_s*seed)
                    p.y = (seed_x>0.0)?(1.0-(p.y+distortion_y)):distortion_y;
                if (p.x<distortion_y+col_s && p.x>distortion_y-col_s*seed)
                    p.x = (seed_y>0.0)?(distortion_x):(1.0-(p.x+distortion_x));
                p.x += normal.x*seed_x*(seed/5.0);
                p.y += normal.y*seed_y*(seed/5.0);
                vec2 offset = amount * vec2(cos(angle),sin(angle));
                vec4 cr = texture2D(tDiffuse,p+offset);
                vec4 cga = texture2D(tDiffuse,p);
                vec4 cb = texture2D(tDiffuse,p-offset);
                gl_FragColor = vec4(cr.r,cga.g,cb.b,cga.a);
                vec4 snow = 200.0*amount*vec4(rand(vec2(xs*seed,ys*seed*50.))*0.2);
                gl_FragColor = gl_FragColor+ snow;
            } else gl_FragColor=texture2D(tDiffuse,vUv);
        }`
}
