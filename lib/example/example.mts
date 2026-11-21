interface RequestPayload {
  body: string
  requestContext: any
}

interface ResponsePayload {
  statusCode: number,
  body: string,
}

export const handler = async (event: RequestPayload): Promise<any>  => {

  const response:ResponsePayload = {
    statusCode: 200,
    body: JSON.stringify(event.requestContext.identity),
  }
  
  return response
}