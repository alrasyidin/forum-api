const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentByThreadIdHandler = this.postCommentByThreadIdHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentByThreadIdHandler(request, h) {
    const { threadId } = request.params;
    const { id: owner } = request.auth.credentials;
    const addCommentUseCase = await this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute(request.payload, owner, threadId);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;
    const deleteCommentUseCase = await this._container.getInstance(DeleteCommentUseCase.name);

    await deleteCommentUseCase.execute(commentId, threadId, owner);

    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
