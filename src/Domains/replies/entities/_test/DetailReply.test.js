const DetailReply = require('../DetailReply');

describe('DetailReply Entities', () => {
  it('Should throw an error when payload not contain needed property', () => {
    const payload = {
      id: 'reply-123',
      content: 'ini sebuah balasan',
    };

    // action and assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('Should throw an error when type payload not meet spesification', () => {
    const payload = {
      id: 12312,
      content: 123,
      date: {},
      username: [],
      isDelete: '',
    };

    // action and assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_TYPE_SPESIFICATION');
  });

  it('Should create new reply object correctly when isDelete true', () => {
    // arrange
    const payload = {
      id: 'reply-123',
      date: new Date().toISOString(),
      content: 'ini sebuah balasan',
      username: 'user-123',
      isDelete: true,
    };

    // action
    const detailReply = new DetailReply(payload);

    // assert
    expect(typeof detailReply).toBe('object');

    expect(detailReply).toHaveProperty('id');
    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply).toHaveProperty('content');
    expect(detailReply.content).toEqual('**balasan telah dihapus**');
    expect(detailReply).toHaveProperty('username');
    expect(detailReply.username).toEqual(payload.username);
    expect(detailReply).toHaveProperty('date');
    expect(detailReply.date).toEqual(payload.date);
  });

  it('Should create new reply object correctly when isDelete false', () => {
    // arrange
    const payload = {
      id: 'reply-123',
      date: new Date().toISOString(),
      content: 'ini sebuah balasan',
      username: 'user-123',
      isDelete: false,
    };

    // action
    const detailReply = new DetailReply(payload);

    // assert
    expect(typeof detailReply).toBe('object');

    expect(detailReply).toHaveProperty('id');
    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply).toHaveProperty('content');
    expect(detailReply.content).toEqual(payload.content);
    expect(detailReply).toHaveProperty('username');
    expect(detailReply.username).toEqual(payload.username);
    expect(detailReply).toHaveProperty('date');
    expect(detailReply.date).toEqual(payload.date);
  });
});
