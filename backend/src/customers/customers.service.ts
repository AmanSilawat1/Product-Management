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
  ) {}

  async exportToExcel(res: Response) {
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
      for await (const row of stream) {
        worksheet.addRow({
          id: row.customer_id,
          userId: row.customer_user_id,
          phoneNumber: row.customer_phone_number,
          createdAt: row.customer_created_at,
        }).commit();
        
        count++;
        if (count % 1000 === 0) {
          // Throttle to keep CPU usage < 10%
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        if (count % 10000 === 0) {
          this.logger.log(`Exported ${count} rows so far...`);
        }
      }

      await workbook.commit();
      this.logger.log(`Export completed. Total rows: ${count}`);
    } catch (error) {
      this.logger.error('Error during export', error);
      if (!res.headersSent) {
        res.status(500).send('Export failed');
      }
    }
  }
}
