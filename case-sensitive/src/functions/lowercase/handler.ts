import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';


const helloLowercase: ValidatedEventAPIGatewayProxyEvent = async (event) => {
  return formatJSONResponse({
    message: `Hello lowercase!`,
  });
}

export const main = middyfy(helloLowercase);
