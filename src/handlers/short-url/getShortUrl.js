'use strict'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { GetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { Ok, BadRequest, NotFound } from '../../shared/utils/responses.js'
import { TABLES } from '../../shared/const/resources.js'
import { getQueryParams } from '../../shared/utils/events.js'
import { UrlID } from '../../shared/url-id/v1.js'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

export const handler = async (event) => {
  const query = getQueryParams(event)
  if (!query.urlId) return new BadRequest(undefined, 'Missing urlId')

  const urlId = UrlID.fromString(query.urlId)

  const response = await docClient.send(
    new GetCommand({
      TableName: TABLES.SHORT_URLS,
      Key: {
        urlId: urlId.getString(),
      },
    })
  )

  const url = response.Item?.url
  if (!url) return new NotFound(undefined, 'Invalid urlId')

  return new Ok({ url })
}
