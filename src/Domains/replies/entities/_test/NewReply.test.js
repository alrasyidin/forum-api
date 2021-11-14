const NewReply = require('../NewReply');

describe('NewReply entities', () => {
  it('Should throw an error when payload not contain needed property', () => {
    const payload = {};

    // action and assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('Should throw an error when type payload not meet spesification', () => {
    const payload = {
      content: 12312,
    };

    // action and assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_TYPE_SPESIFICATION');
  });

  it('Should create new reply object correctly', () => {
    // arrange
    const payload = {
      content:
        'Clean Code adalah kode di dalam perangkat lunak (software) yang formatnya benar dan disusun dengan baik.',
    };

    // action
    const newReply = new NewReply(payload);

    // assert
    expect(typeof newReply).toBe('object');
    expect(newReply).toHaveProperty('content');
    expect(newReply.content).toEqual(payload.content);
  });
});
