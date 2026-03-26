import { Controller, Get, Res } from '@nestjs/common';
import { CustomersService } from './customers.service';
import type { Response } from 'express';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('export')
  async exportToExcel(@Res() res: Response) {
    return this.customersService.exportToExcel(res);
  }
}
