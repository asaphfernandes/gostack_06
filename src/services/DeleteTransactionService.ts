import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const repository = getCustomRepository(TransactionsRepository);
    const transaction = await repository.findOne(id);

    if (!transaction) {
      throw new AppError('This transaction does not exists');
    }

    await repository.delete(transaction);
  }
}

export default DeleteTransactionService;
