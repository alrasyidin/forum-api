class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const detailThread = await this._threadRepository.getThreadById(threadId);

    let commentsOnThread = await this._commentRepository.getCommentsByThreadId(threadId);

    commentsOnThread = await Promise.all(
      commentsOnThread.map(async c => {
        const replies = await this._replyRepository.getRepliesByCommentId(c.id);
        return {
          ...c,
          replies,
        };
      })
    );

    return {
      ...detailThread,
      comments: commentsOnThread,
    };
  }
}

module.exports = GetDetailThreadUseCase;
