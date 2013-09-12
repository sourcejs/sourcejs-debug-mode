define(["jquery", "modules/module"], function ($, module) {

	function CriticalChecker () {
		var ALERT_LINK_CLASS = 'dm_critical_checker_alert_a',
			RUN_DM_LINK = '<a class="' + ALERT_LINK_CLASS + '" href="#">run Debugmode</a>';

		this.ALERT_CLASS = 'dm_critical_checker_alert';
		this.ALERT_HIDDEN_CLASS = '__hidden';
		this.ALERT_CONTENT = 'Errors on page! Open console or ' + RUN_DM_LINK + '.';
		this.ALERT_VISIBLE_TIME = 5000;
		this.inspectorOptions = {};

		this.alert = false;
		this.dmInitializer = false;
	};

	CriticalChecker.prototype.initialize = function (debugmodeOptions, globalOptions, dmInitializer) {
		var _this = this;

		this.dmInitializer = dmInitializer;
		this.inspectorOptions.domRoot = '.' + globalOptions.exampleSectionClass;
		this.inspectorOptions.onComplete = function(errors){
			var count = 0;

			for (var error in errors) {
                var error = errors[error];
                
                console.warn(error.message, error.context);
                count++;
			};

			if(count > 0) {
				_this.showAlert();
			}
		};

		require([debugmodeOptions.pathToInspector], function () {
			if(debugmodeOptions.htmlInspectorRules.length) {
				for(var i = 0; i <= debugmodeOptions.htmlInspectorRules.length; i++ ) {
					rule = debugmodeOptions.htmlInspectorRules[i];
					if(rule) {
						HTMLInspector.rules.add(rule.name, rule.config, rule.func);		
					}
				}
			}
			HTMLInspector.inspect(_this.inspectorOptions);
		});
	};

	CriticalChecker.prototype.showAlert = function () {
		var _this = this;

		if(!this.alert) {
			this.alert = $('<div />', {
							'class' : 	this.ALERT_CLASS,
							'click'	: 	function(){
											_this.hideAlert();
										},
							'html'	: this.ALERT_CONTENT
						}).appendTo($(document.body));

			this.alert.find('a').on('click', function () {
				_this.openDebugmode();
			})
		} else {
			this.alert.removeClass(this.ALERT_HIDDEN_CLASS);
		}

		setTimeout(function(){
			_this.hideAlert();
		}, this.ALERT_VISIBLE_TIME);
	};

	CriticalChecker.prototype.hideAlert = function () {
		if (this.alert) {
			this.alert.addClass(this.ALERT_HIDDEN_CLASS);
		}
	};

	CriticalChecker.prototype.openDebugmode = function () {
		this.dmInitializer.switchMode(true, true);
	};

	return new CriticalChecker();

});