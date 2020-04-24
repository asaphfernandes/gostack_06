import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction, { transactionType } from '../models/Transaction';
import Category from '../models/Category';
import CategoryService from './CategoryService';

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

    const categoryService = new CategoryService();
    let category = await categoryService.GetOrCreateAsync(request.category);

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
