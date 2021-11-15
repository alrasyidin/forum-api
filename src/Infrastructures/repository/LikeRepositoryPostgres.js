const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async likeCommentById({ commentId, userId }) {
    const id = `like-${this._idGenerator(16)}`;

    const query = {
      text: `
        INSERT INTO likes VALUES($1, $2, $3) RETURNING id
      `,
      values: [id, commentId, userId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async unlikeCommentById({ commentId, userId }) {
    const query = {
      text: `
        DELETE FROM likes WHERE id_comments = $1 AND id_users = $2 RETURNING id
      `,
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async checkLikeStatus({ commentId, userId }) {
    const query = {
      text: `
        SELECT id FROM likes WHERE id_comments = $1 AND id_users = $2
      `,
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount) {
      const { id } = result.rows[0];
      return !!id;
    }
    return false;
  }
}

module.exports = LikeRepositoryPostgres;
