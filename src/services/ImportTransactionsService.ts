import csv, { Info } from 'csv-parse';

import Transaction, { transactionType } from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(b: Buffer): Promise<Transaction[]> {
    const service = new CreateTransactionService();
    let transactionRecords: any[] = [];
    const transactions: Transaction[] = [];

    let parse = csv(b, { 
      from_line: 2,
      ltrim: true,
      rtrim: true
    }, (err: Error | undefined, records: any[] | undefined, info: Info) => {
      if (records) {
        transactionRecords = records;
      }
    });

    await new Promise(resolve => {
      parse.on('end', resolve);
    });

    for (const record of transactionRecords) {
      const [title, type, value, category] = record;
      const transaction = await service.execute({ title, type, value, category });
      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
