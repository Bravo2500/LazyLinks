/**
 * Extends each property loaded from json file
 * @param  {String} macrosFromJson macros loaded from json file
 * @return {Object}                extended object
 */
function extendMacro(macrosFromJson) {
	for (var propertyName in macrosFromJson) {
		// log("propertyName: " + propertyName);
		var currentLine = macrosFromJson[propertyName];
		macrosFromJson[propertyName] = {
			macroLine: currentLine,
			value: function(value) {
				addMacro(this.macroLine, value);
				log('Property name: ' + propertyName);
				return macrosFromJson;
			},
			selectByIndex: function(index) {
				addMacro(this.macroLine, "#" + index);
				log('Property name: ' + propertyName);
				return macrosFromJson;
			},
			selectByCode: function(code) {
				addMacro(this.macroLine, "%" + code);
				log('Property name: ' + propertyName);
				return macrosFromJson;
			},
			selectByText: function(text) {
				addMacro(this.macroLine, "$" + text);
				log('Property name: ' + propertyName);
				return macrosFromJson;
			},
			click: function() {
				addMacro(this.macroLine, null);
				log('Property name: ' + propertyName);
				return macrosFromJson;
			}
		};
	}
	log("JavaScript object properties has bean extended");
	return macrosFromJson;
}

/**
 * Append generatedMacros variable by given macro
 * @param {String} macro macro line
 */
function addMacro(macro) {
	addMacro(macro, null);
}

/**
 * Append generatedMacros variable by given macro and value
 * @param {String} macro macro line
 * @param {String} value value of macro line
 */
function addMacro(macro, value) {
	if (typeof(value) !== 'undefined' && value !== null) {
		value = value.split(" ").join("<SP>");
		generatedMacros += macro + value + "\n";
	} else {
		generatedMacros += macro + "\n";
	}
}

