import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

//@ts-ignore
const createAdminUser: ValidatedEventAPIGatewayProxyEvent = async () => {
  return formatJSONResponse({
    message: `Created Admin User!`,
  });
}

export const main = middyfy(createAdminUser);
