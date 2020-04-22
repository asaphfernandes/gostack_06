import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction, { transactionType } from '../models/Transaction';
import Category from '../models/Category';

interface TransactionRequest {
  title: string;
  value: number;
  type: transactionType;
  category: string;
}

class CreateTransactionService {
  public async execute(request: TransactionRequest): Promise<Transaction> {
    const repository = getCustomRepository(TransactionRepository);

    if (request.type !== 'income' && request.type !== 'outcome') {
      throw new AppError('Invalid type');
    }

    const balance = await repository.getBalance();
    if (request.type === 'outcome' && balance.total < request.value) {
      throw new AppError("The transaction value was can't be inserted");
    }

    const categoryRepository = getRepository(Category);
    let category = await categoryRepository.findOne({
      where: { title: request.category },
      select: ['id'],
    });

    // TODO: Move create category to new service
    if (!category) {
      const createCategory = categoryRepository.create({
        title: request.category,
      });
      await categoryRepository.save(createCategory);
      category = createCategory;
    }

    const transaction = repository.create({
      title: request.title,
      value: request.value,
      type: request.type,
      category_id: category.id,
    });

    await repository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
