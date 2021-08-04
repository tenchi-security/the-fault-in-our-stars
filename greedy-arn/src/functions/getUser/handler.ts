import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

//@ts-ignore
const getUser: ValidatedEventAPIGatewayProxyEvent = async (event) => {
  const { username } = event.pathParameters;
  return formatJSONResponse({
    message: `User ${username} Info!`,
  });
}

export const main = middyfy(getUser);
