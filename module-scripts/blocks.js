export { toolbox };
export { keywords };
export { spacesToUnderscores };

// Blockly
import * as Blockly from 'blockly';
import {FieldGridDropdown} from '@blockly/field-grid-dropdown';
import '@blockly/continuous-toolbox';
import '@blockly/field-colour';
import {FieldColourHsvSliders} from '@blockly/field-colour-hsv-sliders';
import 'blockly/msg/en'; // for messages
import {pythonGenerator, Order} from 'blockly/python';

// Prism
//import 'prismjs';
//import 'prismjs/components/prism-python';

// CodeMirror
//import 'codemirror/lib/codemirror.css'; // CSS
//import 'codemirror/addon/hint/show-hint.css';
//import CodeMirror from 'codemirror';
//import 'codemirror/addon/hint/show-hint';

// JSZip
//import JSZip from 'jszip';


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Definitions
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const functionDefinitions = {
	"categories": [
		{
			"name": "Motors",
			"color": "#f43131",
			"blocks": [
				{
					"name": "smallmotor",
					"description": "Creates a smallmotor",
					"blockTemplate": [
						["FieldTextInput", "name", ["name"]],
						"is a smallmotor on port",
						["FieldGridDropdown", "port", [['1', '1'],['2', '2'],['3', '3'],['4', '4'],['5', '5']]],
						"{new line}",
						"in direction",
						["FieldDropdown", "direction", [['clockwise ↻', '1'],['counter-clockwise ↺', '-1']]],
					],
					"autoComplete": ".smallmotor(",
					"blockOutput": ["void"],
					"codeGenerator": function (block) {
						const text_name = spacesToUnderscores(block.getFieldValue('name'));
						const dropdown_port = block.getFieldValue('port');
						const dropdown_direction = block.getFieldValue('direction');
						const directionSnippet = (dropdown_direction == 1) ? '' : ', direction=-1';
						const code = `${text_name} = make.smallmotor(port=${dropdown_port}${directionSnippet})\n`;
						return code;
					}
				},
				{
					"name": "largemotor",
					"description": "Creates a largemotor",
					"blockTemplate": [
						["FieldTextInput", "name", ["name"]],
						"is a largemotor on port",
						["FieldGridDropdown", "port", [['6', '6'],['7', '7']]],
						"{new line}",
						"in direction",
						["FieldDropdown", "direction", [['clockwise ↻', '1'],['counter-clockwise ↺', '-1']]],
					],
					"autoComplete": ".largemotor(",
					"blockOutput": ["void"],
					"codeGenerator": function (block) {
						const text_name = spacesToUnderscores(block.getFieldValue('name'));
						const dropdown_port = block.getFieldValue('port');
						const dropdown_direction = block.getFieldValue('direction');
						const directionSnippet = (dropdown_direction == 1) ? '' : ', direction=-1';
						const code = `${text_name} = make.largemotor(port=${dropdown_port}${directionSnippet})\n`;
						return code;
					}
				},
				{
					"name": "spin",
					"description": "Spins the motor at a power until stopped.",
					"blockTemplate": [
						"Spin",
						["FieldTextInput", "name", ["name"]],
						"at",
						["FieldNumber", "power", [100, -100, 100, 0.1]],
						"power"
					],
					"autoComplete": [".spin(",".spin_back("],
					"blockOutput": ["void"],
					"codeGenerator": function (block) {
						const text_name = spacesToUnderscores(block.getFieldValue('name'));
						const number_power = block.getFieldValue('power');
						const code = `${text_name}.spin(power=${number_power})\n`;
						return code;
					}
				},
				{
					"name": "spinForTime",
					"description": "Spins the motor at a power for a time.",
					"blockTemplate": [
						"Spin",
						["FieldTextInput", "name", ["name"]],
						"at",
						["FieldNumber", "power", [100, -100, 100, 0.1]],
						"power for",
						["FieldNumber", "time", [0, 0, Infinity, 0.01]],
						"seconds"
					],
					"blockOutput": ["void"],
					"codeGenerator": function (block) {
						const text_name = spacesToUnderscores(block.getFieldValue('name'));
						const number_power = block.getFieldValue('power');
						const number_time = block.getFieldValue('time');
						const code = `${text_name}.spin(power=${number_power}, seconds=${number_time})\n`;
						return code;
					}
				},
				{
					"name": "stop",
					"description": "Stops the motor/drivetrain.",
					"blockTemplate": [
						"Stop",
						["FieldTextInput", "name", ["name"]],
					],
					"autoComplete": ".stop(",
					"blockOutput": ["void"],
					"codeGenerator": function (block) {
						const text_name = spacesToUnderscores(block.getFieldValue('name'));
						const code = `${text_name}.stop()\n`;
						return code;
					}
				}
			]
		},
				{
			"name": "Servos",
			"color": "#cc4444",
			"blocks": [
				{
					"name": "servo",
					"description": "Creates a servo",
					"blockTemplate": [
						["FieldTextInput", "name", ["name"]],
						"is a servo on port",
						["FieldGridDropdown", "port", [['1', '1'],['2', '2'],['3', '3'],['4', '4'],['5', '5']]],
					],
					"autoComplete": ".servo(",
					"blockOutput": ["void"],
					"codeGenerator": function (block) {
						const text_name = spacesToUnderscores(block.getFieldValue('name'));
						const dropdown_port = block.getFieldValue('port');
						const code = `${text_name} = make.servo(port=${dropdown_port})\n`;
						return code;
					}
				},
				{
					"name": "servoSpinTo",
					"description": "Spins the servo to angle.",
					"blockTemplate": [
						"Spin servo",
						["FieldTextInput", "name", ["name"]],
						"move to",
						["FieldNumber", "angle", [0, 0, 120, 0.1]],
					],
					"autoComplete": ".moveto(",
					"blockOutput": ["void"],
					"codeGenerator": function (block) {
						const text_name = spacesToUnderscores(block.getFieldValue('name'));
						const number_angle = block.getFieldValue('angle');
						const code = `${text_name}.moveto(angle=${number_angle})\n`;
						return code;
					}
				},
				{
					"name": "servoSpinToForTime",
					"description": "Spins the servo to angle.",
					"blockTemplate": [
						"Spin servo",
						["FieldTextInput", "name", ["name"]],
						"move to",
						["FieldNumber", "angle", [0, 0, 120, 0.1]],
						"for",
						["FieldNumber", "time", [0, 0, Infinity, 0.01]],
						"seconds"
					],
					"autoComplete": ".moveto(",
					"blockOutput": ["void"],
					"codeGenerator": function (block) {
						const text_name = spacesToUnderscores(block.getFieldValue('name'));
						const number_angle = block.getFieldValue('angle');
						const number_time = block.getFieldValue('time');
						const code = `${text_name}.moveto(angle=${number_angle},seconds=${number_time})\n`;
						return code;
					}
				}
			]
		},
		{
			"name": "Drivetrain",
			"color": "#cc5f44",
			"blocks": [
				{
					"name": "drivetrain",
					"description": "Creates a drivetrain",
					"blockTemplate": [
						["FieldTextInput", "name", ["name"]],
						"is a drivetrain from motors",
						["FieldTextInput", "left", ["left"]],
						"and",
						["FieldTextInput", "right", ["right"]],
						"{new line}",
						"in direction",
						["FieldDropdown", "direction", [['clockwise ↻', '1'],['counter-clockwise ↺', '-1']]]
					],
					"autoComplete": ".drivetrain(",
					"blockOutput": ["void"],
					"codeGenerator": function (block) {
						const text_name = spacesToUnderscores(block.getFieldValue('name'));
						const text_left = spacesToUnderscores(block.getFieldValue('left'));
						const text_right = spacesToUnderscores(block.getFieldValue('right'));
						const dropdown_direction = block.getFieldValue('direction');
						const directionSnippet = (dropdown_direction == 1) ? '' : ', direction=-1';
						const code = `${text_name} = make.drivetrain(${text_left}, ${text_right}${directionSnippet})\n`;
						return code;
					}
				},
				{
					"name": "drive",
					"description": "Drives the drivetrain at a power until stopped.",
					"blockTemplate": [
						"Drive",
						["FieldTextInput", "name", ["name"]],
						"at",
						["FieldNumber", "power", [100, -100, 100, 0.1]],
						"power"
					],
					"autoComplete": [".drive(",".drive_back("],
					"blockOutput": ["void"],
					"codeGenerator": function (block) {
						const text_name = spacesToUnderscores(block.getFieldValue('name'));
						const number_power = block.getFieldValue('power');
						const code = `${text_name}.drive(power=${number_power})\n`;
						return code;
					}
				},
				{
					"name": "driveForTime",
					"description": "Drives the drivetrain at a power for a time.",
					"blockTemplate": [
						"Drive",
						["FieldTextInput", "name", ["name"]],
						"at",
						["FieldNumber", "power", [100, -100, 100, 0.1]],
						"power for",
						["FieldNumber", "time", [0, 0, Infinity, 0.01]],
						"seconds"
					],
					"autoComplete": "",
					"blockOutput": ["void"],
					"codeGenerator": function (block) {
						const text_name = spacesToUnderscores(block.getFieldValue('name'));
						const number_power = block.getFieldValue('power');
						const number_time = block.getFieldValue('time');
						const code = `${text_name}.drive(power=${number_power}, seconds=${number_time})\n`;
						return code;
					}
				},
				{
					"name": "curve",
					"description": "Curves the drivetrain at two different powers until stopped.",
					"blockTemplate": [
						"Curve",
						["FieldTextInput", "name", ["name"]],
						"at",
						["FieldNumber", "left", [100, -100, 100, 0.1]],
						"left power and",
						["FieldNumber", "right", [100, -100, 100, 0.1]],
						"right power"
					],
					"autoComplete": [".curve(",".curve_back("],
					"blockOutput": ["void"],
					"codeGenerator": function (block) {
						const text_name = spacesToUnderscores(block.getFieldValue('name'));
						const number_left = block.getFieldValue('left');
						const number_right = block.getFieldValue('right');
						const code = `${text_name}.curve(left_power=${number_left}, right_power=${number_right})\n`;
						return code;
					}
				},
				{
					"name": "curveForTime",
					"description": "Curves the drivetrain at two different powers for a time.",
					"blockTemplate": [
						"Curve",
						["FieldTextInput", "name", ["name"]],
						"at",
						["FieldNumber", "left", [100, -100, 100, 0.1]],
						"left power and",
						["FieldNumber", "right", [100, -100, 100, 0.1]],
						"right power for",
						["FieldNumber", "time", [0, 0, Infinity, 0.01]],
						"seconds"
					],
					"autoComplete": "",
					"blockOutput": ["void"],
					"codeGenerator": function (block) {
						const text_name = spacesToUnderscores(block.getFieldValue('name'));
						const number_left = block.getFieldValue('left');
						const number_right = block.getFieldValue('right');
						const number_time = block.getFieldValue('time');
						const code = `${text_name}.curve(left_power=${number_left}, right_power=${number_right}, seconds=${number_time})\n`;
						return code;
					}
				},
				{
					"name": "turn",
					"description": "Turn the drivetrain at a power until stopped.",
					"blockTemplate": [
						"Turn",
						["FieldTextInput", "name", ["name"]],
						"at",
						["FieldNumber", "power", [100, -100, 100, 0.1]],
						"power"
					],
					"autoComplete": [".turn(",".turn_back("],
					"blockOutput": ["void"],
					"codeGenerator": function (block) {
						const text_name = spacesToUnderscores(block.getFieldValue('name'));
						const number_power = block.getFieldValue('power');
						const code = `${text_name}.turn(power=${number_power})\n`;
						return code;
					}
				},
				{
					"name": "turnForTime",
					"description": "Drives the drivetrain at a power for a time.",
					"blockTemplate": [
						"Turn",
						["FieldTextInput", "name", ["name"]],
						"at",
						["FieldNumber", "power", [100, -100, 100, 0.1]],
						"power for",
						["FieldNumber", "time", [0, 0, Infinity, 0.01]],
						"seconds"
					],
					"autoComplete": "",
					"blockOutput": ["void"],
					"codeGenerator": function (block) {
						const text_name = spacesToUnderscores(block.getFieldValue('name'));
						const number_power = block.getFieldValue('power');
						const number_time = block.getFieldValue('time');
						const code = `${text_name}.turn(power=${number_power}, seconds=${number_time})\n`;
						return code;
					}
				}
			]
		},
		{
			"name": "Sensors",
			"color": "#44cc44",
			"blocks": [
				{
					"name": "button",
					"description": "Creates a button",
					"blockTemplate": [
						["FieldTextInput", "name", ["name"]],
						"is a button on port",
						["FieldGridDropdown", "port", [['8', '8'],['9', '9']]]
					],
					"autoComplete": ".button(",
					"blockOutput": ["void"],
					"codeGenerator": function (block) {
						const text_name = spacesToUnderscores(block.getFieldValue('name'));
						const dropdown_port = block.getFieldValue('port');
						const code = `${text_name} = make.button(port=${dropdown_port})\n`;
						return code;
					}
				},
				{
					"name": "isPressed",
					"description": "Returns whether or not the button is pressed.",
					"blockTemplate": [
						["FieldTextInput", "name", ["name"]],
						"is pressed?"
					],
					"autoComplete": ".pressed(",
					"blockOutput": ["Boolean"],
					"codeGenerator": function (block) {
						const text_name = spacesToUnderscores(block.getFieldValue('name'));
						const code = `${text_name}.pressed()`;
						return [code, Order.NONE];
					}
				},
				{
					"name": "isHeld",
					"description": "Returns whether or not the button is held.",
					"blockTemplate": [
						["FieldTextInput", "name", ["name"]],
						"is held?"
					],
					"autoComplete": ".held(",
					"blockOutput": ["Boolean"],
					"codeGenerator": function (block) {
						const text_name = spacesToUnderscores(block.getFieldValue('name'));
						const code = `${text_name}.held()`;
						return [code, Order.NONE];
					}
				}
			]
		},
		{
			"name": "Time",
			"color": "#4444cc",
			"blocks": [
				{
					"name": "wait",
					"description": "Waits for the number of seconds.",
					"blockTemplate": [
						"wait",
						["FieldNumber", "time", [0, 0, Infinity, 0.01]],
						"seconds"
					],
					"autoComplete": ".wait(",
					"blockOutput": ["void"],
					"codeGenerator": function (block) {
						const number_time = block.getFieldValue('time');
						const code = `make.wait(seconds=${number_time})\n`;
						return code;
					}
				},
				{
					"name": "wait_until",
					"description": "Waits until the given action is true.",
					"blockTemplate": [
						"wait until",
						["Function", "function", 'Boolean'],
					],
					"inline": true,
					"autoComplete": ".wait_until(",
					"blockOutput": ["void"],
					"codeGenerator": function (block) {
						var value_function = pythonGenerator.valueToCode(block, 'function', Order.ATOMIC);
						let len = value_function.length;
						let functionText;
						if (len < 4)
							functionText = '()';
						else if (value_function[len - 3] == '(' && value_function[len - 2] == ')')
							functionText = value_function.replace('()', '');
						else
							functionText = `(lambda: ${value_function})`
						const code = `make.wait_until${functionText}\n`;
						return code;
					}
				},
				{
					"name": "wait_while",
					"description": "Waits while the given action is true.",
					"blockTemplate": [
						"wait while",
						["Function", "function", 'Boolean'],
					],
					"inline": true,
					"autoComplete": ".wait_while(",
					"blockOutput": ["void"],
					"codeGenerator": function (block) {
						var value_function = pythonGenerator.valueToCode(block, 'function', Order.ATOMIC);
						let len = value_function.length;
						let functionText;
						if (len < 4)
							functionText = '()';
						else if (value_function[len - 3] == '(' && value_function[len - 2] == ')')
							functionText = value_function.replace('()', '');
						else
							functionText = `(lambda: ${value_function})`
						const code = `make.wait_while${functionText}\n`;
						return code;
					}
				},
			]
		},
		//{
		//	"name": "Test Blocks",
		//	"color": "#cc6d44",
		//	"blocks": [
		//		{
		//			"name": "betterif",
		//			"description": "if statement help.",
		//			"blockTemplate": [
		//				"if",
		//				["Function", "function", ["Boolean","Any"]],
		//				"{new line}",
		//				"	then do:",
		//				["Statement", "input"],
		//			],
		//			"blockOutput": ["void"],
		//			"codeGenerator": function (block) {
		//				var value_function = python.pythonGenerator.valueToCode(block, 'function', python.Order.ATOMIC);
		//				let len = value_function.length;
		//				if (len == 0)
		//					value_function = 'False';
		//				else {
		//					value_function = value_function.replace('(','');
		//					value_function = value_function.slice(0,-1);
		//				}
		//				var input = python.pythonGenerator.statementToCode(block, 'input');
		//				if (input.length == 0) {
		//					input = '\tpass';
		//				}
		//				const code = `if ${value_function}:\n${input}\n`;
		//				return code;
		//			}
		//		},
		//		{
		//			"name": "BetterCompare",
		//			"description": "Returns whether or not the button is pressed.",
		//			"blockTemplate": [
		//				["Function", "functionA", "Any"],
		//				"{new line}",
		//				["FieldGridDropdown", "operation", [['=', '=='],['>', '>'],['<', '<'],['≠', '!='],['≥', '>='],['≤', '<=']]],
		//				["Function", "functionB", "Any"]
		//			],
		//			"blockOutput": ["Boolean"],
		//			"codeGenerator": function (block) {
		//				const operation = spacesToUnderscores(block.getFieldValue('operation'));
		//				var value_functionA_code = python.pythonGenerator.valueToCode(block, 'functionA', python.Order.ATOMIC);
		//				var value_functionB_code = python.pythonGenerator.valueToCode(block, 'functionB', python.Order.ATOMIC);
		//				if (value_functionA_code.length == 0) {
		//					value_functionA_code = '0';
		//				}
		//				if (value_functionB_code.length == 0) {
		//					value_functionB_code = '0';
		//				}
		//				let code = `${value_functionA_code} ${operation} ${value_functionB_code}`
		//				return [code, python.Order.NONE];
		//			}
		//		},
		//		{
		//			"name": "section",
		//			"description": "Returns whether or not the button is pressed.",
		//			"blockTemplate": [
		//				["FieldCheckbox", "collapsed", ["FALSE", function(newValue) {
		//				if(this.sourceBlock_){
		//					this.sourceBlock_.updateShape_(null, newValue)
		//				}}]],
		//				["FieldTextInput", "section_name", ["label"]],
		//				["FieldColourHsvSliders", "color", ["#ff0000", function(newValue) {
		//					if(this.sourceBlock_){
		//						this.sourceBlock_.updateShape_(newValue, null)
		//					}
		//				}]],
		//				["Statement", "input"],
		//			],
		//			"save": function() {
	  	//				return {
	    //					'collapsed': this.collapsed,
		//					'color': this.color,
	  	//				};
		//			},
		//			"load": function(state) {
	  	//				var color = state['color'];
	  	//				var collapsed = state['collapsed'];
	  	//				this.updateShape_(color, collapsed);
		//			},
		//			"update": function(color, collapsed) {
		//				if(color != null) {
		//					this.setColour(color == null ? "#ff0000" : color);
		//				}
		//				if (collapsed != null) {
		//					this.getInput("input").setVisible(collapsed === "FALSE")
		//					this.render()
		//				}
		//			},
		//			"blockOutput": ["void"],
		//			"codeGenerator": function (block) {
		//				function dropOneTab(str) {
    	//					return str
    	//						.split('\n')
    	//						.map(line => {
    	//						return line.slice(2);
    	//						})
    	//					.join('\n');
		//				}
		//				var raw = python.pythonGenerator.statementToCode(block, 'input');
		//				var cleaned = dropOneTab(raw);
		//				const code = `${cleaned}`;
		//				return code;
		//			}
		//		},
		//		{
		//			"name": "set_variable",
		//			"description": "Returns whether or not the button is pressed.",
		//			"blockTemplate": [
		//				["Function", "value", "Any"],
		//				"Set variable",
		//				["FieldVariable", "var_name", ["my variable"]],
		//				"to",
		//			],
		//			"inline": true,
		//			"blockOutput": ["void"],
		//			"codeGenerator": function (block) {
		//				const variableName = spacesToUnderscores(block.getField('var_name').getText())
		//				var value_functionA_code = python.pythonGenerator.valueToCode(block, "value", python.Order.ATOMIC);
		//				block.getField('var_name')
		//				if (value_functionA_code.length == 0) {
		//					value_functionA_code = '0';
		//				}
		//				console.log(variableName)
		//				console.log(value_functionA_code)
		//				let code = `${variableName} = ${value_functionA_code}`
		//				console.log(code)
		//				return code;
		//			}
		//		},
		//		{
		//			"name": "get_variable",
		//			"description": "Returns whether or not the button is pressed.",
		//			"blockTemplate": [
		//				"Get variable",
		//				["FieldVariable", "var_name", ["my variable"]],
		//			],
		//			"blockOutput": ["Any"],
		//			"codeGenerator": function (block) {
		//				const variableName = spacesToUnderscores(block.getField('var_name').getText())
		//				block.getField('var_name')
		//				let code = `${variableName}`
		//				console.log(code)
		//				return [code, python.Order.NONE];
		//			}
		//		},
		//	]
		//}
	]
};

//blockTemplate
//[Blockly Input Type, Name, (Optional) Additional Params]
/**
 * Function, Name, Type:Boolean,Number,String,Any
 * Statement, Name
 * FieldTextInput, Name, [Default Text, Validator]
 * FieldCheckbox, Name, [Default Value, Validator],
 * FieldNumber, Name, [Default Number, Min, Max, Precision, Validator],
 * FieldDropdown, Name, [[Text, Value], [Text, Value], ...]
 * FieldGridDropdown, Name, [[Text, Value], [Text, Value], ...]
 * FieldColourHsvSliders, Name, [Default Value, Validator]
 * FieldVariable, Name, [Default Value]
 */

//optional tags
/**
 * inline: bool
 * 
 * 
 */

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Block Builder
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var toolboxCategories = {
	kind: "categoryToolbox",
	contents: []
};

var keywords = [];

for (let category of functionDefinitions.categories) {
	let namesUsed = [];

	for (let block of category.blocks) {
			const blockDef = {
				init: function () {
					var dummyInput = this.appendDummyInput();
					for (let item of block.blockTemplate) {
						if (Array.isArray(item)) {
							if (item[0] === "FieldTextInput") {
								dummyInput.appendField(new Blockly.FieldTextInput(item[2][0], item[2][1]), item[1]);
							} else if (item[0] === "FieldGridDropdown") {
								dummyInput.appendField(new FieldGridDropdown(item[2]), item[1]);
							} else if (item[0] === "FieldDropdown") {
								dummyInput.appendField(new Blockly.FieldDropdown(item[2]), item[1]);
							} else if (item[0] === "FieldNumber") {
								dummyInput.appendField(new Blockly.FieldNumber(item[2][0],item[2][1],item[2][2],item[2][3],item[2][4]), item[1]);
							} else if (item[0] === "FieldCheckbox") {
								dummyInput.appendField(new Blockly.FieldCheckbox(item[2][0],item[2][1]), item[1]);
							} else if (item[0] === "FieldColourHsvSliders") {
								dummyInput.appendField(new FieldColourHsvSliders(item[2][0],item[2][1]), item[1]);
							} else if (item[0] === "FieldVariable") {
								dummyInput.appendField(new Blockly.FieldVariable(item[2][0]), item[1]);
							} else if (item[0] === "Function") {
								if (item[2] === "Any"){
									this.appendValueInput(item[1])
								} else {
									this.appendValueInput(item[1])
									.setCheck(item[2] || null)
								}
							} else if (item[0] === "Statement") {
								this.appendStatementInput(item[1])
							} else {
								console.error("Unknown item type in block template:", item);
							}
						} else if (item === "{new line}") {
							dummyInput = this.appendDummyInput();
						} else if (typeof item === 'string') {
							dummyInput.appendField(item);
						} else {
							console.error("Unknown item type in block template:", item);
						}
					}
					if (block.blockOutput[0] === "void") {
						this.setPreviousStatement(true, null);
						this.setNextStatement(true, null);
					} else {
						this.setOutput(true, block.blockOutput[0]);
					}
					this.setTooltip(block.description || '');
					this.setHelpUrl('');
					this.setColour(category.color);
					this.setInputsInline(block.inline);
				},
			saveExtraState: block.save,
			loadExtraState: block.load,
			updateShape_: block.update,
			};
		if (typeof Blockly !== "undefined" && Blockly.common && Blockly.common.defineBlocks) {
			Blockly.common.defineBlocks({ [block.name]: blockDef });
		} else if (typeof Blockly !== "undefined" && Blockly.Blocks) {
			Blockly.Blocks[block.name] = blockDef;
		} else {
			console.error("Blockly is not defined. Please ensure Blockly is loaded.");
		}
		if (block.codeGenerator) {
			pythonGenerator.forBlock[block.name] = block.codeGenerator;
		}
		namesUsed.push(block.name);
		if (Array.isArray(block.autoComplete)) {
			for (let i of block.autoComplete) {
				keywords.push(i);
			}
		} else if (typeof block.autoComplete == "string"){
			keywords.push(block.autoComplete);
		}
		
	}

	toolboxCategories.contents.push({
		kind: "category",
		name: category.name,
		colour: category.color || "#000000",
		contents: namesUsed.map(blockName => ({
			kind: 'block',
			type: blockName
		}))
	});
}


//toolboxCategories.contents.push(
//	{
//      kind: 'category',
//      name: 'Flow',
//      colour: '#e9a719',
//      contents: [
//        {
//          kind: 'block',
//          type: 'controls_if',
//        },
//        {
//          kind: 'block',
//          type: 'logic_compare',
//        },
//        {
//          kind: 'block',
//          type: 'logic_operation',
//        },
//        {
//          kind: 'block',
//          type: 'logic_negate',
//        },
//        {
//          kind: 'block',
//          type: 'logic_boolean',
//        },
//		{
//            kind: 'block',
//            type: 'controls_repeat_ext',
//            inputs: {
//                TIMES: {
//                    block: {
//                        type: 'math_number',
//                        fields: {
//                            NUM: 10,
//                        },
//                    },
//                },
//            },
//        },
//        {
//            kind: 'block',
//            type: 'controls_whileUntil',
//        },
//      ],
//    },
//);

//toolboxCategories.contents.push(
//        {
//          kind: 'category',
//          name: 'Math',
//          colour: '#cc44cc',
//          contents: [
//            {
//              kind: 'block',
//              type: 'math_number',
//              fields: {
//                NUM: 123,
//              },
//            },
//            {
//              kind: 'block',
//              type: 'math_arithmetic',
//            },
//          ],
//        }
//);

toolboxCategories.contents.push(
    {
        kind: 'category',
        name: 'Flow',
        colour: '#e7d533',
        contents: [
            {
                kind: 'block',
                type: 'controls_if',
            },
            {
                kind: 'block',
                type: 'logic_negate',
            },
            {
                kind: 'block',
                type: 'controls_repeat_ext',
                inputs: {
                    TIMES: {
                        block: {
                            type: 'math_number',
                            fields: {
                                NUM: 10,
                            },
                        },
                    },
                },
            },
            {
                kind: 'block',
                type: 'controls_whileUntil',
            },
        ],
    },
);

//toolboxCategories.contents[5].contents.push({
//    "kind": "button",
//    "text": "create variable",
//    "callbackKey": "createVariableButtonPressed"
//})

const toolbox = toolboxCategories;

function spacesToUnderscores(str) {
	return str.replace(/\s+/g, '_');
}

