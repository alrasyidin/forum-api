const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository Interface', () => {
  it('Should throw an error when invoke implementation method', async () => {
    const replyRepository = new ReplyRepository();

    await expect(replyRepository.addReplyByCommentId({}, {})).rejects.toThrowError(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(replyRepository.getRepliesByCommentId('')).rejects.toThrowError(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(replyRepository.deleteReplyById('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.getOwnerReplyById('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
