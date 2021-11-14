/* istanbul ignore file */
const createServer = require('../src/Infrastructures/http/createServer');
const container = require('../src/Infrastructures/container');

const AuthTestHelper = {
  async getAccessToken() {
    const registerUserPayload = {
      username: 'user123',
      password: 'password',
      fullname: 'User Coba',
    };

    const loginPayload = {
      username: 'user123',
      password: 'password',
    };

    const server = await createServer(container);
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: registerUserPayload,
    });

    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: loginPayload,
    });

    const responseJson = JSON.parse(response.payload);
    return responseJson.data.accessToken;
  },
};
module.exports = AuthTestHelper;
