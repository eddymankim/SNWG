function setThingsUp(fog, gui, orbit, plane, divID){
  var scene = new THREE.Scene();
  var gui;
  if(gui == "yes"){
    gui = new dat.GUI();
  }
var enableFog
  if(fog ==yes){
    fog = true;
  }


	if (enableFog) {
		scene.fog = new THREE.FogExp2(0xffffff, 0.2);
	}

	var plane = getPlane(30);
	var directionalLight = getDirectionalLight(1);
	var sphere = getSphere(0.05);
	var boxGrid = getBoxGrid(10, 1.5);
	var helper = new THREE.CameraHelper(directionalLight.shadow.camera);
	var ambientLight = getAmbientLight(10);

	plane.name = 'plane-1';

	plane.rotation.x = Math.PI/2;
	directionalLight.position.x = 13;
	directionalLight.position.y = 10;
	directionalLight.position.z = 10;
	directionalLight.intensity = 2;

	scene.add(plane);
	directionalLight.add(sphere);
	scene.add(directionalLight);
	scene.add(boxGrid);
	scene.add(helper);
	scene.add(ambientLight);

	gui.add(directionalLight, 'intensity', 0, 10);
	gui.add(directionalLight.position, 'x', 0, 20);
	gui.add(directionalLight.position, 'y', 0, 20);
	gui.add(directionalLight.position, 'z', 0, 20);

	var camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth/window.innerHeight,
		1,
		1000
	);

	camera.position.x = 1;
	camera.position.y = 2;
	camera.position.z = 5;

	camera.lookAt(new THREE.Vector3(0, 0, 0));

	var renderer = new THREE.WebGLRenderer();
	renderer.shadowMap.enabled = true;
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor('rgb(120, 120, 120)');
	document.getElementById('3dDiv').appendChild(renderer.domElement);

	var controls = new THREE.OrbitControls(camera, renderer.domElement);

	update(renderer, scene, camera, controls);

	return scene;





}
