const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('Should return 200 and like comment', async () => {
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123456';

      await UsersTableTestHelper.addUser({
        id: owner,
        username: 'user',
        password: 'password',
      });

      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId }, owner, threadId);

      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        auth: {
          strategy: 'forum_api_jwt',
          credentials: {
            id: owner,
          },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(await LikesTableTestHelper.findLikesByCommentAndOwner(commentId, owner)).toHaveLength(1);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toBe('success');
    });
    it('Should return 200 and unlike comment', async () => {
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123456';
      const likeId = 'like-123456';

      await UsersTableTestHelper.addUser({
        id: owner,
        username: 'user',
        password: 'password',
      });

      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId }, owner, threadId);
      await LikesTableTestHelper.addLike({ id: likeId, commentId, userId: owner });
      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        auth: {
          strategy: 'forum_api_jwt',
          credentials: {
            id: owner,
          },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(await LikesTableTestHelper.findLikesByCommentAndOwner(commentId, owner)).toHaveLength(0);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toBe('success');
    });
  });
});
