class AddedComment {
  constructor(payload) {
    const { id, content, owner } = this._validatePayload(payload);

    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _validatePayload(payload) {
    const { id, content, owner } = payload;

    if (!content || !id || !owner) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof id !== 'string' || typeof owner !== 'string') {
      throw new Error('ADDED_COMMENT.NOT_MEET_TYPE_SPESIFICATION');
    }

    return payload;
  }
}

module.exports = AddedComment;
