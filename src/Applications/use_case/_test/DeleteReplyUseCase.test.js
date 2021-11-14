const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('Should throw an error if not owner', async () => {
    // arrange
    const owner = 'user-123';
    const anotherOwner = 'user-987'; // using different owner
    const commentId = 'comment-123456';
    const threadId = 'thread-123';
    const replyId = 'reply-123456';

    const mockCommentRepo = new CommentRepository();
    const mockThreadRepo = new ThreadRepository();
    const mockReplyRepo = new ReplyRepository();

    mockReplyRepo.getOwnerReplyById = jest.fn().mockImplementation(() => Promise.resolve({ owner }));
    mockCommentRepo.getOwnerByCommentId = jest.fn().mockImplementation(() => Promise.resolve({ owner: anotherOwner }));
    mockThreadRepo.getThreadById = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepo.deleteReplyById = jest.fn().mockImplementation(() => Promise.resolve(replyId));

    // action
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
      replyRepository: mockReplyRepo,
    });

    // assert
    await expect(deleteReplyUseCase.execute(replyId, threadId, commentId, anotherOwner)).rejects.toThrowError(
      AuthorizationError
    );

    expect(mockReplyRepo.getOwnerReplyById).toBeCalledWith(replyId);
    expect(mockCommentRepo.getOwnerByCommentId).not.toBeCalled();
    expect(mockThreadRepo.getThreadById).not.toBeCalled();
    expect(mockReplyRepo.deleteReplyById).not.toBeCalled();
  });

  it('Should orcrestrating the delete reply correctly', async () => {
    // arrange
    const replyId = 'reply-123456';
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const mockThreadRepo = new ThreadRepository();
    const mockCommentRepo = new CommentRepository();
    const mockReplyRepo = new ReplyRepository();

    mockReplyRepo.getOwnerReplyById = jest.fn().mockImplementation(() => Promise.resolve({ owner }));
    mockCommentRepo.getOwnerByCommentId = jest.fn().mockImplementation(() => Promise.resolve({ owner }));
    mockThreadRepo.getThreadById = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepo.deleteReplyById = jest.fn().mockImplementation(() => Promise.resolve(replyId));

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
      replyRepository: mockReplyRepo,
    });

    await deleteReplyUseCase.execute(replyId, threadId, commentId, owner);

    expect(mockCommentRepo.getOwnerByCommentId).toBeCalledWith(commentId);
    expect(mockThreadRepo.getThreadById).toBeCalledWith(threadId);
    expect(mockReplyRepo.getOwnerReplyById).toBeCalledWith(replyId);
    expect(mockReplyRepo.deleteReplyById).toBeCalledWith(replyId);
  });
});
