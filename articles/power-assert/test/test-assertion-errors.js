import assert from 'assert';


describe('Power Assert Testing Examples', () => {
  it('fail when an unexpected subtring is found', () => {
    const result = 'Hello World';
    const unexpectedSubstring = 'World';
    assert(!result.includes(unexpectedSubstring));
  });
});
