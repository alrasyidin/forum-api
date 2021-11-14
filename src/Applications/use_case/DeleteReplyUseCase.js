const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(replyId, threadId, commentId, owner) {
    const { owner: ownerReply } = await this._replyRepository.getOwnerReplyById(replyId);

    if (ownerReply !== owner) {
      throw new AuthorizationError('DELETE_REPLY_USE_CASE.NOT_HAVE_PERMISSION_AUTHORIZATION');
    }

    await this._commentRepository.getOwnerByCommentId(commentId);
    await this._threadRepository.getThreadById(threadId);
    await this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
