import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

//@ts-ignore
const userHello: ValidatedEventAPIGatewayProxyEvent = async (event) => {
  return formatJSONResponse({
    message: `User Info!`,
  });
}

export const main = middyfy(userHello);
