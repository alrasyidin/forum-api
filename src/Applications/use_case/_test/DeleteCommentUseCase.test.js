const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('Should throw an error when not owner comment', async () => {
    // arrange
    const owner = 'user-123';
    const anotherOwner = 'user-987'; // using different owner
    const commentId = 'comment-123456';
    const threadId = 'thread-123';

    const mockCommentRepo = new CommentRepository();
    const mockThreadRepo = new ThreadRepository();

    mockCommentRepo.deleteComment = jest.fn().mockImplementation(() => Promise.resolve(commentId));
    mockCommentRepo.getOwnerByCommentId = jest.fn().mockImplementation(() => Promise.resolve({ owner: anotherOwner }));
    mockThreadRepo.getThreadById = jest.fn().mockImplementation(() => Promise.resolve());

    // action
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepo,
      threadRepository: mockThreadRepo,
    });

    // assert
    await expect(deleteCommentUseCase.execute(commentId, threadId, owner)).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.NOT_HAVE_PERMISSION_AUTHORIZATION'
    );
    expect(mockCommentRepo.getOwnerByCommentId).toBeCalledWith(commentId);
    expect(mockThreadRepo.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepo.deleteComment).not.toBeCalled();
  });

  it('Should oschestrating the delete comment correctly', async () => {
    // arrange
    const commentId = 'comment-123456';
    const owner = 'user-123';
    const threadId = 'thread-123';

    const mockCommentRepo = new CommentRepository();
    const mockThreadRepo = new ThreadRepository();

    mockCommentRepo.deleteComment = jest.fn().mockImplementation(() => Promise.resolve(commentId));
    mockCommentRepo.getOwnerByCommentId = jest.fn().mockImplementation(() => Promise.resolve({ owner }));
    mockThreadRepo.getThreadById = jest.fn().mockImplementation(() => Promise.resolve());

    // action
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepo,
      threadRepository: mockThreadRepo,
    });

    const commentDeletedId = await deleteCommentUseCase.execute(commentId, threadId, owner);
    // assert
    expect(commentDeletedId).toBe(commentId);
    expect(mockThreadRepo.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepo.getOwnerByCommentId).toBeCalledWith(commentId);
    expect(mockCommentRepo.deleteComment).toBeCalledWith(commentId);
  });
});
