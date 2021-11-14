exports.up = pgm => {
  pgm.createTable('replies', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    id_comments: { type: 'VARCHAR(50)', notNull: false, references: '"comments"', onDelete: 'cascade' },
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
  pgm.createIndex('replies', 'id_comments');
  pgm.createIndex('replies', 'owner');
};

exports.down = pgm => {
  pgm.dropIndex('replies', 'id_comments');
  pgm.dropIndex('replies', 'owner');
  pgm.dropTable('replies');
};
