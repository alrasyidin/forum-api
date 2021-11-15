const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const { mapDBToModel } = require('../utils');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentByThreadId(newComment, owner, threadId) {
    const id = `comment-${this._idGenerator(16)}`;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) returning id, content, owner',
      values: [id, threadId, newComment.content, owner, false],
    };

    const result = await this._pool.query(query);
    return new AddedComment(result.rows[0]);
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditenukan');
    }
    return result.rows[0];
  }

  async getOwnerByCommentId(id) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
    return result.rows[0];
  }

  async getCommentsByThreadId(id) {
    const query = {
      text: `SELECT 
              c.id, u.username, c.created_at, c.content, c.is_delete, COUNT(l.id_comments)::int as "likeCount"
            FROM comments c 
              INNER JOIN users u ON c.owner = u.id
              LEFT JOIN likes l ON l.id_comments = c.id
            WHERE c.id_threads = $1
            GROUP BY
              c.id, u.username, c.created_at, c.content, c.is_delete, l.id_comments
            ORDER BY c.created_at ASC
            `,
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows.map(comment => new DetailComment(mapDBToModel(comment)));
  }
}

module.exports = CommentRepositoryPostgres;
