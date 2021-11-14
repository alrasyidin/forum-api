const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('Should throw an error when thread not contain needed property', () => {
    // arrange
    const threadPayload = {
      title: 'test',
    };

    // action and assert
    expect(() => new NewThread(threadPayload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('Should throw an error when type thread not meet spesification', () => {
    // arrange
    const threadPayload = {
      title: 12123,
      body: [],
    };

    // action and assert
    expect(() => new NewThread(threadPayload)).toThrowError('NEW_THREAD.NOT_MEET_TYPE_SPESIFICATION');
  });

  it('Should create new thread object correctly', () => {
    // arrange
    const threadPayload = {
      title: 'Apa Itu Clean Code?',
      body: 'Ini merupakan Clean Code',
    };

    // action
    const newThread = new NewThread(threadPayload);
    // assert

    expect(newThread).toHaveProperty('title');
    expect(newThread.title).toEqual(threadPayload.title);
    expect(newThread).toHaveProperty('body');
    expect(newThread.body).toEqual(threadPayload.body);
  });
});
