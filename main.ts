// Weirdest Job Title — one job title, written to /output/entry.txt
import { mkdirSync, writeFileSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// The title itself: a real-sounding job with one oddly specific twist.
const TITLE = "Professional Queue Stander";

function main(): void {
  // The gate accepts 1..60 characters of UTF-8 text, not only whitespace.
  const chars = [...TITLE];
  if (chars.length < 1 || chars.length > 60) {
    throw new Error(`title is ${chars.length} characters, must be 1..60`);
  }
  if (TITLE.trim() !== TITLE || TITLE.includes("\n")) {
    throw new Error("title must be a single line with no surrounding whitespace");
  }

  // An empty MAKEFUN_OUTPUT_DIR means "no override", not "the current dir".
  const outDir = process.env.MAKEFUN_OUTPUT_DIR?.trim() ? process.env.MAKEFUN_OUTPUT_DIR : "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, TITLE, "utf8");

  // Confirm the file on disk is exactly the title's bytes: stat first,
  // then read the content back and compare it character for character.
  const back = readFileSync(target, "utf8");
  if (back !== TITLE) {
    throw new Error("read-back mismatch: entry.txt does not match the title");
  }
  const size = statSync(target).size;
  if (size !== Buffer.byteLength(TITLE, "utf8")) {
    throw new Error(`entry.txt is ${size} bytes, expected ${Buffer.byteLength(TITLE, "utf8")}`);
  }
  console.log(`wrote ${Buffer.byteLength(TITLE, "utf8")} bytes to ${target}`);
}

main();
