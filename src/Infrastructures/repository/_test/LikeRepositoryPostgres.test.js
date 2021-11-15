const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('LikeRepository Implementation', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('likeCommentById', () => {
    it('Should like comment base on id', async () => {
      const owner = 'user-123';

      const threadId = 'thread-123';
      const commentId = 'comment-123456';
      const fakeIdGenerator = () => '123456';

      // action
      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addComment({ id: 'comment-123456' }, owner, threadId);

      const commentRepo = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      const { id } = await commentRepo.likeCommentById({ userId: owner, commentId });
      const like = await LikesTableTestHelper.findLikesById(id);

      expect(id).toBeDefined();
      expect(id).toEqual(like[0].id);
    });
  });

  describe('unlikeCommentById', () => {
    it('Should unlike comment base on id', async () => {
      const owner = 'user-123';

      const threadId = 'thread-123';
      const commentId = 'comment-123456';

      const fakeIdGenerator = () => '123456';

      // action
      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addComment({ id: commentId }, owner, threadId);
      await LikesTableTestHelper.addLike({ userId: owner, commentId });

      const commentRepo = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      const { id } = await commentRepo.unlikeCommentById({ userId: owner, commentId });

      const likes = await LikesTableTestHelper.findLikesById(id);

      expect(likes).toHaveLength(0);
    });
  });

  describe('checkLikeStatus', () => {
    it('Should return false if like not exists', async () => {
      const owner = 'user-123';

      const threadId = 'thread-123';
      const commentId = 'comment-123456';

      const fakeIdGenerator = () => '123456';

      // action
      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addComment({ id: 'comment-123456' }, owner, threadId);

      const commentRepo = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      const liked = await commentRepo.checkLikeStatus({ commentId, userId: owner });

      expect(liked).toEqual(false);
    });

    it('Should return true if like exists', async () => {
      const owner = 'user-123';

      const threadId = 'thread-123';
      const likeId = 'like-123';
      const commentId = 'comment-123456';
      const fakeIdGenerator = () => '123456';

      // action
      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addComment({ id: commentId }, owner, threadId);
      await LikesTableTestHelper.addLike({ id: likeId, userId: owner, commentId });

      const commentRepo = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      const liked = await commentRepo.checkLikeStatus({ commentId, userId: owner });
      expect(liked).toEqual(true);
    });
  });
});
