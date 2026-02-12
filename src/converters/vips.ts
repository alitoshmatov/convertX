import { execFile as execFileOriginal } from "node:child_process";
import { ExecFileFn } from "./types";

export const properties = {
  from: {
    images: [
      "avif", "bif", "csv", "exr", "fits", "gif", "hdr.gz", "hdr", "heic",
      "heif", "img.gz", "img", "j2c", "j2k", "jp2", "jpeg", "jpx", "jxl",
      "mat", "mrxs", "ndpi", "nia.gz", "nia", "nii.gz", "nii", "pdf", "pfm",
      "pgm", "pic", "png", "ppm", "raw", "scn", "svg", "svs", "svslide",
      "szi", "tif", "tiff", "v", "vips", "vms", "vmu", "webp", "zip",
    ],
  },
  to: {
    images: [
      "avif", "dzi", "fits", "gif", "hdr.gz", "heic", "heif", "img.gz", "j2c",
      "j2k", "jp2", "jpeg", "jpx", "jxl", "mat", "nia.gz", "nia", "nii.gz",
      "nii", "png", "tiff", "vips", "webp",
    ],
  },
};

export function convert(
  filePath: string,
  fileType: string,
  convertTo: string,
  targetPath: string,
  options?: unknown,
  execFile: ExecFileFn = execFileOriginal,
): Promise<string> {
  let action = "copy";
  if (fileType === "pdf") {
    action = "pdfload";
  }

  return new Promise((resolve, reject) => {
    execFile("vips", [action, filePath, targetPath], (error, stdout, stderr) => {
      if (error) {
        reject(`error: ${error}`);
      }

      if (stdout) {
        console.log(`stdout: ${stdout}`);
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }

      resolve("Done");
    });
  });
}
