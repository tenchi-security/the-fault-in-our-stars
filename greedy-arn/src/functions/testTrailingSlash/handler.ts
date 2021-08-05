import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

//@ts-ignore
const testTrailingSlash: ValidatedEventAPIGatewayProxyEvent = async () => {
  return formatJSONResponse({
    message: `Trailing Slash Success!`,
  });
}

export const main = middyfy(testTrailingSlash);
