const AddedThread = require('../AddedTread');

describe('AddedThread entities', () => {
  it('Should throw an error when payload not contain needed property', () => {
    const threadPayload = {
      title: 'Apa Itu Clean Code?',
    };

    // action and assert
    expect(() => new AddedThread(threadPayload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('Should throw an error when type payload not meet spesification', () => {
    const threadPayload = {
      id: 123123,
      title: 12312,
      owner: [],
    };

    // action and assert
    expect(() => new AddedThread(threadPayload)).toThrowError('ADDED_THREAD.NOT_MEET_TYPE_SPESIFICATION');
  });

  it('Should create added thread object correctly', () => {
    // arrange
    const threadPayload = {
      id: 'thread-123',
      title: 'Apa Itu Clean Code?',
      owner: 'user-123',
    };

    // action
    const addedThread = new AddedThread(threadPayload);

    // assert
    expect(addedThread).toHaveProperty('id');
    expect(addedThread.id).toEqual(threadPayload.id);
    expect(addedThread).toHaveProperty('title');
    expect(addedThread.title).toEqual(threadPayload.title);
    expect(addedThread).toHaveProperty('owner');
    expect(addedThread.owner).toEqual(threadPayload.owner);
  });
});
