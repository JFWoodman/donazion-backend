#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { ApiStack } from '../lib/ApiStack';
import { AuthStack } from '../lib/AuthStack';

// import { DbStack } from '../lib/DbStack';
// import { VpcStack } from '../lib/VpcStack';

const app = new cdk.App();

// const vpc = new VpcStack(app, 'vpcStack', {});
// const db = new DbStack(app, 'dbStack', {"vpc": vpc});
const auth = new AuthStack(app, 'AuthStack', { env: {account: '157108548075', region: 'us-east-1'}});
const api = new ApiStack(app, 'apiStack', { env: {account: '157108548075', region: 'us-east-1'}});
