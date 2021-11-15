const LikeRepository = require('../LikeRepository');

describe('LikeRepository Interface', () => {
  it('Should throw an error when invoke implementation method', async () => {
    const likeRepository = new LikeRepository();

    await expect(likeRepository.likeCommentById({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.unlikeCommentById({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.checkLikeStatus({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
