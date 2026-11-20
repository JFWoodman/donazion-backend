import * as cdk from 'aws-cdk-lib/core';
import * as cognito from "aws-cdk-lib/aws-cognito"
import { Construct } from 'constructs';

export class AuthStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // Login with Username+password, email as recovery only
    const userPool = new cognito.UserPool(this, 'myuserpool', {
      userPoolName: 'donazion-userpool',
      selfSignUpEnabled: true,
      signInCaseSensitive: false,
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      userVerification: {
        emailSubject: 'Verify your email for our awesome app!',
        emailBody: 'Thanks for signing up to our awesome app! Your verification code is {####}',
        emailStyle: cognito.VerificationEmailStyle.CODE,
        smsMessage: 'Thanks for signing up to our awesome app! Your verification code is {####}',
      },
      signInAliases: {
        username: true,
      },
      keepOriginal: {
        email: true,
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      standardAttributes: {
        email: { required: true, mutable: true },
      },
      autoVerify: { email: true },
    })

    const client = userPool.addClient('donazion-web-client', {
      oAuth: {
        flows: {
          // allows the implicit token passing
          authorizationCodeGrant: true,
        },
        scopes: [ cognito.OAuthScope.OPENID ],
        // allowlist redirect
        callbackUrls: [ 
          'http://localhost:3000/OrgDashboard',
          'http://localhost:3000/DCenterDashboard' 
         ],
        logoutUrls: [ 
          'http://localhost:3000/signin'
        ],
      },
    })
    // const clientId = client.userPoolClientId

    userPool.addDomain('donazion-managed-login', {
    cognitoDomain: {
      domainPrefix: 'donazion',
    },
      managedLoginVersion: cognito.ManagedLoginVersion.NEWER_MANAGED_LOGIN,
    })
  }
}
