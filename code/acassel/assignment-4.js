
import * as THREE from '../lib/module.js'

var Colors = {
	red: 0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
};

window.addEventListener('load', init, false);

const clock = new THREE.Clock() 
let mesh = null

function init() {
	//set up scene w/ camera and renderer
	createScene();

	//add lights
	createLights();

	//start loop, updates objects position and //renders scene on each frame
	render();
}

let t = 1

function render(deltaTime=0.1) {
	t += deltaTime
	mesh.position.set(0, 0, Math.sin(t*5)*60)
    renderer.render(scene, camera)
    requestAnimationFrame(() => render(clock.getDelta()))
}

var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container;

function createScene() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;

	scene = new THREE.Scene ();
	scene.fog = new THREE.Fog(0xf7d9aa, 1, 150);

	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera (
		fieldOfView, aspectRatio, nearPlane, farPlane );

	camera.position.x = 0;
	camera.position.z = 100;
	camera.position.y = 0;

	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true
	});

	renderer.setClearColor(0xF5986E, 1)

	renderer.setSize(WIDTH, HEIGHT);

	renderer.shadowMap.enabled = true;

	container = document.getElementById('RenderCanvas');
	container.appendChild(renderer.domElement);

	window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {

	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

var hemisphereLight, shadowLight;

function createLights() {

	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)

	shadowLight = new THREE.DirectionalLight(0xffffff, .9);

	shadowLight.position.set(150, 350, 350);

	shadowLight.castShadow = true;

	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	scene.add(hemisphereLight);
	scene.add(shadowLight);


	const geometry = new THREE.SphereGeometry(20, 40, 40)

	const material = new THREE.MeshPhongMaterial({
			color: 0x68c3c0,
			map: null,
})

	mesh = new THREE.Mesh(geometry, material) 



	scene.add(mesh);
}








