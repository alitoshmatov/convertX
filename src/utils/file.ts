import { mkdirSync, existsSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { TEMP_DIR } from "./config";

if (!existsSync(TEMP_DIR)) {
  mkdirSync(TEMP_DIR, { recursive: true });
}

export function getTempPath(filename: string): string {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return join(
    TEMP_DIR,
    `${Date.now()}-${Math.random().toString(36).slice(2)}-${safe}`
  );
}

export function cleanup(...paths: string[]) {
  for (const p of paths) {
    try {
      unlinkSync(p);
    } catch {
      // ignore — file may already be deleted
    }
  }
}

export function getExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}
