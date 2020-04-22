import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    let income = 0;
    let outcome = 0;

    const transactions = await this.find({ select: ['type', 'value'] });
    transactions.forEach(transaction => {
      switch (transaction.type) {
        case 'income':
          income += transaction.value;
          break;
        case 'outcome':
          outcome += transaction.value;
          break;
        default:
          throw new Error(`Invalid type (${transaction.type}) of transaction.`);
      }
    });

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
