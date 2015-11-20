//
// Handles terrain generation
//

// Valid types:
// 	"plane-fault", "plane-circle", "plane-diamond-square",
// 	"sphere-fault"

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
	if(this.type === "sphere-fault")
	{
		this.iterate = function()
		{

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
	this.material = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.lookAt(new THREE.Vector3(0, 1, 0));
};

TERRAIN.Plane.prototype.updateColors = function()
{
	this.material.vertexColors = THREE.VertexColors;
	for(var i = 0; i < this.geometry.faces.length; i++)
	{
		var current = this.geometry.faces[i];
		current.vertexColors[0] = new THREE.Color().setRGB(1, 0, 0);
		current.vertexColors[1] = new THREE.Color().setRGB(0, 1, 0);
		current.vertexColors[2] = new THREE.Color().setRGB(0, 0, 1);
	}
	this.geometry.colorsNeedUpdate = true;
};

TERRAIN.Sphere = function(radius)
{
	this.geometry = new THREE.SphereGeometry(radius, radius/2, radius/2);

};
