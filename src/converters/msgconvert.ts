import { execFile as execFileOriginal } from "node:child_process";
import { ExecFileFn } from "./types";

export const properties = {
  from: {
    email: ["msg"],
  },
  to: {
    email: ["eml"],
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
  return new Promise((resolve, reject) => {
    if (fileType === "msg" && convertTo === "eml") {
      const args = ["--outfile", targetPath, filePath];

      execFile("msgconvert", args, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`msgconvert failed: ${error.message}`));
          return;
        }

        if (stderr) {
          console.warn(`msgconvert stderr: ${stderr.slice(0, 200)}`);
        }

        resolve(targetPath);
      });
    } else {
      reject(
        new Error(
          `Unsupported conversion from ${fileType} to ${convertTo}. Only MSG to EML is supported.`,
        ),
      );
    }
  });
}
