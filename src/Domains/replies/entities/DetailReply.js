class DetailReply {
  constructor(payload) {
    const { id, username, content, date, isDelete } = this._validatePayload(payload);
    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDelete ? '**balasan telah dihapus**' : content;
  }

  _validatePayload(payload) {
    const { id, content, username, date, isDelete } = payload;
    if (!id || !content || !username || !date || isDelete === undefined) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'string' ||
      typeof isDelete !== 'boolean'
    ) {
      throw new Error('DETAIL_REPLY.NOT_MEET_TYPE_SPESIFICATION');
    }

    return payload;
  }
}

module.exports = DetailReply;
