#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { ApiStack } from '../lib/ApiStack';
// import { DbStack } from '../lib/DbStack';
// import { VpcStack } from '../lib/VpcStack';

const app = new cdk.App();

// const vpc = new VpcStack(app, 'vpcStack', {});
// const db = new DbStack(app, 'dbStack', {"vpc": vpc});
const api = new ApiStack(app, 'apiStack', { env: {account: '157108548075', region: 'us-east-1'}});
