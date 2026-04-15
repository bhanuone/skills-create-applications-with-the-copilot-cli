#!/usr/bin/env node

// Supported operations:
// - addition
// - subtraction
// - multiplication
// - division

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
    default:
      throw new Error(
        `Unsupported operation: ${operation}. Use +, -, *, / or add, subtract, multiply, divide.`,
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
  if (args.length !== 3) {
    throw new Error(
      "Usage: node src/calculator.js <left> <operation> <right> or node src/calculator.js <operation> <left> <right>",
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
    "No supported operation was found. Use +, -, *, / or add, subtract, multiply, divide.",
  );
}

function runCli(args = process.argv.slice(2)) {
  const { operation, leftOperand, rightOperand } = parseCliArguments(args);
  const result = calculate(
    operation,
    parseNumber(leftOperand, "left operand"),
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
  calculate,
  normalizeOperation,
  parseCliArguments,
  runCli,
};
