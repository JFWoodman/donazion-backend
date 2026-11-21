interface RequestPayload {
  body: string
  requestContext: any
}

interface ResponsePayload {
  statusCode: number,
  body: string,
}

export const handler = async (event: RequestPayload): Promise<ResponsePayload>  => {
  console.log("FULL EVENT:", JSON.stringify(event, null, 2));

  const response:ResponsePayload = {
    statusCode: 200,
    body: JSON.stringify(event.requestContext.identity),
  }

  console.log("RESPONSE EVENT:", JSON.stringify(response, null, 2));
  return response
}