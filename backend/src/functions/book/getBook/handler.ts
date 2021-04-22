import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { dynamoDb } from '@libs/dynamoDb';

const getBook: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: 'pk = :ent_id and sk = :ent_type',
    ExpressionAttributeValues: {
      ':ent_type': 'book',
      ':ent_id': event.pathParameters.book_id,
    },
  };

  try {
    const data = await dynamoDb.query(params).promise()
    return formatJSONResponse({ ...data.Items[0], })
  } catch (err) {
    console.error('getBook: ', err);
    return formatJSONResponse({ 'error': 'Failed to fetch book', }, 500);
  }
}

export const main = middyfy(getBook);
