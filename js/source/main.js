/**
* Created by Anton Korochinsky.
* Mail: anton.korochinskiy@gmail.com , twitter: korochinskiy
* Date: 19.01.13
*/

define(["jquery", "modules/module"], function ($, module) {

// some options
var
	dmUtilityClasses = {
		classError : 'dm_class_count_error',
		domLevelError : 'dm_dom_level_error',
		hiError : 'dm_hi_error'
	},
	dmOtions = {
		switchOffEvent : 'debugmodeSwitchOff'
	};

//@@debugmode

//@@toolbar

//@@sectionToolbar

//@@resizer

//@@tooltip

//@@htmlInspector

return new Debugmode();

});
