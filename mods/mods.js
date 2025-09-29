import { ProtoRenderer } from "./proto_renderer/proto_renderer.js";

export function inject(){

    Blockly.blockRendering.register('proto_renderer', ProtoRenderer);

}