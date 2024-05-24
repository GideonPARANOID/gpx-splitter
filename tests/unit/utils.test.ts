import { getLessThanIndex } from '../../src/utils';

describe('utilst', () => {
  describe('get less than index', () => {
    it.each<[number[], number, number]>([
      [[1, 2, 3, 4], 2, 1],
      [[1, 2, 3, 4], 3, 2],
      [[1, 2, 3, 4], 4, 3],
      [[1, 1, 1, 1], 0, 0],
    ])('should return correct index', (quantities, value, expected) => {
      expect(getLessThanIndex(quantities, value)).toEqual(expected);
    });
  });
});
