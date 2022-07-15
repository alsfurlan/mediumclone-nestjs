import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    if (!user) {
      return null;
    }

    if (data) {
      return user[data];
    }

    return user;
  },
);
