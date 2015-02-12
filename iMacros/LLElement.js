/**
 * Extends each property loaded from json file
 * @param  {String} macrosFromJson macros loaded from json file
 * @return {Object}                extended object
 */
function extendMacro(macrosFromJson) {
	// log(macrosFromJson);
	for (var propertyName in macrosFromJson) {
		// log("propertyName: " +p ropertyName + ', typeof: ' + typeof(macrosFromJson[propertyName]));
		if (typeof(macrosFromJson[propertyName]) === 'object') {
			// Extend subobjects
			extendMacro(macrosFromJson[propertyName]);
		} else {
			var currentLine = macrosFromJson[propertyName];
			macrosFromJson[propertyName] = new LLElement(macrosFromJson, currentLine);
		}
	}
	// log("JavaScript object properties has been extended");
	return macrosFromJson;
}

/**
 * LazyLink Element class
 * @class LLElement
 * @constructor
 * @param {String} macrosFromJson macros file content
 * @param {String} macroLine      macro line
 */
function LLElement(macrosFromJson, macroLine) {
	this.macrosFromJson = macrosFromJson;
	this.macroLine = macroLine;
};

/**
 * Enter value to field.
 * Join given arguments to one string and append it to macro line end
 * Play appended macro line, which sets value(s) to field
 *
 * @since 1.0.0
 * @param {...value} value(s) will be joined to one string
 *                            and appended to macroline end
 * @return                    Extended macros
 */
LLElement.prototype.value = function( /* value, value, ... */ ) {
	playMacro(this.macroLine, joinArguments(arguments));
	return this.macrosFromJson;
};

/**
 * Select value(s) by index.
 * Join given arguments per '#' symbol to one string and append it to macro line end
 * Play appended macro line, which selects value(s) on UI field
 *
 * @since 1.0.0
 * @param {...value} value(s) will be joined to one string
 *                            and appended to macroline end
 * @return                    Extended macros
 */
LLElement.prototype.selectByIndex = function( /* value, value, ... */ ) {
	playMacro(this.macroLine, joinArguments(arguments, "#"));
	return this.macrosFromJson;
};

/**
 * Select value by index or select last option if index > available options
 *
 * @since 1.0.3
 * @param {index}  
 * @return           Extended macros
 */
LLElement.prototype.selectByIndexOrLast = function(index) {
	playMacro(this.macroLine, getApplicableIndex(this.getElement(), index));
	return this.macrosFromJson;
};

/**
 * Select value(s) by code.
 * Join given arguments per '%' symbol to one string and append it to macro line end
 * Play appended macro line, which selects value(s) on UI field
 *
 * @since 1.0.0
 * @param {...value} value(s) will be joined to one string
 *                            and appended to macroline end
 * @return                    Extended macros
 */
LLElement.prototype.selectByCode = function( /* value, value, ... */ ) {
	playMacro(this.macroLine, joinArguments(arguments, "%"));
	return this.macrosFromJson;
};

/**
 * Select value(s) by text.
 * Join given arguments per '$' symbol to one string and append it to macro line end
 *
 * @since 1.0.0
 * Play appended macro line, which selects value(s) on UI field
 * @param {...value} value(s) will be joined to one string
 *                            and appended to macroline end
 * @return                    Extended macros
 */
LLElement.prototype.selectByText = function( /* value, value, ... */ ) {
	playMacro(this.macroLine, joinArguments(arguments, "$"));
	return this.macrosFromJson;
};

/**
 * Get selected index from drop-down or listbox
 *
 * @since 1.0.1
 * @return {Number} selected index
 */
LLElement.prototype.getSelectedIndex = function() {
	return this.getElement().selectedIndex;
};

/**
 * Get selected code from drop-down or listbox
 *
 * @since 1.0.1
 * @return {String} selected value text
 */
LLElement.prototype.getSelectedCode = function() {
	return this.getElement().options[this.getSelectedIndex()].value;
};

/**
 * Get selected value from drop-down or listbox
 *
 * @since 1.0.1
 * @return {String} selected value text
 */
LLElement.prototype.getSelectedText = function() {
	return this.getElement().options[this.getSelectedIndex()].text;
};

/**
 * Click on element.
 *
 * @since 1.0.0
 * @param  {Number} [index] index of row/link/button on table
 * @return                  Extended macros
 */
LLElement.prototype.click = function(index) {
	if (typeof index === 'undefined') {
		playMacro(this.macroLine);
	} else if (this.macroLine.match('{{index}}')) {
		playMacro(this.macroLine.replace('{{index}}', index)); // change index in middle of macro line
	} else {
		playMacro(this.macroLine, index); // append index to macro line end
	}
	return this.macrosFromJson;
};

/**
 * Saves value to given variable name
 * Note:
 * 	Play engine playing macros lines separately, one by one
 *  that is reason why macros commands: SET and EXTRACT not works.
 *  To solve that problem please use functions: 'saveToVar' and 'valueFromVar'
 *
 * @since 1.0.0
 * @param  {varName} Mandatory, variable name
 * @return           Extended macros
 */
LLElement.prototype.saveToVar = function(varName) {
	if (typeof(varName) === 'undefined') {
		logError('Couldn\'t save variable! Property name: ' + propertyName);
	}
	var line = this.macroLine.replace('CONTENT=', '').replace(/FORM.*ATTR/, 'ATTR');
	playMacro(line + '{{SAVE_TO:' + varName + '}}');
	return this.macrosFromJson;
};

/**
 * Replace variable name to value on macroline
 *
 * @since 1.0.0
 * @
 * @return Extended macros
 */
LLElement.prototype.valueFromVar = function(varName) {
	if (typeof(varName) === 'undefined') {
		logError('Couldn\'t get variable! Property name: ' + propertyName);
	}
	playMacro(this.macroLine + '{{VALUE_FROM:' + varName + '}}');
	return this.macrosFromJson;
};

// ----------------------------------------------------------------------------- 
//                                Utilities
// -----------------------------------------------------------------------------
/**
 * Get iMacro line
 *
 * @since 1.0.0
 * @return {string} iMacro line
 */
LLElement.prototype.getMacro = function() {
	return this.macroLine;
};

/**
 * Get element id
 *
 * @since 1.0.0
 * @return {String} element id
 */
LLElement.prototype.getId = function() {
	return this.macroLine.substr(this.macroLine.indexOf('ATTR=ID:')).replace('ATTR=ID:', '').replace('CONTENT=', '').trim();
};

/**
 * Check is it exists
 *
 * @since 1.0.0
 * @return {Boolean} true if exists, otherwise return false
 */
LLElement.prototype.exists = function() {
	if (id(this.getId()) !== null) {
		return true;
	}
	return false;
};

/**
 * Get HTML Element
 *
 * @since 1.0.0
 * @return {HTMLElement} HTMLElement
 */
LLElement.prototype.getElement = function() {
	return id(this.getId());
};

/**
 * Recursively concatenating a javascript function arguments
 * @param  {Array}  arguments      function arguments
 * @param  {String} [separator=''] separator between arguments
 * @return {String}                concatenated arguments
 */
function joinArguments(arguments, separator) {
	if (arguments.length === 0) {
		return "";
	}
	if (typeof(separator) === 'undefined') {
		separator = '';
	}
	return separator + Array.prototype.slice.call(arguments).join(':' + separator);
}

/**
 * Checks has given index is not out of range 
 *
 * @since 1.0.3
 * @param  {HTMLElement} element HTML Element
 * @param  {Number} index   drop-down or list-box index
 * @return {Number}         return given index if it is applicable
 */
function getApplicableIndex(element, index) {
	var availableGroupsCount = element.options.length;
	// Increase if given value == 0
	if (index == 0) index++;
	// Increase if first option is empty
	if (element.options[0].value === '') index++;
	// check index is more then available options count
	if (index <= availableGroupsCount) {
		return index;
	}
	return availableGroupsCount;
}