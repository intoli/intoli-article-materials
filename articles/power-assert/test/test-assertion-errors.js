import assert from 'assert';


// Note that all of these tests are designed to fail, so we can see the error messages!
describe('Power Assert Testing Examples', () => {
  it('check that an unexpected subtring is not found', () => {
    const result = 'Hello World';
    const unexpectedSubstring = 'World';

    // Jest Equivalent: expect(result).toEqual(expect.not.stringContaining(unexpectedSubstring));
    assert(!result.includes(unexpectedSubstring));
  });
});
