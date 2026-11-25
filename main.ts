// Monday Morning Punchlines — entry writer.
//
// The joke lives in JOKE below. Before anything is written, the text is
// passed through a table of independent gates (CHECKS). A gate is a small
// object: a label, a predicate, and the hint shown when it fails. Adding a
// new rule means adding one row to the table, not touching the writer.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const JOKE =
  "Monday is the only day the snooze button files for overtime.";

const OUT_DIR = "/output";
const OUT_PATH = `${OUT_DIR}/entry.txt`;
const MAX_CHARS = 200;

type Gate = {
  label: string;
  passes: (text: string) => boolean;
  hint: string;
};

const CHECKS: Gate[] = [
  {
    label: "non-blank",
    passes: (text) => text.trim().length > 0,
    hint: "the joke must contain more than whitespace",
  },
  {
    label: "length",
    passes: (text) => [...text].length >= 1 && [...text].length <= MAX_CHARS,
    hint: `the joke must be 1-${MAX_CHARS} characters`,
  },
  {
    label: "single-line",
    passes: (text) => !/[\r\n]/.test(text),
    hint: "the joke must fit on one line",
  },
  {
    label: "printable-ascii",
    passes: (text) => /^[\x20-\x7E]*$/.test(text),
    hint: "the joke must be printable ASCII only",
  },
  {
    label: "about-monday",
    passes: (text) => /monday/i.test(text),
    hint: "the joke must be about Monday morning",
  },
];

function failingGates(text: string): Gate[] {
  return CHECKS.filter((gate) => !gate.passes(text));
}

function verifyRoundTrip(text: string): void {
  // Read the file back and compare byte for byte: a silent encoding or
  // newline surprise on disk must fail loudly here, not at grading time.
  const onDisk = readFileSync(OUT_PATH, "utf8");
  if (onDisk !== text) {
    throw new Error(
      `round-trip mismatch: wrote ${text.length} chars, disk holds ${onDisk.length}`,
    );
  }
  if (onDisk.endsWith("\n") || onDisk.endsWith("\r")) {
    throw new Error("round-trip mismatch: trailing newline on disk");
  }
}

function publish(text: string): void {
  const failed = failingGates(text);
  if (failed.length > 0) {
    const lines = failed.map((gate) => ` - ${gate.label}: ${gate.hint}`);
    throw new Error(`entry rejected by ${failed.length} gate(s):\n${lines.join("\n")}`);
  }
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_PATH, text, "utf8");
  verifyRoundTrip(text);
  console.log(`wrote ${[...text].length} chars to ${OUT_PATH}`);
}

publish(JOKE);
