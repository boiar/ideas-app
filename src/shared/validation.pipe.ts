import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { metadata } from 'reflect-metadata/no-conflict';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (value instanceof Object && this.isEmpty(value)) {
      throw new HttpException(
        `Validation Failed: no body submitted`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new HttpException(
        `Validation failed: ${this.formatErrors(errors)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]) {
    return errors
      .map((err) => {
        for (const property in err.constraints) {
          return err.constraints[property];
        }
      })
      .join(', ');
  }

  private isEmpty(value: any) {
    return Object.keys(value).length === 0;
  }
}
