class DetailComment {
  constructor(payload) {
    const { id, username, content, date, isDelete } = this._validatePayload(payload);
    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDelete ? '**komentar telah dihapus**' : content;
  }

  _validatePayload(payload) {
    const { id, content, username, date, isDelete } = payload;

    if (!username || !content || !id || !date || isDelete in payload) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof username !== 'string' ||
      typeof content !== 'string' ||
      typeof id !== 'string' ||
      typeof date !== 'string' ||
      typeof isDelete !== 'boolean'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_TYPE_SPESIFICATION');
    }

    return payload;
  }
}

module.exports = DetailComment;
