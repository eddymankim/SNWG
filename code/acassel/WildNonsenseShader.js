
export default {

var shader = {
    uniforms: { 
      time: {value:0},
      speed: {value:4},
      tDiffuse: {value:null} },

    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      uniform float time, speed;

      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          float theta = sin(time*speed+position.y)/50.0;
          float c = cos(theta);
          float s = sin(theta);
          mat3 m = mat3(c, 0, s, 0, 1, 0, -s, 0, c);
          vec3 transformed = vec3(position)*m;
          mat4 modelView = viewMatrix * modelMatrix;
          mat4 modelViewProjection = projectionMatrix * modelView;
          vNormal = (modelView * vec4(normal.xyz, 0.0)).xyz*m;
          // vec3 vNormal = (modelViewMatrix * vec4(normal.xyz, 0.0)).xyz*m;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
          // gl_Position.xyz = vNormal*m; // HERE BE DRAGONS
          gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      }`,

    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      uniform sampler2D tDiffuse;
      uniform float time, speed;

      vec3 rgb2hsv(vec3 c) {
          vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
          vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
          vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
          float d = q.x - min(q.w, q.y);
          float e = 1.0e-10;
          return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
      }

      vec3 hsv2rgb(vec3 c) {
          vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }


      vec3 packNormalToRGB(const in vec3 normal) {
        return normalize(normal) * 0.5 + 0.5; }

      void main() {
        float opacity = 0.2;
        float saturation = 0.05, hue = 20.6, brightness =0.9;
        float yellowAmount = 0.9;
        vec3 tint = vec3(0.9, 0.5, 0.9);
        vec3 light = vec3(0.5, 0.2, 1.0);
        light = normalize(light);
        float dProd = max(0.0, dot(vNormal, light));
        gl_FragColor = texture2D(tDiffuse,vUv);
        //gl_FragColor = vec4(vNormal,0.25);
        vec3 color = rgb2hsv(packNormalToRGB(vNormal));
        // color.r += cos(time*speed*0.1);
        color = vec3(
          mix(color.r,1.0,hue), 
          mix(color.g,1.0,saturation), 
          mix(color.b,1.0,brightness));
        color = hsv2rgb(color);
        float avg = mix(color.r, color.g, 0.5);
        float distillR = mix(avg, color.r, yellowAmount);
        float distillG = mix(avg, color.g, yellowAmount);
        float tintAmount = 0.8;
        color.rgb = vec3(distillR, distillG, color.b);
        // color.rgb *= dProd;
        gl_FragColor = vec4(mix(color, tint, tintAmount), opacity);
        // gl_FragColor = vec4(dProd*0.5, dProd, dProd*0.2, 1.0);
      }`
    }
}