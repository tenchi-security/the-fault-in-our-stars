import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';


const helloLowerCASE: ValidatedEventAPIGatewayProxyEvent = async (event) => {
  return formatJSONResponse({
    message: `Hello lowerCASE!`,
  });
}

export const main = middyfy(helloLowerCASE);
