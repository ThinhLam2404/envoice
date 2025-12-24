import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getProcessid } from '@common/utils/string.util';
export const RequestParams = createParamDecorator((param: string, ctx: ExecutionContext) => {
  const request = ctx.switchToRpc().getData();
  return param ? request.data[param] : request.data;
});
