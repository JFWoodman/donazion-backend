import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Stage } from 'aws-cdk-lib';
import { ApiStack } from './ApiStack';
import * as cognito from "aws-cdk-lib/aws-cognito"

interface AppStageProps extends cdk.StageProps {
  legacyStackNames?: { auth: string; api: string };
}
// Define the stage
export class AppStage extends Stage {
  constructor(scope: Construct, id: string, props?: AppStageProps) {
    super(scope, id, props);

    // this would generate 4 seperate auth pools which is probably a bad idea
    // const auth_stack = new AuthStack(this, 'AuthStack', {
    //     stackName: props?.legacyStackNames?.auth
    // })

    const api_stack = new ApiStack(this, 'ApiStack', {
        stackName: props?.legacyStackNames?.api
    })

  }
}