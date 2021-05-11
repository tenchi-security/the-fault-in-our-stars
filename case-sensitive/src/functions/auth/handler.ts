import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';
import jwt_decode from 'jwt-decode';
import 'source-map-support/register';


const authorize: APIGatewayProxyEvent = async (event) => {
  console.log(`LOG:::event.authorizationToken`, event.authorizationToken)
  if (!event.authorizationToken) {
    return formatJSONResponse({ message: `Unauthorized` }, 401);
  }

  try {
    const token = event.authorizationToken.split(' ')[1];
    const decodedToken = jwt_decode(token)
    console.log(`LOG:::decoded`, decodedToken)
    const user = decodedToken;

    const policy = generatePolicy(user.sub, user.role);
    console.log(`LOG:::Generated Policy`, policy)
    return policy;

  } catch (err) {
    console.error(`Error on console`, err);
    return formatJSONResponse({ message: `Unauthorized` }, 401);
  }
}

const generatePolicy = (principalId, role) => {

  const allowedResources = [];

  switch (role.toUpperCase()) {
    case 'ADMIN':
      allowedResources.push(`arn:aws:execute-api:*:*:*/*`);
      break;
    case 'GUEST_USER':
      allowedResources.push("arn:aws:execute-api:*:*:*/foo/uppercase");
      allowedResources.push("arn:aws:execute-api:*:*:*/foo/LOWERCASE");
      break;
    default:
      break;
  }

  return {
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
};

export const main = middyfy(authorize);

