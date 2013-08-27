// debugmode controller
function Debugmode(){
	
	this.inDebugmode = false;
	this._body = $('body');
	this.pathToDmCss = '/plugins/debugmode/css/debugmode.css';
	this._window = $(window);
	this.switcherActiveClass = 'active';
	this.toolbarTransparentClass = '__transparent';
}

// get all needed parameters
Debugmode.prototype.initialize = function(paramSwitcher, globalOptions, options) {
	this.switcher = paramSwitcher;
	this.options = options;
	this.globalOptions = globalOptions;
	this.containers = $('.' + this.globalOptions.exampleSectionClass);
	this.sectionToolbar = new DmSectionToolbar(this,this.containers);
};	

// toggle mode
Debugmode.prototype.switchMode = function(needToMaximize){
	if(this.inDebugmode){
		this.offDebugMode();
	} else {
		this.runDebugMode(needToMaximize);
	}
};

// switch debugmode on
Debugmode.prototype.runDebugMode = function(needToMaximize){
	
    var options = {
		needToMaximize: needToMaximize
	};

	this.switcher.toggleClass(this.switcherActiveClass);

	this.inDebugmode = true;

	if(!this.dmToolbar){
		// if DmToolbar isn't created
		this.dmToolbar = new DmToolbar(this, this.globalOptions, options);
	} else {    
		this.dmToolbar.toolbar.removeClass(this.toolbarTransparentClass);
        if (needToMaximize) {
            this.dmToolbar.maximize();
        }
	};

	this._window.trigger(dmOtions.switchOffEvent);
};

// switch debugmode off
Debugmode.prototype.offDebugMode = function(){
	this.switcher.toggleClass(this.switcherActiveClass);
	this.inDebugmode = false;

	this.dmToolbar.toolbar.addClass(this.toolbarTransparentClass);

	this._window.trigger(dmOtions.switchOffEvent);
};