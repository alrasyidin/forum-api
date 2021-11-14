class NewReply {
  constructor(payload) {
    const { content } = this._validatePayload(payload);

    this.content = content;
  }

  _validatePayload(payload) {
    const { content } = payload;

    if (!content) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_TYPE_SPESIFICATION');
    }

    return payload;
  }
}

module.exports = NewReply;
