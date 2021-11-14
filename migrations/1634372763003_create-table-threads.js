/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('threads', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    title: { type: 'TEXT', notNull: true },
    body: { type: 'TEXT', notNull: true },
    owner: { type: 'VARCHAR(50)', notNull: true, references: '"users"', onDelete: 'cascade' },
  });

  pgm.createIndex('threads', 'owner');
};

exports.down = pgm => {
  pgm.dropIndex('threads', 'owner');
  pgm.dropTable('threads');
};
