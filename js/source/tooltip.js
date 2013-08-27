// debugmode tooltip
function DmTooltip() {

	this.hiddenClass = '__hidden';
	this.tooltipClass = 'dm_tooltip';
	this.tooltipRowClass = 'dm_tooltip_row';
	this.tooltipWrapperClass =  'dm_tooltip_w';
	this.tooltipHiddenClass = '__hidden';
	
	// create layout of tooltip
	this.getContainerHTML();

};

// get test to show and show tooltip with this text
DmTooltip.prototype.show = function(event) {

	var _this = event.data.self || this,
		text = event.data.text;
		row = _this.getRowHtml(text);

	if(row) {
		// append row with current text to common container
		row.appendTo(_this.container);
		
		// if tooltip is unvisible, show it
		if(!_this.tooltipIsVisible) {
			_this.container.removeClass(_this.hiddenClass);
			_this.tooltipIsVisible = true;
		};
	} else {
		return false;
	};
};

// hide tooltip 
DmTooltip.prototype.hide = function(event) {
	var _this;

	if(event) {
		_this = event.data.self || this;	
	} else {
		_this = this;	
	}

	// if tooltip is visible, hide it
	if(_this.tooltipIsVisible) {
		_this.container.addClass(_this.hiddenClass);
		// remove all rows
		_this.container.empty();

		_this.tooltipIsVisible = false;
	} else {
		return false;
	};
};

// create layout of tooltip container
DmTooltip.prototype.getContainerHTML = function() {
	this.container = $('<div />', {
						'class'	: this.tooltipWrapperClass + ' ' + this.tooltipHiddenClass
					}).appendTo($(document.body));

	$('<div />', {
		'class'	: this.tooltipClass
	}).appendTo(this.container);
};

// get row with one error text for append to container
DmTooltip.prototype.getRowHtml = function(text) {
	if (text)
		return $('<p />', {
					'class' : this.tooltipRowClass,
					'text'	: text
				});
	else
		return false;
};

DmTooltip.prototype.unbindAppearence = function(elements) {
	// unbind from element tooltip appearence by hover
	$(elements)
		.off('mouseenter', this.show)
		.off('mouseleave', this.hide);
};