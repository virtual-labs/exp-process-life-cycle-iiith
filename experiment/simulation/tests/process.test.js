import { Process } from "../src/Process";

test('adds 1 + 2 to equal 3', () => {
    const process = new Process(5)
    expect(process.pid).toBe(5);
  });