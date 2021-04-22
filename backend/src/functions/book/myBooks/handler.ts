import { formatJSONResponse } from '@libs/apiGateway';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { dynamoDb } from '@libs/dynamoDb';
import { middyfy } from '@libs/lambda';
import 'source-map-support/register';
import schema from './schema';


const myBooks: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    IndexName: 'gsi3',
    KeyConditionExpression: 'author = :value',
    ExpressionAttributeValues: {
      ':value': event.pathParameters.username,
    },
  };

  try {
    const data = await dynamoDb.query(params).promise()
    const books = data.Items;
    return formatJSONResponse({ books, })
  } catch (err) {
    console.error('listBooks by user: ', err);
    return formatJSONResponse({ 'error': 'Failed to fetch books', }, 500);
  }

}

export const main = middyfy(myBooks);
