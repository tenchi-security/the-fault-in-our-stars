import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

//@ts-ignore
const userLogout: ValidatedEventAPIGatewayProxyEvent = async (event) => {
  return formatJSONResponse({
    message: `User Logged Out!`,
  });
}

export const main = middyfy(userLogout);
