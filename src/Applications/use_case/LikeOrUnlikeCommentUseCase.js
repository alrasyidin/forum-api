class LikeOrUnlikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute({ threadId, commentId, userId }) {
    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.getOwnerByCommentId(commentId);

    const isLiked = await this._likeRepository.checkLikeStatus({ commentId, userId });

    if (!isLiked) {
      this._likeRepository.likeCommentById({ userId, commentId });
    } else {
      this._likeRepository.unlikeCommentById({ userId, commentId });
    }
  }
}

module.exports = LikeOrUnlikeCommentUseCase;
