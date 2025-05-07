import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpErrorFilter.name); // Create logger

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errResponse = {
      code: status,
      timestamp: new Date().toLocaleDateString(),
      path: req.url,
      method: req.method,
      message: exception.message || null,
    };

    this.logger.error(
      `${req.method} ${req.url} ${status} - ${errResponse.message}`,
      JSON.stringify(errResponse),
    );

    res.status(status).json(errResponse);
  }
}
