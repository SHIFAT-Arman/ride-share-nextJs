import assert from "node:assert/strict";
import { zoomFrame } from "./zoom-frame.ts";

const origin = { top: 100, left: 200, width: 400, height: 200 };
const rest = zoomFrame(origin, false, { w: 1200, h: 800 });
assert.equal(rest.scale, 1);
assert.equal(rest.tx, 0);
assert.equal(rest.ty, 0);

const grown = zoomFrame(origin, true, { w: 1200, h: 800 });
assert.equal(grown.scale, 1.75);
assert.equal(grown.tx, 200);
assert.equal(grown.ty, 200);

console.log("zoom-frame.check ok");
