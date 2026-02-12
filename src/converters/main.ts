import { normalizeFiletype } from "./normalizeFiletype";

import * as inkscape from "./inkscape";
import * as libjxl from "./libjxl";
import * as resvg from "./resvg";
import * as vips from "./vips";
import * as libheif from "./libheif";
import * as xelatex from "./xelatex";
import * as calibre from "./calibre";
import * as dasel from "./dasel";
import * as libreoffice from "./libreoffice";
import * as pandoc from "./pandoc";
import * as msgconvert from "./msgconvert";
import * as dvisvgm from "./dvisvgm";
import * as imagemagick from "./imagemagick";
import * as graphicsmagick from "./graphicsmagick";
import * as assimp from "./assimp";
import * as ffmpeg from "./ffmpeg";
import * as potrace from "./potrace";
import * as vtracer from "./vtracer";
import * as vcf from "./vcf";
import * as markitdown from "./markitdown";

interface ConverterModule {
  properties: {
    from: Record<string, string[]>;
    to: Record<string, string[]>;
  };
  convert: (
    filePath: string,
    fileType: string,
    convertTo: string,
    targetPath: string,
    options?: unknown,
  ) => Promise<string>;
}

// Order matters — earlier converters are preferred when multiple support the same format pair
const converters: Record<string, ConverterModule> = {
  inkscape,
  libjxl,
  resvg,
  vips,
  libheif,
  xelatex,
  calibre,
  dasel,
  libreoffice,
  pandoc,
  msgconvert,
  dvisvgm,
  imagemagick,
  graphicsmagick,
  assimp,
  ffmpeg,
  potrace,
  vtracer,
  vcf,
  markitdown,
};

// Build lookup: inputFormat → { converterName: outputFormats[] }
const possibleTargets: Record<string, Record<string, string[]>> = {};

for (const converterName in converters) {
  const props = converters[converterName]?.properties;
  if (!props) continue;

  for (const key in props.from) {
    const fromList = props.from[key];
    const toList = props.to[key];

    if (!fromList || !toList) continue;

    for (const ext of fromList) {
      if (!possibleTargets[ext]) possibleTargets[ext] = {};
      possibleTargets[ext][converterName] = toList;
    }
  }
}

export function getPossibleTargets(from: string): Record<string, string[]> {
  const fromClean = normalizeFiletype(from);
  return possibleTargets[fromClean] || {};
}

export function getFlatTargets(from: string): string[] {
  const byConverter = getPossibleTargets(from);
  const all = new Set<string>();
  for (const formats of Object.values(byConverter)) {
    for (const f of formats) {
      all.add(f);
    }
  }
  return [...all].sort();
}

// Popular formats per category — shown first on page 1
// Only formats that exist in the available targets will be shown
const popularFormats: Record<string, string[]> = {
  image: [
    "png", "jpg", "jpeg", "webp", "gif", "pdf", "svg", "avif", "bmp",
    "tiff", "ico", "heic", "jxl", "eps", "psd",
  ],
  audio: [
    "mp3", "wav", "aac", "m4a", "ogg", "flac", "opus", "aiff", "wma",
    "ac3", "dts", "amr", "oga", "spx", "w64",
  ],
  video: [
    "mp4", "mkv", "webm", "mov", "avi", "gif", "flv", "wmv", "m4v",
    "3gp", "ogv", "ts", "mpg", "vob", "dv",
  ],
  document: [
    "pdf", "docx", "png", "jpg", "html", "txt", "odt", "epub", "rtf",
    "csv", "doc", "pptx", "markdown", "xml", "latex",
  ],
  ebook: [
    "epub", "mobi", "azw3", "pdf", "fb2", "docx", "txt", "html", "rtf",
    "htmlz", "oeb", "pdb", "lit", "lrf", "kepub.epub",
  ],
  model3d: [
    "obj", "stl", "gltf", "glb", "fbx", "dae", "3ds", "ply", "3mf",
    "stp", "json", "x", "collada", "pbrt", "assxml",
  ],
  data: [
    "json", "yaml", "toml", "csv",
  ],
  email: ["eml"],
  contacts: ["csv"],
};

// Map input extensions to their category
const extensionCategories: Record<string, string> = {};

// Images
for (const ext of [
  "jpg", "jpeg", "jfif", "png", "gif", "bmp", "webp", "svg", "svgz",
  "tiff", "tif", "ico", "heic", "heif", "avif", "jxl", "psd", "psb",
  "raw", "cr2", "cr3", "nef", "arw", "dng", "orf", "rw2", "raf",
  "eps", "ai", "xcf", "pcx", "tga", "pbm", "pgm", "ppm", "pnm",
  "exr", "hdr", "dpx", "sgi", "wbmp", "xbm", "xpm", "cur",
  "emf", "wmf", "apng", "qoi", "ora",
]) extensionCategories[ext] = "image";

// Audio
for (const ext of [
  "mp3", "wav", "aac", "m4a", "m4b", "ogg", "oga", "opus", "flac",
  "wma", "aiff", "aif", "ac3", "dts", "amr", "au", "gsm",
  "mka", "wv", "ape", "tak", "shn", "caf", "alac",
  "ilbc", "sbc", "mlp", "thd", "dtshd", "eac3",
]) extensionCategories[ext] = "audio";

// Video
for (const ext of [
  "mp4", "mkv", "avi", "webm", "mov", "flv", "wmv", "m4v", "3gp",
  "3g2", "ogv", "ts", "m2ts", "mts", "mpg", "mpeg", "vob", "dv",
  "mxf", "f4v", "rm", "asf", "swf", "divx", "m2v",
]) extensionCategories[ext] = "video";

// Documents
for (const ext of [
  "pdf", "doc", "docx", "docm", "dot", "dotx", "odt", "ott", "rtf",
  "txt", "html", "htm", "xhtml", "xml", "csv", "tsv", "tab",
  "epub", "fodt", "pages", "wps", "wpd", "sdw", "sxw",
  "markdown", "md", "latex", "tex", "rst", "org", "textile",
  "json", "ipynb", "pptx",
]) extensionCategories[ext] = "document";

// Ebooks
for (const ext of [
  "epub", "mobi", "azw3", "azw4", "fb2", "lit", "lrf", "pdb",
  "rb", "snb", "tcr", "cbr", "cbz", "cbt", "cba", "cb7", "djvu",
  "recipe", "htlz", "pml",
]) extensionCategories[ext] = "ebook";

// 3D models
for (const ext of [
  "stl", "obj", "fbx", "gltf", "glb", "dae", "3ds", "3mf", "ply",
  "blend", "step", "stp", "iges", "usd", "usda", "usdc", "usdz",
  "x3d", "x3db", "wrl", "amf", "bvh", "ifc",
]) extensionCategories[ext] = "model3d";

// Data formats
for (const ext of ["yaml", "toml", "json", "xml", "csv"])
  extensionCategories[ext] = "data";

// Email
extensionCategories["msg"] = "email";

// Contacts
extensionCategories["vcf"] = "contacts";

function detectCategory(ext: string): string {
  return extensionCategories[ext.toLowerCase()] || "unknown";
}

/**
 * Returns targets sorted with popular formats first.
 * Popular formats are filtered to only include those actually available.
 */
export function getSmartTargets(from: string): string[] {
  const allTargets = getFlatTargets(from);
  if (allTargets.length === 0) return [];

  const normalized = normalizeFiletype(from);
  const category = detectCategory(normalized);
  const popular = popularFormats[category] || [];

  // Filter popular to only those actually available, preserving curated order
  const availableSet = new Set(allTargets);
  const topFormats = popular.filter((f) => availableSet.has(f));

  // Remaining formats alphabetically, excluding those already in top
  const topSet = new Set(topFormats);
  const rest = allTargets.filter((f) => !topSet.has(f));

  return [...topFormats, ...rest];
}

export async function mainConverter(
  filePath: string,
  fileType: string,
  convertTo: string,
  targetPath: string,
): Promise<string> {
  const normalized = normalizeFiletype(fileType);

  // Find a converter that supports this from→to pair in the same category
  for (const converterName in converters) {
    const conv = converters[converterName];
    if (!conv) continue;

    for (const key in conv.properties.from) {
      if (
        conv.properties.from[key]?.includes(normalized) &&
        conv.properties.to[key]?.includes(convertTo)
      ) {
        const result = await conv.convert(filePath, normalized, convertTo, targetPath);
        console.log(
          `Converted ${filePath} from ${normalized} to ${convertTo} using ${converterName}.`,
        );
        return result;
      }
    }
  }

  throw new Error(`No converter found for ${normalized} → ${convertTo}`);
}
