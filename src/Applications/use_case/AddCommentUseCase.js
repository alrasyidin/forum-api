const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload, owner, threadId) {
    const newComment = new NewComment(payload);

    await this._threadRepository.getThreadById(threadId);

    const addedComment = await this._commentRepository.addCommentByThreadId(newComment, owner, threadId);
    return addedComment;
  }
}

module.exports = AddCommentUseCase;
