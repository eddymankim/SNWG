///
/// 2017-10-31 Ben Scott <bescott@andrew.cmu.edu>
///
/// dream shader
///
import * as M from '../module.js'

export default {

    uniforms: {
        'time':     { value: 0.0 },
        'noir':     { value: 1.0 },
        'hue':      { value: 0.0 },
        'noise':    { value: 0.5 },
        'scan':     { value: 0.05 },
        'lines':    { value: 4096 },
        'color':    { value: new M.Color(0xffffff) },
        'powRGB':   { value: new M.Vector3(1.5,1.5,1.5) },
        'mulRGB':   { value: new M.Vector3(1.1,1.1,1.1) },
        'addRGB':   { value: new M.Vector3(0.0,0.0,0.0) },
        'tDiffuse': { value: null }, },

    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }`,


    fragmentShader: `
        #include <common>
        varying vec2 vUv;
        uniform float time;
        uniform float noir;
        uniform float hue;
        uniform float noise;
        uniform float scan;
        uniform float lines;
        uniform vec3 color;
        uniform vec3 powRGB;
        uniform vec3 mulRGB;
        uniform vec3 addRGB;
        uniform sampler2D tDiffuse;


        vec4 AdjustColors(vec4 o) { return vec4(mulRGB*pow(o.rgb+addRGB,powRGB),o.a); }
        vec4 ColorizeView(vec4 o) { return vec4(dot(o.xyz,vec3(0.299,0.587,0.114))*color,o.a); }
        vec4 GammaCorrect(vec4 o) { return LinearToGamma(o, float(GAMMA_FACTOR)); }
        vec4 UseFilmGrain(vec4 o) {
            vec3 cr = o.rgb+o.rgb*clamp(0.1+rand(vUv+time),0.0,1.0);
            vec2 sc = vec2(sin(vUv.y*lines), cos(vUv.y*lines));
            cr += o.rgb*vec3(sc.x,sc.y,sc.x)*scan;
            // if (noir>=0.0) cr = vec3(cr.r*0.3+cr.g*0.59+cr.b*0.11);
            return vec4(o.rgb+clamp(noise,0.0,1.0)*(cr-o.rgb), o.a);
        }

        vec4 SaturateHues(vec4 o) {
            float angle = hue*3.14159265, c = 1.0-noir;
            float t = sqrt(3.0), ts = sin(angle), tc = cos(angle);
            vec3 w = (vec3(2.0*tc,-t*ts-tc,t*ts-tc)+1.0)/3.0;
            o.rgb = vec3(dot(o.rgb,w.xyz),dot(o.rgb,w.zxy),dot(o.rgb,w.yzx));
            float saturation = ((c<=0.0)?(-c):(1.0-1.0/(1.001-c)));
            return vec4(o.rgb+((o.r+o.g+o.b)/3.0-o.rgb)*saturation, o.a);
        }

        void main() {
            gl_FragColor = texture2D(tDiffuse, vUv);
            // gl_FragColor = ColorizeView(gl_FragColor);
            // gl_FragColor = AdjustColors(gl_FragColor);
            gl_FragColor = SaturateHues(gl_FragColor);
            // gl_FragColor = GammaCorrect(gl_FragColor);
            gl_FragColor = UseFilmGrain(gl_FragColor);
        }`

            // gl_FragColor = texture2D(tDiffuse, vUv);
            // // gl_FragColor = ColorizeView(gl_FragColor);
            // gl_FragColor = UseFilmGrain(gl_FragColor);
            // // gl_FragColor = AdjustColors(gl_FragColor);
            // // gl_FragColor = GammaCorrect(gl_FragColor);
            // gl_FragColor = SaturateHues(gl_FragColor);
}
