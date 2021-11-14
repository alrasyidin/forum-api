const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('Shuold orchestrating  add reply correctly', async () => {
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const useCasePayload = {
      content: 'ini adalah balasan',
    };

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'ini sebuah balasan',
      owner,
    });

    const mockThreadRepo = new ThreadRepository();
    const mockCommentRepo = new CommentRepository();
    const mockReplyRepo = new ReplyRepository();

    mockThreadRepo.getThreadById = jest.fn().mockImplementation(() => Promise.resolve());

    mockCommentRepo.getOwnerByCommentId = jest.fn().mockImplementation(() => Promise.resolve());

    mockReplyRepo.addReplyByCommentId = jest.fn().mockImplementation(() => Promise.resolve(expectedAddedReply));

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
      replyRepository: mockReplyRepo,
    });

    const addedReply = await addReplyUseCase.execute(useCasePayload, { threadId, commentId, owner });

    expect(addedReply).toStrictEqual(expectedAddedReply);

    await expect(mockThreadRepo.getThreadById).toBeCalledWith(threadId);
    await expect(mockCommentRepo.getOwnerByCommentId).toBeCalledWith(commentId);
    await expect(mockReplyRepo.addReplyByCommentId).toBeCalledWith(useCasePayload, { commentId, owner });
  });
});
