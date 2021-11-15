class DetailComment {
  constructor(payload) {
    const { id, username, content, date, isDelete, likeCount } = this._validatePayload(payload);
    this.id = id;
    this.username = username;
    this.date = date;
    this.likeCount = likeCount;
    this.content = isDelete ? '**komentar telah dihapus**' : content;
  }

  _validatePayload(payload) {
    const { id, content, username, date, isDelete, likeCount } = payload;

    if (!username || !content || !id || !date || likeCount === undefined || isDelete in payload) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof username !== 'string' ||
      typeof content !== 'string' ||
      typeof id !== 'string' ||
      typeof date !== 'string' ||
      typeof likeCount !== 'number' ||
      typeof isDelete !== 'boolean'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_TYPE_SPESIFICATION');
    }

    return payload;
  }
}

module.exports = DetailComment;
