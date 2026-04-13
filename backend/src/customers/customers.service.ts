// import { Injectable, Logger } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Customer } from './customer.entity';
// import * as ExcelJS from 'exceljs';
// import { Response } from 'express';

// @Injectable()
// export class CustomersService {
//   private readonly logger = new Logger(CustomersService.name);

//   constructor(
//     @InjectRepository(Customer)
//     private readonly customerRepository: Repository<Customer>,
//   ) { }

//   async exportToExcel(res: Response) {
//     const startTime = performance.now();
//     this.logger.log('Starting Excel export process...');

//     res.setHeader(
//       'Content-Type',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     );
//     res.setHeader(
//       'Content-Disposition',
//       'attachment; filename=' + 'customers_export.xlsx',
//     );

//     const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
//       stream: res,
//       useStyles: true,
//       useSharedStrings: false,
//     });

//     const worksheet = workbook.addWorksheet('Customers');

//     worksheet.columns = [
//       { header: 'ID', key: 'id', width: 40 },
//       { header: 'User ID', key: 'userId', width: 40 },
//       { header: 'Phone Number', key: 'phoneNumber', width: 20 },
//       { header: 'Created At', key: 'createdAt', width: 25 },
//     ];

//     this.logger.log('Querying database for customer records...');
//     const stream = await this.customerRepository
//       .createQueryBuilder('customer')
//       .select([
//         'customer.id',
//         'customer.userId',
//         'customer.phoneNumber',
//         'customer.createdAt',
//       ])
//       .stream();

//     let count = 0;

//     try {
//       this.logger.log('Stream started, writing rows to Excel...');
//       for await (const row of stream) {
//         worksheet.addRow({
//           id: row.customer_id,
//           userId: row.customer_user_id,
//           phoneNumber: row.customer_phone_number,
//           createdAt: row.customer_created_at,
//         }).commit();

//         count++;

//         if (count % 10000 === 0) {
//           // Throttle to keep CPU usage < 10%
//           await new Promise(resolve => setTimeout(resolve, 500));
//           const currentTime = performance.now();
//           const elapsed = ((currentTime - startTime) / 1000).toFixed(2);
//           this.logger.log(`[Export Progress] ${count} rows processed so far... (Elapsed: ${elapsed}s)`);
//         }
//       }

//       await workbook.commit();
//       const endTime = performance.now();
//       const duration = ((endTime - startTime) / 1000).toFixed(2);
//       this.logger.log(`Excel export successfully completed. Total rows: ${count}. Total duration: ${duration}s`);
//     } catch (error) {
//       this.logger.error(`CRITICAL: Excel export failed after ${count} rows. error: ${error.message}`, error.stack);
//       if (!res.headersSent) {
//         res.status(500).send('Export failed');
//       }
//     }
//   }
// }


// code 1 - backend:98%, db: 122%
// import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Customer } from './customer.entity';
// import * as ExcelJS from 'exceljs';
// import { Response } from 'express';

// @Injectable()
// export class CustomersService implements OnModuleInit {
//   private readonly logger = new Logger(CustomersService.name);

//   constructor(
//     @InjectRepository(Customer)
//     private readonly customerRepository: Repository<Customer>,
//   ) { }

//   /**
//    * 🔥 Warm-up query to avoid first-time CPU spike
//    */
//   async onModuleInit() {
//     try {
//       await this.customerRepository.query(`
//         SELECT id FROM customers ORDER BY "createdAt" DESC LIMIT 10
//       `);
//       this.logger.log('DB warm-up query executed');
//     } catch (err) {
//       this.logger.warn('Warm-up query failed');
//     }
//   }

//   /**
//    * 🚀 Optimized Excel Export (Batch + Cursor based)
//    */
//   async exportToExcel(res: Response): Promise<void> {
//     const startTime = performance.now();
//     this.logger.log('Starting Excel export process...');

//     res.setHeader(
//       'Content-Type',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     );

//     res.setHeader(
//       'Content-Disposition',
//       'attachment; filename=customers_export.xlsx',
//     );

//     const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
//       stream: res,
//       useStyles: false, // 🔥 disables styling → reduces CPU
//       useSharedStrings: false,
//     });

//     const worksheet = workbook.addWorksheet('Customers');

//     worksheet.columns = [
//       { header: 'ID', key: 'id', width: 40 },
//       { header: 'User ID', key: 'userId', width: 40 },
//       { header: 'Phone Number', key: 'phoneNumber', width: 20 },
//       { header: 'Created At', key: 'createdAt', width: 25 },
//     ];

//     let lastCreatedAt: Date | null = null;
//     const batchSize = 2000;
//     let totalProcessed = 0;

//     try {
//       while (true) {
//         const query = this.customerRepository
//           .createQueryBuilder('customer')
//           .select([
//             'customer.id',
//             'customer.userId',
//             'customer.phoneNumber',
//             'customer.createdAt',
//           ])
//           .orderBy('customer.createdAt', 'DESC')
//           .limit(batchSize);

//         if (lastCreatedAt) {
//           query.where('customer.createdAt < :cursor', {
//             cursor: lastCreatedAt,
//           });
//         }

//         const rows = await query.getRawMany();

//         if (!rows.length) break;

//         for (const row of rows) {
//           worksheet
//             .addRow({
//               id: row.customer_id,
//               userId: row.customer_user_id,
//               phoneNumber: row.customer_phone_number,
//               createdAt: row.customer_created_at,
//             })
//             .commit();
//         }

//         totalProcessed += rows.length;
//         lastCreatedAt = rows[rows.length - 1].customer_created_at;

//         // 🔥 Yield to event loop → prevents CPU spike
//         await new Promise((resolve) => setImmediate(resolve));

//         if (totalProcessed % 10000 === 0) {
//           const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
//           this.logger.log(
//             `[Export Progress] ${totalProcessed} rows processed... (${elapsed}s)`,
//           );
//         }
//       }

//       await workbook.commit();

//       const duration = ((performance.now() - startTime) / 1000).toFixed(2);

//       this.logger.log(
//         `Excel export completed. Rows: ${totalProcessed}. Duration: ${duration}s`,
//       );
//     } catch (error) {
//       this.logger.error(
//         `Export failed after ${totalProcessed} rows: ${error.message}`,
//         error.stack,
//       );

//       if (!res.headersSent) {
//         res.status(500).send('Export failed');
//       }
//     }
//   }
// }


// code 2 - backend:28% cpu, db:62%
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class CustomersService implements OnModuleInit {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) { }

  async onModuleInit() {
    try {
      await this.customerRepository.query(`
        SELECT id FROM customers ORDER BY "created_at" DESC LIMIT 10
      `);
      this.logger.log('DB warmup completed');
    } catch {
      this.logger.warn('Warmup query failed');
    }
  }

  // async exportToExcel(res: Response): Promise<void> {
  //   const startTime = performance.now();

  //   res.setHeader(
  //     'Content-Type',
  //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   );

  //   res.setHeader(
  //     'Content-Disposition',
  //     'attachment; filename=customers_export.xlsx',
  //   );

  //   const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
  //     stream: res,
  //     useStyles: false,
  //     useSharedStrings: false,
  //     // zip: { zlib: { level: 1 } }, // 🔥 reduces compression CPU
  //   });

  //   const worksheet = workbook.addWorksheet('Customers');

  //   worksheet.columns = [
  //     { header: 'ID', key: 'id', width: 40 },
  //     { header: 'User ID', key: 'userId', width: 40 },
  //     { header: 'Phone Number', key: 'phoneNumber', width: 20 },
  //     { header: 'Created At', key: 'createdAt', width: 25 },
  //   ];

  //   const batchSize = 300; // 🔥 smaller batch = lower CPU
  //   // let lastCreatedAt: Date | null = null;
  //   let total = 0;

  //   let lastCreatedAt: Date | null = null;
  //   let lastId: string | null = null; // or number based on your DB


  //   try {
  //     while (true) {
  //       const query = this.customerRepository
  //         .createQueryBuilder('customer')
  //         .select([
  //           'customer.id',
  //           'customer.userId',
  //           'customer.phoneNumber',
  //           'customer.createdAt',
  //         ])
  //         .orderBy('customer.createdAt', 'DESC')
  //         .limit(batchSize);

  //       if (lastCreatedAt) {
  //         query.where('customer.createdAt < :cursor', {
  //           cursor: lastCreatedAt,
  //         });
  //       }


  //       // const rows = await query.getRawMany();
  //       const rows = await this.customerRepository.query(
  //         `
  // SELECT id, user_id, phone_number, created_at
  // FROM customers
  // WHERE 
  //   ($1::timestamp IS NULL)
  //   OR (
  //     created_at < $1
  //     OR (created_at = $1 AND id < $2)
  //   )
  // ORDER BY created_at DESC, id DESC
  // LIMIT $3
  // `,
  //         [lastCreatedAt, lastId, batchSize],
  //       );


  //       if (!rows.length) break;

  //       for (const row of rows) {
  //         worksheet.addRow({
  //           id: row.customer_id,
  //           userId: row.customer_user_id,
  //           phoneNumber: row.customer_phone_number,
  //           createdAt: row.customer_created_at,
  //         }).commit();

  //         total++;
  //       }

  //       lastCreatedAt = rows[rows.length - 1].customer_created_at;

  //       // 🔥 Release event loop
  //       await new Promise((resolve) => setImmediate(resolve));
  //       // if (total % 500 === 0) {
  //       //   await new Promise((resolve) => setImmediate(resolve));
  //       // }

  //       // 🔥 Hard throttle every 5000 rows
  //       if (total % 2000 === 0) {
  //         await new Promise((r) => setTimeout(r, 300));

  //         const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);

  //         this.logger.log(
  //           `[Export Progress] ${total} rows processed (${elapsed}s)`
  //         );
  //       }
  //     }

  //     await workbook.commit();

  //     const duration = ((performance.now() - startTime) / 1000).toFixed(2);

  //     this.logger.log(
  //       `Excel export finished. Rows: ${total}. Duration: ${duration}s`
  //     );
  //   } catch (error) {
  //     this.logger.error(
  //       `Export failed after ${total} rows: ${error.message}`,
  //       error.stack,
  //     );

  //     if (!res.headersSent) {
  //       res.status(500).send('Export failed');
  //     }
  //   }
  // }



  async exportToExcel(res: Response): Promise<void> {
    const startTime = performance.now();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=customers_export.xlsx',
    );

    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: res,
      useStyles: false,
      useSharedStrings: false,
    });

    const worksheet = workbook.addWorksheet('Customers');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 40 },
      { header: 'User ID', key: 'userId', width: 40 },
      { header: 'Phone Number', key: 'phoneNumber', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 25 },
    ];

    const batchSize = 300;

    let total = 0;
    let lastCreatedAt: Date | null = null;
    let lastId: string | null = null; // or number

    try {
      while (true) {
        const rows = await this.customerRepository.query(
          `
        SELECT id, user_id, phone_number, created_at
        FROM customers
        WHERE 
          ($1::timestamp IS NULL)
          OR (
            created_at < $1
            OR (created_at = $1 AND id < $2)
          )
        ORDER BY created_at DESC, id DESC
        LIMIT $3
        `,
          [lastCreatedAt, lastId, batchSize],
        );

        if (!rows.length) break;

        for (const row of rows) {
          worksheet
            .addRow({
              id: row.id,
              userId: row.user_id,
              phoneNumber: row.phone_number,
              createdAt: row.created_at,
            })
            .commit();

          total++;


          if (total % 500 === 0) {
            await new Promise((resolve) => setImmediate(resolve));
          }
        }


        const last = rows[rows.length - 1];
        lastCreatedAt = last.created_at;
        lastId = last.id;


        if (total % 2000 === 0) {
          await new Promise((r) => setTimeout(r, 300));

          const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);

          // this.logger.log(
          //   [Export Progress] ${total} rows processed (${elapsed}s)
          // );
        }
      }

      await workbook.commit();

      const duration = ((performance.now() - startTime) / 1000).toFixed(2);

      // this.logger.log(
      //   Excel export finished. Rows: ${total}. Duration: ${duration}s
      // );
    } catch (error) {
      // this.logger.error(
      //   Export failed after ${total} rows: ${error.message},
      //   error.stack,
      // );

      if (!res.headersSent) {
        res.status(500).send('Export failed');
      }
    }

  }
}


// code 3 - need less then 10% cpu


