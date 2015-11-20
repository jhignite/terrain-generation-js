// purpose: to display multiple terrain generation techniques
//
// requires: three.js, RequestAnimationFrame.js, OrbitControls.js,
// 		terrain.js
//
// author: Jesse Hignite
//

var	renderer, scene, camera, controls, terrain, index;
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

	// Initialize scene
	scene = new THREE.Scene();
	
	// Create camera and add it to the first scene initially
	camera = new THREE.PerspectiveCamera(45, container.offsetWidth/container.offsetHeight, .001, 4000);
	camera.position.set(0, 100, 0);
	scene.add(camera);

	// OrbitControls
	controls = new THREE.OrbitControls(camera);

	initTerrain();
	terrain[0].update();
	for(var i = 0; i < 1000; i++)
		terrain[0].iterate();
	terrain[0].shape.mesh.position.z = 0;

	for(var propertyName in terrain[0].shape.geometry.faces[0])
		console.log(propertyName);
	console.log(terrain[0].shape.mesh.position);
	console.log(camera.position);
	for(var i = 0; i < terrain[0].lines.length; i++)
		scene.add(terrain[0].lines[i].line);
	run();
};

function initTerrain()
{
	terrain = [];
	planes = [];
	for(var i = 0; i < 3; i++)
		planes.push(new TERRAIN.Plane(128, 128));
	terrain[0] = new TERRAIN.Generator("plane-fault", planes[0]);
	scene.add(terrain[0].shape.mesh);
	terrain[1] = new TERRAIN.Generator("plane-circle", planes[1]);
	terrain[2] = new TERRAIN.Generator("plane-diamond-square", planes[2]);
	//terrain[3] = new TERRAIN.Generator("sphere-fault", sphere);
};

function run()
{
	renderer.render(scene, camera);

	terrain[0].update();

	requestAnimationFrame(run);
};
