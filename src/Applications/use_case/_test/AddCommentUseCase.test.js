const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('Should orchestrating add comment correctly', async () => {
    // arrange
    const owner = 'user-123';
    const threadId = 'thread-123';
    const useCasePayload = {
      content: 'ini sebuah comment',
    };
    const expectedAddedCommnet = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner,
    });

    // action
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.addCommentByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedCommnet));
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve());

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedComment = await addCommentUseCase.execute(useCasePayload, owner, threadId);

    // assert
    expect(addedComment).toStrictEqual(expectedAddedCommnet);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.addCommentByThreadId).toBeCalledWith(new NewComment(useCasePayload), owner, threadId);
  });
});
