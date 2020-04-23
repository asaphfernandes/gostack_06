import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

class ImportTransactionsService {
  async execute(): Promise<Transaction[]> {
    const repository = getCustomRepository(TransactionsRepository);
    const transactions: Transaction[] = [];

    await repository.save(transactions);
    return transactions;
  }
}

export default ImportTransactionsService;
