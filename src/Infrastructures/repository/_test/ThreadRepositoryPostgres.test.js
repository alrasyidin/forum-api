const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedTread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('ThreadRepoisitoryPostgres implementation', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('AddThread method', () => {
    it('Should persist thread correctly', async () => {
      // arrange
      const newThread = new NewThread({
        title: 'test',
        body: 'test',
      });

      const fakeIdGenerator = () => '123456';
      const owner = 'user-123';

      await UsersTableTestHelper.addUser({ id: owner });

      // action
      const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const addedThread = await threadRepo.addThread(newThread, owner);

      // assert
      const threads = await ThreadsTableTestHelper.findThreadById(addedThread.id);
      expect(threads).toHaveLength(1);
    });

    it('Should return added thread correctly correctly', async () => {
      // arrange
      const newThread = new NewThread({
        title: 'test',
        body: 'test',
      });

      const fakeIdGenerator = () => '123456';
      const owner = 'user-123';

      await UsersTableTestHelper.addUser({ id: owner });

      // action
      const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const addedThread = await threadRepo.addThread(newThread, owner);

      // assert

      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123456',
          title: newThread.title,
          owner,
        })
      );
    });
  });

  describe('getThreadById Method', () => {
    it('Should throw an error if thread not found', async () => {
      const threadId = 'thread-12312';

      const fakeIdGenerator = () => '123456';

      // action
      const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await expect(() => threadRepo.getThreadById(threadId)).rejects.toThrowError('Thread tidak ditemukan');
    });

    it('Should return correct thread when thread exist', async () => {
      const threadId = 'thread-123456';
      const owner = 'user-123';

      const threadPayload = {
        id: threadId,
        owner,
        title: 'test',
        body: 'test',
      };

      await UsersTableTestHelper.addUser({ id: owner, username: 'user-123' });
      await ThreadsTableTestHelper.addThread(threadPayload);

      const fakeIdGenerator = () => '123456';

      const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const detailThread = await threadRepo.getThreadById(threadId);
      await expect(threadRepo.getThreadById(threadId)).resolves.not.toThrow(NotFoundError);

      expect(detailThread).toHaveProperty('id');
      expect(detailThread.id).toEqual(threadId);
      expect(detailThread).toHaveProperty('title');
      expect(detailThread.title).toEqual(threadPayload.title);
      expect(detailThread).toHaveProperty('body');
      expect(detailThread.body).toEqual(threadPayload.body);
      expect(detailThread).toHaveProperty('username');
      expect(detailThread.username).toEqual('user-123');
      expect(detailThread).toHaveProperty('date');
    });
  });
});
