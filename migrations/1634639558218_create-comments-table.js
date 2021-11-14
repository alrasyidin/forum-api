/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('comments', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    id_threads: { type: 'VARCHAR(50)', notNull: false, references: '"threads"', onDelete: 'cascade' },
    content: { type: 'TEXT', notNull: true },
    owner: { type: 'VARCHAR(50)', notNull: true, references: '"users"', onDelete: 'cascade' },
    is_delete: { type: 'BOOLEAN', default: false },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('comments', 'id_threads');
  pgm.createIndex('comments', 'owner');
};

exports.down = pgm => {
  pgm.dropIndex('comments', 'id_threads');
  pgm.dropIndex('comments', 'owner');

  pgm.dropTable('comments');
};
