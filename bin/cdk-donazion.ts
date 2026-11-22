#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { AppStage } from '../lib/AppStage';
import { AuthStack } from '../lib/AuthStack';

const app = new cdk.App();
const env = {account: '157108548075', region: 'us-east-1'}

new AuthStack(app, 'AuthStack', { env });

new AppStage(app, 'Prod', {
  env: {
    account: '157108548075',
    region: 'us-east-1'
  },
  legacyStackNames: { auth: "AuthStack", api: "apiStack" }
})

new AppStage(app, 'Dev-Adam', {
  env: {
    account: '157108548075',
    region: 'us-east-1'
  }
})

new AppStage(app, 'Dev-Dennis', {
  env: {
    account: '157108548075',
    region: 'us-east-1'
  }
})

new AppStage(app, 'Dev-Jared', {
  env: {
    account: '157108548075',
    region: 'us-east-1'
  }
})

new AppStage(app, 'Dev-Tucker', {
  env: {
    account: '157108548075',
    region: 'us-east-1'
  }
})