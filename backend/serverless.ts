import type { AWS } from '@serverless/typescript';
import { auth, book } from './src/functions';

const serverlessConfiguration: AWS = {
  service: 'policy-research',
  frameworkVersion: '2',
  custom: {
    dynamodb: {
      stages: ['dev', 'qa'],
      start: {
        port: 8000,
        inMemory: false,
        migrate: true
      },
    },
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    documentation: {
      api: {
        info: {
          version: 1,
          title: 'IAM Policy Injection',
          description: 'Serverless API Vulnerable for IAM Policy Injection via Lambda Custom Authorizer',

        }
      }
    }
  },
  plugins: [
    'serverless-webpack',
    'serverless-dynamodb-local',
    'serverless-offline',
    'serverless-aws-documentation'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      DYNAMODB_TABLE: "${self:service}-${opt:stage, self:provider.stage}",
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem"
        ],
        Resource: [
          "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.DYNAMODB_TABLE}",
          "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.DYNAMODB_TABLE}/index/gsi",
          "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.DYNAMODB_TABLE}/index/gsi3",
        ]
      }
    ]
  },
  functions: {
    auth,

    createBook: book.create,
    listBook:book.list,
    getBook: book.get,
    myBooks: book.myBooks,

  },
  resources: {
    Resources: {
      BooksDDBTable: {
        Type: "AWS::DynamoDB::Table",
        DeletionPolicy: "Delete",
        Properties: {
          AttributeDefinitions: [{
            AttributeName: "pk",
            AttributeType: "S"
          },
          {
            AttributeName: "sk",
            AttributeType: "S"
          },
          {
            AttributeName: "author",
            AttributeType: "S"
          }],
          KeySchema: [{
            AttributeName: "pk",
            KeyType: "HASH"
          }, {
            AttributeName: "sk",
            KeyType: "RANGE"
          }],
          TableName: "${self:provider.environment.DYNAMODB_TABLE}",
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          GlobalSecondaryIndexes: [{
            IndexName: 'gsi',
            KeySchema: [
              {
                AttributeName: 'sk',
                KeyType: 'HASH',
              },
            ],
            Projection: {
              ProjectionType: 'ALL',
            },
            ProvisionedThroughput: {
              ReadCapacityUnits: 1,
              WriteCapacityUnits: 1,
            },
          },{
            IndexName: 'gsi3',
            KeySchema: [
              {
                AttributeName: 'author',
                KeyType: 'HASH',
              },
            ],
            Projection: {
              ProjectionType: 'ALL',
            },
            ProvisionedThroughput: {
              ReadCapacityUnits: 1,
              WriteCapacityUnits: 1,
            },
          }]
        }
      },
      GatewayResponse: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers": "'*'"
          },
          ResponseType: "EXPIRED_TOKEN",
          RestApiId: {
            "Ref": "ApiGatewayRestApi"
          },
          StatusCode: "401"
        }
      },
      AuthFailureGatewayResponse: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers": "'*'"
          },
          ResponseType: "UNAUTHORIZED",
          RestApiId: {
            Ref: "ApiGatewayRestApi"
          },
          StatusCode: "401"
        }
      },
    }
  }
}

module.exports = serverlessConfiguration;
