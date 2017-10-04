import * as THREE from '../lib/module.js';
import GUI from './dat.gui.module.js';

window.THREE = THREE;

console.log(THREE, GUI);

const background = 0xFF0000;

const clock = new THREE.Clock();

function windowinfo() {
  return { wh: [700, 700], ratio: 700 / 700 }
}

const camera = new THREE.PerspectiveCamera(120, windowinfo().ratio, 1, 2e5);
camera.position.z = 500;

const light = new THREE.DirectionalLight(0xFFFAD3, 1);
light.position.set(100, 200, 100);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(background, 1);
renderer.setSize(...windowinfo().wh);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


let scene = new THREE.Scene();
scene.fog = new THREE.Fog(background, 2 * 16, 2e5);
scene.add(camera, light, new THREE.AmbientLight(0x14031B));


let controls = new THREE.OrbitControls(camera, renderer.domElement);

document.querySelector('#RenderCanvas').appendChild(renderer.domElement)

window.onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
};

const geometry = new THREE.SphereGeometry(5, 4, 4);
const material = new THREE.MeshPhongMaterial({ color: 0xAAAAAA, shininess: 20 });

const params = {
  cohere: { distance: 100, k: -0.009 },
  repel: { distance: 50, k: -0.08 },
  align: { distance: 150, k: 0.003 },
  minDist: 100,
  dampening: 0.95,
  n_particles: 500
}

class Boid {
  constructor(mesh) {
    this.pos = new THREE.Vector3(0.0, 0.0, 0.0);
    this.pos.copy(mesh.position);
    this.vel = new THREE.Vector3(0.0, 0.0, 0.0);
    this.mesh = mesh;
  }
  update(others) {
    for (let other of others) {
      if (this != other) {
        let xd = other.pos.clone().sub(this.pos);
        let d = xd.length();
        if (d < params.minDist) {
          let nxd = xd.negate();
          let xc = xd.multiplyScalar(params.cohere.k);
          let xr = d < params.repel.distance ?
            nxd.multiplyScalar(params.repel.k) :
            new THREE.Vector3;
          let xa =
            other.vel.clone().sub(this.vel).multiplyScalar(params.align.k);
          this.vel = this.vel.add(xc).add(xr).add(xa);
        }
      }
    }
    this.pos = this.pos.add(this.vel);
    this.vel = this.vel.multiplyScalar(params.dampening);
    this.mesh.position.copy(this.pos);
    this.mesh.scale.set(Math.min(5.0 / Math.abs(this.vel.x), 20.0),
      Math.min(5.0 / Math.abs(this.vel.x), 20.0),
      Math.min(5.0 / Math.abs(this.vel.x), 20.0));

    if (this.pos.length() > 1000) {
      this.pos = this.pos.negate();
    }
  }
}

const particles = [];

for (let i = 0; i < params.n_particles; i++) {
  let edges = new THREE.EdgesGeometry(geometry);
  let mesh = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));


  //const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(new THREE.Vector3(
    Math.random() * 500 - 250, Math.random() * 500 - 250,
    Math.random() * 500 - 250));
  particles.push(new Boid(mesh));
  scene.add(mesh);
}

function render(deltaTime = 0.01) {
  for (const boid of particles) {
    boid.update(particles);
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(() => render(clock.getDelta()));
}

render();
console.log(GUI);
const gui = new GUI.GUI();
const cohere_gui = gui.addFolder('Cohere');
cohere_gui.add(params.cohere, 'k');
cohere_gui.add(params.cohere, 'distance');
const repel_gui = gui.addFolder('Repel');
repel_gui.add(params.cohere, 'k');
repel_gui.add(params.cohere, 'distance');
const align_gui = gui.addFolder('Align');
align_gui.add(params.cohere, 'k');
align_gui.add(params.cohere, 'distance');

gui.add(params, 'minDist');
gui.add(params, 'dampening');