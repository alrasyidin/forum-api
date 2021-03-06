/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({ id = 'comment-123', content = 'test' }, owner = 'user-123', threadId = 'thread-123') {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5)',
      values: [id, threadId, content, owner, false],
    };

    await pool.query(query);
  },

  async findcommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query(`TRUNCATE TABLE comments CASCADE`);
  },

  async checkCommentWasDeleted(id) {
    const query = {
      text: 'select id FROM comments WHERE is_delete = TRUE AND id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0].id;
  },
};

module.exports = CommentsTableTestHelper;
