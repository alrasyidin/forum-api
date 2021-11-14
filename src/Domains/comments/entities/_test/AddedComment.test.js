const AddedComment = require('../AddedComment');

describe('AddedComment entities', () => {
  it('Should throw an error when payload not contain needed property', () => {
    const payload = {
      id: 'test',
      content:
        'Clean Code adalah kode di dalam perangkat lunak (software) yang formatnya benar dan disusun dengan baik.',
    };

    // action and assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('Should throw an error when type payload not meet spesification', () => {
    const payload = {
      id: 123123,
      content: 12312,
      owner: [],
    };

    // action and assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_TYPE_SPESIFICATION');
  });

  it('Should create added comment object correctly', () => {
    // arrange
    const payload = {
      id: 'comment-123',
      content:
        'Clean Code adalah kode di dalam perangkat lunak (software) yang formatnya benar dan disusun dengan baik.',
      owner: 'user-123',
    };

    // action
    const addedComment = new AddedComment(payload);

    // assert
    expect(typeof addedComment).toBe('object');
    expect(addedComment).toHaveProperty('id');
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment).toHaveProperty('content');
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment).toHaveProperty('owner');
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
