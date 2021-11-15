const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyByIdHandler = this.deleteReplyByIdHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;
    const addReplyUseCase = await this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute(request.payload, { threadId, commentId, owner });
    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyByIdHandler(request, h) {
    const { threadId, commentId, replyId } = request.params;
    const { id: owner } = request.auth.credentials;

    const deleteReplyUseCase = await this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute(replyId, threadId, commentId, owner);

    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
