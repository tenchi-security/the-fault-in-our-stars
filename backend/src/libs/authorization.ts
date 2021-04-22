import 'source-map-support/register';
import { dynamoDb } from "./dynamoDb";

const retrieveLoggedUserOrganization = async (event: any) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    IndexName: 'gsi',
    KeyConditionExpression: 'sk = :user_email',
    ExpressionAttributeValues: {
      ':user_email': event.requestContext.authorizer.email,
    },
  };

  try {
    const data = await dynamoDb.query(params).promise();
    const user_org = data.Items.find((item) => item.sk !== "user");
    return user_org;
  } catch (err) {
    console.error('retrieveLoggedUserOrganization: ', retrieveLoggedUserOrganization)
    return false;
  }

}

export const retrieveLoggedUserOrganizationId = async (event: any) => {
  const org = await retrieveLoggedUserOrganization(event);
  return org.pk
}

export const retrieveLoggedUserOrganizationRole = async (event: any) => {
  const member = await retrieveLoggedUserOrganization(event);
  return member.role;
}


export const isLoggedUserSystemAdmin = async (event: any) => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      KeyConditionExpression: 'pk = :user_email and begins_with(sk, :role)',
      ExpressionAttributeValues: {
        ':user_email': event.requestContext.authorizer.email,
        ':role': 'SYSADMIN',
      },
    };

    const data = await dynamoDb.query(params).promise();
    return data.Items.length >= 1;
  } catch (err) {
    console.error('isLoggedUserSystemAdmin: ', err)
    return false;
  }
}

