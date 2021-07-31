import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';
import jwt from 'jsonwebtoken';
import 'source-map-support/register';

//@ts-ignore
const authorize: APIGatewayProxyEvent = async (event: any) => {
  console.log(`LOG:::event.authorizationToken`, event.authorizationToken)
  if (!event.authorizationToken) {
    return formatJSONResponse({ message: `Unauthorized` }, 401);
  }

  try {
    const authHeader = event.authorizationToken;
    if (!authHeader.startsWith('Bearer ')) {
      throw Error
    }
    const token = authHeader.substring(7, authHeader.length)
    const decodedToken = jwt.verify(token, `supersecretkey`)
    const data = decodedToken;

    return generatePolicy(data.sub, event.methodArn, data.role);

  } catch (err) {
    console.error(`Error on Auth`, err);
    return formatJSONResponse({ message: `Unauthorized` }, 401);
  }
}

const generatePolicy = (principalId: string, methodArn: string, role: string) => {

  const allowedResources = [];
  const baseArn = methodArn.split(`/`, 2).join('/');

  switch (role.toUpperCase()) {
    case 'ADMIN':
      allowedResources.push(`${baseArn}/*/*`)
      break;
    case 'USER':
      allowedResources.push(`${baseArn}/GET/*/test/`)
      break;
    default:
      break;
  }
  const generatedPolicy = {
    principalId: principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: [
            ...allowedResources,
          ]
        }],
    },
  };
  return generatedPolicy;
};

export const main = middyfy(authorize);

