import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

//@ts-ignore
const chargeCustomer: ValidatedEventAPIGatewayProxyEvent = async () => {
  return formatJSONResponse({
    message: `Charged Customer Credit Card!`,
  });
}

export const main = middyfy(chargeCustomer);
