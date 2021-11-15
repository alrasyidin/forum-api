const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('CommentRepository Implementation', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addCommentByThreadId', () => {
    it('Should add comment correctly', async () => {
      //   arrange
      const owner = 'user-123';
      const threadId = 'thread-123';

      const useCasePayload = {
        content: 'ini sebuah comment',
      };

      const fakeIdGenerator = () => '123456';

      // action
      const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const newComment = new NewComment(useCasePayload);

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId });

      const addedComment = await commentRepo.addCommentByThreadId(newComment, owner, threadId);
      const comments = await CommentsTableTestHelper.findcommentById('comment-123456');

      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123456',
          content: useCasePayload.content,
          owner,
        })
      );
      expect(comments).toHaveLength(1);
    });
  });

  describe('deleteCommentByThreadId', () => {
    it('Should throw an error if comment not found', async () => {
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123456';

      const fakeIdGenerator = () => '123456';

      // action
      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId });

      const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // assert
      await expect(commentRepo.deleteComment(commentId)).rejects.toThrowError(NotFoundError);
    });

    it('Should delete comment correctly', async () => {
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123456';

      const fakeIdGenerator = () => '123456';

      // action
      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId }, owner, threadId);

      const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      // assert
      await expect(commentRepo.deleteComment(commentId)).resolves.not.toThrowError(NotFoundError);
      expect(await CommentsTableTestHelper.checkCommentWasDeleted(commentId)).toEqual(commentId);
    });
  });

  describe('getOnwerByCommentId', () => {
    it('Should throw an error when comment not found', async () => {
      const commentRepo = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepo.getOwnerByCommentId('comment-123456')).rejects.toThrowError('Komentar tidak ditemukan');
    });

    it('Should return owner corrcetly', async () => {
      const owner = 'user-123';

      const threadId = 'thread-123';

      const fakeIdGenerator = () => '123456';

      // action
      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: 'comment-123456' }, owner, threadId);

      const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const { owner: ownerComment } = await commentRepo.getOwnerByCommentId('comment-123456');

      expect(ownerComment).toBe(owner);
    });
  });

  describe('getCommentsByThreadId', () => {
    it('Should return correct comments base on thread id', async () => {
      const owner = 'user-123';

      const threadId = 'thread-123';

      const fakeIdGenerator = () => '123456';

      // action
      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addComment({ id: 'comment-123456' }, owner, threadId);

      const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const comments = await commentRepo.getCommentsByThreadId(threadId);
      expect(comments).toHaveLength(1);
      expect(comments[0]).toHaveProperty('id');
      expect(comments[0].id).toEqual('comment-123456');
      expect(comments[0]).toHaveProperty('username');
      expect(comments[0]).toHaveProperty('date');
      expect(comments[0]).toHaveProperty('content');
      expect(comments[0]).toHaveProperty('likeCount');
    });
  });
});
