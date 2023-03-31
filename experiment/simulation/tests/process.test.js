import { Process } from "../src/Process";
import * as config from "../src/config"
const process = new Process(5);

test('Initializing process class', () => {
    expect(process.pid).toBe(5);
    expect(process.state).toBe(config.INFANT);
    expect(process.name).toBe("P5");
  });

test('checking getData method', () => {
  const data = process.getData();
  const keys = Object.keys(data);
  expect(keys).toContain("pid");
  expect(keys).toContain("state");
  expect(keys).toContain("name");
  expect(keys).toContain("history");
})

test('creating process', () => {
  process.create();
  expect(process.state).toBe(config.READY);
});

test('moving process to cpu', () => {
  process.run();
  expect(process.state).toBe(config.RUNNING);
});

test('moving process to ready', () => {
  process.ready();
  expect(process.state).toBe(config.READY);
});

test('moving process to IO', () => {
  process.moveToIO();
  expect(process.state).toBe(config.BLOCKED);
});

test('terminating process', () => {
  process.terminate();
  expect(process.state).toBe(config.TERMINATED);
});



