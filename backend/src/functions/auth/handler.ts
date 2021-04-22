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
    const data = decodedToken;

    const policy = generatePolicy(data.sub, event.methodArn, data.username, data.role);
    console.log(`LOG:::Generated Policy`, policy)
    return JSON.parse(policy);

  } catch (err) {
    console.error(`Error on console`, err);
    return formatJSONResponse({ message: `Unauthorized` }, 401);
  }
}

const generatePolicy = (principalId, methodArn, username, role) => {
  console.log(`methodArn`, methodArn)
  console.log(`split`, methodArn.split(`/`, 2).join('/'))

  const baseArn = methodArn.split(`/`, 2).join('/');

  const allowedResources = [];

  switch (role.toUpperCase()) {
    case 'ADMIN':
      allowedResources.push(`arn:aws:execute-api:us-east-1:*:*/*`)
      break;
    case 'GUEST_USER':
      allowedResources.push(`${baseArn}/GET/books`)
      allowedResources.push(`${baseArn}/POST/book`)
      allowedResources.push(`${baseArn}/GET/books/${username}`)
      break;
    default:
      break;
  }

  let strAllowedResources = '';
  allowedResources.forEach((value) => {
    if (!strAllowedResources.startsWith('"')) {
      strAllowedResources = '"' + strAllowedResources + value + '","';
    } else {
      strAllowedResources = strAllowedResources + value + '","';
    }
  })

  strAllowedResources = strAllowedResources.substring(0, strAllowedResources.length - 2);
  return `
  {
    "principalId":"${principalId}",
    "policyDocument": {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "execute-api:Invoke",
        "Effect": "Allow",
        "Resource": [` + strAllowedResources + `]
        }
      ]
    }
  }`;

  // console.log('String Policy: ====', pre);

  // return pre;
  // return ({
  //   "principalId": principalId,
  //   "policyDocument": {
  //     "Version": "2012-10-17",
  //     "Statement": [
  //       {
  //         "Action": "execute-api:Invoke",
  //         "Effect": "Allow",
  //         "Resource": [
  //           strAllowedResources,
  //         ]
  //       }],
  //   },
  // }).toString();
};

export const main = middyfy(authorize);

