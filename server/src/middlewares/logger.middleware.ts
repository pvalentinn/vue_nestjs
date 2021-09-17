import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if(req.body.operationName != "IntrospectionQuery") {
        console.log(req.url, req.method, req.body)
    } else {
    }
    next();
  }
}
