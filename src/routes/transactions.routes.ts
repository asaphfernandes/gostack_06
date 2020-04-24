import { Router, json } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import multer from 'multer';
import fs from 'fs';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import Category from '../models/Category';

const transactionsRouter = Router();

transactionsRouter.get('/c', async (request, response) => {
  const repository = getRepository(Category);
  const categories = await repository.find();
  return response.status(200).json(categories);
});

transactionsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(TransactionsRepository);
  const transactions = await repository.find({ relations: ['category'] });
  const balance = await repository.getBalance();
  return response.status(200).json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const service = new CreateTransactionService();
  const { title, value, type, category } = request.body;
  const transaction = await service.execute({
    title,
    value,
    type,
    category,
  });
  return response.status(201).json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const service = new DeleteTransactionService();
  await service.execute(id);
  return response.status(204).send();
});

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const service = new ImportTransactionsService();
  const transactions = await service.execute(request.file.buffer);
  return response.status(200).json(transactions);
});

export default transactionsRouter;
