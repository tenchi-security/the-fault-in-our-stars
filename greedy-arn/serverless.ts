import type { AWS } from '@serverless/typescript';
import {
  auth,
  userHello,
  chargeCustomer,
  createAdminUser,
  getUser,
  putUser,
  deleteUser,
  userLogin,
  userLogout
} from './src/functions';


const serverlessConfiguration: AWS = {
  service: 'greedy-arn',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: ['serverless-webpack', 'serverless-offline',],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: {
    auth,
    userHello,
    chargeCustomer,
    createAdminUser,
    getUser,
    putUser,
    deleteUser,
    userLogin,
    userLogout
  },
  resources: {
    Resources: {
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
