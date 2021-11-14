class AddedThread {
  constructor(payload) {
    this._validatePayload(payload);
    const { id, title, owner } = payload;

    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  _validatePayload({ id, title, owner }) {
    const values = [id, title, owner];

    values.forEach(value => {
      if (value === undefined || value === null) {
        throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      }

      if (typeof value !== 'string') {
        throw new Error('ADDED_THREAD.NOT_MEET_TYPE_SPESIFICATION');
      }
    });
  }
}

module.exports = AddedThread;
