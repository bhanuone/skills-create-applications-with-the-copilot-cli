#!/usr/bin/env node

// Supported operations:
// - addition
// - subtraction
// - multiplication
// - division
// - modulo
// - exponentiation
// - square root

function addition(leftOperand, rightOperand) {
  return leftOperand + rightOperand;
}

function subtraction(leftOperand, rightOperand) {
  return leftOperand - rightOperand;
}

function multiplication(leftOperand, rightOperand) {
  return leftOperand * rightOperand;
}

function division(leftOperand, rightOperand) {
  if (rightOperand === 0) {
    throw new Error("Division by zero is not allowed.");
  }

  return leftOperand / rightOperand;
}

function modulo(leftOperand, rightOperand) {
  if (rightOperand === 0) {
    throw new Error("Modulo by zero is not allowed.");
  }

  return leftOperand % rightOperand;
}

function power(base, exponent) {
  return base ** exponent;
}

function squareRoot(value) {
  if (value < 0) {
    throw new Error("Square root of a negative number is not allowed.");
  }

  return Math.sqrt(value);
}

function normalizeOperation(token) {
  const value = String(token).toLowerCase();

  if (["+", "add", "addition"].includes(value)) {
    return "addition";
  }

  if (["-", "subtract", "subtraction"].includes(value)) {
    return "subtraction";
  }

  if (["*", "x", "×", "multiply", "multiplication"].includes(value)) {
    return "multiplication";
  }

  if (["/", "÷", "divide", "division"].includes(value)) {
    return "division";
  }

  if (["%", "mod", "modulo"].includes(value)) {
    return "modulo";
  }

  if (["^", "**", "pow", "power"].includes(value)) {
    return "power";
  }

  if (["sqrt", "√", "square-root", "squareroot"].includes(value)) {
    return "squareRoot";
  }

  return null;
}

function calculate(operation, leftOperand, rightOperand) {
  const normalizedOperation = normalizeOperation(operation);

  switch (normalizedOperation) {
    case "addition":
      return addition(leftOperand, rightOperand);
    case "subtraction":
      return subtraction(leftOperand, rightOperand);
    case "multiplication":
      return multiplication(leftOperand, rightOperand);
    case "division":
      return division(leftOperand, rightOperand);
    case "modulo":
      return modulo(leftOperand, rightOperand);
    case "power":
      return power(leftOperand, rightOperand);
    case "squareRoot":
      return squareRoot(leftOperand);
    default:
      throw new Error(
        `Unsupported operation: ${operation}. Use +, -, *, /, %, ^, sqrt or add, subtract, multiply, divide, modulo, power, squareRoot.`,
      );
  }
}

function parseNumber(value, label) {
  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    throw new Error(`Invalid ${label}: ${value}`);
  }

  return parsedValue;
}

function parseCliArguments(args) {
  if (args.length === 2) {
    const [firstArgument, secondArgument] = args;

    if (normalizeOperation(firstArgument) === "squareRoot") {
      return {
        operation: firstArgument,
        leftOperand: secondArgument,
      };
    }

    if (normalizeOperation(secondArgument) === "squareRoot") {
      return {
        operation: secondArgument,
        leftOperand: firstArgument,
      };
    }
  }

  if (args.length !== 3) {
    throw new Error(
      "Usage: node src/calculator.js <left> <operation> <right>, node src/calculator.js <operation> <left> <right>, node src/calculator.js <value> <operation>, or node src/calculator.js <operation> <value>",
    );
  }

  const [firstArgument, secondArgument, thirdArgument] = args;

  if (normalizeOperation(firstArgument)) {
    return {
      operation: firstArgument,
      leftOperand: secondArgument,
      rightOperand: thirdArgument,
    };
  }

  if (normalizeOperation(secondArgument)) {
    return {
      operation: secondArgument,
      leftOperand: firstArgument,
      rightOperand: thirdArgument,
    };
  }

  throw new Error(
    "No supported operation was found. Use +, -, *, /, %, ^, sqrt or add, subtract, multiply, divide, modulo, power, squareRoot.",
  );
}

function runCli(args = process.argv.slice(2)) {
  const { operation, leftOperand, rightOperand } = parseCliArguments(args);
  const normalizedOperation = normalizeOperation(operation);
  const parsedLeftOperand = parseNumber(
    leftOperand,
    normalizedOperation === "squareRoot" ? "value" : "left operand",
  );
  const result =
    normalizedOperation === "squareRoot"
      ? calculate(operation, parsedLeftOperand)
      : calculate(
          operation,
          parsedLeftOperand,
          parseNumber(rightOperand, "right operand"),
        );

  console.log(result);
  return result;
}

if (require.main === module) {
  try {
    runCli();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  addition,
  subtraction,
  multiplication,
  division,
  modulo,
  power,
  squareRoot,
  calculate,
  normalizeOperation,
  parseCliArguments,
  runCli,
};
