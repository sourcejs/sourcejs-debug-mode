function HtmlInspector(pathToInspector, exampleSectionClass, tooltip) {
	var _this = this;

	this.pathToInspector = pathToInspector;
	this.inspectorOptions = {
		domRoot: '.' + exampleSectionClass
	};
	this.tooltip = tooltip;

	this.form = $(document.getElementById('dm_html_inspector_form'));
	this.triggerToMarkElement = $('#dm_his_mark_elements', this.form);

	this.resetCtrl = $('[type="reset"]', this.form);

	this.ERROR_CLASS = 'dm_hi_error';

	this.form.on('submit', function () {
		_this.run();
		return false;
	});

	this.resetCtrl.on('click', function () {
		_this.reset();
		return false;
	});
};

HtmlInspector.prototype.run = function () {
	var _this = this;

	this.reset();
	this.inspectorOptions = this.getOptions();

	require([this.pathToInspector], function(){
		HTMLInspector.inspect(_this.inspectorOptions);	
	});
};

HtmlInspector.prototype.reset = function () {
	var prevElements = $('.' + this.ERROR_CLASS);

	prevElements.removeClass(this.ERROR_CLASS);
	this.tooltip.unbindAppearence(prevElements);
};

HtmlInspector.prototype.getOptions = function(){
	var _this = this;

	if (!this.triggerToMarkElement.prop('checked')) {
		delete this.inspectorOptions.onComplete;
	} else {
		this.inspectorOptions.onComplete = function(errors){
			for (var error in errors) {
                var error = errors[error];
                
				$(error.context).addClass(_this.ERROR_CLASS);
                console.warn(error.message, error.context);
                
                $(error.context).on('mouseenter', {text: error.message, self: _this.tooltip}, _this.tooltip.show)
                                .on('mouseleave', {self: _this.tooltip}, _this.tooltip.hide);
			};
		};
	};

	return this.inspectorOptions;
};