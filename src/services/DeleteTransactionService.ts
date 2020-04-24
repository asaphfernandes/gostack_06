import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const repository = getCustomRepository(TransactionsRepository);
    const transaction = await repository.findOne(id);

    if (!transaction) {
      throw new AppError('This transaction does not exists');
    }

    await repository.createQueryBuilder()
      .delete()
      .from(Transaction)
      .where("id = :id", { id })
      .execute();
  }
}

export default DeleteTransactionService;
