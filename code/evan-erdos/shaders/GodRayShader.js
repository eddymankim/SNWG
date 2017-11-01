///
/// @author huwb / http://huwbowles.com/
///
/// God-rays (crepuscular rays)
///
/// Similar implementation to the one used by Crytek for CryEngine 2
/// Blurs a mask of depth along radial lines emanating from the light
/// blur repeatedly applies a blur filter of increasing support but
/// constant sample count to produce a blur filter with large support
///
/// performs 3 passes, similar to the implementation from Sousa.
/// I found just 6 samples per pass produced acceptible results.
/// The blur is applied three times, with decreasing filter support.
/// The result is equivalent to a single pass with 6*6*6 = 216 samples.
///
export default {

	///
	/// god-ray generation shader
	///
	/// First pass:
	///
	/// The input is the depth map. I found that the output from the
	/// THREE.MeshDepthMaterial material was directly suitable without
	/// requiring any treatment whatsoever.
	///
	/// The depth map is blurred along radial lines towards the "sun". The
	/// output is written to a temporary render target (I used a 1/4 sized
	/// target).
	///
	/// Pass two & three:
	///
	/// The results of the previous pass are re-blurred, each time with a
	/// decreased distance between samples.
	///
	'godrays_generate': {

		uniforms: {
			tInput: { value: null },
			fStepSize: { value: 1.0 },
			vSunPositionScreenSpace: {
				value: new THREE.Vector2(0.5, 0.5) } },

		vertexShader: `
			varying vec2 vUv;
			void main() {
				vUv = uv;
				gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
			}`,

		fragmentShader: `
			#define TAPS_PER_PASS 6.0
			varying vec2 vUv;
			uniform sampler2D tInput;
			uniform vec2 vSunPositionScreenSpace;
			uniform float fStepSize; // filter step size

			void main() {
				// delta from current pixel to sun position
				vec2 delta = vSunPositionScreenSpace-vUv;
				float dist = length(delta);
				vec2 stepv = fStepSize*delta/dist; // Step vector (uv)
				float iters = dist/fStepSize; // steps from pixel to sun
				vec2 uv = vUv.xy;
				float col = 0.0;

				for (float i=0.0;i<TAPS_PER_PASS;i++) {
					col += (i<=iters&&uv.y<1.0?texture2D(tInput,uv).r:0.0);
					uv += stepv;
				}

				gl_FragColor = vec4(col/TAPS_PER_PASS);
				gl_FragColor.a = 1.0;
			}`,
	},

	'godrays_combine': {

		uniforms: {
			tColors: { value: null },
			tGodRays: { value: null },
			fGodRayIntensity: { value: 0.69 },
			vSunPositionScreenSpace: { value: new THREE.Vector2(0.5,0.5) } },

		vertexShader: `
			varying vec2 vUv;
			void main() {
				vUv = uv;
				gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.0);
			}`,

		fragmentShader: `
			varying vec2 vUv;
			uniform sampler2D tColors;
			uniform sampler2D tGodRays;
			uniform vec2 vSunPositionScreenSpace;
			uniform float fGodRayIntensity;

			void main() {
				gl_FragColor = texture2D(tColors, vUv)
					+ fGodRayIntensity*vec4(1.0-texture2D(tGodRays, vUv).r);
				gl_FragColor.a = 1.0;
			}`
	},

	'godrays_fake_sun': {

		uniforms: {
			vSunPositionScreenSpace: { value: new THREE.Vector2(0.5, 0.5) },
			fAspect: { value: 1.0 },
			sunColor: { value: new THREE.Color(0xffee00) },
			bgColor: { value: new THREE.Color(0x000000) } },

		vertexShader: `
			varying vec2 vUv;
			void main() {
				vUv = uv;
				gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
			}`,

		fragmentShader: `
			varying vec2 vUv;
			uniform vec2 vSunPositionScreenSpace;
			uniform float fAspect;
			uniform vec3 sunColor;
			uniform vec3 bgColor;

			void main() {
				vec2 diff = vUv-vSunPositionScreenSpace;
				diff.x *= fAspect;
				float prop = clamp(length(diff)/0.5, 0.0, 1.0);
				prop = 0.35*pow(1.0-prop, 3.0);
				gl_FragColor.xyz = mix(sunColor, bgColor, 1.0-prop);
				gl_FragColor.w = 1.0;
			}`
	}
}
