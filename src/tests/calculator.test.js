const {
  addition,
  subtraction,
  multiplication,
  division,
  calculate,
  normalizeOperation,
  parseCliArguments,
  runCli,
} = require("../calculator");

describe("calculator operations", () => {
  test("addition returns the sum of two numbers", () => {
    expect(addition(2, 3)).toBe(5);
  });

  test("subtraction returns the difference of two numbers", () => {
    expect(subtraction(10, 4)).toBe(6);
  });

  test("multiplication returns the product of two numbers", () => {
    expect(multiplication(45, 2)).toBe(90);
  });

  test("division returns the quotient of two numbers", () => {
    expect(division(20, 5)).toBe(4);
  });

  test("division throws on division by zero", () => {
    expect(() => division(10, 0)).toThrow("Division by zero is not allowed.");
  });
});

describe("calculate", () => {
  test("supports the image examples", () => {
    expect(calculate("+", 2, 3)).toBe(5);
    expect(calculate("-", 10, 4)).toBe(6);
    expect(calculate("*", 45, 2)).toBe(90);
    expect(calculate("/", 20, 5)).toBe(4);
  });

  test("supports word-based operations", () => {
    expect(calculate("add", 8, 2)).toBe(10);
    expect(calculate("subtract", 8, 2)).toBe(6);
    expect(calculate("multiply", 8, 2)).toBe(16);
    expect(calculate("divide", 8, 2)).toBe(4);
  });

  test("throws for unsupported operations", () => {
    expect(() => calculate("%", 8, 2)).toThrow("Unsupported operation: %");
  });
});

describe("normalizeOperation", () => {
  test("maps symbolic and word operators to normalized operation names", () => {
    expect(normalizeOperation("+")).toBe("addition");
    expect(normalizeOperation("addition")).toBe("addition");
    expect(normalizeOperation("-")).toBe("subtraction");
    expect(normalizeOperation("subtract")).toBe("subtraction");
    expect(normalizeOperation("*")).toBe("multiplication");
    expect(normalizeOperation("multiply")).toBe("multiplication");
    expect(normalizeOperation("/")).toBe("division");
    expect(normalizeOperation("divide")).toBe("division");
  });

  test("returns null for unknown operations", () => {
    expect(normalizeOperation("square")).toBeNull();
  });
});

describe("parseCliArguments", () => {
  test("parses operand operator operand input", () => {
    expect(parseCliArguments(["2", "+", "3"])).toEqual({
      operation: "+",
      leftOperand: "2",
      rightOperand: "3",
    });
  });

  test("parses operator operand operand input", () => {
    expect(parseCliArguments(["multiply", "6", "5"])).toEqual({
      operation: "multiply",
      leftOperand: "6",
      rightOperand: "5",
    });
  });

  test("throws when the operation is missing", () => {
    expect(() => parseCliArguments(["2", "3", "4"])).toThrow(
      "No supported operation was found.",
    );
  });

  test("throws when the wrong number of arguments is provided", () => {
    expect(() => parseCliArguments(["2", "+"])).toThrow("Usage: node src/calculator.js");
  });
});

describe("runCli", () => {
  test("returns the result and prints it", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    expect(runCli(["2", "+", "3"])).toBe(5);
    expect(logSpy).toHaveBeenCalledWith(5);

    logSpy.mockRestore();
  });

  test("supports operator-first CLI input", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    expect(runCli(["divide", "20", "5"])).toBe(4);
    expect(logSpy).toHaveBeenCalledWith(4);

    logSpy.mockRestore();
  });

  test("surfaces invalid numeric input", () => {
    expect(() => runCli(["two", "+", "3"])).toThrow("Invalid left operand: two");
  });

  test("surfaces division by zero from the CLI flow", () => {
    expect(() => runCli(["20", "/", "0"])).toThrow("Division by zero is not allowed.");
  });
});
