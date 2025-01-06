import { initialize_processes, getRandomInt, getRandomElement } from '../src/helper_functions'
import { Kernel } from '../src/Kernel'

//to check for random number generation
describe('getRandomInt', () => {
    it('should return a random number between min and max (inclusive)', () => {
      const min = 1;
      const max = 10;
      for (let i = 0; i < 100; i++) {
        const randomInt = getRandomInt(min, max);
        expect(randomInt).toBeGreaterThanOrEqual(min);
        expect(randomInt).toBeLessThanOrEqual(max);
        expect(Number.isInteger(randomInt)).toBe(true);
      }
    });
  
    it('should return min when min and max are equal', () => {
      const min = 5;
      const max = 5;
      expect(getRandomInt(min, max)).toBe(min);
    });
  
    it('should handle negative numbers', () => {
      const min = -10;
      const max = -1;
      for (let i = 0; i < 100; i++) {
        const randomInt = getRandomInt(min, max);
        expect(randomInt).toBeGreaterThanOrEqual(min);
        expect(randomInt).toBeLessThanOrEqual(max);
        expect(Number.isInteger(randomInt)).toBe(true);
      }
    });
  });
  //testing the random element genration snippet.
  test("Get random element ", () => {
    //define a random element
    const l = [0,3,4,5,6];
    const getElemnt = getRandomElement(l);
    expect(l).toContain(getElemnt)
  });
  test("To check if the the random element is 1", () => {
    const l = [1];
    const getElemnt = getRandomElement(l);
    expect(getElemnt).toEqual(1);
  });
  test("To check if it gives out undefined", () => {
    const l = [];
    const getElemnt = getRandomElement(l);
    expect(getElemnt).toBeUndefined();
  });

  