// resizer of debugmode toolbar
function DmResizer(dmToolbarContent, dmToolbar, dmHider, dmResizer, needToMaximize) {
	// content of toolbar
	this.dmToolbarContent = dmToolbarContent;
	// toolbar
	this.dmToolbar = dmToolbar;

	// link to minimize or maximaze toolbar
	this.dmHider = dmHider;
	// active area for resize
	this.dmResizer = dmResizer;

	// in cookie write last height of toolbar
	this.lastDmHeightCookieName = 'lastDmHeight';
	this.currentHeight = $.cookie(this.lastDmHeightCookieName) || 300;

	this.body = $('body');
	this.window = $(window);

	this.lastHeight = start_height = 20;

	this.dmIsHidden = false;
	this.hiddenClass = '__closed';
	
	var _this = this;
	
	if(this.currentHeight){
		this.dmToolbarContent.css('height',this.currentHeight);
	} else {
		this.currentHeight = this.dmToolbar.height();
	}
	
	this.dmResizer.mousedown(function(){
		_this.window.bind('mousemove',resizeToolbar);
		_this.makeBodyUnselectable(true);
		_this.changeVisibleStatus(true);
	});

	this.body.mouseup(function(){
		_this.window.unbind('mousemove',resizeToolbar);
		_this.makeBodyUnselectable(false);
	});

	function resizeToolbar(e){
		_this.currentHeight = (_this.window.height()  - e.clientY);
		_this.lastHeight = _this.currentHeight;
		_this.dmToolbarContent.css('height', _this.currentHeight);
		$.cookie(_this.lastDmHeightCookieName, _this.currentHeight);
	}

	this.initializeToolbar();

	if( needToMaximize ) {
		this.showToolbar();
	};
};

DmResizer.prototype.hideToolbar = function(){
	this.dmToolbarContent.css('height',start_height);
	this.changeVisibleStatus(false);
}

DmResizer.prototype.showToolbar = function(){
	this.dmToolbarContent.css('height',this.lastHeight);
	this.changeVisibleStatus(true);
}

DmResizer.prototype.initializeToolbar = function(){
	// initialize toolbar after it's gotten from server
	var _this = this;

	this.lastHeight = this.dmToolbarContent.height();

	this.dmHider.click(function(e){
		e.preventDefault();
		checkState();
	});

	function checkState(state){
		var os = _this.dmHider.text();;
		if(_this.dmIsHidden){
			_this.showToolbar();
		} else {
			_this.hideToolbar();
		};
	};

	this.hideToolbar();
};

DmResizer.prototype.changeVisibleStatus = function(isToBeVisible) {
	if(isToBeVisible == this.dmIsHidden) {
		var otherState = this.dmHider.text();

		this.dmHider.text(this.dmHider.attr('data-other-state'));
		this.dmHider.attr('data-other-state', otherState);

		this.dmIsHidden = !this.dmIsHidden;

		if(this.dmIsHidden) {
			this.dmToolbar.addClass(this.hiddenClass);
		} else {
			this.dmToolbar.removeClass(this.hiddenClass);
		};

		return true;
	} else {
		return false;
	};
};


DmResizer.prototype.makeBodyUnselectable = function (toBeUnselectable){
	var params = new Array();

	if (toBeUnselectable) {
		params[0] = 'on';
		params[1] = 'none';
		params[2] = false;
	} else {
		params[0] = 'off';
		params[1] = 'auto';
		params[2] = true;
	};

	this.body
		.attr('unselectable', params[0])
        .css('user-select', params[1])
        .css('-webkit-user-select', params[1]);
};