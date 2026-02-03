const NUMBER_PATTERN = /^-?\d+(\.\d+)?$/;

export class Interpreter {
  constructor({ input = async () => "", output = console.log } = {}) {
    this.variables = new Map();
    this.input = input;
    this.output = output;
  }

  async run(source) {
    const lines = source.split(/\r?\n/);
    for (let lineNumber = 0; lineNumber < lines.length; lineNumber += 1) {
      const raw = lines[lineNumber];
      const line = raw.trim();
      if (!line || line.startsWith("#")) {
        continue;
      }
      await this.executeLine(line, lineNumber + 1);
    }
  }

  async executeLine(line, lineNumber) {
    if (line.startsWith("print ")) {
      const expr = line.slice(6);
      const value = this.evaluateExpression(expr);
      this.output(value);
      return;
    }

    if (line.startsWith("input ")) {
      const [, name, ...promptParts] = line.split(" ");
      this.assertValidIdentifier(name, lineNumber);
      const prompt = promptParts.join(" ").trim();
      const promptText = prompt ? this.parseStringLiteral(prompt) : `${name}> `;
      const answer = await this.input(promptText);
      this.variables.set(name, answer);
      return;
    }

    if (line.startsWith("set ")) {
      const rest = line.slice(4);
      const [name, ...valueParts] = rest.split("=");
      if (!name || valueParts.length === 0) {
        throw new Error(`Line ${lineNumber}: set requires 'set name = value'.`);
      }
      const trimmedName = name.trim();
      this.assertValidIdentifier(trimmedName, lineNumber);
      const expr = valueParts.join("=").trim();
      const value = this.evaluateExpression(expr);
      this.variables.set(trimmedName, value);
      return;
    }

    if (line.startsWith("add ")) {
      const [, name, ...exprParts] = line.split(" ");
      this.assertValidIdentifier(name, lineNumber);
      const expr = exprParts.join(" ");
      const currentValue = Number(this.variables.get(name) ?? 0);
      const addValue = Number(this.evaluateExpression(expr));
      if (Number.isNaN(currentValue) || Number.isNaN(addValue)) {
        throw new Error(`Line ${lineNumber}: add requires numeric values.`);
      }
      this.variables.set(name, currentValue + addValue);
      return;
    }

    throw new Error(`Line ${lineNumber}: Unknown command '${line}'.`);
  }

  evaluateExpression(expression) {
    const tokens = this.tokenize(expression);
    if (tokens.length === 0) {
      return "";
    }
    let value = this.resolveToken(tokens[0]);
    for (let i = 1; i < tokens.length; i += 2) {
      const operator = tokens[i];
      const right = this.resolveToken(tokens[i + 1]);
      if (operator === "+") {
        if (typeof value === "number" && typeof right === "number") {
          value += right;
        } else {
          value = String(value) + String(right);
        }
      } else if (operator === "-") {
        value = Number(value) - Number(right);
      } else {
        throw new Error(`Unsupported operator '${operator}'.`);
      }
    }
    return value;
  }

  tokenize(expression) {
    const tokens = [];
    let current = "";
    let inString = false;
    for (let i = 0; i < expression.length; i += 1) {
      const char = expression[i];
      if (char === "\"") {
        current += char;
        if (inString) {
          tokens.push(current.trim());
          current = "";
        }
        inString = !inString;
        continue;
      }
      if (inString) {
        current += char;
        continue;
      }
      if (char === "+" || char === "-") {
        if (current.trim()) {
          tokens.push(current.trim());
        }
        tokens.push(char);
        current = "";
        continue;
      }
      current += char;
    }
    if (current.trim()) {
      tokens.push(current.trim());
    }
    return tokens;
  }

  resolveToken(token) {
    if (token.startsWith("\"") && token.endsWith("\"")) {
      return this.parseStringLiteral(token);
    }
    if (NUMBER_PATTERN.test(token)) {
      return Number(token);
    }
    if (this.variables.has(token)) {
      return this.variables.get(token);
    }
    return token;
  }

  parseStringLiteral(token) {
    return token.slice(1, -1);
  }

  assertValidIdentifier(name, lineNumber) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
      throw new Error(`Line ${lineNumber}: Invalid variable name '${name}'.`);
    }
  }
}
