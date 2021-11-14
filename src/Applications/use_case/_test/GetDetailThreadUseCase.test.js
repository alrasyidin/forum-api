const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('Should oschestrating get detail thread correctly', async () => {
    const threadId = 'thread-123';
    const detailThread = new DetailThread({
      id: threadId,
      title: 'ini judul',
      body: 'ini body',
      username: 'dicoding',
      date: '2021-11-04T06:52:30.023Z',
    });

    const replies = [
      {
        id: 'reply-123456',
        username: 'ariefbrata',
        content: 'ini adalah reply',
        date: '2021-11-07T11:00:32.965Z',
      },
      {
        id: 'reply-347891',
        username: 'johndoe',
        content: 'ini reply yang lain',
        date: '2021-11-07T11:00:32.965Z',
      },
    ];

    const comments = [
      {
        id: 'comment-123456',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        replies,
      },
      {
        id: 'comment-512311',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: '**komentar telah dihapus**',
        replies,
      },
    ];

    const expectedResultDetailThread = {
      ...detailThread,
      comments,
    };

    const mockThreadRepo = new ThreadRepository();
    const mockCommentRepo = new CommentRepository();
    const mockReplyRepo = new ReplyRepository();

    mockThreadRepo.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(detailThread));
    mockCommentRepo.getCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve(comments));
    mockReplyRepo.getRepliesByCommentId = jest.fn().mockImplementation(() => Promise.resolve(replies));

    const detailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
      replyRepository: mockReplyRepo,
    });

    const detailThreadResult = await detailThreadUseCase.execute(threadId);
    expect(detailThreadResult).toStrictEqual(expectedResultDetailThread);
    expect(mockThreadRepo.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepo.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyRepo.getRepliesByCommentId).toHaveBeenNthCalledWith(1, comments[0].id);
    expect(mockReplyRepo.getRepliesByCommentId).toHaveBeenNthCalledWith(2, comments[1].id);
  });
});
