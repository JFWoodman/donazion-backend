interface RequestPayload {
  body: string
  requestContext: any
}

interface ResponsePayload {
  statusCode: number,
  body: string,
  cognitoIdentityPoolId: string
  cognitoIdentityId: string,
  accountId: string,
  user: string
}

export const handler = async (event: RequestPayload): Promise<any>  => {

  const response:ResponsePayload = {
    statusCode: 200,
    body: JSON.stringify(event.body),
    cognitoIdentityPoolId: JSON.stringify(event.requestContext.identity.cognitoIdentityPoolId),
    cognitoIdentityId: JSON.stringify(event.requestContext.identity.cognitoIdentityId),
    accountId: JSON.stringify(event.requestContext.identity.accountId),
    user: JSON.stringify(event.requestContext.identity.user)
  }
  
  return response
}