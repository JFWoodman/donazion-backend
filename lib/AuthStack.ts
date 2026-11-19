import * as cdk from 'aws-cdk-lib/core';
import * as cognito from "aws-cdk-lib/aws-cognito"
import { Construct } from 'constructs';

export class AuthStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    let userPool = new cognito.UserPool(this, 'myuserpool', {
      userPoolName: 'donazion-userpool',
      signInCaseSensitive: false,
      userVerification: {
        emailSubject: 'Verify your email for Donazion!',
        emailBody: 'Thanks for signing up for Donazion! Your verification code is {####}',
        emailStyle: cognito.VerificationEmailStyle.CODE,
        smsMessage: 'Thanks for signing up for Donazion! Your verification code is {####}',
      }
    })
  }
}
