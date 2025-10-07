import './index.html.css';

import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup} from "codemirror"
import {python} from "@codemirror/lang-python"
import { oneDark } from '@codemirror/theme-one-dark';
import {autocompletion, completeFromList } from "@codemirror/autocomplete"
import {defaultKeymap, indentWithTab } from "@codemirror/commands"
import { hoverTooltip } from "@codemirror/view";

import { toolbox } from "./module-scripts/blocks.js";
import { keywords } from "./module-scripts/blocks.js";
import { getTheme } from "./module-scripts/themes.js";

// Blockly
import * as Blockly from 'blockly';
import {pythonGenerator} from 'blockly/python';
import '@blockly/field-grid-dropdown';
import {registerContinuousToolbox} from '@blockly/continuous-toolbox';
import {registerFieldColour} from '@blockly/field-colour';
import '@blockly/field-colour-hsv-sliders';
import 'blockly/msg/en'; // for messages
import { inject } from "./mods/mods.js";

// Prism
import Prism from 'prismjs';
import 'prismjs/components/prism-python.js';
import 'prismjs/themes/prism-tomorrow.css';

import JSZip from 'jszip';

export {workspace};

function copyText(element) {
    window.navigator.clipboard.writeText(element.innerText);
}

window.copyText = copyText;

function saveText(element) {
    const zip = new JSZip();

    // Add the code to a file named main.py
    zip.file('main.py', element.innerText);

    // Compress the code and download it
    zip.generateAsync({ type: "base64" })
        .then((encoding) => {
            const dummyLink = document.createElement('a');
            dummyLink.download = 'proto.zip';
            dummyLink.href = 'data:application/zip;base64,' + encoding;
            dummyLink.dispatchEvent(new MouseEvent('click'));
        });
}

window.saveText = saveText;

function switchEditor() {
    document.getElementById('line-editor').toggleAttribute('data-closed');
    document.getElementById('block-editor').toggleAttribute('data-closed');
}

window.switchEditor = switchEditor;

console.info("... post script loaded");


//setup for blockly plugins and mods
registerContinuousToolbox();
registerFieldColour();
inject();

var workspace = Blockly.inject("blockly-canvas", {
    theme: getTheme(),
    toolbox: toolbox,
    //renderer: 'zelos',
    //renderer: 'thrasos',
    //renderer: 'geras',
    renderer: 'proto_renderer',
    grid:
         {spacing: 20,
          length: 3,
          colour: '#e4e4e4ff',
          snap: true},
    zoom:
         {controls: false,
          wheel: false,
          startScale: 0.8,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2,
          pinch: false},
    trashcan: true,
    plugins: {
        flyoutsVerticalToolbox: 'ContinuousFlyout',
        metricsManager: 'ContinuousMetrics',
        toolbox: 'ContinuousToolbox',
    },
});

//workspace.registerButtonCallback("createVariableButtonPressed", function () { Blockly.Variables.createVariableButtonHandler(workspace, null)})


const supportedEvents = new Set([
    Blockly.Events.BLOCK_CHANGE,
    Blockly.Events.BLOCK_CREATE,
    Blockly.Events.BLOCK_DELETE,
    Blockly.Events.BLOCK_MOVE,
]);

workspace.addChangeListener((event) => {
    if (workspace.isDragging()) return;
    if (!supportedEvents.has(event.type)) return;

    const code = pythonGenerator.workspaceToCode(workspace);
    const codeContainer = document.getElementById("line-preview-text");

    codeContainer.innerHTML = Prism.highlight(
        "import make\n\n" + code,
        Prism.languages.python,
        "python"
    );
});

//line coder

function functionInfoTooltip(view, pos) {
  const word = view.state.wordAt(pos);
  if (!word) return null;

  const hoveredText = view.state.sliceDoc(word.from, word.to);

  // Try to match by exact label or by last part (e.g. sqrt matches math.sqrt)
  const found = completions.find(c =>
    c.label === hoveredText || c.label.endsWith("." + hoveredText)
  );

  if (!found) return null;

  return {
    pos: word.from,
    end: word.to,
    create() {
      const dom = document.createElement("div");
      dom.textContent = found.info;
      dom.className = "cm-hover-info";
      return { dom };
    }
  };
}

const hoverExtension = hoverTooltip(functionInfoTooltip);

// List of math library completions
const completions = [
  { label: "math", type: "module", info: "Python math module" },
  { label: "math.sqrt", type: "function", info: "Return the square root of x" },
  { label: "math.sin", type: "function", info: "Return the sine of x (x in radians)" },
  { label: "math.cos", type: "function", info: "Return the cosine of x (x in radians)" },
  { label: "math.tan", type: "function", info: "Return the tangent of x (x in radians)" },
  { label: "math.log", type: "function", info: "Return the natural logarithm of x" },
  { label: "math.exp", type: "function", info: "Return e**x" },
  { label: "math.pi", type: "constant", info: "The mathematical constant π" },
  { label: "math.e", type: "constant", info: "Euler's number e" }
];

const codeEditorContainer = document.getElementById("code-editor-container");
const view = new EditorView({
    state: EditorState.create({
  doc: "import make\n\n",
  extensions: [basicSetup, python(), oneDark,       autocompletion({
        override: [completeFromList(completions)]
      }), hoverExtension, keymap.of([defaultKeymap, indentWithTab])],
    }),
  parent: codeEditorContainer
})

const code = view.state.doc.toString();
console.log(code);

function setEditorText(view, text) {
  view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } });
}

setEditorText(view, "import make" + "\n" +
"# name your motors!" + "\n" +
"left = make.largemotor(6)" + "\n" +
"right = make.largemotor(7)" + "\n" + "\n" +

"# spin both motors forwards" + "\n" +
"left.spin(100)" + "\n" +
"right.spin(100)" + "\n" +
"# wait for 2 seconds" + "\n" +
"make.wait(2)" + "\n" +
"# stop both motors" + "\n" +
"left.stop()" + "\n" +
"right.stop()")

if (codeEditorContainer) {
    codeEditorContainer.addEventListener("click", () => {
        view.focus();
    });
} else {
    console.error("Could not find code editor container or input element.");
}

const saveBlocksButton = document.getElementById('save-blocks-button');
saveBlocksButton.addEventListener('click', saveCodeFromBlockEditor);
function saveCodeFromBlockEditor() {
    const state = Blockly.serialization.workspaces.save(workspace);
    const jsonString = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blocks.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("Blocks saved to local storage. JSON: " + jsonString);
}
window.saveBlocksButton = saveBlocksButton;

const loadBlocksButton = document.getElementById('load-blocks-button');
loadBlocksButton.addEventListener('click', loadCodeIntoBlockEditor);
function loadCodeIntoBlockEditor() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";

    input.onchange = async event => {
        const file = event.target.files[0];
        if (!file) return; // user cancelled
        try {
            const text = await file.text();
            const state = JSON.parse(text);
            console.log("✅ Loaded state:", state);
            Blockly.serialization.workspaces.load(state, workspace);



        } catch (err) {
            console.error("Failed to read/parse JSON:", err);
            alert("Could not load the file make sure it's valid JSON.");
        }
    };

    // Programmatically trigger the file‑picker dialog
    input.click();
}
window.loadBlocksButton = loadBlocksButton;
