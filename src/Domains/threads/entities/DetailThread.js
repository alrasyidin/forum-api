class DetailThread {
  constructor(payload) {
    const { id, title, body, date, username } = this._validatePayload(payload);

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
  }

  _validatePayload(payload) {
    const { id, title, body, date, username } = payload;

    if (!id || !title || !body || !date || !username) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof date !== 'string' ||
      typeof username !== 'string'
    ) {
      throw new Error('DETAIL_THREAD.NOT_MEET_TYPE_SPESIFICATION');
    }

    return payload;
  }
}

module.exports = DetailThread;
