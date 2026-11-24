// Monday, Reviewed in One Line — entry writer (program/v1).
//
// Writes exactly one line, a review of my own Monday, to
// $MAKEFUN_OUTPUT_DIR/entry.txt. Deterministic: no clock, no randomness,
// no network, no input. The text is a fixed constant, so two runs produce
// byte-identical output.
//
// The line (123 characters, one line, no trailing newline):
//   One star. Monday started with my toast landing butter-side down and
//   ended with my boss asking if I 'got a sec' at 4:59 p.m.
//
// Hard rules, learned from past entries:
//   - Write ONLY inside MAKEFUN_OUTPUT_DIR. Never a relative path, never
//     process.cwd() — a relative write is EROFS on the grader's read-only
//     filesystem and fails run_completes.
//   - Never remove or clean the output directory itself.
//   - Skip dotfiles on every copy into the output (this entry copies
//     nothing, so no dotfile can leak into /output).

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "One star. Monday started with my toast landing butter-side down and " +
  "ended with my boss asking if I 'got a sec' at 4:59 p.m.";

// Gate the entry ourselves before writing: the sealed scorer only accepts
// UTF-8 text of 1 to 200 characters, a single line, not only whitespace.
// Fail loudly here rather than ship an invalid entry.
if (ENTRY.length < 1 || ENTRY.length > 200) {
  throw new Error(`entry is ${ENTRY.length} characters, must be 1-200`);
}
if (ENTRY.includes("\n") || ENTRY.trim().length === 0) {
  throw new Error("entry must be a single non-blank line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
