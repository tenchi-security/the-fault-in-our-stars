import { formatJSONResponse } from '@libs/apiGateway';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { dynamoDb } from '@libs/dynamoDb';
import { middyfy } from '@libs/lambda';
import 'source-map-support/register';
import schema from './schema';


const listBooks: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    IndexName: 'gsi',
    KeyConditionExpression: 'sk = :value',
    ExpressionAttributeValues: {
      ':value': 'book',
    },
  };

  try {
    const data = await dynamoDb.query(params).promise()
    const books = data.Items;
    return formatJSONResponse({ books, })
  } catch (err) {
    console.error('listBooks: ', err);
    return formatJSONResponse({ 'error': 'Failed to fetch books', }, 500);
  }

}

export const main = middyfy(listBooks);
