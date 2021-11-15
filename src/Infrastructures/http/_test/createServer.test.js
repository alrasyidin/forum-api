const AuthTestHelper = require('../../../../tests/AuthTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('HTTP server', () => {
  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const server = await createServer({});

    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });

    // Assert
    expect(response.statusCode).toEqual(404);
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret',
    };
    const server = await createServer({}); // fake injection

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
  });

  it('should throw an error when no credentials', async () => {
    const requestPayload = {
      title: 'test',
      body: 'test',
    };
    const server = await createServer({});

    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayload,
    });

    expect(response.statusCode).toEqual(401);
  });

  it('should handle login correctly', async () => {
    const requestPayload = {
      title: 'test',
      body: 'test',
    };

    const server = await createServer(container);
    const accessToken = await AuthTestHelper.getAccessToken();
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    expect(accessToken).toBeDefined();
    console.log(response);
    console.log(response.payload);
    const responseJson = JSON.parse(response.payload);
    console.log(responseJson);
    expect(response.statusCode).toEqual(201);
    expect(responseJson.data.addedThread).toBeDefined();
    expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
  });
});
