const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('/threads endpoint', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('Should return 201 and persisted thread', async () => {
      // arrange
      const userId = 'user-123';
      await UsersTableTestHelper.addUser({ id: userId });

      const requestPayload = {
        title: 'test',
        body: 'test',
      };

      // action hit threads
      const server = await createServer(container);
      const response = await server.inject({
        url: '/threads',
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

      // assert
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('Should return 200 and detail thread', async () => {
      // arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123' }, { owner: userId, commentId });
      // action hit threads
      const server = await createServer(container);
      const response = await server.inject({
        url: `/threads/${threadId}`,
        method: 'GET',
      });

      const responseJson = JSON.parse(response.payload);

      const { thread } = responseJson?.data;
      // assert
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(thread).toBeDefined();
      expect(thread.id).toBeDefined();
      expect(thread.title).toBeDefined();
      expect(thread.body).toBeDefined();
      expect(thread.date).toBeDefined();
      expect(thread.username).toBeDefined();
      expect(thread.comments).toBeDefined();
      expect(thread.comments).toHaveLength(1);
      expect(thread.comments[0].replies).toBeDefined();
      expect(thread.comments[0].replies).toHaveLength(1);
    });
  });
});
