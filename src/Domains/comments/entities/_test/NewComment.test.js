const NewComment = require('../NewComment');

describe('NewComment', () => {
  it('Should throw an error when payload not contain needed property', () => {
    const payload = {};

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('Should throw an error when payload not meet type spesification', () => {
    const payload = {
      content: 123123,
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_TYPE_SPESIFICATION');
  });

  it('Should create object new comment correctly', () => {
    const payload = {
      content: 'test',
    };

    const newComment = new NewComment(payload);
    expect(newComment).toHaveProperty('content');
    expect(newComment.content).toEqual(payload.content);
  });
});
