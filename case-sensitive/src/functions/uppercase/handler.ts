import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';


const helloUppercase: ValidatedEventAPIGatewayProxyEvent = async (event) => {
  return formatJSONResponse({
    message: `Hello UPPERCASE!`,
  });
}

export const main = middyfy(helloUppercase);
