import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    private logger = new Logger('RequestLogger');

    use(req: Request, res: Response, next: NextFunction) {
        const startTime = new Date().getTime();

        res.on('finish', () => {
            const endTime = new Date().getTime();
            const duration = endTime - startTime;
            const { method, url } = req;
            const statusCode = res.statusCode;

            this.logger.log(`${method} ${url} ${statusCode} ${duration} ms`);
        });

        next();
    }
}
