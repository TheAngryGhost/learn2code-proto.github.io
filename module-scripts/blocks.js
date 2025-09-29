export { toolbox };
export { keywords };
export { spacesToUnderscores };

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Definitions
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const functionDefinitions = {
	"categories": [
		{
			"name": "Motors",
			"color": "#cc4444",
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
					"blockOutput": ["void", null],
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
					"blockOutput": ["void", null],
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
					"blockOutput": ["void", null],
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
					"blockOutput": ["void", null],
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
					"blockOutput": ["void", null],
					"codeGenerator": function (block) {
						const text_name = spacesToUnderscores(block.getFieldValue('name'));
						const code = `${text_name}.stop()\n`;
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
					"blockOutput": ["void", null],
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
					"blockOutput": ["void", null],
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
					"blockOutput": ["void", null],
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
					"blockOutput": ["void", null],
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
					"blockOutput": ["void", null],
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
					"blockOutput": ["void", null],
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
					"blockOutput": ["void", null],
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
					"blockOutput": ["void", null],
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
					"blockOutput": ["Boolean", null],
					"codeGenerator": function (block) {
						const text_name = spacesToUnderscores(block.getFieldValue('name'));
						const code = `${text_name}.pressed()`;
						return [code, python.Order.NONE];
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
					"blockOutput": ["void", null],
					"codeGenerator": function (block) {
						const number_time = block.getFieldValue('time');
						const code = `make.wait(seconds=${number_time})\n`;
						return code;
					}
				},
				{
					"name": "until",
					"description": "Waits until the given action is true.",
					"blockTemplate": [
						"wait until",
						["Function", "function", 'Boolean'],
					],
					"blockOutput": ["void", null],
					"codeGenerator": function (block) {
						var value_function = python.pythonGenerator.valueToCode(block, 'function', python.Order.ATOMIC);
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
					"name": "betterif", //this is a test block please remove this later
					"description": "if statement help.",
					"blockTemplate": [
						"if",
						["Function", "function", 'Boolean'],
						"{new line}",
						"	then do:",
						["Statement", "input"],
					],
					"blockOutput": ["void", null],
					"codeGenerator": function (block) {
						var value_function = python.pythonGenerator.valueToCode(block, 'function', python.Order.ATOMIC);
						let len = value_function.length;
						if (len == 0)
							value_function = 'False';
						else {
							value_function = value_function.replace('(','');
							value_function = value_function.slice(0,-1);
						}
						var input = python.pythonGenerator.statementToCode(block, 'input');
						if (input.length == 0) {
							input = '    pass';
						}
						const code = `if ${value_function}:\n${input}\n`;
						return code;
					}
				},
			]
		}
	]
};

//[Blockly Input Type, Name, (Optional) Additional Params]
/**
 * Function, Name, [Type:Boolean,Number,String,Any]
 * Statement, Name
 * FieldTextInput, Name, [Default Text]
 * FieldNumber
 * FieldDropdown, Name, [[Text, Value], [Text, Value], ...]
 * FieldGridDropdown, Name, [[Text, Value], [Text, Value], ...]
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

	console.log(category.name, category.color);

	for (let block of category.blocks) {
			const blockDef = {
				init: function () {
					var dummyInput = this.appendDummyInput();
					for (let item of block.blockTemplate) {
						if (Array.isArray(item)) {
							if (item[0] === "FieldTextInput") {
								dummyInput.appendField(new Blockly.FieldTextInput(item[2][0]), item[1]);
							} else if (item[0] === "FieldGridDropdown") {
								dummyInput.appendField(new FieldGridDropdown(item[2]), item[1]);
							} else if (item[0] === "FieldDropdown") {
								dummyInput.appendField(new Blockly.FieldDropdown(item[2]), item[1]);
							} else if (item[0] === "FieldNumber") {
								dummyInput.appendField(new Blockly.FieldNumber(item[2][0],item[2][1],item[2][2],item[2][3],item[2][4]), item[1]);
							} else if (item[0] === "Function") {
								this.appendValueInput(item[1])
								.setCheck(item[2] || null)
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
				}
			};
		if (typeof Blockly !== "undefined" && Blockly.common && Blockly.common.defineBlocks) {
			Blockly.common.defineBlocks({ [block.name]: blockDef });
		} else if (typeof Blockly !== "undefined" && Blockly.Blocks) {
			Blockly.Blocks[block.name] = blockDef;
		} else {
			console.error("Blockly is not defined. Please ensure Blockly is loaded.");
		}
		if (typeof python !== "undefined" && python.pythonGenerator && block.codeGenerator) {
			python.pythonGenerator.forBlock[block.name] = block.codeGenerator;
		}
		namesUsed.push(block.name);
		keywords.push("." + block.name + "(");
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


toolboxCategories.contents.push(
	{
      kind: 'category',
      name: 'Flow',
      colour: '#e9a719',
      contents: [
        {
          kind: 'block',
          type: 'controls_if',
        },
        {
          kind: 'block',
          type: 'logic_compare',
        },
        {
          kind: 'block',
          type: 'logic_operation',
        },
        {
          kind: 'block',
          type: 'logic_negate',
        },
        {
          kind: 'block',
          type: 'logic_boolean',
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

toolboxCategories.contents.push(
        {
          kind: 'category',
          name: 'Math',
          colour: '#cc44cc',
          contents: [
            {
              kind: 'block',
              type: 'math_number',
              fields: {
                NUM: 123,
              },
            },
            {
              kind: 'block',
              type: 'math_arithmetic',
            },
          ],
        }
);


const toolbox = toolboxCategories;

function spacesToUnderscores(str) {
	return str.replace(/\s+/g, '_');
}

