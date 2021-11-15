const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeOrUnlikeCommentUseCase = require('../LikeOrUnlikeCommentUseCase');

describe('LikeOrUnlikeCommentUseCase', () => {
  it('Should oscrestrating the like comment correctly if like not yet exist', async () => {
    const commentId = 'comment-123456';
    const owner = 'user-123';
    const threadId = 'thread-123';
    const likeId = 'like-123';

    const mockCommentRepo = new CommentRepository();
    const mockThreadRepo = new ThreadRepository();
    const mockLikeRepo = new LikeRepository();

    mockLikeRepo.likeCommentById = jest.fn().mockImplementation(() => Promise.resolve(likeId));
    mockLikeRepo.checkLikeStatus = jest.fn().mockImplementation(() => Promise.resolve(false));
    mockCommentRepo.getOwnerByCommentId = jest.fn().mockImplementation(() => Promise.resolve({ owner }));
    mockThreadRepo.getThreadById = jest.fn().mockImplementation(() => Promise.resolve());

    const likeOrUnlikeCommentUseCase = new LikeOrUnlikeCommentUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
      likeRepository: mockLikeRepo,
    });

    await likeOrUnlikeCommentUseCase.execute({ commentId, threadId, userId: owner });

    expect(mockThreadRepo.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepo.getOwnerByCommentId).toBeCalledWith(commentId);
    expect(mockLikeRepo.checkLikeStatus).toBeCalledWith({ commentId, userId: owner });
    expect(mockLikeRepo.likeCommentById).toBeCalledWith({ commentId, userId: owner });
  });

  it('Should oscrestrating the unlike comment correctly if like exist', async () => {
    const commentId = 'comment-123456';
    const owner = 'user-123';
    const threadId = 'thread-123';
    const likeId = 'like-123';

    const mockCommentRepo = new CommentRepository();
    const mockThreadRepo = new ThreadRepository();
    const mockLikeRepo = new LikeRepository();

    mockLikeRepo.unlikeCommentById = jest.fn().mockImplementation(() => Promise.resolve(likeId));
    mockLikeRepo.checkLikeStatus = jest.fn().mockImplementation(() => Promise.resolve(true));
    mockCommentRepo.getOwnerByCommentId = jest.fn().mockImplementation(() => Promise.resolve({ owner }));
    mockThreadRepo.getThreadById = jest.fn().mockImplementation(() => Promise.resolve());

    const likeOrUnlikeCommentUseCase = new LikeOrUnlikeCommentUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
      likeRepository: mockLikeRepo,
    });

    await likeOrUnlikeCommentUseCase.execute({ commentId, threadId, userId: owner });

    expect(mockThreadRepo.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepo.getOwnerByCommentId).toBeCalledWith(commentId);
    expect(mockLikeRepo.checkLikeStatus).toBeCalledWith({ commentId, userId: owner });
    expect(mockLikeRepo.unlikeCommentById).toBeCalledWith({ commentId, userId: owner });
  });
});
