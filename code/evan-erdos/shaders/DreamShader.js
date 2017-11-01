///
/// 2017-10-31 Ben Scott <bescott@andrew.cmu.edu>
///
/// dream shader
///
import * as M from '../module.js'

export default {

    uniforms: {
        gray:   { value: false },
        time:   { value: 0.01 },
        noir:   { value: 1.01 },
        hue:    { value: 0.01 },
        noise:  { value: 0.51 },
        scan:   { value: 0.05 },
        lines:  { value: 4096 },
        fill:   { value: 0.11 },
        creep:  { value: 1.00 },
        darken: { value: 1.00 },
        color:  { value: new M.Color(0XFFFFFF) },
        filter: { value: new M.Color(0XFFFFFF) },
        accent: { value: new M.Color(0XFFFFFF) },
        mulHue: { value: new M.Vector3(0.9,0.9,0.9) },
        powRGB: { value: new M.Vector3(1.5,1.5,1.5) },
        mulRGB: { value: new M.Vector3(1.1,1.1,1.1) },
        addRGB: { value: new M.Vector3(0.0,0.0,0.0) },
        tex:    { value: null } },

    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }`,


    fragmentShader: `
        #include <common>
        varying vec2 vUv;
        uniform bool gray;
        uniform float time, scan, lines, noise, noir;
        uniform float hue, fill, creep, darken;
        uniform vec3 color, filter, accent, mulHue;
        uniform vec3 powRGB, mulRGB, addRGB;
        uniform sampler2D tex;

        vec4 ColorizeView(vec4 o, vec3 color, vec3 filter, float i) {
            return vec4(dot(o.xyz,filter*i)*color+o.xyz*i,o.a); }


        vec4 AdjustColors(vec4 o, vec3 cpow, vec3 cmul, vec3 cadd) {
            return vec4(cmul*pow(o.rgb+cadd,cpow),o.a); }


        vec4 UseFilmGrain(vec4 o, float l, float s, float p, bool b) {
            vec3 cr = o.rgb+o.rgb*clamp(0.1+rand(vUv+time),0.0,1.0);
            vec2 sc = vec2(sin(vUv.y*l), cos(vUv.y*l));
            cr += o.rgb*vec3(sc.x,sc.y,sc.x)*s;
            if (b) cr = vec3(cr.r*0.3+cr.g*0.59+cr.b*0.11);
            return vec4(o.rgb+clamp(p,0.0,1.0)*(cr-o.rgb), o.a); }


        vec4 SaturateHues(vec4 o, vec3 h, float hue, float value) {
            float angle = hue*3.14159265, c = value;
            float t = sqrt(3.0), ts = sin(angle), tc = cos(angle);
            vec3 w = (vec3(2.0*tc,-t*ts-tc,t*ts-tc)+1.0)/3.0;
            o.rgb = vec3(dot(o.rgb,w.xyz),dot(o.rgb,w.zxy),dot(o.rgb,w.yzx));
            vec3 sat = ((o.r+o.g+o.b)/3.0-o.rgb)*((c<=0.0)?-c:1.0-1.0/(1.001-c));
            return vec4(o.rgb+dot(o.rgb,h)*sat, o.a); }


        vec4 MakeVignette(vec4 o, float c, float d) {
            vec2 v = (vUv-vec2(0.5))*vec2(c);
            return vec4(mix(o.rgb,vec3(1.0-d),dot(v,v)),o.a);
            // return vec4(o.rgb*smoothstep(0.8,c*0.799,distance(vUv,vec2(0.5))*(d+c)), o.a);
        }


        void main() {
            gl_FragColor = texture2D(tex, vUv); // filter = vec3(0.299, 0.587, 0.114)
            gl_FragColor = ColorizeView(gl_FragColor, color, filter, fill);
            gl_FragColor = AdjustColors(gl_FragColor, powRGB, mulRGB, addRGB);
            gl_FragColor = SaturateHues(gl_FragColor, mulHue, hue+0.05, 0.97-noir);
            gl_FragColor = UseFilmGrain(gl_FragColor, lines, scan, noise, gray);
            gl_FragColor = MakeVignette(gl_FragColor, creep, darken);
        }`
}
