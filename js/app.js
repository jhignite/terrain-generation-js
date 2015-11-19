// purpose: to display multiple terrain generation techniques
//
// requires: three.js, RequestAnimationFrame.js, OrbitControls.js,
// 		terrain.js
//
// author: Jesse Hignite
//

var	renderer, scenes, camera, controls, terrain, index;
var	planeGeometry, planeMaterial, planes;
var	sphereGeometry, sphereMaterial, spheres;
var	wireframe = false;

function onLoad()
{
	// Get container
	var container = document.getElementById("container");

	// Create and add renderer
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize(container.offsetWidth, container.offsetHeight);
	container.appendChild(renderer.domElement);

	// index will be the current terrain generator and scene
	index = 0;

	// Initialize scenes
	scenes = [];
	for(var i = 0; i < 4; i++)
		scenes[i] = new THREE.Scene();
	
	// Create camera and add it to the first scene initially
	camera = new THREE.PerspectiveCamera(45, container.offsetWidth/container.offsetHeight, .001, 4000);
	camera.position.set(0, 50, 0);
	scenes[0].add(camera);

	// OrbitControls
	controls = new THREE.OrbitControls(camera);

	initTerrain();
};

function initTerrain();
{
	terrain = [];
	terrain[0] = new TERRAIN.Generator("plane-fault", plane);
	terrain[1] = new TERRAIN.Generator("plane-circle", plane);
	terrain[2] = new TERRAIN.Generator("plane-diamond-square", plane);
	terrain[3] = new TERRAIN.Generator("sphere-fault", sphere);
};

function run()
{
	currentScene = scene[0];

	renderer.render(currentScene, camera);

	requestAnimationFrame(run);
};
