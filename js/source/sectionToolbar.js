// debugmode toolbar in section 
function  DmSectionToolbar(dm,sections){

	var 
		_this = this,
		toolbarContent = { /* dtoolbar items */
			'dm_editable':'Редактировать контент',
			'dm_uneditable':'Закончить редактирование',
			'dm_revert': 'Отменить изменения',
			'dm_close': 'Выйти из дебагг-режима'
		},
		dmToolbarClass = 'dm_dtoolbar';
	
	this.sections = sections;
	this.dm = dm;

	this._body = $('body');
	this.toolbar = $('<div />', {
				'class': dmToolbarClass,
				'contenteditable': false
			});
	this.debugmoodeIsOn = true;
	this.firstStates = {};
	
	// fill dtoolbar by dtoolbars items
	for(var key in toolbarContent){
		$('<a />',{
			id: key,
			text: toolbarContent[key]
		}).appendTo(this.toolbar);			
	};

	// apend toolbar to the bottom of body
	this.toolbar.appendTo(this._body);

	// bind all toolbar controls click
	$(document.getElementById('dm_editable')).click(function(){
		_this.makeSectionEditable(_this.currentSection,true);
	});
	$(document.getElementById('dm_uneditable')).click(function(){
		_this.makeSectionEditable(_this.currentSection,false);
	})
	$(document.getElementById('dm_revert')).click(function(){
		_this.revertSectionContent(_this.currentSection,_this.currentSectionIdx);
	})
	$(document.getElementById('dm_close')).click(function(){
		_this.removeDebugToolbar(_this.currentSection);
		_this.offDebugMode();
	});

	// every section section
	this.sections.each(function(i){
		(function(i){
			// bind mouseenter for showing section toolbar
			$(_this.sections[i]).mouseenter(function(){
				_this.currentSectionIdx = i;
				// mark mouseentered section as current
				_this.currentSection = $(_this.sections[i]);

				// add toolbar to current section 
				_this.addDebugToolbar(_this.currentSection, i);
			// bind mouseleaving
			}).mouseleave(function(){
				// hide toolbar in this section
				_this.removeDebugToolbar(_this.currentSection, i);
			});
		})(i);
	});
};	

// append section toolbar to section
DmSectionToolbar.prototype.addDebugToolbar = function (section,i) {
	// if debugmode is on
	if(this.dm.inDebugmode) {
		// save start content for reverting
		if(!this.firstStates['item_' + i]) {
			this.firstStates['item_' + i] = this.sections[i].innerHTML;
		}
		// append toolbar to section
		section.css('position','relative').append(this.toolbar);
	// id gebugmode is off, no section toolbar
	} else {
		return false;
	};
};

// remove section toolbar from section
DmSectionToolbar.prototype.removeDebugToolbar = function(section,i){
	var section = $(this.sections[i]);
	// move toolbar from section to body
	this.toolbar.appendTo(this._body);
	// remove utility relative position
	section.css('position','');
};

// let or no edit content in section
DmSectionToolbar.prototype.makeSectionEditable = function(currentSection, letEdit){
	// add to section editable attribute
	currentSection.attr('contenteditable',letEdit);
};

// replace section content with saved first state
DmSectionToolbar.prototype.revertSectionContent = function(currentSection,currentSectionIdx){
	// move toolbar to body cause will replace all content in section
	this.toolbar.appendTo(this._body);
	// replace section content with saved content
	currentSection.html(this.firstStates['item_' + currentSectionIdx]);
	// move toolbar back to section
	this.toolbar.appendTo(currentSection);
};

// switch debugmode off
DmSectionToolbar.prototype.offDebugMode = function() {
	var _this = this;
	
	this.dm.offDebugMode();
	// make all section uneditable
	this.sections.each(function(i){
		_this.makeSectionEditable($(this),false);
	});
};