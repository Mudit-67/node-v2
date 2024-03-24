import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  async calculateExpression(calcBody: CalcDto) {
    const expression = calcBody.expression
    const validate = this.validateExpression(expression)
    if (!validate) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Invalid expression provided',
        error: 'Bad Request',
      })
    }
    const result = this.evaluateExpression(expression);
    return result;
  }

  validateExpression(expression: string) {
    const type = typeof (expression)
    if (type !== 'string') return false
    if (!expression.trim()) {
      return false
    }
    const lastChar = expression.charAt(expression.length - 1);
    const isChar = !/\d/.test(lastChar);
    if (isChar) return false
    const validCharacters = /^[0-9+\-*/]+$/;
    if (!validCharacters.test(expression)) {
      return false
    }
    const consecutiveOperators = /[+\-*/]{2,}/;
    if (consecutiveOperators.test(expression)) {
      return false
    }
    return true
  }

  private evaluateExpression(expression: string): number {

    const tokens = expression.match(/(\d+|\+|\-|\*|\/)/g);
    const stack: number[] = [];

    let result = 0;
    let operator = '+';

    for (const token of tokens) {
      if ('+-*/'.includes(token)) {
        operator = token;
      } else {
        const operand = parseFloat(token);

        switch (operator) {
          case '+':
            stack.push(operand);
            break;
          case '-':
            stack.push(-operand);
            break;
          case '*':
            stack.push(stack.pop() * operand);
            break;
          case '/':
            if (operand === 0) {
              throw new HttpException(
                {
                  statusCode: 400,
                  message: 'Division by zero',
                  error: 'Bad Request',
                },
                400
              );
            }
            stack.push(stack.pop() / operand);
            break;
        }
      }
    }

    while (stack.length) {
      result += stack.pop();
    }
    return result;
  }
}
