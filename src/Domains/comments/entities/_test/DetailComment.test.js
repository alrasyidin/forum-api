const DetailComment = require('../DetailComment');

describe('DetailComment entities', () => {
  it('Should throw an error when payload not contain needed property', () => {
    const payload = {
      id: 'test',
      username: 'user',
      content:
        'Clean Code adalah kode di dalam perangkat lunak (software) yang formatnya benar dan disusun dengan baik.',
    };

    // action and assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('Should throw an error when type payload not meet spesification', () => {
    const payload = {
      id: 123123,
      content: 12312,
      username: [],
      date: true,
      isDelete: 'test',
    };

    // action and assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_TYPE_SPESIFICATION');
  });

  it('Should create detail comment object correctly when is_delete false', () => {
    // arrange
    const payload = {
      id: 'comment-123',
      content:
        'Clean Code adalah kode di dalam perangkat lunak (software) yang formatnya benar dan disusun dengan baik.',
      username: 'user-123',
      date: '2021-11-06T00:41:01.922Z',
      isDelete: false,
    };

    // action
    const detailComment = new DetailComment(payload);

    // assert
    expect(typeof detailComment).toBe('object');
    expect(detailComment).toHaveProperty('id');
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment).toHaveProperty('content');
    expect(detailComment.content).toEqual(payload.content);
    expect(detailComment).toHaveProperty('username');
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment).toHaveProperty('date');
    expect(detailComment.date).toEqual(payload.date);
  });

  it('Should create detail comment object correctly when is_delete true', () => {
    // arrange
    const payload = {
      id: 'comment-123',
      content:
        'Clean Code adalah kode di dalam perangkat lunak (software) yang formatnya benar dan disusun dengan baik.',
      username: 'user-123',
      date: '2021-11-06T00:41:01.922Z',
      isDelete: true,
    };

    // action
    const detailComment = new DetailComment(payload);

    // assert
    expect(typeof detailComment).toBe('object');
    expect(detailComment).toHaveProperty('id');
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment).toHaveProperty('content');
    expect(detailComment.content).toEqual('**komentar telah dihapus**');
    expect(detailComment).toHaveProperty('username');
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment).toHaveProperty('date');
    expect(detailComment.date).toEqual(payload.date);
  });
});
