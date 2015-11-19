// purpose: to display multiple terrain generation techniques
//
// requires: three.js, RequestAnimationFrame.js, OrbitControls.js,
// 		terrain.js
//
// author: Jesse Hignite
//

var	renderer, scenes, camera, controls;
var	planeGeometry, planeMaterial, plane;
var	sphereGeometry, sphereMaterial, sphere;
var	wireframe = false;

function onLoad()
{
	// Get container
	var container = document.getElementById("container");

	// Create and add renderer
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize(container.offsetWidth, container.offsetHeight);
	container.appendChild(renderer.domElement);

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


};

function run()
{
	currentScene = scene[0];

	renderer.render(currentScene, camera);

	requestAnimationFrame(run);
};
