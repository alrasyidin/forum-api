const AddedThread = require('../../../Domains/threads/entities/AddedTread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('Should oscrestrating the add threads correctly', async () => {
    const owner = 'user-123';
    const threadUseCasePayload = {
      title: 'test',
      body: 'test',
    };

    const addedThreadExpected = new AddedThread({
      id: 'thread-123',
      title: 'test',
      owner,
    });

    // mock object
    const mockThreadsRepo = new ThreadRepository();

    mockThreadsRepo.addThread = jest.fn().mockImplementation(() => Promise.resolve(addedThreadExpected));

    const addThreadUseCase = new AddThreadUseCase({ threadRepository: mockThreadsRepo });

    // action
    const addedThread = await addThreadUseCase.execute(threadUseCasePayload, owner);

    // assert
    expect(typeof addedThread).toBe('object');
    expect(addedThread).toStrictEqual(addedThreadExpected);
    expect(mockThreadsRepo.addThread).toBeCalledWith(new NewThread(threadUseCasePayload), owner);
  });
});
