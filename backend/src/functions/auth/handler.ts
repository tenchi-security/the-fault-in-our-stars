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
    return policy;

  } catch (err) {
    console.error(`Error on console`, err);
    return formatJSONResponse({ message: `Unauthorized` }, 401);
  }
}

const generatePolicy = (principalId, methodArn, username, role) => {
  console.log(`methodArn`, methodArn)

  let tmp = methodArn.split(':')
  let apiGatewayArnTmp = tmp[5].split('/')
  let awsAccountId = tmp[4]

  console.log('\n\n\n\n')
  console.log({ tmp, apiGatewayArnTmp, awsAccountId })
  console.log('\n\n\n\n')

  // policy = AuthPolicy(principalId, awsAccountId)
  // policy.restApiId = apiGatewayArnTmp[0]
  // policy.region = tmp[3]
  // policy.stage = apiGatewayArnTmp[1]


  const baseArn = methodArn.split(`/`, 2).join('/');

  const allowedResources = [];

  switch (role.toUpperCase()) {
    case 'ADMIN':
      allowedResources.push(`arn:aws:execute-api:us-east-1:*:*/*`)
      break;
    case 'GUEST_USER':
      allowedResources.push(`${baseArn}/GET/books/${username}`)
      allowedResources.push(`${baseArn}/GET/books`)
      allowedResources.push(`${baseArn}/GET/book/*`)
      allowedResources.push(`${baseArn}/POST/book`)
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
  console.log(generatedPolicy.policyDocument.Statement)
  return generatedPolicy
};

export const main = middyfy(authorize);

