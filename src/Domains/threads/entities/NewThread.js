class NewThread {
  constructor(payload) {
    const { title, body } = this._validatePayload(payload);

    this.title = title;
    this.body = body;
  }

  _validatePayload(payload) {
    const { title, body } = payload;
    if (!title || !body) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_TYPE_SPESIFICATION');
    }

    return payload;
  }
}

module.exports = NewThread;
