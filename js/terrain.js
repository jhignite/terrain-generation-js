//
// Handles terrain generation
//

// Valid types:
// 	"plane-fault", "plane-circle", "plane-diamond-square",
// 	"sphere-fault"

TERRAIN.Generator = function(type, geometry)
{
	this.type = type;
	this.geometry = geometry;
	if(this.type === "plane-fault")
	{
		this.iterate = function()
		{
			var line = randomLine(this.geometry);
			var rand = Math.random();
			for(var i = 0; i < this.geometry.vertices.length; i++)
			{

			}
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
	
};

TERRAIN.randomLine.prototype.locatePoint = function(point)
{

};
