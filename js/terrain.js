//
// Handles terrain generation
//

// Valid types:
// 	"plane-fault", "plane-circle", "plane-diamond-square",
// 	"sphere"

var TERRAIN = { VERSION: '0.1' };

TERRAIN.Generator = function(type, shape)
{
	this.type = type;
	this.shape = shape;
	this.heightFactor = 2;
	this.lines = [];
	if(this.type === "plane-fault")
	{
		this.iterate = function()
		{
			var line = new TERRAIN.randomLine(this.shape.geometry);
			this.lines.push(line.line);
			var coinFlip = Math.random() - 0.5;
			for(var i = 0; i < this.shape.geometry.vertices.length; i++)
			{
				var current = this.shape.geometry.vertices[i];
				if(coinFlip >= 0)
				{
					if(TERRAIN.pointAboveLine(line, current))
						current.z += this.heightFactor;
					else current.z -= this.heightFactor;
				} else {
					if(TERRAIN.pointAboveLine(line, current))
						current.z -= this.heightFactor;
					else current.z += this.heightFactor;
				}
			}
			this.shape.geometry.verticesNeedUpdate = true;
			this.shape.geometry.__dirtyVertices = true;
		};
		this.smooth = function()
		{

		};	
	}
	if(this.type === "plane-circle")
	{
		this.iterate = function()
		{

		};	
	}
	if(this.type === "plane-diamond-square")
	{
		this.iterate = function()
		{

		};	
	}
	if(this.type === "sphere")
	{
		this.heightFactor = 1.01;
		this.iterate = function()
		{
			var planeVector = new THREE.Vector3(Math.random(), Math.random(), Math.random());
			planeVector.normalize();
			var coinFlip = Math.random() - 0.5;
			for(var i = 0; i < this.shape.geometry.vertices.length; i++)
			{
				var vertex = this.shape.geometry.vertices[i];
				var point = new THREE.Vector3(vertex.x, vertex.y, vertex.z);
				if(coinFlip >= 0)
				{
					if(planeVector.dot(point) >= 0)
					{
						point.multiplyScalar(this.heightFactor);
						vertex.x = point.x;
						vertex.y = point.y;
						vertex.z = point.z;
					} else
					{
						point.multiplyScalar(1 / this.heightFactor);
						vertex.x = point.x;
						vertex.y = point.y;
						vertex.z = point.z;
					}
				} else
				{
					if(planeVector.dot(point) <= 0)
					{
						point.multiplyScalar(this.heightFactor);
						vertex.x = point.x;
						vertex.y = point.y;
						vertex.z = point.z;
					} else
					{
						point.multiplyScalar(1 / this.heightFactor);
						vertex.x = point.x;
						vertex.y = point.y;
						vertex.z = point.z;
					}
				}
			}
			this.shape.geometry.verticesNeedUpdate = true;
		};	
	}
};

TERRAIN.randomLine = function(geometry)
{
	this.planePoint1 = 
	{
		x: Math.round(geometry.vertices.length * (Math.random()-0.5)), 
		y: Math.round(geometry.vertices.length * (Math.random()-0.5))
	};
	this.planePoint2 = 
	{
		x: Math.round(geometry.vertices.length/2 * (Math.random()-0.5)), 
		y: Math.round(geometry.vertices.length/2 * (Math.random()-0.5))
	};
	this.slope = (this.planePoint1.y - this.planePoint2.y) / (this.planePoint1.x - this.planePoint2.x);
	this.line = new TERRAIN.line(this.planePoint1, this.planePoint2);
};

TERRAIN.line = function(point1, point2)
{
	this.material = new THREE.LineBasicMaterial({color: 0x0000ff});
	this.geometry = new THREE.Geometry();
	this.geometry.vertices.push(new THREE.Vector3(point1.x, 0, point1.y));
	this.geometry.vertices.push(new THREE.Vector3(point2.x, 0, point2.y));
	this.line = new THREE.Line(this.geometry, this.material);
};

TERRAIN.pointAboveLine = function(line, point)
{
	var y = line.slope*(point.x - line.planePoint1.x) + line.planePoint1.y;
	if(point.y >= y)
		return true;
	else return false;
};

TERRAIN.Generator.prototype.toggleWireframe = function()
{
	this.shape.material.wireframe = !this.shape.material.wireframe;
};

TERRAIN.Generator.prototype.update = function()
{
	this.shape.updateColors();
};

TERRAIN.Plane = function(width, height)
{
	this.geometry = new THREE.PlaneGeometry(width, height, width/2, height/2);
	this.material = new THREE.MeshLambertMaterial({color: 0xffffff, wireframe: false});
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.lookAt(new THREE.Vector3(0, 1, 0));
};

TERRAIN.Plane.prototype.updateColors = function()
{
	this.material.vertexColors = THREE.VertexColors;
	var max = this.geometry.vertices[0].z;
	var min = this.geometry.vertices[0].z;
	for(var i = 0; i < this.geometry.vertices.length; i++)
	{
		var current = this.geometry.vertices[i].z;
		if(current > max)
			max = current;
		if(current < min)
			min = current;
	}

	var offset = 0;
	if(min < 0)
		offset = Math.abs(min);
	min = min + offset;
	max = max + offset;

	var range = max-min;

	for(var i = 0; i < this.geometry.faces.length; i++)
	{
		var color = new THREE.Color(0x000000);
		var face = this.geometry.faces[i];
		var vertices = this.geometry.vertices;
		var a = (vertices[face.a].z + offset) / range;
		color.r = a;
		color.g = a;
		color.b = a;
		face.vertexColors[0] = color;
		var b = (vertices[face.b].z + offset) / range;
		color.r = b;
		color.g = b;
		color.b = b;
		face.vertexColors[1] = color;
		var c = (vertices[face.c].z + offset) / range;
		color.r = c;
		color.g = c;
		color.b = c;
		face.vertexColors[2] = color;
	}

	this.geometry.__dirtyColors = true;
	this.geometry.colorsNeedUpdate = true;
	this.geometry.computeFaceNormals();
	this.geometry.computeVertexNormals();
};

TERRAIN.Sphere = function(radius)
{
	this.geometry = new THREE.SphereGeometry(radius, radius/2, radius/2);
	this.material = new THREE.MeshLambertMaterial({color: 0xffffff, wireframe: false});
	this.mesh = new THREE.Mesh(this.geometry, this.material);
};

TERRAIN.Sphere.prototype.updateColors = function()
{
	this.material.vertexColors = THREE.VertexColors;
	var current = this.geometry.vertices[0];
	var d = Math.sqrt(current.x*current.x + current.y*current.y + current.z*current.z);
	var max = d;
	var min = d;
	for(var i = 0; i < this.geometry.vertices.length; i++)
	{
		var current = this.geometry.vertices[i];
		var distance = Math.sqrt(current.x*current.x + current.y*current.y + current.z*current.z);
		if(distance > max)
			max = distance;
		if(distance < min)
			min = distance;
	}

	var offset = 0;
	if(min < 0)
		offset = Math.abs(min);
	min = min + offset;
	max = max + offset;

	var range = max-min;

	for(var i = 0; i < this.geometry.faces.length; i++)
	{
		var color = new THREE.Color(0x000000);
		var face = this.geometry.faces[i];
		var vertices = this.geometry.vertices;
		var current = this.geometry.vertices[face.a];
		var distance = Math.sqrt(current.x*current.x + current.y*current.y + current.z*current.z);
		var a = (distance + offset) / range;
		color.r = a;
		color.g = a;
		color.b = a;
		face.vertexColors[0] = color;
		current = this.geometry.vertices[face.b];
		distance = Math.sqrt(current.x*current.x + current.y*current.y + current.z*current.z);
		var b = (distance + offset) / range;
		color.r = b;
		color.g = b;
		color.b = b;
		face.vertexColors[1] = color;
		current = this.geometry.vertices[face.c];
		distance = Math.sqrt(current.x*current.x + current.y*current.y + current.z*current.z);
		var c = (distance + offset) / range;
		color.r = c;
		color.g = c;
		color.b = c;
		face.vertexColors[2] = color;
	}

	this.geometry.__dirtyColors = true;
	this.geometry.colorsNeedUpdate = true;
	this.geometry.computeFaceNormals();
	this.geometry.computeVertexNormals();
};
