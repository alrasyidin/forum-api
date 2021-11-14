const DetailThread = require('../DetailThread');

describe('DetailThread entities', () => {
  it('Should throw an error when payload not contain needed property', () => {
    const detailThreadPayload = {
      title: 'Apa Itu Clean Code?',
      body: 'Clean Code adalah bla bla bla bla bla bla',
      date: '2021-11-04T06:03:33.831Z',
    };

    // action and assert
    expect(() => new DetailThread(detailThreadPayload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('Should throw an error when type payload not meet spesification', () => {
    const detailThreadPayload = {
      id: 123123,
      title: 12312,
      body: true,
      date: [],
      username: new Set(),
    };

    // action and assert
    expect(() => new DetailThread(detailThreadPayload)).toThrowError('DETAIL_THREAD.NOT_MEET_TYPE_SPESIFICATION');
  });

  it('Should create added thread object correctly', () => {
    // arrange
    const detailThreadPayload = {
      id: 'thread-123',
      title: 'Apa Itu Clean Code?',
      body: 'Clean Code adalah bla bla bla bla bla bla',
      date: '2021-11-04T06:03:33.831Z',
      username: 'dicoding',
    };

    // action
    const detailThread = new DetailThread(detailThreadPayload);

    // assert
    expect(detailThread.id).toEqual(detailThreadPayload.id);
    expect(detailThread).toHaveProperty('id');
    expect(detailThread.title).toEqual(detailThreadPayload.title);
    expect(detailThread).toHaveProperty('title');
    expect(detailThread.body).toEqual(detailThreadPayload.body);
    expect(detailThread).toHaveProperty('body');
    expect(detailThread.date).toEqual(detailThreadPayload.date);
    expect(detailThread).toHaveProperty('date');
    expect(detailThread.username).toEqual(detailThreadPayload.username);
    expect(detailThread).toHaveProperty('username');
  });
});
