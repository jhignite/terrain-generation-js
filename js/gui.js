// 
// GUI using dat.GUI for terrain generator
//

TerrainGUI = function()
{
	this.updated = false;
	this.controller = 
	{
		iterations: 0,
		generate: function(){},
		smoothness: 0,
		smooth: function(){},
		wireframe: false
	};
	this.gui = new dat.GUI();
	this.gui.folders = [];
	this.gui.folders['plane-fault'] = this.gui.addFolder('plane-fault');
	this.gui.folders['plane-fault'].open();
	this.gui.folders['plane-fault'].add(this.controller, 'iterations', 0, 1000);
	this.gui.folders['plane-fault'].add(this.controller, 'generate');
	this.gui.folders['plane-fault'].add(this.controller, 'smoothness', 0.1, 10.0);
	this.gui.folders['plane-fault'].add(this.controller, 'smooth');
	this.gui.folders['plane-fault'].add(this.controller, 'wireframe');
};

TerrainGUI.prototype.update = function()
{
	this.updated = false;
};
