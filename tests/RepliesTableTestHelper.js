/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({ id = 'reply-123', content = 'test' }, { owner = 'user-123', commentId = 'comment-123' }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5)',
      values: [id, commentId, content, owner, false],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query(`TRUNCATE TABLE replies CASCADE`);
  },

  async checkReplyWasDeleted(id) {
    const query = {
      text: 'select id FROM replies WHERE is_delete = TRUE AND id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0].id;
  },
};

module.exports = RepliesTableTestHelper;
