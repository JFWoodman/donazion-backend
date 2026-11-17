interface RequestPayload {
  body: string
}

interface ResponsePayload {
  statusCode: number,
  body: string
}

export const handler = async (event: RequestPayload): Promise<any>  => {
  let response:ResponsePayload = { response:event.body }
  
  const response:ResponsePayload = {
    statusCode: 200,
    body: JSON.stringify(result)
  }
  
  return response
}