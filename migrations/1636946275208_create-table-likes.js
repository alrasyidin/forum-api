/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('likes', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    id_comments: { type: 'VARCHAR(50)', notNull: true, references: 'comments', onDelete: 'cascade' },
    id_users: { type: 'VARCHAR(50)', notNull: true, references: 'users', onDelete: 'cascade' },
  });

  pgm.addConstraint('likes', 'unique_id_comments_and_id_users', 'UNIQUE(id_comments, id_users)');
};

exports.down = pgm => {
  pgm.dropConstraint('likes', 'unique_id_comments_and_id_users');
  pgm.dropTable('likes');
};
