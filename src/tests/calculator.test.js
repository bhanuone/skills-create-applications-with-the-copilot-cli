const {
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

  test("modulo returns the remainder of two numbers", () => {
    expect(modulo(10, 3)).toBe(1);
  });

  test("modulo throws on division by zero", () => {
    expect(() => modulo(10, 0)).toThrow("Modulo by zero is not allowed.");
  });

  test("power returns the base raised to the exponent", () => {
    expect(power(2, 4)).toBe(16);
  });

  test("square root returns the square root of a number", () => {
    expect(squareRoot(81)).toBe(9);
  });

  test("square root throws for negative input", () => {
    expect(() => squareRoot(-1)).toThrow(
      "Square root of a negative number is not allowed.",
    );
  });
});

describe("calculate", () => {
  test("supports the image examples", () => {
    expect(calculate("+", 2, 3)).toBe(5);
    expect(calculate("-", 10, 4)).toBe(6);
    expect(calculate("*", 45, 2)).toBe(90);
    expect(calculate("/", 20, 5)).toBe(4);
  });

  test("supports the extended operation image examples", () => {
    expect(calculate("%", 5, 2)).toBe(1);
    expect(calculate("^", 2, 3)).toBe(8);
    expect(calculate("√", 16)).toBe(4);
  });

  test("supports word-based operations", () => {
    expect(calculate("add", 8, 2)).toBe(10);
    expect(calculate("subtract", 8, 2)).toBe(6);
    expect(calculate("multiply", 8, 2)).toBe(16);
    expect(calculate("divide", 8, 2)).toBe(4);
    expect(calculate("modulo", 8, 3)).toBe(2);
    expect(calculate("power", 2, 5)).toBe(32);
  });

  test("throws for unsupported operations", () => {
    expect(() => calculate("unknown", 8, 2)).toThrow("Unsupported operation: unknown");
  });

  test("supports the new symbolic operations", () => {
    expect(calculate("%", 8, 3)).toBe(2);
    expect(calculate("^", 2, 5)).toBe(32);
    expect(calculate("sqrt", 81)).toBe(9);
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
    expect(normalizeOperation("%")).toBe("modulo");
    expect(normalizeOperation("mod")).toBe("modulo");
    expect(normalizeOperation("^")).toBe("power");
    expect(normalizeOperation("pow")).toBe("power");
    expect(normalizeOperation("sqrt")).toBe("squareRoot");
    expect(normalizeOperation("√")).toBe("squareRoot");
    expect(normalizeOperation("squareRoot")).toBe("squareRoot");
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

  test("parses unary operator operand input", () => {
    expect(parseCliArguments(["sqrt", "81"])).toEqual({
      operation: "sqrt",
      leftOperand: "81",
    });
  });

  test("parses unary symbol operator operand input", () => {
    expect(parseCliArguments(["√", "16"])).toEqual({
      operation: "√",
      leftOperand: "16",
    });
  });

  test("parses unary operand operator input", () => {
    expect(parseCliArguments(["81", "sqrt"])).toEqual({
      operation: "sqrt",
      leftOperand: "81",
    });
  });

  test("parses unary operand symbol operator input", () => {
    expect(parseCliArguments(["16", "√"])).toEqual({
      operation: "√",
      leftOperand: "16",
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

  test("supports modulo from the CLI flow", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    expect(runCli(["10", "%", "3"])).toBe(1);
    expect(logSpy).toHaveBeenCalledWith(1);

    logSpy.mockRestore();
  });

  test("supports exponentiation from the CLI flow", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    expect(runCli(["power", "2", "4"])).toBe(16);
    expect(logSpy).toHaveBeenCalledWith(16);

    logSpy.mockRestore();
  });

  test("supports square root from the CLI flow", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    expect(runCli(["sqrt", "81"])).toBe(9);
    expect(logSpy).toHaveBeenCalledWith(9);

    logSpy.mockRestore();
  });

  test("supports the square root symbol from the CLI flow", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    expect(runCli(["√", "16"])).toBe(4);
    expect(logSpy).toHaveBeenCalledWith(4);

    logSpy.mockRestore();
  });

  test("surfaces square root validation errors from the CLI flow", () => {
    expect(() => runCli(["sqrt", "-9"])).toThrow(
      "Square root of a negative number is not allowed.",
    );
  });
});
