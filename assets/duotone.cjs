// Sprint OS — processes a photo into a dark brand-colored DUOTONE, for cover/divider backgrounds.
// Produces a dark, lightweight image consistent with the accent color, on which a light title stays readable.
// Async (sharp) -> PRE-GENERATE before the synchronous pptxgenjs build. Returns the PNG path.
//
// Usage:
//   const duotone = require('./assets/duotone.cjs');
//   const bg = await duotone('sources/photo.jpg', 'out/bg', { dark:'11151A', light:'76B900', overlay:0.55 });
//   kit.coverDark(s, { bgPath: bg, title:'…' });
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const toRGB = h => { h = String(h).replace("#", ""); return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) }; };

module.exports = async function duotone(imgPath, outDir, opts) {
  opts = opts || {};
  if (!fs.existsSync(imgPath)) throw new Error("duotone: source image not found -> " + imgPath);
  const dark = opts.dark || "11151A", light = opts.light || "2E7CF6";
  const overlay = Math.max(0, Math.min(1, opts.overlay != null ? opts.overlay : 0.55)); // dark veil (readability), clamped to [0,1]
  const W = opts.w || 1600, H = opts.h || 900;
  outDir = outDir || path.join(process.cwd(), "bg");
  const mtime = fs.statSync(imgPath).mtimeMs; // invalidates the cache if the photo changes without being renamed
  const key = "duo-" + crypto.createHash("md5").update(imgPath + mtime + dark + light + overlay + W + "x" + H).digest("hex").slice(0, 10);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, key + ".png");
  if (fs.existsSync(outPath)) return outPath;

  const sharp = require("sharp");
  const L = toRGB(light), D = toRGB(dark);
  // 1) photo -> normalized greyscale -> tinted toward the light color (highlights = accent)
  const tinted = await sharp(imgPath).resize(W, H, { fit: "cover", position: "attention" })
    .greyscale().normalise().tint(L).toBuffer();
  // 2) dark brand veil on top (darkens + unifies -> readable background for light text)
  const veil = await sharp({ create: { width: W, height: H, channels: 4, background: { r: D.r, g: D.g, b: D.b, alpha: overlay } } }).png().toBuffer();
  await sharp(tinted).composite([{ input: veil, blend: "over" }]).png().toFile(outPath);
  return outPath;
};
