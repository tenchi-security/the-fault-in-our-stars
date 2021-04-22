import { formatJSONResponse } from '@libs/apiGateway';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { dynamoDb } from '@libs/dynamoDb';
import { middyfy } from '@libs/lambda';
import 'source-map-support/register';
import * as uuid from 'uuid';
import schema from './schema';
import jwt_decode from 'jwt-decode';


const createBook: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  
  const Item = bookItem(event);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item,
  };
  try {
    await dynamoDb.put(params).promise()
    return formatJSONResponse({ ...Item, })
  } catch (err) {
    console.error('createBook: ', err);
    return formatJSONResponse({ 'error': 'Failed to create book', }, 500);
  }
}

export const main = middyfy(createBook);
function bookItem(event) {
  console.log(`event.headers.authorization`, event.headers.Authorization)
  const userData = jwt_decode(event.headers.Authorization.split(' ')[1]);
  return {
    pk: uuid.v4(),
    sk: 'book',
    name: event.body.name,
    author: userData.username
  };
}

