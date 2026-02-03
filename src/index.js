#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { Interpreter } from "./interpreter.js";

const [filePath] = process.argv.slice(2);

if (!filePath) {
  console.error("Usage: easy-lang <file.easy>");
  process.exit(1);
}

const rl = createInterface({ input, output });
const interpreter = new Interpreter({
  input: async (promptText) => {
    const answer = await rl.question(promptText);
    return answer;
  },
  output: (value) => {
    output.write(`${value}\n`);
  },
});

try {
  const source = await readFile(filePath, "utf8");
  await interpreter.run(source);
  rl.close();
} catch (error) {
  rl.close();
  console.error(error.message);
  process.exit(1);
}
