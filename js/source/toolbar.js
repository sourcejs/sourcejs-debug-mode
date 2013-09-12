// debugmode toolbar 
function DmToolbar(debugmode, globalOptions, options) {

	this.options = globalOptions;
	this.needToMaximize = options.needToMaximize;
	this.runHtmlInspector = options.runHtmlInspector;
	this.debugmode = debugmode;
	// path to dm toolbar template
	this.toolbarUrl = this.options.pluginsDir + 'debugmode/templates/toolbar.html';

	this.window = $(window);
	this.body = $('body');

	this.toolbar = false;

	// get html of dn toolbar
	this.getToolbar();
	// create tooltip object for tooltip appearence
	this.tooltip = new DmTooltip();
	debugmode.tooltip = this.tooltip;

	this.toolbarId = 'dm_controls';
	this.toolbarTransparentClass = '__transparent';

	// class added to all simple forms, rules are descripted in rules table 
	this.formsIds = {
		troubleClassesForm : 'trouble_classes',
		troubleDOMLevelsForm : 'trouble_dom',
		resetLink : 'dm_form_hide'
	};

	// info for function calculates class count
	this.classForm = {
		countId : 'dt_lots_classes',
		countShow : 'count_dt_lots_classes',
		maxCountController : 'dt_classes_max_count',
		pathToControllerFunction : this.options.pluginsDir + 'debugmode/js/deffered/domclassuncorrect.js' 
	}

	// info for function calculates DOM level count
	this.DOMLevelForm = {
		countId : 'dt_level_count',
		countShow : 'count_dt_level_count',
		maxCountController : 'dt_level_max_count',
		pathToControllerFunction : this.options.pluginsDir + 'debugmode/js/deffered/domleveluncorrect.js' 
	};

	// info for common operations
	this.commonOperations = {
		htmlInspectorRunnerId : 'dm_start_html_inspector'
	}

	// info about toolbar controls
	this.toolbarControls = {
		controls : 'dm_controls_inner',
		hider : 'dm_hider',
		resizer : 'dm_resizer'
	};

	this.noTroublesContent = '<span class="no-troubles">0</span>';

	this.formsObj = {};

};
	
// get toolbar layout from server
DmToolbar.prototype.getToolbar = function(){
	// we don't have toolbar on the page at start, 
	// and this is how we get it from server 
	var _this = this,
		animationDuration = 200;

	// if toolbar isn't gotten
	 if(!this.toolbar) {
	 	// send request for toolbar template
	 	$.get(_this.toolbarUrl,function(data){
	 		// append toolbar to body
	 		_this.body.append(data);
	 		_this.toolbar = $(document.getElementById(_this.toolbarId));

	 		// show toolbar smoothly
	 		setTimeout(function(){
	 			_this.toolbar.removeClass(_this.toolbarTransparentClass);
	 		}, animationDuration);
	 		
	 		// create resize controller of toolbar
	 		_this.resizer = new DmResizer($('#' + _this.toolbarControls.controls), _this.toolbar, $('#' + _this.toolbarControls.hider), $('#' + _this.toolbarControls.resizer), _this.needToMaximize);

	 		// bind html inspector run to link click 
	 		new HtmlInspector(_this.debugmode.options, _this.options.exampleSectionClass, _this.tooltip, _this.runHtmlInspector);

	 		// initilaize all forms in toolbar for showing troubles
	 		_this.initilaizeForms();
	 	})
	 // if if toolbar is gotten
	 } else {
	 	return this.toolbar;
	 };
};

// initialize all forms toolbar contains
DmToolbar.prototype.initilaizeForms = function () {
	//initialize form that show clasese and DOM levels count
	this.initializeClassForm($('#' + this.formsIds.troubleClassesForm, this.toolbar));
	this.initializeDomLevelsCountForm($('#' + this.formsIds.troubleDOMLevelsForm, this.toolbar));
}

// initialize form calculates class count
DmToolbar.prototype.initializeClassForm = function(form){
	//initialize forrm that show classes count
	var 
		_this = this,
		// checbox in this form
		countControl = $('#' + this.classForm.countId, form),
		// container shows troubles count
		countShow = $('#' + this.classForm.countShow, form),
		// controller via can point max count of classes
		maxCountController = $('#' + this.classForm.maxCountController, form),
		// form reset link
		reset = $('.' + this.formsIds.resetLink, form),
		// function controls element count
		domClassUncorrect = false;

	form.submit(function(e){
		require([_this.classForm.pathToControllerFunction], function() {
			// if have no domClassUncorrect function initialized yet
			if(!domClassUncorrect)
				domClassUncorrect = new DomClassUncorrect(_this.options.exampleSectionClass, dmUtilityClasses, _this.tooltip);

			// hide previous shown suitable elements
			domClassUncorrect.hideUncorrect();

			// if need to show elements
			if(countControl.is(':checked')){
				//show new suitable elements
				var count = domClassUncorrect.showUncorrect(maxCountController.val());
				// show count next to checkbox
				_this.addTroublesCount(_this.classForm.countId, count);
			// else hide problematic elements count
			} else {
				countShow.text('');
			};
		});
		return false;
	});

	// reset form by reset link clicked
	reset.click(function(e){
		_this.resetForm(form, countControl);

		return false;
	});

	// if debugmode is switched off
	this.window.bind(dmOtions.switchOffEvent, function(){
		_this.resetForm(form, countControl);
	});
};

// initialize form calculates DOM level count
DmToolbar.prototype.initializeDomLevelsCountForm = function(form){
	var 
		_this = this,
		// checbox in this form
		countControl = $('#' + this.DOMLevelForm.countId, form),
		// container shows troubles count
		countShow = $('#' + this.DOMLevelForm.countShow, form),
		// controller via can point max count of classes
		maxCountController = $('#' + this.DOMLevelForm.maxCountController, form),
		// form reset link
		reset = $('.' + this.formsIds.resetLink, form),
		// function controls element count
		domLevelUncorrect = false;


	form.submit(function(e){
		require([_this.DOMLevelForm.pathToControllerFunction], function() {
			// if have no domLevelUncorrect function initialized yet
			if(!domLevelUncorrect)
				domLevelUncorrect = new LevelUncorrect(_this.options.exampleSectionClass, dmUtilityClasses, _this.tooltip);	
			
			//hide previous classed effects	
			domLevelUncorrect.hideUncorrect();
			
			if(countControl.is(':checked')){
				//get count of troubles elements
				var uncorrectElements = domLevelUncorrect.showUncorrect(maxCountController.val());
				
				_this.addTroublesCount(_this.DOMLevelForm.countId, uncorrectElements.count);
			} else {
				countShow.text('');
			};

		});

		return false;
	});

	// reset form by reset link clicked
	reset.click(function(e){
		_this.resetForm(form, countControl);
		return false;
	})

	// if debugmode switchoff
	this.window.bind(dmOtions.switchOffEvent, function () {
		_this.resetForm(form, countControl);
	}) 
}

// reset form - hide all shown trubles by this form
DmToolbar.prototype.resetForm = function (form, controls) {
	// for each checkboxes uncheck it
	controls.each(function(idx,el){
		el.checked = false;
	});

	// and submit form with no one checked checkbox
	form.trigger('submit');

	this.tooltip.hide();
}

// show trubles count next to every checkbox
DmToolbar.prototype.addTroublesCount = function (id, count) {
	// if there are troubles, show count
	if(count > 0) {
		document.getElementById('count_' + id).innerHTML = count;
	// else add wrapper for green font color, if we have no troubles 
	} else {
		document.getElementById('count_' + id).innerHTML = this.noTroublesContent;
	};
};

// hide troubles count next to checkbox
DmToolbar.prototype.removeTroublesCount = function(id){
	document.getElementById('count_' + id).innerHTML = "";	
};

DmToolbar.prototype.maximize = function () {
    this.resizer.showToolbar();
};