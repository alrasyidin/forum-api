const mapDBToModel = ({ is_delete, created_at, ...args }) => ({
  ...args,
  date: new Date(created_at).toISOString(),
  isDelete: is_delete,
});

module.exports = { mapDBToModel };
