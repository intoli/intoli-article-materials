import assert from 'assert';


// Note that all of these tests are designed to fail, so we can see the error messages!
describe('Power Assert Testing Examples', () => {
  it('check that an unexpected subtring is not found', () => {
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
});
