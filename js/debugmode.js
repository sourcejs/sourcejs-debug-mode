/**
 * Created by Anton Korochinsky. 
 * Mail: anton.korochinskiy@gmail.com , twitter: korochinskiy 
 * Date: 19.01.13
 */

define([
    "core/options",
    "plugins/debugmode/lib/jquery-cookie/jquery.cookie",
    "modules/css"
    ], function (globalOptions, cookie, Css) {

    var debugmodeOptions = {
	    	pathToInspector: globalOptions.pluginsDir + 'debugmode/lib/html-inspector.js',
	    	pathToCriticalChecker: globalOptions.pluginsDir + 'debugmode/js/deffered/criticalChecker.js',
	    	pathToScript: globalOptions.pluginsDir + 'debugmode/js/dm.js',
	    	pathToStyles: 'debugmode/css/dm.css',
	        switchKeys: {
	            show: {
	                keyCode: '68',
	                specialKeys: ['ctrlKey']
	            },
	            maximize: {
	                keyCode: '68',
	                specialKeys: ['ctrlKey', 'shiftKey']
	            }
	        },
	        enableCriticalCheck: true,
	        htmlInspectorRules: {
	        	// [
	        	// 	{
	        	// 		name: 'Rule name',
	        	// 		config: ['rule','config'],
	        	// 		func: 'processing function'
	        	// 	}
	        	// ]
	        }
    	};

    $.extend(debugmodeOptions, globalOptions.pluginsOptions.debugmodeOptions);

	function DmInitialize(options) {
		var _this = this,
            isSpecialKeysPressed = function (event, keys) {
                if (event && typeof keys == 'object') {
                    var i,
                        result = true;
                    for (i = 0; i < keys.length; i++) {
                        result = result && event[keys[i]];
                    }
                    return result;
                } else {
                    return false;
                }
            }
		// path to script and style to load if dm will be switched on
		this.options = options;
		this.pathToScript = options.pathToScript;
		this.pathToStyles = options.pathToStyles;

		// path to styles need to load necessary
		this.pathToStartStyles = 'debugmode/css/debugmode.css';

		this.switcherAttr = {
			'class' : 'debugbar_corner',
			'id' : 'dm_open',
			'iconClass' : 'debugbar_corner_ic'
		};

		this.switcher = this.addDebugSwitcher();
		this.debugmode = false;

		$(document).on('keydown', function (e) {
			if (e.keyCode == debugmodeOptions.switchKeys.maximize.keyCode && isSpecialKeysPressed(e, debugmodeOptions.switchKeys.maximize.specialKeys)) {
				_this.switchMode(true);
			} else if (e.keyCode == debugmodeOptions.switchKeys.show.keyCode && isSpecialKeysPressed(e, debugmodeOptions.switchKeys.show.specialKeys)) {
				_this.switchMode();
			}
		});

		if (this.options.enableCriticalCheck) {
			this.runCriticalCheck();
		};
	};

	// add layout of debugmode switcher
	DmInitialize.prototype.addDebugSwitcher = function () {
		var
			_this = this,
			// create left panel switch off and on dm
			switcher = $('<div />', {
							'class'	: this.switcherAttr.class,
							'id'	: this.switcherAttr.id,
							click	:  function(){
											_this.switchMode();
										}
						}).appendTo($(document.body)),

			icon = $('<i />', {
						'class'	: this.switcherAttr.iconClass
					}).appendTo(switcher);

		// load styles for dm switcher
		new Css(this.pathToStartStyles);

		return switcher;
	};

	// switch mode off or on
	DmInitialize.prototype.switchMode = function (needToMaximize, runHtmlInspector) {
		var _this = this;

		if(!this.debugmode) {
			// if object wasn't created
			require([_this.pathToScript], function(debugmode) {
				// create object if script is loaded
				_this.debugmode = debugmode;
				_this.debugmode.initialize(_this.switcher, globalOptions, _this.options);

				//load styles for dm toolbars
				new Css(_this.pathToStyles,globalOptions.pluginsDir);
				// switch debuggmode on first time
				return _this.debugmode.switchMode(needToMaximize, runHtmlInspector);
			})
		} else {
			// switch on or off debugmode
			return this.debugmode.switchMode(needToMaximize, runHtmlInspector);
		}
	};

	// run html inspector and log errors to console by default
	DmInitialize.prototype.runCriticalCheck = function () {
		var _this = this;

		require([this.options.pathToCriticalChecker], function(criticalChecker){
			criticalChecker.initialize(debugmodeOptions, globalOptions, _this);
		});
	};

	$(function () {
		new DmInitialize(debugmodeOptions);
	})

})

