/**
 * Get body event data
 * @param {any} event
 * @param {'all' | 'data' | 'none'} logging
 */
export const getBody = (event, logging = 'data') => {
  if (logging === 'all') console.log('Event -> ', JSON.stringify(event, null, 2))
  if (!event?.body) return {}

  try {
    const body = JSON.parse(event.body)
    if (logging === 'data') console.log('Body -> ', JSON.stringify(body, null, 2))

    return body
  } catch (error) {
    console.warn(error.message)
    return {}
  }
}

/**
 * Get query params from event
 * @param {any} event
 * @param {'all' | 'data' | 'none'} logging
 */
export const getQueryParams = (event, logging = 'data') => {
  if (logging === 'all') console.log('Event -> ', JSON.stringify(event, null, 2))

  const queryParams = event.queryStringParameters ?? {}
  if (logging === 'data') console.log('Query Params -> ', JSON.stringify(queryParams, null, 2))

  return queryParams
}

// /**
//  * It takes an event object as an argument, logs the event to the console, and returns the path
//  * parameters from the event
//  * @param {APIGatewayEvent | APIGatewayProxyEventV2} event - The event object that was passed to the Lambda function.
//  * @returns The path parameters from the event object.
//  */
// export const getPathParams = (event: APIGatewayProxyEvent | APIGatewayProxyEventV2) => {
//   console.log('EVENT RECEIVED:', JSON.stringify(event, null, 2))
//   return event.pathParameters
// }
