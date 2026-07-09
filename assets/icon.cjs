// Sprint OS — generates a monochrome PNG icon from react-icons (for iconColumns, callouts…).
// Usage (async):
//   const makeIcon = require('./assets/icon.cjs');
//   const p = await makeIcon('FaChartLine', '5E1E9E', 'out/icons');   // -> PNG path
//   kit.iconColumns(s, [{title:'Focus', text:'…', icon:p}], ...)
// Dependencies: react, react-dom, react-icons, sharp (installed in the skill).
const path = require("path");
const fs = require("fs");

// simple cache to avoid regenerating the same icon
const cache = {};

module.exports = async function makeIcon(name, colorHex, outDir, size) {
  colorHex = (colorHex || "000000").replace("#", "");
  size = size || 256;
  outDir = outDir || path.join(process.cwd(), "icons");
  const key = name + "-" + colorHex + "-" + size;
  if (cache[key]) return cache[key];
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, key + ".png");
  if (fs.existsSync(outPath)) { cache[key] = outPath; return outPath; }

  const React = require("react");
  const ReactDOMServer = require("react-dom/server");
  const sharp = require("sharp");
  // react-icons: resolve the family from the prefix (Fa, Md, Hi, Bi, Lu, Tb…)
  const fam = (name.match(/^[A-Z][a-z0-9]+/) || ["Fa"])[0].toLowerCase();
  const libMap = { fa:"fa", fa6:"fa6", md:"md", hi:"hi", hi2:"hi2", bi:"bi", lu:"lu", tb:"tb", io:"io5", io5:"io5", ri:"ri", fi:"fi", ai:"ai", bs:"bs", gi:"gi", pi:"pi" };
  const lib = libMap[fam] || "fa";
  let Icon;
  try { Icon = require("react-icons/" + lib)[name]; } catch (e) { Icon = null; }
  if (!Icon) throw new Error("Icon not found: " + name + " (lib react-icons/" + lib + ")");
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Icon, { color: "#" + colorHex, size: String(size) })
  );
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  cache[key] = outPath;
  return outPath;
};
