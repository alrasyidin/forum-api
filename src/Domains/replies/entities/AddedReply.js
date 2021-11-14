class AddedReply {
  constructor(payload) {
    const { id, content, owner } = this._validatePayload(payload);

    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _validatePayload(payload) {
    const { id, content, owner } = payload;

    if (!id || !content || !owner) {
      throw new Error('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('ADDED_REPLY.NOT_MEET_TYPE_SPESIFICATION');
    }

    return payload;
  }
}

module.exports = AddedReply;
