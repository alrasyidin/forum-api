const AddedReply = require('../AddedReply');

describe('AddedReply entities', () => {
  it('Should throw an error when payload not contain needed property', () => {
    const payload = {
      id: 'test',
      content: 'Ini sebuah balasan',
    };

    // action and assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('Should throw an error when type payload not meet spesification', () => {
    const payload = {
      id: 123123,
      content: 12312,
      owner: [],
    };

    // action and assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_TYPE_SPESIFICATION');
  });

  it('Should create added comment object correctly', () => {
    // arrange
    const payload = {
      id: 'comment-123',
      content: 'Ini sebuah balasan',
      owner: 'user-123',
    };

    // action
    const addedReply = new AddedReply(payload);

    // assert
    expect(typeof addedReply).toBe('object');
    expect(addedReply).toHaveProperty('id');
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply).toHaveProperty('content');
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply).toHaveProperty('owner');
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
