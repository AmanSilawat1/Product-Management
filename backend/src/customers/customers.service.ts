import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) { }

  async exportToExcel(res: Response) {
    const startTime = performance.now();
    this.logger.log('Starting Excel export process...');

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'customers_export.xlsx',
    );

    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: res,
      useStyles: true,
      useSharedStrings: false,
    });

    const worksheet = workbook.addWorksheet('Customers');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 40 },
      { header: 'User ID', key: 'userId', width: 40 },
      { header: 'Phone Number', key: 'phoneNumber', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 25 },
    ];

    this.logger.log('Querying database for customer records...');
    const stream = await this.customerRepository
      .createQueryBuilder('customer')
      .select([
        'customer.id',
        'customer.userId',
        'customer.phoneNumber',
        'customer.createdAt',
      ])
      .stream();

    let count = 0;

    try {
      this.logger.log('Stream started, writing rows to Excel...');
      for await (const row of stream) {
        worksheet.addRow({
          id: row.customer_id,
          userId: row.customer_user_id,
          phoneNumber: row.customer_phone_number,
          createdAt: row.customer_created_at,
        }).commit();

        count++;

        if (count % 10000 === 0) {
          // Throttle to keep CPU usage < 10%
          await new Promise(resolve => setTimeout(resolve, 500));
          const currentTime = performance.now();
          const elapsed = ((currentTime - startTime) / 1000).toFixed(2);
          this.logger.log(`[Export Progress] ${count} rows processed so far... (Elapsed: ${elapsed}s)`);
        }
      }

      await workbook.commit();
      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      this.logger.log(`Excel export successfully completed. Total rows: ${count}. Total duration: ${duration}s`);
    } catch (error) {
      this.logger.error(`CRITICAL: Excel export failed after ${count} rows. error: ${error.message}`, error.stack);
      if (!res.headersSent) {
        res.status(500).send('Export failed');
      }
    }
  }
}