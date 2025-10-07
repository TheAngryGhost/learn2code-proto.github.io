console.info("... post script loaded");

import { EditorState } from "@codemirror/state";
import {EditorView, basicSetup} from "codemirror"
import {python} from "@codemirror/lang-python"
import { oneDark } from '@codemirror/theme-one-dark';
import {autocompletion, completeFromList } from "@codemirror/autocomplete"

// List of math library completions
const mathCompletions = [
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

const container  = document.getElementById("editor-container");
const view = new EditorView({
    state: EditorState.create({
  doc: "import make\n\n",
  extensions: [basicSetup, python(), oneDark,       autocompletion({
        override: [completeFromList(mathCompletions)]
      })],
    }),
  parent: container
})

const code = view.state.doc.toString();
console.log(code);

function setEditorText(view, text) {
  view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } });
}

setEditorText(view, "new Python code")























import './index.html.css';
import 'prismjs/themes/prism-tomorrow.css'; // or prism.css, prism-okaidia.css, etc.

import { toolbox } from "./module-scripts/blocks.js";
import { keywords } from "./module-scripts/blocks.js";
import { getTheme } from "./module-scripts/themes.js";

// Blockly
import * as Blockly from 'blockly';
//import 'blockly/python'; // imports Blockly.Python generator
import {pythonGenerator} from 'blockly/python';
import '@blockly/field-grid-dropdown';
import {registerContinuousToolbox} from '@blockly/continuous-toolbox';
import {registerFieldColour} from '@blockly/field-colour';
import '@blockly/field-colour-hsv-sliders';
import 'blockly/msg/en'; // for messages

// Prism
import Prism from 'prismjs';
//import PrismPython from 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-python.js';

// CodeMirror
//import 'codemirror/lib/codemirror.css'; // CSS
//import 'codemirror/addon/hint/show-hint.css';
//import CodeMirror from 'codemirror';
////import CodeMirror from 'codemirror/lib/codemirror.js';
//import 'codemirror/addon/hint/show-hint.js';

// JSZip
import JSZip from 'jszip';

export {workspace};

//setup for blockly plugins and mods
registerContinuousToolbox();
registerFieldColour();
import { inject } from "./mods/mods.js";
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

// Initialize the line editor
const codeInput = document.getElementById("code-input");
const suggestionBox = document.getElementById("suggestion-box");
const codeEditorContainer = document.querySelector(".code-editor-container");

// Make the entire code editor pane clickable
if (codeEditorContainer && codeInput) {
    codeEditorContainer.addEventListener("click", () => {
        codeInput.focus(); // Focus the contenteditable div
    });
} else {
    console.error("Could not find code editor container or input element.");
}

let indentationLevel = 0;
let inIndentMode = false;

// Add this right after initializing codeInput
function applyInitialHighlighting() {
    const code = codeInput.innerText;
    const highlightedCode = Prism.highlight(
        code,
        Prism.languages.python,
        "python"
    );
    codeInput.innerHTML = highlightedCode;
}

// Call it when page loads and when switching to line editor
document.addEventListener("DOMContentLoaded", applyInitialHighlighting);

// Update switchEditor function
function switchEditor() {
    const blockEditor = document.getElementById("block-editor");
    const lineEditor = document.getElementById("line-editor");

    if (blockEditor.getAttribute("data-closed") === "") {
        blockEditor.setAttribute("data-closed", "true");
        lineEditor.setAttribute("data-closed", "");
        applyInitialHighlighting();
    } else {
        blockEditor.setAttribute("data-closed", "");
        lineEditor.setAttribute("data-closed", "true");
    }
}

window.switchEditor = switchEditor;

// Save code Button
function saveTextFromLineEditor() {
    const code = codeInput.innerText;
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "main.py";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
