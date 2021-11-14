const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, owner) {
    const newThread = new NewThread(useCasePayload);
    const addedThread = await this._threadRepository.addThread(newThread, owner);
    return addedThread;
  }
}

module.exports = AddThreadUseCase;
