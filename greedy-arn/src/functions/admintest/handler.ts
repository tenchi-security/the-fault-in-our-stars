import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

const adminTestHello: ValidatedEventAPIGatewayProxyEvent = async () => {
  return formatJSONResponse({
    message: `Hello Admin Test!`,
  });
}

export const main = middyfy(adminTestHello);
