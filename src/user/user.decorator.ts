import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((property, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return property ? request.user[property] : request.user;
});
