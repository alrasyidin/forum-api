const LikeOrUnlikeCommentUseCase = require('../../../../Applications/use_case/LikeOrUnlikeCommentUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeOrUnlikeCommentHandler = this.putLikeOrUnlikeCommentHandler.bind(this);
  }

  async putLikeOrUnlikeCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;

    const likeOrUnlikeCommentUseCase = await this._container.getInstance(LikeOrUnlikeCommentUseCase.name);

    await likeOrUnlikeCommentUseCase.execute({ threadId, commentId, userId: owner });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
