import assert from 'assert';


// Note that all of these tests are designed to fail, so we can see the error messages!
describe('Power Assert Testing Examples', () => {
  it('check that an unexpected substring is not found', () => {
    const result = 'Hello World';
    const unexpectedSubstring = 'World';

    // Jest Equivalent: expect(result).toEqual(expect.not.stringContaining(unexpectedSubstring));
    assert(!result.includes(unexpectedSubstring));
  });

  it('check that no members of an array are included in another array', () => {
    const result = ['Hello', 'World'];
    const unexpectedMembers = ['Evan', 'World'];
    // Jest Equivalent: expect(result).toEqual(expect.not.arrayContaining(unexpectedMembers));
    unexpectedMembers.forEach(member =>
      assert(!result.includes(member))
    );
  });

  it('check that a regular expression matches a string', () => {
    const regex = /^Hello World!/;
    const result = 'Hello World';
    // Jest Equivalent: expect(result).toEqual(expect.stringMatching(regex));
    assert(regex.test(result));
  });

  it('check that an array contains at least one number', () => {
    const result = ['Hello', 'World'];
    // Jest Equivalent: expect(result).toContainEqual(expect.any(Number));
    assert(result.some(member => typeof member === 'number'));
  });

  it('check for deep equality between two objects', () => {
    const expectedResult = { 'a': [1, 2], 'b': [1, 2] }
    const result = { 'a': [1, 2], 'b': [1, 2, 3] }
    // Jest Equivalent: expect(result).toEqual(expectedResult);
    assert.deepEqual(result, expectedResult);
  });
});
