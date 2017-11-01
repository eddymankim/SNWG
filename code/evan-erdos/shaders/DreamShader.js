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
        bleach: { value: 0.50 },
        techni: { value: 0.10 },
        sepia:  { value: 0.01 },
        color0: { value: new M.Color(0XFFFFFF) },
        color1: { value: new M.Color(0XFFFFFF) },
        color2: { value: new M.Color(0XFFFFFF) },
        color3: { value: new M.Color(0XFFFFFF) },
        mulHue: { value: new M.Vector3(0.9,0.9,0.9) },
        powRGB: { value: new M.Vector3(1.5,1.5,1.5) },
        mulRGB: { value: new M.Vector3(1.1,1.1,1.1) },
        addRGB: { value: new M.Vector3(0.0,0.0,0.0) },
        tDiffuse: { value: null } },

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
        uniform float time, scan, lines, noise, noir, opacity;
        uniform float creep, darken, hue, fill, bleach, techni, sepia;
        uniform vec3 color0, color1, color2, color3;
        uniform vec3 lumin, mulHue, powRGB, mulRGB, addRGB;
        uniform sampler2D tDiffuse;


        vec4 ColorizeView(vec4 o, vec3 c, vec3 f, float i) {
            return vec4(dot(o.xyz,f*i)*c+o.xyz*i,o.a); }


        vec4 AdjustColors(vec4 o, vec3 cpow, vec3 cmul, vec3 cadd) {
            return vec4(cmul*pow(o.rgb+cadd,cpow),o.a); }


        vec4 Technicolors(vec4 o, float i) {
            return mix(o.rgba,vec4(o.r,(o.g+o.b)*0.5,(o.g+o.b)*0.5,1.0), i); }


        vec4 DustbowlChic(vec4 o, float i) {
            return vec4(min(vec3(1.0), vec3(
                dot(o.rgb,vec3(1.0-0.607*i,0.769*i,0.189*i)),
                dot(o.rgb,vec3(0.349*i,1.0-0.314*i,0.168*i)),
                dot(o.rgb,vec3(0.272*i,0.534*i,1.0-0.869*i)))), o.a); }


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


        vec4 BleachBypass(vec4 o, vec3 lux, float opacity) {
            float l = dot(lux,o.rgb), a = opacity*o.a, p = min(1.0,max(0.0,10.0*(l-0.45)));
            vec3 bl = vec3(l), c = mix(2.0*o.rgb*bl,1.0-2.0*(1.0-bl)*(1.0-o.rgb),p);
            return vec4(a*c.rgb+((1.0-a)*o.rgb),o.a); }


        vec4 MakeVignette(vec4 o, vec3 tone, float c, float d, float i) {
            vec2 v = (vUv-vec2(0.5))*vec2(c);
            return vec4(mix(o.rgb,vec3(1.0-d),dot(v,v)),o.a); }


        void main() { // lumin = vec3(0.25,0.65,0.1), filter = vec3(0.299, 0.587, 0.114)
            gl_FragColor = texture2D(tDiffuse, vUv);
            gl_FragColor = ColorizeView(gl_FragColor, color0, color1, fill);
            gl_FragColor = AdjustColors(gl_FragColor, powRGB, mulRGB, addRGB);
            gl_FragColor = SaturateHues(gl_FragColor, mulHue, hue, 0.97-noir);
            gl_FragColor = BleachBypass(gl_FragColor, color2, bleach);
            gl_FragColor = UseFilmGrain(gl_FragColor, lines, scan, noise, gray);
            gl_FragColor = Technicolors(gl_FragColor, techni);
            gl_FragColor = DustbowlChic(gl_FragColor, sepia);
            gl_FragColor = MakeVignette(gl_FragColor, color3, creep, darken, 0.5);
        }`
}
