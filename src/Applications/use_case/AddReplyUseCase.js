const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(payload, { threadId, commentId, owner }) {
    const newReply = new NewReply(payload);

    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.getOwnerByCommentId(commentId);

    const addedReply = await this._replyRepository.addReplyByCommentId(newReply, { commentId, owner });

    return addedReply;
  }
}

module.exports = AddReplyUseCase;
