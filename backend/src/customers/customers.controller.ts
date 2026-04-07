import { Controller, Get, Res, Logger } from '@nestjs/common';
import { CustomersService } from './customers.service';
import type { Response } from 'express';

@Controller('customers')
export class CustomersController {
  private readonly logger = new Logger(CustomersController.name);

  constructor(private readonly customersService: CustomersService) { }

  @Get('export')
  async exportToExcel(@Res() res: Response) {
    this.logger.log('Received request to export customers to Excel');
    return this.customersService.exportToExcel(res);
  }
}
