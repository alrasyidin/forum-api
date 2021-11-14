const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');

describe('/replies endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('When POST /threads/{threadId}/comments/{commentId}/replies request ', () => {
    it('Should return 201 and persisted replies', async () => {
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const userId = 'user-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId }, userId, threadId);

      const requestPayload = {
        content: 'Ini adalah balasan',
      };

      // action hit threads
      const server = await createServer(container);
      const response = await server.inject({
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        method: 'POST',
        payload: requestPayload,
        auth: {
          strategy: 'forum_api_jwt',
          credentials: {
            id: userId,
          },
        },
      });

      const responseJson = JSON.parse(response.payload);
      const { addedReply } = responseJson.data;
      // assert
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(addedReply).toBeDefined();
      expect(addedReply.id).toBeDefined();
      expect(addedReply.content).toBeDefined();
      expect(addedReply.content).toBe(requestPayload.content);
      expect(addedReply.owner).toBeDefined();
      expect(addedReply.owner).toBe(userId);
    });
  });
  describe('When DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId} request ', () => {
    it('Should return 200 and remove reply', async () => {
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const userId = 'user-123';
      const replyId = 'reply-123';
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId }, userId, threadId);
      await RepliesTableTestHelper.addReply({ id: replyId }, { owner: userId, commentId });

      // action hit threads
      const server = await createServer(container);
      const response = await server.inject({
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        method: 'DELETE',
        auth: {
          strategy: 'forum_api_jwt',
          credentials: {
            id: userId,
          },
        },
      });

      const responseJson = JSON.parse(response.payload);
      // assert
      expect(responseJson).toHaveProperty('status');
      expect(responseJson.status).toEqual('success');
    });
  });
});
