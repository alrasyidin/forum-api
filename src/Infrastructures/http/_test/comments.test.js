const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('/comments endpoint', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('Should return 404 when thread not found', async () => {
    const owner = 'user-123';
    const threadId = 'thread-123';
    const requestPayload = {
      content: 'test',
    };

    await UsersTableTestHelper.addUser({
      id: owner,
      username: 'user',
      password: 'password',
    });

    const server = await createServer(container);
    // action hit comments
    const response = await server.inject({
      url: `/threads/${threadId}/comments`,
      method: 'POST',
      payload: requestPayload,
      auth: {
        strategy: 'forum_api_jwt',
        credentials: {
          id: owner,
        },
      },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(404);
    expect(typeof responseJson.message).toEqual('string');
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('Should return 201 and persisted comment', async () => {
      // arrange
      const owner = 'user-123';
      const threadId = 'thread-123';
      const requestPayload = {
        content: 'Ini adalah comment terbaik',
      };

      await UsersTableTestHelper.addUser({
        id: owner,
        username: 'user',
        password: 'password',
      });

      await ThreadsTableTestHelper.addThread({ id: threadId });

      // action hit comments
      const server = await createServer(container);
      const response = await server.inject({
        url: `/threads/${threadId}/comments`,
        method: 'POST',
        payload: requestPayload,
        auth: {
          strategy: 'forum_api_jwt',
          credentials: {
            id: owner,
          },
        },
      });

      const responseJson = JSON.parse(response.payload);
      // assert
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('Should return 200 and delete comment', async () => {
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
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        auth: {
          strategy: 'forum_api_jwt',
          credentials: {
            id: owner,
          },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toBe('success');
    });
  });
});
