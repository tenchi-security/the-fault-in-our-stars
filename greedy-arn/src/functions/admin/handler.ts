import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

const adminHello: ValidatedEventAPIGatewayProxyEvent = async () => {
  return formatJSONResponse({
    message: `Hello Admin!`,
  });
}

export const main = middyfy(adminHello);
