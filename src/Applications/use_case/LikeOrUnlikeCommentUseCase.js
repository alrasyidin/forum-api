class LikeOrUnlikeCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute({ threadId, commentId, userId }) {
    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.getOwnerByCommentId(commentId);

    const isLiked = await this._commentRepository.checkLikeStatus({ commentId, userId });

    if (!isLiked) {
      this._commentRepository.likeCommentById({ userId, commentId });
    } else {
      this._commentRepository.unlikeCommentById({ userId, commentId });
    }
  }
}

module.exports = LikeOrUnlikeCommentUseCase;
