// Monday Morning Punchlines — u-gentle-badger-68-monday-morning-punchlines-709645dc
// Writes one joke about Monday mornings to /output/entry.txt.
// Gate: UTF-8 text, 1–200 characters, a single line.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const JOKE = "Monday is the only day the snooze button files for overtime.";

function validate(text: string): void {
  if (text.length === 0 || text.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must be a single line");
  }
  if (!/^[\x00-\x7F]*$/.test(text)) {
    throw new Error("entry must be plain ASCII");
  }
  // The brief is a joke about Monday mornings: the text must say so.
  if (!/monday/i.test(text)) {
    throw new Error("entry must be a joke about Monday mornings");
  }
}

function main(): void {
  validate(JOKE);
  const outPath = "/output/entry.txt";
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JOKE, "utf8");
  // Read back and verify byte-identical output.
  const back = readFileSync(outPath, "utf8");
  if (back !== JOKE) {
    throw new Error("read-back mismatch: output differs from joke");
  }
  console.log(`wrote ${JOKE.length} chars to ${outPath}`);
}

main();
