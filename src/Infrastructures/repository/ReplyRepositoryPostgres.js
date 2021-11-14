const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const DetailReply = require('../../Domains/replies/entities/DetailReply');
const { mapDBToModel } = require('../utils');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReplyByCommentId(newReply, { commentId, owner }) {
    const id = `reply-${this._idGenerator(16)}`;
    const { content } = newReply;
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, commentId, content, owner, false],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT 
              r.id, r.content, u.username, r.is_delete, r.created_at 
             FROM replies r
              INNER JOIN users u ON u.id = r.owner
              WHERE r.id_comments = $1
              ORDER BY r.created_at ASC`,

      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows.map(reply => new DetailReply(mapDBToModel(reply)));
  }

  async deleteReplyById(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Balasan tidak ditemukan di komentar ini');
    }
    return result.rows[0];
  }

  async getOwnerReplyById(id) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Balasan tidak ditemukan di komentar ini');
    }
    return result.rows[0];
  }
}

module.exports = ReplyRepositoryPostgres;
