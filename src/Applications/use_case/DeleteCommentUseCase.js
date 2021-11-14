class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(commentId, threadId, owner) {
    await this._threadRepository.getThreadById(threadId);

    const { owner: ownerComment } = await this._commentRepository.getOwnerByCommentId(commentId);
    if (ownerComment !== owner) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_HAVE_PERMISSION_AUTHORIZATION');
    }
    const deletedId = await this._commentRepository.deleteComment(commentId);

    return deletedId;
  }
}

module.exports = DeleteCommentUseCase;
