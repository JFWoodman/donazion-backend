import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';

export class DbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkDonazionQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
