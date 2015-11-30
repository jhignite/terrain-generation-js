// purpose: to display multiple terrain generation techniques
//
// requires: three.js, RequestAnimationFrame.js, OrbitControls.js,
// 		terrain.js
//
// author: Jesse Hignite
//

var	renderer, scene, camera, controls, light, terrain, index, gui;
var	planeGeometry, planeMaterial, planes;
var	sphereGeometry, sphereMaterial, sphere;

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

	//Let there be light
	light = new THREE.DirectionalLight(0xffffff, 0.75);
	light.position.set(0, 1000, 0);
	scene.add(light);

	initTerrain();
	initGUI();
	terrain[0].update();
	/*
	for(var i = 0; i < 1000; i++)
		terrain[0].iterate();
	terrain[0].shape.mesh.position.z = 0;

	for(var propertyName in terrain[0].shape.geometry.faces[0])
		console.log(propertyName);
	console.log(terrain[0].shape.mesh.position);
	console.log(camera.position);
	for(var i = 0; i < terrain[0].lines.length; i++)
		scene.add(terrain[0].lines[i].line);
	*/
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
	sphere = new TERRAIN.Sphere(64);
	scene.add(sphere.mesh);
	sphere.mesh.visible = false;
	terrain[3] = new TERRAIN.Generator("sphere", sphere);
};

function initGUI()
{
	gui = new TerrainGUI();
};

function run()
{
	renderer.render(scene, camera);

	terrain[0].update();
	terrain[3].update();
	requestAnimationFrame(run);
};

TerrainGUI = function()
{
	this.gui = new dat.GUI();
	/*
	this.current = 'plane-fault';
	this.controller = 
	{
		swapGenerator: function()
		{
			this.gui.folders[this.current].close();
			if(this.current = 'plane-fault')
			{
				this.current = 'sphere';
				planes[0].mesh.visible = false;
				sphere.mesh.visible = true;
			}
			else
			{
				this.current = 'plane-fault';
				sphere.mesh.visible = false;
				planes[0].mesh.visible = true;
			}
			this.gui.folders[this.current].open();
		}
	};
	*/
	this.faultController = 
	{
		iterations: 0,
		generate: function()
		{
			for(var i = 0; i < this.iterations; i++)
				terrain[0].iterate();
		},
		smoothness: 0,
		smooth: function(){},
		wireframe: false,
		wireframeToggle: function()
		{
			this.wireframe = !this.wireframe;
			if(this.wireframe)
				planes[0].material.wireframe = true;
			else planes[0].material.wireframe = false;
			planes[0].material.needsUpdate = true;
		},
		visibilityToggle: function()
		{
			planes[0].mesh.visible = !planes[0].mesh.visible;
		}
	};

	this.sphereController = 
	{
		iterations: 0,
		generate: function()
		{
			for(var i = 0; i < this.iterations; i++)
				terrain[3].iterate();
		},
		wireframe: false,
		wireframeToggle: function()
		{
			this.wireframe = !this.wireframe;
			if(this.wireframe)
				sphere.material.wireframe = true;
			else sphere.material.wireframe = false;
			sphere.material.needsUpdate = true;
		},
		visibilityToggle: function()
		{
			sphere.mesh.visible = !sphere.mesh.visible;
		}
	};
	this.gui.folders = [];
	//this.gui.add(this.controller, 'swapGenerator');
	this.gui.folders['plane-fault'] = this.gui.addFolder('plane-fault');
	this.gui.folders['plane-fault'].open();
	this.gui.folders['plane-fault'].add(this.faultController, 'iterations', 0, 1000);
	this.gui.folders['plane-fault'].add(this.faultController, 'generate');
	this.gui.folders['plane-fault'].add(this.faultController, 'smoothness', 0, 50);
	this.gui.folders['plane-fault'].add(this.faultController, 'smooth');
	this.gui.folders['plane-fault'].add(this.faultController, 'wireframeToggle');
	this.gui.folders['plane-fault'].add(this.faultController, 'visibilityToggle');
	this.gui.folders['sphere'] = this.gui.addFolder('sphere');
	this.gui.folders['sphere'].add(this.sphereController, 'iterations', 0, 1000);
	this.gui.folders['sphere'].add(this.sphereController, 'generate');
	this.gui.folders['sphere'].add(this.sphereController, 'wireframeToggle');
	this.gui.folders['sphere'].add(this.sphereController, 'visibilityToggle');
};
