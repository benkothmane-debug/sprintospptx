// Sprint OS — generates a monochrome PNG icon (for iconColumns, callouts, exec summary chips...).
// TWO sources, in order:
//   1. BUNDLED set (assets/icon-svgs.json, ~137 curated icons, zero extra dependency) — the default.
//   2. react-icons fallback (30k+ icons) — ONLY if installed (`npm i react react-dom react-icons`, optional).
// Usage (async):
//   const makeIcon = require('./assets/icon.cjs');
//   const p = await makeIcon('FaChartLine', '5E1E9E', 'out/icons');   // -> PNG path
//   makeIcon.list()                                                   // -> names available in the bundle
// Requires only `sharp` (already a core dependency of the skill).
const path = require("path");
const fs = require("fs");

const cache = {};
let bundle = null;
const loadBundle = () => bundle || (bundle = JSON.parse(fs.readFileSync(path.join(__dirname, "icon-svgs.json"), "utf8")));

function svgFromReactIcons(name, colorHex) {
  // Optional fallback: resolve the family from the prefix (Fa, Md, Hi, Bi, Lu, Tb...)
  const fam = (name.match(/^[A-Z][a-z0-9]+/) || ["Fa"])[0].toLowerCase();
  const libMap = { fa:"fa", fa6:"fa6", md:"md", hi:"hi", hi2:"hi2", bi:"bi", lu:"lu", tb:"tb", io:"io5", io5:"io5", ri:"ri", fi:"fi", ai:"ai", bs:"bs", gi:"gi", pi:"pi" };
  const lib = libMap[fam] || "fa";
  let React, RDS, Icon;
  try {
    React = require("react"); RDS = require("react-dom/server");
    Icon = require("react-icons/" + lib)[name];
  } catch (e) {
    throw new Error("Icon '" + name + "' is not in the bundled set, and react-icons is not installed. " +
      "Either pick a bundled icon (see require('./icon.cjs').list()) or run: npm i react react-dom react-icons");
  }
  if (!Icon) throw new Error("Icon not found in react-icons/" + lib + ": " + name);
  return RDS.renderToStaticMarkup(React.createElement(Icon, { color: "#" + colorHex, size: "256" }));
}

module.exports = async function makeIcon(name, colorHex, outDir, size) {
  colorHex = (colorHex || "000000").replace("#", "");
  size = size || 256;
  outDir = outDir || path.join(process.cwd(), "icons");
  const key = name + "-" + colorHex + "-" + size;
  if (cache[key]) return cache[key];
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, key + ".png");
  if (fs.existsSync(outPath)) { cache[key] = outPath; return outPath; }

  const bundled = loadBundle()[name];
  const svg = bundled ? bundled.split("SOICON").join("#" + colorHex) : svgFromReactIcons(name, colorHex);
  const sharp = require("sharp");
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outPath);
  cache[key] = outPath;
  return outPath;
};
module.exports.list = () => Object.keys(loadBundle()).sort();
