import * as THREE from 'three';
import OutlineEffect from './OutlineEffect.js'
import { PointerLockControls } from './PointerLockControls.js'
/* aman's dumb toon renderer
 * adapted from evan-erdos' boilerplate
 */

const curvatureVertShader = `precision mediump float;
 uniform float curvature;
 
 float PI = 3.14159265358979323846264;

 void main() {
     // world pos
   vec3 w_pos = position;
   float y = w_pos.y;
   float z = w_pos.z;
   float om = curvature*sin(((w_pos.z) / 256.0));
   w_pos.y = z*sin(om)+y*cos(om);
   w_pos.z = z*cos(om)+y*sin(om);
     // model view pos
   vec4 mv_pos = modelViewMatrix * vec4(w_pos, 1.0);
   fPosition = mv_pos.xyz;
   gl_Position = projectionMatrix * mv_pos;
 }`

export default class TechnicalRender {

  private scene;
  public camera: THREE.Camera;
  constructor({
    path = '../../data/',
    width = window.innerWidth,
    height = window.innerHeight,
    background = 0xffffff,
    worldCurvature = -0.3,
    ambient = 0x333333,
    light = 0xff0000,
    ground = 0x000000,
    webgl = { antialias: true, shadowMapEnabled: true },
    position = { x: 0, y: 0, z: 0 },
    fog = { color: 0x0000FF, near: 1, far: 1e3 },
    cam = { near: 0.1, far: 2e4 },
    elt = "body",
    update = (t) => { }
      } = {}) {

    //cam = { fov: 120, aspect: width / height, near: 0.1, far: 2e4, ...cam }

    let clock = new THREE.Clock()

    let renderer = new THREE.WebGLRenderer(webgl);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(ambient, 0);
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;

    let scene = new THREE.Scene();
    this.scene = scene;

    scene.fog = new THREE.Fog(fog.color, fog.near, fog.far);
    scene.background = new THREE.Color(background);

    scene.add(new THREE.AmbientLight(ambient)); //@ts-ignore

    //let camera = new THREE.PerspectiveCamera(cam.fov, cam.aspect, cam.near, cam.far);
    let camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, cam.near, cam.far);
    camera.position.set(position.x, position.y, position.z);

    scene.add(camera);

    let controls = new THREE.OrbitControls(camera, renderer.domElement);
    //let controls = new PointerLockControls(camera);
    controls.enabled = true;
    let sun = new THREE.HemisphereLight(ambient, ground, 1.0);
    sun.position.set(1, 2, 0);
    scene.add(sun);

    let effect: any = new OutlineEffect(renderer, {
      defaultThickNess: 0.01,
      defaultColor: new THREE.Color(0x888888),
      defaultAlpha: 0.8,
      defaultKeepAlive: true // keeps outline material in cache even if material is removed from scene
    });

    const render = () => {
      requestAnimationFrame(render.bind(this));
      controls.update();
      update(clock.getDelta());
      //renderer.render(scene, camera);
      effect.render(scene, camera);
    }

    const resize = () => {
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', resize, false);

    window.addEventListener('load', () => render(), false);

    document.querySelector(elt).appendChild(renderer.domElement);
    this.camera = camera;
  }

  public add(...args) {
    for (let arg of args) this.scene.add(arg);
  }
}
