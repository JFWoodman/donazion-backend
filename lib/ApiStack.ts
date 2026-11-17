import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as apigw from "aws-cdk-lib/aws-apigateway"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'node:path'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { Duration } from 'aws-cdk-lib'

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // Pulls existing SG
    const vpc = ec2.Vpc.fromVpcAttributes(this, 'VPC', {
        vpcId: 'vpc-0e60f0a4fbd4f0183',                                    
        availabilityZones: ['us-east-1a', 'us-east-1b', 'us-east-1c'],       
        privateSubnetIds: ['subnet-04b2d39e459725e17', 'subnet-0d8a653b772b55650', 'subnet-04e1b54924e5f9d3d'], 
    })

    // Pulls existing SG
    const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'SG', 'sg-04a27b0bfdcd4b9f6', {
        mutable: false
    })

    const db_env = {
      "RDS_USER": process.env.SQL_USER!,
      "RDS_PASSWORD": process.env.SQL_PASSWORD!,
      "RDS_DATABASE": process.env.SQL_DB!,
      "RDS_HOST": process.env.SQL_ENDPOINT!
    }

    // generic default handler for any API function that doesn't get its own Lambda method
    // Basically: This lambda functions runs for any request that aren't properly hooked up 
    const default_fn = new lambdaNodejs.NodejsFunction(this, 'LambdaDefaultFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'default.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'default')),
      vpc: vpc,
      securityGroups: [securityGroup],
      timeout: Duration.seconds(3),
    })

    const api_endpoint = new apigw.LambdaRestApi(this, `donazionAPI`, {
      handler: default_fn,
      restApiName: `donazionAPI`, 
      proxy: false,
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
      },
    })

    // Create a resource (e.g., '/calc')
    const mainResource = api_endpoint.root.addResource('api')
    const exampleResource = mainResource.addResource('example')

    // https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk-lib/aws-apigateway/README.md
    // Defines how the lambda responses are handled by the API gateway
    const integration_parameters = { 
       proxy: false,
       passthroughBehavior: apigw.PassthroughBehavior.WHEN_NO_MATCH,
       
       integrationResponses: [
          {
            // Successful response from the Lambda function, no filter defined
            statusCode: '200',
            responseTemplates: {
              'application/json': '$input.json(\'$\')',       // should just pass JSON through untouched
            },
            responseParameters: {
                'method.response.header.Content-Type':                      "'application/json'",
                'method.response.header.Access-Control-Allow-Origin':       "'*'",
                'method.response.header.Access-Control-Allow-Credentials':  "'true'"
            },
          },
          {
            // For errors, we check if the error message is not empty, get the error data
            selectionPattern: '(\n|.)+',
            statusCode: "400",
            responseTemplates: {
              'application/json': JSON.stringify({ state: 'error', message: "$util.escapeJavaScript($input.path('$.errorMessage'))" })
          },
            responseParameters: {
                'method.response.header.Content-Type':                      "'application/json'",
                'method.response.header.Access-Control-Allow-Origin':       "'*'",
                'method.response.header.Access-Control-Allow-Credentials':  "'true'"
            },
          }
        ]
      }

    // defines what responses are from gateway to client
    const response_parameters = {
      methodResponses: [
        {
          // Successful response from the integration
          statusCode: '200',
          // Define what parameters are allowed or not
          responseParameters: {
            'method.response.header.Content-Type': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Credentials': true
          },

        },
        {
          // Same thing for the error responses
          statusCode: '400',
          responseParameters: {
            'method.response.header.Content-Type': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Credentials': true
          },
    
        }
      ]
    }

      // Add a POST method to the '/todo/create' resource
    // const example_lambda_fnc = new lambdaNodejs.NodejsFunction(this, 'CreateFunction', {
    //   runtime: lambda.Runtime.NODEJS_22_X,
    //   handler: 'create.handler',
    //   code: lambda.Code.fromAsset(path.join(__dirname, 'create')),
    //   vpc: vpc,
    //   environment: db_env,
    //   securityGroups: [securityGroup],
    //   timeout: Duration.seconds(3),
    // })

    // exampleResource.addMethod('POST', new apigw.LambdaIntegration(example_lambda_fnc, integration_parameters), response_parameters)


  }
}
