import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CalcService } from './calc.service';
import { CalcDto } from './calc.dto';

@Controller('calc')
export class CalcController {
  constructor(private readonly calcService: CalcService) { }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async calc(@Body() calcBody: CalcDto) {
    const result = await this.calcService.calculateExpression(calcBody);
    return {
      result,
    };
  }
}
