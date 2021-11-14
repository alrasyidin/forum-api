/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.addColumns('threads', {
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
};

exports.down = pgm => {
  pgm.dropColumns('threads', ['createdAt', 'updatedAt']);
};
