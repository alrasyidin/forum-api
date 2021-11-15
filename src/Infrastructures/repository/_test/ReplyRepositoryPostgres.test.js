const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ReplyRepository Implementation', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReplyByCommentId', () => {
    it('Should add reply to comments correctly', async () => {
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const owner = 'user-123';
      const newReply = new NewReply({
        content: 'ini balasan',
      });
      const fakeIdGenerator = () => '123456';

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addComment({ id: commentId }, owner, threadId);

      const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      const addedReply = await replyRepo.addReplyByCommentId(newReply, { commentId, owner });

      const replies = await RepliesTableTestHelper.findReplyById(addedReply.id);

      expect(replies).toHaveLength(1);
      expect(addedReply).toHaveProperty('id');
      expect(addedReply).toHaveProperty('content');
      expect(addedReply).toHaveProperty('owner');
    });
  });

  describe('getRepliesByCommentId', () => {
    it('Should return replies on comment correctly', async () => {
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const owner = 'user-123';
      const replyId = 'reply-123';

      const fakeIdGenerator = () => '123456';

      const replyPayload = {
        id: replyId,
        content: 'test konten balasan',
      };

      await UsersTableTestHelper.addUser({ id: owner, username: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addComment({ id: commentId }, owner, threadId);
      await RepliesTableTestHelper.addReply(replyPayload, { commentId, owner });
      const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const replies = await replyRepo.getRepliesByCommentId(commentId);

      expect(replies).toHaveLength(1);
      expect(replies[0]).toHaveProperty('id');
      expect(replies[0].id).toEqual(replyPayload.id);
      expect(replies[0]).toHaveProperty('content');
      expect(replies[0].content).toEqual(replyPayload.content);
      expect(replies[0]).toHaveProperty('username');
      expect(replies[0].username).toEqual('user-123');
      expect(replies[0]).toHaveProperty('date');
    });
  });

  describe('deleteReplyById', () => {
    it('Should throw an error when reply not exist', async () => {
      const replyId = 'reply-123';

      const fakeIdGenerator = () => '123456';
      const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await expect(replyRepo.deleteReplyById(replyId)).rejects.toThrowError(NotFoundError);
    });

    it('Should delete reply correctly', async () => {
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const owner = 'user-123';
      const replyId = 'reply-123';

      const fakeIdGenerator = () => '123456';

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addComment({ id: commentId }, owner, threadId);
      await RepliesTableTestHelper.addReply({ id: replyId }, { owner, commentId });

      const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await expect(replyRepo.deleteReplyById(replyId)).resolves.not.toThrowError(NotFoundError);
      expect(await RepliesTableTestHelper.checkReplyWasDeleted(replyId)).toEqual(replyId);
    });
  });

  describe('getOwnerReplyById', () => {
    it('Should throw an error when reply not exist', async () => {
      const replyId = 'reply-123';

      const fakeIdGenerator = () => '123456';
      const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await expect(replyRepo.getOwnerReplyById(replyId)).rejects.toThrowError(NotFoundError);
    });

    it('Should get owner reply', async () => {
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const owner = 'user-123';
      const replyId = 'reply-123';

      const fakeIdGenerator = () => '123456';

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addComment({ id: commentId }, owner, threadId);
      await RepliesTableTestHelper.addReply({ id: replyId }, { owner, commentId });

      const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const { owner: ownerResult } = await replyRepo.getOwnerReplyById(replyId);
      expect(ownerResult).toEqual(owner);
      await expect(replyRepo.getOwnerReplyById(replyId)).resolves.not.toThrowError(NotFoundError);
    });
  });
});
